import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Testimonial } from '../types';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials');
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      }
    } catch (err) {
      console.error('Failed to load testimonials:', err);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  if (!testimonials.length) return null;

  return (
    <section className="py-20 bg-slate-950 border-t border-b border-slate-800" id="testimonials">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-center">
        
        {/* Header Title Section */}
        <div className="space-y-4 max-w-xl mx-auto">
          <span className="text-xs font-black text-red-500 uppercase tracking-widest block">Success Stories</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
            What Our Students Say
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-red-600 mx-auto mt-2 rounded"></div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Hear directly from our graduates who rebooted their careers and landed developer positions in multinational corporations.
          </p>
        </div>

        {/* Testimonial Active Display Card */}
        <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-12 shadow-2xl overflow-hidden max-w-4xl mx-auto">
          
          {/* Decorative blur elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-600/5 rounded-full blur-2xl"></div>

          <div className="absolute top-6 left-6 text-slate-800">
            <Quote className="w-12 h-12 rotate-180 opacity-40" />
          </div>

          <div className="relative space-y-8">
            {/* Star Rating */}
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>

            {/* Quote content */}
            <motion.p
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed font-medium italic max-w-2xl mx-auto"
            >
              "{testimonials[currentIndex]?.review}"
            </motion.p>

            {/* Profile Info */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <img
                src={testimonials[currentIndex]?.image}
                alt={testimonials[currentIndex]?.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-full border-2 border-blue-500 object-cover shadow-md"
              />
              <div className="text-center sm:text-left">
                <h4 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">{testimonials[currentIndex]?.name}</h4>
                <span className="text-xs text-slate-500 font-bold uppercase">{testimonials[currentIndex]?.course} Graduate</span>
              </div>
            </div>
          </div>

          {/* Navigation Controls (Only if multiple) */}
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-slate-900">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                title="Previous Testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                title="Next Testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Small Slider Dot Indicators */}
        {testimonials.length > 1 && (
          <div className="flex justify-center gap-1.5 pt-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx ? 'bg-red-500 w-6' : 'bg-slate-800'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
