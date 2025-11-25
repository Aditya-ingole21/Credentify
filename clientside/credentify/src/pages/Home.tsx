// src/pages/Home.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { HeroSection } from '../components/ui/hero-section-dark';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Button';
import { Shield, Zap, Globe, Lock, Check, Award } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { account, connectWallet, isUniversity } = useWeb3();

  const handleGetStarted = async () => {
    if (!account) {
      await connectWallet();
    } else {
      if (isUniversity) {
        navigate('/university');
      } else {
        navigate('/student');
      }
    }
  };

  const features = [
    {
      icon: <Shield className="w-12 h-12 text-purple-600" />,
      title: 'Tamper-Proof',
      description: 'Certificates stored on blockchain are immutable and cannot be altered or forged.',
    },
    {
      icon: <Zap className="w-12 h-12 text-purple-600" />,
      title: 'Instant Verification',
      description: 'Verify credentials in seconds with QR code scanning. No manual checks needed.',
    },
    {
      icon: <Globe className="w-12 h-12 text-purple-600" />,
      title: 'Global Access',
      description: 'Access and verify credentials anywhere in the world, 24/7.',
    },
    {
      icon: <Lock className="w-12 h-12 text-purple-600" />,
      title: 'Cryptographically Secure',
      description: 'Protected by advanced cryptographic signatures and ECDSA recovery.',
    },
    {
      icon: <Award className="w-12 h-12 text-purple-600" />,
      title: 'Student-Owned',
      description: 'Students have full control and ownership of their credentials.',
    },
    {
      icon: <Check className="w-12 h-12 text-purple-600" />,
      title: 'Zero Fraud',
      description: 'Eliminate academic fraud with blockchain-backed verification.',
    },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'University Issues Certificate',
      description: 'Universities upload and issue certificates on the blockchain with student details.',
    },
    {
      step: '02',
      title: 'QR Code Generated',
      description: 'A cryptographically signed QR code is generated for each certificate.',
    },
    {
      step: '03',
      title: 'Instant Verification',
      description: 'Employers scan the QR code to instantly verify authenticity.',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <HeroSection
        title="Blockchain-Verified Academic Credentials"
        subtitle={{
          regular: 'Secure, Immutable, and ',
          gradient: 'Instantly Verifiable',
        }}
        description="Eliminate academic fraud with blockchain technology. Issue tamper-proof certificates stored on-chain and accessible globally."
        ctaText={account ? 'Go to Dashboard' : 'Connect Wallet to Start'}
        onCtaClick={handleGetStarted}
        bottomImage={{
          light: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop',
          dark: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop',
        }}
        gridOptions={{
          angle: 65,
          opacity: 0.4,
          cellSize: 50,
          lightLineColor: '#4a4a4a',
          darkLineColor: '#2a2a2a',
        }}
      />

      {/* Features Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Why Choose CredChain?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Built on blockchain technology to provide the most secure and efficient credential verification system.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Three simple steps to issue and verify academic credentials on the blockchain.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white text-2xl font-bold mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Join the future of academic credential verification. Connect your wallet to begin.
          </p>
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
          >
            {account ? 'Go to Dashboard' : 'Connect Wallet Now'}
          </button>
        </div>
      </section>
    </div>
  );
};