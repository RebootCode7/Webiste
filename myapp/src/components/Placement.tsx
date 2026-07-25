import { motion } from 'motion/react';
import { Briefcase, Compass, Users, Award, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';

export default function Placement() {
  const hiringPartners = [
    { name: 'Cognizant', logo: 'https://logo.clearbit.com/cognizant.com' },
    { name: 'Capgemini', logo: 'https://logo.clearbit.com/capgemini.com' },
    { name: 'Tata Consultancy Services', logo: 'https://logo.clearbit.com/tcs.com' },
    { name: 'Wipro', logo: 'https://logo.clearbit.com/wipro.com' },
    { name: 'Infosys', logo: 'https://logo.clearbit.com/infosys.com' },
    { name: 'Accenture', logo: 'https://logo.clearbit.com/accenture.com' },
    { name: 'HCLTech', logo: 'https://logo.clearbit.com/hcltech.com' },
    { name: 'Tech Mahindra', logo: 'https://logo.clearbit.com/techmahindra.com' }
  ];

  return (
    <section className="py-20 bg-slate-900 border-t border-b border-slate-800" id="placement">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Title Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-black text-red-500 uppercase tracking-widest block">Placement Hub</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
            100% Job Placement Assistance
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-red-600 mx-auto mt-2 rounded"></div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            We don't just teach, we reboot your career! We have established direct tie-ups with tier-1 MNC hiring departments to secure interviews for our graduates.
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-600/15 text-blue-400 mx-auto flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-white uppercase">Portfolio & CV Vetting</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              We design premium developer portfolios, custom GitHub pages, and ATS-vetted standard resumes containing correct technical descriptions of your live projects.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-red-600 text-white font-black text-[9px] px-3 py-1 uppercase rounded-bl-xl tracking-widest">
              Bi-Weekly
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-600/15 text-red-400 mx-auto flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-white uppercase">Mock Technical Drills</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Regular coding challenges, database query challenges, and interactive whiteboard simulations led by senior engineers from multinational partners.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/15 text-emerald-400 mx-auto flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-white uppercase">Direct Interview Pipelines</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Avoid standard online submission black holes. We route your portfolio directly to hiring coordinators in our partner networks, organizing exclusive placement drives.
            </p>
          </div>

        </div>

        {/* Brand partners display */}
        <div className="space-y-6 text-center border-t border-slate-800/60 pt-12">
          <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block">
            Where Our Alumni Work (Top Recruiting Partners)
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 items-center justify-center">
            {hiringPartners.map((partner, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-950 border border-slate-800/60 hover:border-slate-700/80 rounded-xl flex flex-col items-center justify-center gap-2 grayscale hover:grayscale-0 transition-all duration-300 shadow-sm"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  onError={(e) => {
                    // Fallback to text if Clearbit fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                  referrerPolicy="no-referrer"
                  className="h-7 w-auto object-contain max-w-[80px]"
                />
                <span className="text-[10px] font-bold text-slate-400 hover:text-white uppercase truncate w-full text-center">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Admissions Callout */}
        <div className="bg-gradient-to-r from-blue-900 via-slate-950 to-red-900 border-2 border-blue-600/30 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] bg-red-600 text-white font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
              Limited Seats Available
            </span>
            <h4 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">Admissions Open for New Batches</h4>
            <p className="text-xs text-slate-400 font-medium">
              Start your career pivot today! Register your preferred time slot and attend a free demo session.
            </p>
          </div>

          <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider shrink-0 bg-black/40 border border-slate-800 px-4 py-2 rounded-xl">
            <Sparkles className="w-4 h-4 text-amber-400 animate-bounce" />
            Your Success is Our Mission
          </div>
        </div>

      </div>
    </section>
  );
}
