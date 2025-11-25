// src/pages/StudentDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/button';
import { Award, Download, ExternalLink, FileText, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import QRCode from 'qrcode.react';
import { ethers } from 'ethers';

interface Certificate {
  id: string;
  studentName: string;
  studentWallet: string;
  courseName: string;
  degree: string;
  issueDate: string;
  ipfsHash: string;
  dataHash: string;
  qrData?: string;
}

export const StudentDashboard: React.FC = () => {
  const { account, contract, signer } = useWeb3();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [generatingQR, setGeneratingQR] = useState(false);

  useEffect(() => {
    if (account && contract) {
      loadCertificates();
    }
  }, [account, contract]);

  const loadCertificates = async () => {
    if (!contract || !account) return;

    setLoading(true);
    try {
      const certIds = await contract.getStudentCertificateIds(account);
      
      const certs: Certificate[] = [];
      for (const id of certIds) {
        const cert = await contract.certificates(id);
        certs.push({
          id: cert.id.toString(),
          studentName: cert.studentName,
          studentWallet: cert.studentWallet,
          courseName: cert.courseName,
          degree: cert.degree,
          issueDate: new Date(Number(cert.issueDate) * 1000).toLocaleDateString(),
          ipfsHash: cert.ipfsHash,
          dataHash: cert.dataHash,
        });
      }
      
      setCertificates(certs);
    } catch (error) {
      console.error('Error loading certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (cert: Certificate) => {
    if (!signer) return;

    setGeneratingQR(true);
    try {
      // Generate certificate hash
      const certHash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ['string', 'address', 'string', 'string', 'string'],
          [cert.studentName, cert.studentWallet, cert.courseName, cert.degree, cert.ipfsHash]
        )
      );

      // Sign the certificate hash
      const signature = await signer.signMessage(ethers.getBytes(certHash));

      // Create QR data
      const qrData = JSON.stringify({
        certId: cert.id,
        studentWallet: cert.studentWallet,
        ipfsLink: `https://ipfs.io/ipfs/${cert.ipfsHash}`,
        certHash,
        signature,
      });

      setSelectedCert({ ...cert, qrData });
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code');
    } finally {
      setGeneratingQR(false);
    }
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById(`qr-${selectedCert?.id}`) as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `certificate-${selectedCert?.id}-qr.png`;
      link.href = url;
      link.click();
    }
  };

  const downloadCertificate = (ipfsHash: string) => {
    window.open(`https://ipfs.io/ipfs/${ipfsHash}`, '_blank');
  };

  if (!account) {
    return (
      <div className="min-h-screen pt-24 px-4 bg-gray-50 dark:bg-black">
        <div className="max-w-2xl mx-auto text-center">
          <Alert variant="warning">
            <AlertCircle className="w-5 h-5 mr-2" />
            Please connect your wallet to view your certificates.
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
            My Certificates
          </h1>
          <p className="text-gray-600 dark:text-gray-400">View and manage your academic credentials</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
          </div>
        ) : certificates.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Award className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                No Certificates Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your issued certificates will appear here once your institution adds them.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <Card key={cert.id} className="hover:shadow-2xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Award className="w-5 h-5 mr-2 text-purple-600" />
                    Certificate #{cert.id}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Name:</span>
                      <p className="text-gray-900 dark:text-white">{cert.studentName}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Course:</span>
                      <p className="text-gray-900 dark:text-white">{cert.courseName}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Degree:</span>
                      <p className="text-gray-900 dark:text-white">{cert.degree}</p>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{cert.issueDate}</span>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button
                      onClick={() => generateQRCode(cert)}
                      disabled={generatingQR}
                      className="w-full"
                      size="sm"
                    >
                      {generatingQR ? 'Generating...' : 'Generate QR Code'}
                    </Button>
                    <Button
                      onClick={() => downloadCertificate(cert.ipfsHash)}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Certificate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* QR Code Modal */}
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <Card className="max-w-md w-full">
              <CardHeader>
                <CardTitle>Certificate QR Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2 text-sm">
                  <div><strong>Certificate ID:</strong> {selectedCert.id}</div>
                  <div><strong>Student:</strong> {selectedCert.studentName}</div>
                  <div><strong>Course:</strong> {selectedCert.courseName}</div>
                </div>

                <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-900 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Scan this QR code to verify
                  </p>
                  {selectedCert.qrData && (
                    <QRCode
                      id={`qr-${selectedCert.id}`}
                      value={selectedCert.qrData}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={downloadQRCode} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button onClick={() => setSelectedCert(null)}>
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};