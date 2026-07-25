import { motion } from 'motion/react';
import { ArrowRight, Sparkles, CheckCircle, GraduationCap } from 'lucide-react';

interface HeroProps {
  onBookDemo: () => void;
}

export default function Hero({ onBookDemo }: HeroProps) {
  const scrollToCourses = () => {
    const element = document.getElementById('courses');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 pt-16 pb-24 md:py-32" id="home">
      {/* Decorative Gradient Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(30,58,138,0.1)_0,transparent_100%)] -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-blue-400 text-xs sm:text-sm font-semibold shadow-inner justify-center"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Bhimavaram's Leading Premium IT Academy</span>
            </motion.div>

            {/* Display Heading */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-none uppercase"
              >
                Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-royal-blue to-red-500">Reboot</span> <br />
                to a Successful <br />
                <span className="text-red-500 relative inline-block">
                  Career
                  <span className="absolute bottom-1 left-0 w-full h-2 bg-blue-600/30 -z-10"></span>
                </span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg sm:text-2xl font-black tracking-widest text-slate-300 flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-1 uppercase"
              >
                <span>Learn</span>
                <span className="text-red-500">•</span>
                <span>Build</span>
                <span className="text-blue-400">•</span>
                <span>Practice</span>
                <span className="text-red-500">•</span>
                <span>Get Hired</span>
              </motion.p>
            </div>

            {/* Paragraph Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base sm:text-lg text-slate-400 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Don't just memorize codes. Reboot your skillsets with industry-led full-stack developers, practical live projects, and 100% committed placement assistance right in Bhimavaram.
            </motion.p>

            {/* Actions Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button
                onClick={onBookDemo}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-extrabold text-base rounded-xl shadow-lg shadow-blue-900/30 hover:shadow-red-900/40 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book Free Demo</span>
                <ArrowRight className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={scrollToCourses}
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 hover:border-slate-700 font-bold text-base rounded-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 cursor-pointer"
              >
                Explore Courses
              </button>
            </motion.div>

            {/* Quick trust metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="pt-6 border-t border-slate-900 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0"
            >
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% Practical</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>MNC Trainers</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Job Referrals</span>
              </div>
            </motion.div>
          </div>

          {/* Hero Right Visual Column */}
          <div className="lg:col-span-5 relative flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-md"
            >
              {/* Outer Glow Ring */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-red-500 to-indigo-600 rounded-2xl blur-xl opacity-40 animate-pulse"></div>

              {/* Card Container */}
              <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-tr-xl"></div>

                {/* Card Header with real-time stats badge */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-red-500 font-black">Success Rate</span>
                    <h3 className="text-2xl font-black text-white">100% PLACEMENT</h3>
                    <p className="text-xs text-slate-400">Assistance & Training Program</p>
                  </div>
                  <div className="p-3 bg-red-600 rounded-xl text-white shadow-md">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                </div>

                {/* Beautiful Mock Graphics (Anti-AI Slop, literal and high fidelity) */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase">Recent Hired</span>
                    <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded font-black uppercase">Active Drives</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                        SK
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-white">Sagar Kumar</p>
                        <p className="text-[10px] text-slate-500">Placed as Web Developer • Cognizant</p>
                      </div>
                      <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">9.2 LPA</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center font-bold text-sm">
                        PR
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-white">Pratyusha Reddy</p>
                        <p className="text-[10px] text-slate-500">Placed as Java Engineer • Capgemini</p>
                      </div>
                      <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">8.5 LPA</span>
                    </div>
                  </div>
                </div>

                {/* Sub features listed on flyer */}
                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl">
                    <p className="text-[10px] text-red-500 font-bold uppercase">Mode of Teaching</p>
                    <p className="text-xs font-extrabold text-white">Online & Offline</p>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl">
                    <p className="text-[10px] text-blue-400 font-bold uppercase">Weekly Classes</p>
                    <p className="text-xs font-extrabold text-white">Mon to Sat Drills</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
