// src/components/Navbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { Button } from '../components/ui/Button';
import { Wallet, GraduationCap, LogOut, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { account, connectWallet, disconnectWallet, isUniversity, isAdmin } = useWeb3();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleConnect = async () => {
    await connectWallet();
    setIsMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (isUniversity || isAdmin) {
      return '/university';
    }
    return '/student';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="w-8 h-8 text-purple-600" />
            <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              CredChain
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition">
              Home
            </Link>
            {account && (
              <>
                <Link to={getDashboardLink()} className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition">
                  Dashboard
                </Link>
                <Link to="/verify" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition">
                  Verify
                </Link>
              </>
            )}
          </div>

          {/* Wallet Connection */}
          <div className="hidden md:flex items-center space-x-4">
            {account ? (
              <>
                <div className="flex items-center space-x-2 px-4 py-2 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <Wallet className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-mono text-purple-600 dark:text-purple-400">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={disconnectWallet}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Disconnect
                </Button>
              </>
            ) : (
              <Button onClick={handleConnect}>
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/"
              className="block py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {account && (
              <>
                <Link
                  to={getDashboardLink()}
                  className="block py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/verify"
                  className="block py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Verify
                </Link>
              </>
            )}
            
            {account ? (
              <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center space-x-2 px-4 py-2 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <Wallet className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-mono text-purple-600 dark:text-purple-400">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </span>
                </div>
                <Button variant="outline" className="w-full" onClick={disconnectWallet}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button className="w-full" onClick={handleConnect}>
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};