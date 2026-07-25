import { motion } from 'motion/react';
import {
  Users,
  Code,
  Zap,
  HelpCircle,
  MessageSquare,
  Award,
  FileText,
  Compass,
  Laptop,
  CheckCircle2
} from 'lucide-react';

interface FeatureCardProps {
  key?: any;
  icon: any;
  title: string;
  description: string;
  color: string;
  index: number;
}

const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', glow: 'shadow-emerald-900/10' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', glow: 'shadow-blue-900/10' },
  sky: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20', glow: 'shadow-sky-900/10' },
  orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', glow: 'shadow-orange-900/10' },
  pink: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20', glow: 'shadow-pink-900/10' },
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20', glow: 'shadow-indigo-900/10' },
  teal: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20', glow: 'shadow-teal-900/10' },
  red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', glow: 'shadow-red-900/10' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', glow: 'shadow-cyan-900/10' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', glow: 'shadow-rose-900/10' },
};

function FeatureCard({ icon: Icon, title, description, color, index }: FeatureCardProps) {
  const styles = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className={`p-6 bg-slate-900 border ${styles.border} rounded-2xl shadow-lg hover:shadow-xl ${styles.glow} transition-all duration-300 flex flex-col gap-4 text-left`}
    >
      <div className={`p-3 w-12 h-12 rounded-xl ${styles.bg} ${styles.text} flex items-center justify-center shadow-inner`}>
        <Icon className="w-6 h-6 shrink-0" />
      </div>

      <div className="space-y-1.5">
        <h4 className="text-sm sm:text-base font-extrabold text-white uppercase tracking-tight">{title}</h4>
        <p className="text-xs text-slate-400 leading-relaxed font-medium">{description}</p>
      </div>
    </motion.div>
  );
}

export default function Features() {
  const coreFeatures = [
    { icon: Users, title: 'Industry Expert Trainers', description: 'Our teachers work in top MNC organizations and design real corporate codebases.', color: 'emerald' },
    { icon: Code, title: 'Live Projects & Apps', description: 'Build and deploy 2+ enterprise standard client-server applications on live cloud hosting.', color: 'blue' },
    { icon: Zap, title: 'Real-Time Training', description: 'Zero theoretical whiteboard boredom. 80%+ curriculum is dedicated strictly to writing active code.', color: 'sky' },
    { icon: HelpCircle, title: 'Mock Technical Interviews', description: 'Regular real-world mock rounds with professional code interviewers to build high-stakes confidence.', color: 'orange' },
    { icon: MessageSquare, title: 'Soft Skills Training', description: 'Comprehensive workshops covering English grammar, speaking fluency, and assertive body language.', color: 'pink' },
    { icon: Award, title: 'Placement Support', description: 'Direct resume submissions, exclusive placement drives, and custom high-salary interview targets.', color: 'indigo' },
    { icon: FileText, title: 'Professional Resume Building', description: 'Personalized ATS-vetted curriculum vitae, portfolio reviews, and premium GitHub layout coaching.', color: 'rose' },
    { icon: Compass, title: 'Career Guidance', description: 'Dedicated mentors helping you define targets in front-end, back-end, DevOps, or non-technical domains.', color: 'teal' },
    { icon: Laptop, title: 'Hands-on Learning', description: 'Fully equipped development sandbox labs with high-speed development rigs and expert desk help.', color: 'cyan' },
    { icon: CheckCircle2, title: 'Course Certification', description: 'Stand out from the crowd with a corporate-ready verification certificate upon project completion.', color: 'red' },
  ];

  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden" id="features">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-950/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-950/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-16">
        {/* Header Title Section */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-black text-red-500 uppercase tracking-widest block">Core Pillars</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
            Everything You Need To Get Hired
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-red-600 mx-auto mt-2 rounded"></div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            We provide a comprehensive, rigorous transition ecosystem tailored to bridge the gaps between standard college degrees and actual industry expectations.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {coreFeatures.map((feat, idx) => (
            <FeatureCard
              key={idx}
              icon={feat.icon}
              title={feat.title}
              description={feat.description}
              color={feat.color}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
