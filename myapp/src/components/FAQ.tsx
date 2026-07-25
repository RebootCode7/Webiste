import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FAQ as FAQType } from '../types';

interface FAQItemProps {
  key?: any;
  faq: FAQType;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ faq, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300">
      {/* Toggle Button Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none cursor-pointer"
      >
        <div className="flex gap-3.5 pr-4">
          <HelpCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <span className="text-sm sm:text-base font-extrabold text-white uppercase tracking-tight">
            {faq.question}
          </span>
        </div>
        <span className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-400">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {/* Expandable Content Panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-400 leading-relaxed font-medium border-t border-slate-950/80">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [faqs, setFaqs] = useState<FAQType[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await fetch('/api/faq');
      if (response.ok) {
        const data = await response.json();
        setFaqs(data);
      }
    } catch (err) {
      console.error('Failed to load FAQs:', err);
    }
  };

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  if (!faqs.length) return null;

  return (
    <section className="py-20 bg-slate-950 border-t border-b border-slate-800" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Title Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-black text-red-500 uppercase tracking-widest block">Clear Your Doubts</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
            Frequently Asked Questions
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-red-600 mx-auto mt-2 rounded"></div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Find answers to commonly asked questions about our software development pipelines, batch timings, and placement referrals.
          </p>
        </div>

        {/* FAQs List Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isOpen={openIndex === idx}
              onToggle={() => handleToggle(idx)}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
