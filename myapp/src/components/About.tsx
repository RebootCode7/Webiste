import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Target, Eye, ShieldCheck, Award, ThumbsUp, Compass } from 'lucide-react';

interface CounterProps {
  target: number;
  suffix?: string;
}

function AnimatedCounter({ target, suffix = '' }: CounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500; // ms
    const increment = Math.ceil(target / (duration / 16)); // ~60fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <span className="font-extrabold text-3xl sm:text-5xl text-white">
      {count}
      {suffix}
    </span>
  );
}

export default function About() {
  return (
    <section className="py-20 bg-slate-900 border-t border-b border-slate-800 relative overflow-hidden" id="about">
      {/* Background visual accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated Counter Badges Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-slate-950 border border-slate-800 rounded-2xl shadow-lg flex flex-col items-center gap-2"
          >
            <div className="p-3 bg-blue-600/10 text-blue-400 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <AnimatedCounter target={1500} suffix="+" />
            <span className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider">Students Trained</span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-slate-950 border border-slate-800 rounded-2xl shadow-lg flex flex-col items-center gap-2"
          >
            <div className="p-3 bg-red-600/10 text-red-400 rounded-xl">
              <Compass className="w-6 h-6" />
            </div>
            <AnimatedCounter target={250} suffix="+" />
            <span className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider">Industry Projects</span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-slate-950 border border-slate-800 rounded-2xl shadow-lg flex flex-col items-center gap-2"
          >
            <div className="p-3 bg-emerald-600/10 text-emerald-400 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <AnimatedCounter target={100} suffix="%" />
            <span className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider">Placement Assistance</span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-slate-950 border border-slate-800 rounded-2xl shadow-lg flex flex-col items-center gap-2"
          >
            <div className="p-3 bg-pink-600/10 text-pink-400 rounded-xl">
              <ThumbsUp className="w-6 h-6" />
            </div>
            <AnimatedCounter target={50} suffix="+" />
            <span className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider">Hiring Partners</span>
          </motion.div>
        </div>

        {/* About Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Mission, Vision, Overview */}
          <div className="space-y-8">
            <div>
              <span className="text-xs font-black text-red-500 uppercase tracking-widest block mb-2">Who We Are</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
                Rebooting Minds, <br />
                Building Technical Leaders
              </h2>
              <div className="w-16 h-1 bg-blue-600 mt-4 rounded"></div>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
              Reboot Code Academy is a premier IT education and training institute based in Bhimavaram, Andhra Pradesh. We offer advanced, highly industry-oriented coding, database engineering, cloud computing, and job-readiness skill development training designed to empower students from both IT and Non-IT backgrounds.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {/* Mission Card */}
              <div className="p-5 bg-slate-950 border border-slate-800/80 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-blue-400">
                  <Target className="w-5 h-5 shrink-0" />
                  <h4 className="font-bold text-white uppercase text-sm">Our Mission</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  To provide practical, affordable, and high-impact software development and career training, ensuring every student has the skills to land their dream job in global multi-national companies.
                </p>
              </div>

              {/* Vision Card */}
              <div className="p-5 bg-slate-950 border border-slate-800/80 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-red-400">
                  <Eye className="w-5 h-5 shrink-0" />
                  <h4 className="font-bold text-white uppercase text-sm">Our Vision</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  To bridge the gap between academic education and modern industry demands, establishing a world-class IT talent hub in Andhra Pradesh accessible to everyone.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Why Choose Us list of 9 bullet items as shown on flyer */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative">
            <h3 className="text-xl font-bold text-white uppercase border-b border-slate-800 pb-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              Why Choose Reboot Code Academy?
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div className="flex items-start gap-2.5">
                <span className="text-red-500 font-extrabold text-lg shrink-0 mt-0.5">✓</span>
                <div>
                  <h5 className="text-xs font-bold text-slate-200">Industry Expert Trainers</h5>
                  <p className="text-[10px] text-slate-500">Learn directly from engineers working in top MNCs</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-red-500 font-extrabold text-lg shrink-0 mt-0.5">✓</span>
                <div>
                  <h5 className="text-xs font-bold text-slate-200">100% Practical Training</h5>
                  <p className="text-[10px] text-slate-500">More than 80% classes spent on writing live codes</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-red-500 font-extrabold text-lg shrink-0 mt-0.5">✓</span>
                <div>
                  <h5 className="text-xs font-bold text-slate-200">Real-Time Live Projects</h5>
                  <p className="text-[10px] text-slate-500">Deploy your applications on production clouds</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-red-500 font-extrabold text-lg shrink-0 mt-0.5">✓</span>
                <div>
                  <h5 className="text-xs font-bold text-slate-200">Placement Assistance</h5>
                  <p className="text-[10px] text-slate-500">Resume vetting, portfolio building & direct hiring</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-red-500 font-extrabold text-lg shrink-0 mt-0.5">✓</span>
                <div>
                  <h5 className="text-xs font-bold text-slate-200">Individual Attention</h5>
                  <p className="text-[10px] text-slate-500">Small batch sizes to focus on each student's speed</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-red-500 font-extrabold text-lg shrink-0 mt-0.5">✓</span>
                <div>
                  <h5 className="text-xs font-bold text-slate-200">Advanced Infrastructure</h5>
                  <p className="text-[10px] text-slate-500">State-of-the-art lab equipment and high-speed labs</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-red-500 font-extrabold text-lg shrink-0 mt-0.5">✓</span>
                <div>
                  <h5 className="text-xs font-bold text-slate-200">Interview Preparation</h5>
                  <p className="text-[10px] text-slate-500">Comprehensive coding mock sessions & FAQs</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-red-500 font-extrabold text-lg shrink-0 mt-0.5">✓</span>
                <div>
                  <h5 className="text-xs font-bold text-slate-200">Soft Skills Training</h5>
                  <p className="text-[10px] text-slate-500">English grammar, fluency, mock group discussions</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-900/30 to-red-900/30 p-4 border border-blue-800/30 rounded-xl mt-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Weekly Class Schedule</p>
                <p className="text-xs font-bold text-slate-200">Mon - Fri Technical • Sat English + Aptitude</p>
              </div>
              <span className="text-[10px] bg-red-600 text-white font-extrabold px-2 py-1 rounded">2 Weeks Sundays Mock Tests</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
