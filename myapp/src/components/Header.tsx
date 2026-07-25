import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Award, MapPin, Phone, MessageSquare, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import Logo from './Logo';

interface HeaderProps {
  onBookDemo?: () => void;
}

export default function Header({ onBookDemo }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    if (isAdminPage) return; // Allow normal router navigation if we're on the admin page
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="w-full bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-40 shadow-xl" id="app-header">
      {/* Top Bar Contact & Location */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 sm:px-6 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            <span className="font-medium text-slate-200">Bhimavaram, Andhra Pradesh</span>
          </span>
          <span className="hidden md:flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-blue-500" />
            <span>+91 90595 56216</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-emerald-400 font-semibold flex items-center gap-1 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Admissions Open (Limited Seats Only)
          </span>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo Brand Section */}
          <Link to="/" className="flex items-center group" id="logo-link">
            <Logo size="md" />
          </Link>

          {/* Tagline Middle (Hidden on smaller screens) */}
          <div className="hidden lg:flex flex-col items-center border-l border-r border-slate-800 px-6">
            <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Your Reboot To A</span>
            <span className="text-sm font-black text-blue-500 uppercase tracking-tight">Successful Career</span>
            <span className="text-[10px] text-red-500 tracking-wider font-bold">LEARN • BUILD • PRACTICE • GET HIRED</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-3">
            {!isAdminPage ? (
              <>
                <button onClick={() => scrollToSection('home')} className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer">Home</button>
                <button onClick={() => scrollToSection('courses')} className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer">Courses</button>
                <button onClick={() => scrollToSection('placement')} className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer">Placements</button>
                <button onClick={() => scrollToSection('testimonials')} className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer">Reviews</button>
                <button onClick={() => scrollToSection('gallery')} className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer">Gallery</button>
                <button onClick={() => scrollToSection('faq')} className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer">FAQ</button>
              </>
            ) : (
              <Link to="/" className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                ← Back to Site
              </Link>
            )}

            <Link
              to="/admin"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isAdminPage
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-red-400" />
              Admin Portal
            </Link>

            {!isAdminPage && (
              <button
                onClick={onBookDemo || (() => scrollToSection('courses'))}
                className="ml-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                Book Free Demo
              </button>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/admin"
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-red-400 hover:text-red-300"
              title="Admin Portal"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-4 space-y-3"
        >
          {!isAdminPage ? (
            <>
              <button onClick={() => scrollToSection('home')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Home</button>
              <button onClick={() => scrollToSection('courses')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Courses</button>
              <button onClick={() => scrollToSection('placement')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Placements</button>
              <button onClick={() => scrollToSection('testimonials')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Reviews</button>
              <button onClick={() => scrollToSection('gallery')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Gallery</button>
              <button onClick={() => scrollToSection('faq')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">FAQ</button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (onBookDemo) {
                    onBookDemo();
                  } else {
                    scrollToSection('courses');
                  }
                }}
                className="w-full text-center py-2.5 bg-gradient-to-r from-blue-600 to-red-600 text-white font-bold rounded-lg shadow cursor-pointer"
              >
                Book Free Demo
              </button>
            </>
          ) : (
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center py-2.5 bg-slate-800 text-white font-medium rounded-lg"
            >
              ← Back to Site
            </Link>
          )}
        </motion.div>
      )}

      {/* Ribbon Banner (matches design of flyer subheader) */}
      {!isAdminPage && (
        <div className="w-full bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 py-2.5 text-center px-4 overflow-hidden shadow-inner border-t border-b border-slate-800">
          <span className="text-xs sm:text-sm font-extrabold tracking-widest text-amber-400 uppercase flex items-center justify-center gap-2">
            <Award className="w-4 h-4 text-amber-400 animate-bounce" />
            ONE ACADEMY – COMPLETE CAREER SOLUTION
            <Award className="w-4 h-4 text-amber-400 animate-bounce" />
          </span>
        </div>
      )}
    </header>
  );
}
