import { Link } from "react-router-dom";
import { useWeb3 } from "../context/Web3Context";
import { Wallet, LogOut, GraduationCap } from "lucide-react"; // Imported GraduationCap for logo design
import React from "react";

export const Navbar: React.FC = () => {
  const { account, connectWallet, disconnectWallet } = useWeb3();

  const navItems = [
    { name: "Student", to: "/student" },
    { name: "University", to: "/university" },
    { name: "Verify", to: "/verify" },
  ];

    // CORAL/ORANGE ACCENT CLASSES (Matching the Home.tsx theme)
    const ACCENT_CTA_CLASSES = "bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 shadow-md text-sm font-medium px-4 py-2 rounded-lg";
    const NAV_LINK_CLASSES = "text-gray-600 hover:text-red-600 transition text-sm font-medium";

  return (
 
    <nav className="top-0 left-0 right-0 z-50 h-16 border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto h-full flex items-center justify-between px-6">

        {/* LEFT — LOGO (Custom Credentify Design) */}
        <Link
          to="/"
          className="flex items-center space-x-2 font-bold text-xl tracking-tight text-gray-900 hover:text-red-600 transition"
        >
          {/* Logo Icon (Using Coral Accent) */}
          <GraduationCap className="w-6 h-6 text-red-500" />
          <span>Credentify</span>
        </Link>

        {/* RIGHT — NAVIGATION & WALLET (Combined Group) */}
        <div className="flex items-center gap-6">

          {/* DASHBOARD LINKS (Student, University, Verify) */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className={NAV_LINK_CLASSES}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Separator */}
          <div className="hidden md:block h-6 w-px bg-gray-200" />

          {/* Wallet Chip / Connect Button */}
          {account ? (
            <div className="flex items-center gap-2 text-gray-700 text-sm bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
              {/* Wallet icon color matches the accent theme text */}
              <Wallet size={16} className="text-red-600" />
              <span className="font-mono">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>

              <button
                onClick={disconnectWallet}
                className="text-gray-500 hover:text-red-500 transition ml-2"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className={ACCENT_CTA_CLASSES}
            >
              Connect Wallet
            </button>
          )}

        </div>
      </div>
    </nav>
  );
};