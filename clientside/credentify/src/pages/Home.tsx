// src/pages/Home.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { HeroSection as HeroSectionLight } from '../components/ui/HerosectionLight'; 
import { Card, CardContent } from '../components/ui/Card';
import { Shield, Zap, Globe, Lock, GraduationCap, FileText, UserCheck,User,CheckCircle } from 'lucide-react'; 
import { cn } from '../lib/utils'; // Imported cn for better utility class usage

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

    // STICKING TO THE PHOTO'S ACCENT COLOR: Coral/Orange Gradient
    const ACCENT_COLOR_CLASSES = "bg-white-400 from-red-400 to-orange-400 hover:from-red-500 hover:to-orange-500 transition-colors duration-200 ";
    const ACCENT_TEXT_COLOR = "text-red-500";
    const ACCENT_BG_COLOR = "bg-red-50";

  const features = [
    {
      icon: <Shield className="w-4 h-6 text-red-500" />, 
      title: 'Blockchain-Secure',
      description: 'Certificates are immutably stored on-chain, ensuring tamper-proof records.',
    },
    {
      icon: <Zap className="w-4 h-6 text-orange-500" />, 
      title: 'Instant Verification',
      description: 'Verify credentials in seconds via QR code—no manual checks or delays.',
    },
    {
      icon: <Globe className="w-4 h-6 text-green-500" />,
      title: 'Global and Accessible',
      description: 'Access records anytime, anywhere, eliminating international verification hurdles.',
    },
    {
      icon: <Lock className="w-4 h-6 text-gray-500" />, // Neutral color for the lock
      title: 'Eliminate Fraud',
      description: 'Cryptographically secured records make forging academic credentials impossible.',
    },
  ];

  const howItWorks = [
    {
      icon: <GraduationCap className="w-6 h-6 text-red-600" />, 
      title: 'University Issues',
      description: 'The institution mints the certificate on the decentralized network.',
    },
    {
      icon: <FileText className="w-6 h-6 text-red-600" />, 
      title: 'Student Receives',
      description: 'The student gains cryptographic ownership of the unique credential.',
    },
    {
      icon: <UserCheck className="w-6 h-6 text-red-600" />, 
      title: 'Employer Verifies',
      description: 'A third party validates the certificate\'s authenticity instantly on-chain.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      
      {/* 1. Hero Section (Uses Coral Accent) */}
      <HeroSectionLight
        title="Academic Credentials, Decentralized."
        subtitle={{
          regular: 'The minimal solution that transforms paper diplomas into organized,',
          highlight: 'instantly verifiable digital assets.',
        }}
        ctaText={account ? 'Go to Dashboard' : 'Get Started - Connect Wallet'}
        onCtaClick={handleGetStarted}
        // NOTE: The HeroSectionLight component itself must use ACCENT_COLOR_CLASSES internally 
        // as defined in the previous reply to get the button color right.
        className={ACCENT_COLOR_CLASSES}
      />

{/*       
      <div className="max-w-6xl mx-auto px-4 -mt-10 mb-20">
        <Card className="shadow-2xl shadow-gray-200 border-gray-100 p-8 h-[500px] flex items-center justify-center">
            <div className="w-full h-full bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="text-gray-400 text-center pt-20">
                    <h4 className="text-xl font-semibold mb-4 text-gray-900">Live Credential Verification Dashboard</h4>
                    <p>Central hub for universities to issue and students/employers to verify credentials.</p>
                    <div className="mt-8 p-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-700">
                        Verification Status: <span className="text-green-600 font-bold">SUCCESSFUL</span> on Blockchain
                    </div>
                </div>
            </div>
        </Card>
      </div>  */}






       






















<div className="max-w-6xl mx-auto px-6 mt-20 mb-32 grid grid-cols-1 md:grid-cols-2 gap-12">

  {/* LEFT — HOLOGRAPHIC VERIFICATION SCANNER (Light Theme) */}
  <div className="relative rounded-2xl h-[420px] 
                 /* Changed background to light, subtle border and shadow */
                 bg-white border border-gray-200 backdrop-blur-sm shadow-xl shadow-gray-200/50 p-8 flex items-center justify-center">

    {/* glowing ring */}
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Changed ring color to a soft, pulsating coral */}
      <div className="h-64 w-64 rounded-full border border-red-300/60 animate-pulse"></div>
    </div>

    {/* hologram box (now a subtle device view) */}
    <div className="relative h-52 w-52 
                     /* Light, clean background for the display */
                     bg-gray-50/50 border border-gray-300 rounded-xl backdrop-blur-sm
                     flex items-center justify-center shadow-lg">

      {/* Verification Icon */}
      <div className="animate-pulse text-6xl text-gray-500">🔍</div>

      {/* scan line (Accent Color) */}
      <div className="absolute top-0 left-0 w-full h-[3px] 
                      /* Changed scan line to Coral/Orange accent */
                      bg-gradient-to-r from-red-400 to-orange-400 animate-scan"></div>
    </div>

  </div>

  {/* RIGHT — INFO PANEL (High Contrast Text) */}
  <div className="flex flex-col justify-center">

    <h2 className="text-4xl font-extrabold 
                   /* Changed gradient accent to Coral/Orange */
                   bg-gradient-to-r from-red-600 to-orange-600 
                   bg-clip-text text-transparent mb-4">
      Real-Time Credential Verification
    </h2>

    <p className="text-gray-700 leading-relaxed mb-8">
      A next-generation decentralized platform enabling universities to issue 
      **tamper-proof credentials** and allowing students and employers to verify 
      authenticity **instantly on the blockchain**.
    </p>

    {/* Status Indicator (Green for Active/Success) */}
    <div className="flex items-center gap-3 
                    /* Clean, light background for status chip */
                    bg-green-50 text-green-700 
                    px-5 py-3 rounded-xl border border-green-300/40">
      <span className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
      <span className="font-semibold text-sm">Verification Active · Blockchain Synced</span>
    </div>

  </div>
</div>







      {/* 2. Feature Grid Section (Uses subtle grays, clean cards) */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-4">
              <CardContent className="p-4 pt-4">
                <div className="mb-4">
                    {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-base text-gray-600 max-w-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. Side-by-Side Section (Uses Coral Accent in text and background) */}
      <section className="py-24 px-4 bg-gray-50/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          
            {/* Left Side: Mockup Illustration */}
          <div className="flex-1 max-w-lg mx-auto">
                <Card className="bg-white border-gray-200 rounded-lg p-8 shadow-xl shadow-gray-200">
                    <div className="space-y-4">
                        {howItWorks.map((item, index) => (
                            <div key={index} className="flex items-start space-x-3 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className={cn("p-2 rounded-full", ACCENT_BG_COLOR)}>{item.icon}</div> {/* Coral Background */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                                    <p className="text-xs text-gray-500">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
          </div>

            {/* Right Side: Text and Accent CTA */}
          <div className="flex-1 max-w-lg md:max-w-none">
            <h2 className="text-4xl font-extrabold mb-4 text-gray-900 leading-tight">
              Stop paper waste. <br/>
                <span className={ACCENT_TEXT_COLOR}>Start instant verification.</span> {/* Coral Text */}
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md">
              Credentify centralizes issuance, ownership, and verification into one seamless, cryptographically secure process.
            </p>
            
            <button
                onClick={handleGetStarted}
                className={cn(
                    "inline-flex items-center justify-center px-8 py-3 text-base font-medium text-red-600 rounded-lg shadow-lg",
                    ACCENT_COLOR_CLASSES // Coral Gradient Applied
                )}
            >
              Learn How It Works
            </button>

          </div>
        </div>
      </section>


      {/* 4. Footer Section (Final cleanup) */}
      <footer className="py-20 px-4 text-center bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <span className="text-xl font-bold text-gray-900">Credentify</span> 
          </div>
          
            <nav className="space-x-6 mb-4 text-gray-600 text-sm">
                <a href="#" className="hover:text-red-600">Documentation</a> {/* Coral hover */}
                <a href="#" className="hover:text-red-600">GitHub</a> {/* Coral hover */}
                <a href="#" className="hover:text-red-600">Privacy</a> {/* Coral hover */}
            </nav>

            <div className="inline-flex items-center justify-center px-3 py-1 text-xs font-medium text-red-700 bg-red-100 border border-red-300 rounded-full mb-2"> {/* Coral accent badge */}
                <Shield className="w-3 h-3 mr-1" /> Decentralized & Open Source
            </div>

          <p className="text-gray-500 text-xs mt-2">
            Designed for trust, &copy; 2025 Credentify.
          </p>
        </div>
      </footer>
    </div>
  );
};