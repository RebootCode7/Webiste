import { useEffect, useState } from 'react';
import { Phone, MessageCircle, Mail, MapPin, Facebook, Instagram, Youtube, Linkedin, ArrowUp } from 'lucide-react';
import { SiteSettings } from '../types';
import Logo from './Logo';

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings>({
    whatsappNumber: '919059556216',
    phoneNumber: '+91 90595 56216',
    email: 'rebootcode6@gmail.com',
    address: 'Reboot Code Academy, Bhimavaram, Andhra Pradesh, India - 534201',
    googleMapsUrl: 'https://maps.google.com/?q=Bhimavaram,+Andhra+Pradesh',
    socialLinks: {
      facebook: 'https://facebook.com/rebootcodeacademy',
      instagram: 'https://instagram.com/rebootcodeacademy',
      youtube: 'https://youtube.com/rebootcodeacademy',
      linkedin: 'https://linkedin.com/company/rebootcodeacademy'
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (err) {
      console.error('Failed to load footer site settings:', err);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-8" id="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          
          {/* Column 1: Brand Info */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center">
              <Logo size="md" />
            </div>
            
            <p className="text-xs sm:text-sm leading-relaxed text-slate-500 font-medium">
              Bhimavaram's premium technical school leading professional transitions into Web Development, Java Full Stack, Python Full Stack, ServiceNow, Testing, and Aptitude Coaching. Learn. Build. Practice. Get Hired.
            </p>

            {/* Direct Contact Buttons (WhatsApp, Call, Email, Maps) */}
            <div className="grid grid-cols-2 gap-3 max-w-sm">
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-2 transition-all shadow"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>WhatsApp Chat</span>
              </a>

              <a
                href={`tel:${settings.phoneNumber}`}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-2 transition-all shadow"
              >
                <Phone className="w-4 h-4 text-white" />
                <span>Call Advisor</span>
              </a>

              <a
                href={`mailto:${settings.email}`}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-2 transition-all shadow"
              >
                <Mail className="w-4 h-4 text-slate-400" />
                <span>Send Email</span>
              </a>

              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-2 transition-all shadow"
              >
                <MapPin className="w-4 h-4 text-red-500" />
                <span>Open Google Maps</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-widest border-b border-slate-900 pb-2">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs font-bold uppercase">
              <li>
                <a href="#home" className="hover:text-blue-500 transition-colors">Home Base</a>
              </li>
              <li>
                <a href="#courses" className="hover:text-blue-500 transition-colors">Dynamic Courses</a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-blue-500 transition-colors">Student Reviews</a>
              </li>
              <li>
                <a href="#placement" className="hover:text-blue-500 transition-colors">Placement Assistance</a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-blue-500 transition-colors">Campus Gallery</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-blue-500 transition-colors">Ask Questions (FAQ)</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Social Info */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-widest border-b border-slate-900 pb-2">
              Physical Location
            </h4>
            <div className="space-y-3.5 text-xs text-slate-500 font-medium">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <span>{settings.phoneNumber}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-600 shrink-0" />
                <span>{settings.email}</span>
              </p>
            </div>

            {/* Social Icons row */}
            <div className="pt-2 flex gap-2">
              {settings.socialLinks.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-600 hover:bg-slate-800 transition-all"
                  title="Follow us on Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-pink-500 hover:bg-slate-800 transition-all"
                  title="Follow us on Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks.youtube && (
                <a
                  href={settings.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-500 hover:bg-slate-800 transition-all"
                  title="Subscribe on YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks.linkedin && (
                <a
                  href={settings.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-all"
                  title="Connect on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-600 font-bold uppercase">
          <p>© {new Date().getFullYear()} Reboot Code Academy. All rights reserved. Bhimavaram, AP.</p>
          
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Scroll back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
