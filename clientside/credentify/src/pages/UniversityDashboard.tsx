// src/pages/UniversityDashboard.tsx
import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Button';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Button';
import { Label } from '../components/ui/Button';
import { Alert } from '../components/ui/Button';
import { Upload, FileText, Award, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { ethers } from 'ethers';
import QRCode from 'qrcode.react';

interface CertificateForm {
  studentName: string;
  studentWallet: string;
  courseName: string;
  degree: string;
  ipfsHash: string;
}

interface IssuedCertificate {
  certId: string;
  studentName: string;
  studentWallet: string;
  courseName: string;
  degree: string;
  ipfsHash: string;
  qrData?: string;
}

export const UniversityDashboard: React.FC = () => {
  const { account, contract, isUniversity, isAdmin, signer } = useWeb3();
  const [formData, setFormData] = useState<CertificateForm>({
    studentName: '',
    studentWallet: '',
    courseName: '',
    degree: '',
    ipfsHash: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [issuedCert, setIssuedCert] = useState<IssuedCertificate | null>(null);
  const [uploadingToIPFS, setUploadingToIPFS] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadToIPFS = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploadingToIPFS(true);
    setError('');

    try {
      // Simulated IPFS upload - In production, use actual IPFS client
      // For demo purposes, we'll generate a mock IPFS hash
      const mockIPFSHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      
      setFormData({ ...formData, ipfsHash: mockIPFSHash });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // In production, use this:
      /*
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY,
        },
        body: formData,
      });
      
      const data = await response.json();
      setFormData({ ...formData, ipfsHash: data.IpfsHash });
      */
    } catch (err) {
      console.error('IPFS upload error:', err);
      setError('Failed to upload to IPFS');
    } finally {
      setUploadingToIPFS(false);
    }
  };

  const issueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contract || !signer) {
      setError('Please connect your wallet');
      return;
    }

    if (!isUniversity && !isAdmin) {
      setError('Only universities can issue certificates');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Issue certificate on blockchain
      const tx = await contract.issueCertificate(
        formData.studentWallet,
        formData.studentName,
        formData.courseName,
        formData.degree,
        formData.ipfsHash
      );

      const receipt = await tx.wait();
      
      // Get the certificate ID from the event
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed?.name === 'CertificateIssued';
        } catch {
          return false;
        }
      });

      let certId = '1'; // Default
      if (event) {
        const parsed = contract.interface.parseLog(event);
        certId = parsed?.args[0].toString();
      }

      // Generate certificate hash for QR
      const certHash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ['string', 'address', 'string', 'string', 'string'],
          [formData.studentName, formData.studentWallet, formData.courseName, formData.degree, formData.ipfsHash]
        )
      );

      // Sign the certificate hash
      const signature = await signer.signMessage(ethers.getBytes(certHash));

      // Create QR data
      const qrData = JSON.stringify({
        certId,
        studentWallet: formData.studentWallet,
        ipfsLink: `https://ipfs.io/ipfs/${formData.ipfsHash}`,
        certHash,
        signature,
      });

      setIssuedCert({
        certId,
        studentName: formData.studentName,
        studentWallet: formData.studentWallet,
        courseName: formData.courseName,
        degree: formData.degree,
        ipfsHash: formData.ipfsHash,
        qrData,
      });

      setSuccess(true);
      
      // Reset form
      setFormData({
        studentName: '',
        studentWallet: '',
        courseName: '',
        degree: '',
        ipfsHash: '',
      });
      setFile(null);
    } catch (err: any) {
      console.error('Error issuing certificate:', err);
      setError(err.message || 'Failed to issue certificate');
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `certificate-${issuedCert?.certId}-qr.png`;
      link.href = url;
      link.click();
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen pt-24 px-4 bg-gray-50 dark:bg-black">
        <div className="max-w-2xl mx-auto text-center">
          <Alert variant="warning">
            <AlertCircle className="w-5 h-5 mr-2" />
            Please connect your wallet to access the university dashboard.
          </Alert>
        </div>
      </div>
    );
  }

  if (!isUniversity && !isAdmin) {
    return (
      <div className="min-h-screen pt-24 px-4 bg-gray-50 dark:bg-black">
        <div className="max-w-2xl mx-auto text-center">
          <Alert variant="error">
            <AlertCircle className="w-5 h-5 mr-2" />
            Access Denied. Only authorized universities can access this dashboard.
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            University Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Issue and manage academic credentials</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Issue Certificate Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-6 h-6 mr-2 text-purple-600" />
                Issue New Certificate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={issueCertificate} className="space-y-4">
                {/* File Upload */}
                <div>
                  <Label>Certificate PDF</Label>
                  <div className="mt-2 flex items-center space-x-3">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex-1 cursor-pointer flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-purple-500 transition"
                    >
                      <Upload className="w-5 h-5 mr-2 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {file ? file.name : 'Choose PDF file'}
                      </span>
                    </label>
                    <Button
                      type="button"
                      onClick={uploadToIPFS}
                      disabled={!file || uploadingToIPFS}
                      variant="outline"
                    >
                      {uploadingToIPFS ? 'Uploading...' : 'Upload to IPFS'}
                    </Button>
                  </div>
                  {formData.ipfsHash && (
                    <p className="mt-2 text-xs text-green-600 dark:text-green-400 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Uploaded: {formData.ipfsHash}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Student Name</Label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label>Student Wallet Address</Label>
                  <Input
                    type="text"
                    placeholder="0x..."
                    value={formData.studentWallet}
                    onChange={(e) => setFormData({ ...formData, studentWallet: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label>Course Name</Label>
                  <Input
                    type="text"
                    placeholder="Computer Science"
                    value={formData.courseName}
                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label>Degree</Label>
                  <Input
                    type="text"
                    placeholder="Bachelor of Science"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    required
                  />
                </div>

                {error && (
                  <Alert variant="error">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {error}
                  </Alert>
                )}

                {success && !issuedCert && (
                  <Alert variant="success">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Certificate issued successfully!
                  </Alert>
                )}

                <Button type="submit" disabled={loading || !formData.ipfsHash} className="w-full" size="lg">
                  {loading ? 'Issuing Certificate...' : 'Issue Certificate'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* QR Code Display */}
          {issuedCert && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-purple-600" />
                  Certificate Issued Successfully
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant="success">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Certificate #{issuedCert.certId} has been issued to {issuedCert.studentName}
                </Alert>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2 text-sm">
                  <div><strong>Certificate ID:</strong> {issuedCert.certId}</div>
                  <div><strong>Student:</strong> {issuedCert.studentName}</div>
                  <div><strong>Course:</strong> {issuedCert.courseName}</div>
                  <div><strong>Degree:</strong> {issuedCert.degree}</div>
                  <div className="break-all"><strong>IPFS:</strong> {issuedCert.ipfsHash}</div>
                </div>

                <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-900 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    QR Code for Verification
                  </p>
                  <QRCode
                    id="qr-code"
                    value={issuedCert.qrData || ''}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                  <Button onClick={downloadQRCode} variant="outline" className="mt-4">
                    Download QR Code
                  </Button>
                </div>

                <Button
                  onClick={() => setIssuedCert(null)}
                  className="w-full"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Issue Another Certificate
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};