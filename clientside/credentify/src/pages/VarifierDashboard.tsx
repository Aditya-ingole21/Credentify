// src/pages/VerifierDashboard.tsx
import React, { useState, useRef } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Button';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Button';
import { Input } from '../components/ui/Button';
import { Label } from '../components/ui/Button';
import { 
  Camera, 
  Upload, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Shield,
  FileText,
  Calendar,
  User,
  Award
} from 'lucide-react';
import jsQR from 'jsqr';
import { ethers } from 'ethers';

interface VerificationResult {
  isValid: boolean;
  certId?: string;
  studentName?: string;
  studentWallet?: string;
  courseName?: string;
  degree?: string;
  issueDate?: string;
  ipfsHash?: string;
  message?: string;
}

export const VerifierDashboard: React.FC = () => {
  const { contract } = useWeb3();
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [scanning, setScanning] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const image = new Image();
      image.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(image, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          
          if (code) {
            await verifyQRData(code.data);
          } else {
            setError('No QR code found in the image');
          }
        }
      };
      image.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    setScanning(true);
    setError('');
    setVerificationResult(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        requestAnimationFrame(scanQRCode);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Failed to access camera. Please upload QR code image instead.');
      setScanning(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  const scanQRCode = () => {
    if (!scanning || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        stopCamera();
        verifyQRData(code.data);
        return;
      }
    }

    requestAnimationFrame(scanQRCode);
  };

  const verifyQRData = async (qrDataString: string) => {
    if (!contract) {
      setError('Please connect to the blockchain first');
      return;
    }

    setVerifying(true);
    setError('');
    setVerificationResult(null);

    try {
      const qrData = JSON.parse(qrDataString);
      const { certId, studentWallet, certHash, signature } = qrData;

      // Recover signer from signature
      const recoveredAddress = ethers.verifyMessage(ethers.getBytes(certHash), signature);

      // Check if recovered address has UNIVERSITY_ROLE
      const universityRole = ethers.keccak256(ethers.toUtf8Bytes("UNIVERSITY_ROLE"));
      const hasUniversityRole = await contract.hasRole(universityRole, recoveredAddress);

      if (!hasUniversityRole) {
        setVerificationResult({
          isValid: false,
          message: 'Invalid signature: Signer is not an authorized university',
        });
        return;
      }

      // Get certificate from blockchain
      const cert = await contract.certificates(certId);

      // Verify certificate data
      const isValid = await contract.verifyCertificate(
        certId,
        cert.studentName,
        studentWallet,
        cert.courseName,
        cert.degree,
        cert.ipfsHash
      );

      if (isValid) {
        setVerificationResult({
          isValid: true,
          certId: cert.id.toString(),
          studentName: cert.studentName,
          studentWallet: cert.studentWallet,
          courseName: cert.courseName,
          degree: cert.degree,
          issueDate: new Date(Number(cert.issueDate) * 1000).toLocaleDateString(),
          ipfsHash: cert.ipfsHash,
          message: 'Certificate is valid and verified',
        });
      } else {
        setVerificationResult({
          isValid: false,
          message: 'Certificate data does not match blockchain records',
        });
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.message || 'Failed to verify certificate');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-black">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Verify Certificate
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Scan or upload a QR code to verify academic credentials
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Scanner Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="w-6 h-6 mr-2 text-purple-600" />
                QR Code Scanner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!scanning ? (
                <div className="space-y-4">
                  <Button onClick={startCamera} className="w-full" size="lg">
                    <Camera className="w-5 h-5 mr-2" />
                    Scan with Camera
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">or</span>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload QR Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      playsInline
                    />
                    <div className="absolute inset-0 border-4 border-purple-500 m-12 rounded-lg pointer-events-none">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-purple-500"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-purple-500"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-purple-500"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-purple-500"></div>
                    </div>
                  </div>
                  <canvas ref={canvasRef} className="hidden" />
                  <Button onClick={stopCamera} variant="outline" className="w-full">
                    Stop Scanning
                  </Button>
                  <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                    Position QR code within the frame
                  </p>
                </div>
              )}

              {verifying && (
                <Alert variant="default">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Verifying certificate on blockchain...
                </Alert>
              )}

              {error && (
                <Alert variant="error">
                  <XCircle className="w-5 h-5 mr-2" />
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Verification Result Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-6 h-6 mr-2 text-purple-600" />
                Verification Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!verificationResult ? (
                <div className="py-12 text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Scan or upload a QR code to see verification results
                  </p>
                </div>
              ) : verificationResult.isValid ? (
                <div className="space-y-6">
                  <Alert variant="success">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {verificationResult.message}
                  </Alert>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Award className="w-5 h-5 text-purple-600 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Certificate ID
                        </p>
                        <p className="text-lg font-mono text-gray-900 dark:text-white">
                          #{verificationResult.certId}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <User className="w-5 h-5 text-purple-600 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Student Name
                        </p>
                        <p className="text-lg text-gray-900 dark:text-white">
                          {verificationResult.studentName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <FileText className="w-5 h-5 text-purple-600 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Course & Degree
                        </p>
                        <p className="text-gray-900 dark:text-white">
                          {verificationResult.courseName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {verificationResult.degree}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Calendar className="w-5 h-5 text-purple-600 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Issue Date
                        </p>
                        <p className="text-gray-900 dark:text-white">
                          {verificationResult.issueDate}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={() => window.open(`https://ipfs.io/ipfs/${verificationResult.ipfsHash}`, '_blank')}
                      variant="outline"
                      className="w-full"
                    >
                      View Certificate Document
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <Alert variant="error">
                    <XCircle className="w-5 h-5 mr-2" />
                    {verificationResult.message}
                  </Alert>

                  <div className="py-8 text-center">
                    <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      Invalid Certificate
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      This certificate could not be verified. It may be forged or tampered with.
                    </p>
                  </div>
                </div>
              )}

              {verificationResult && (
                <Button
                  onClick={() => setVerificationResult(null)}
                  variant="outline"
                  className="w-full mt-6"
                >
                  Verify Another Certificate
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};