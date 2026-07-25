import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Eye, X, ZoomIn } from 'lucide-react';
import { GalleryItem } from '../types';

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'All' | 'Campus' | 'Classroom' | 'Labs' | 'Events'>('All');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState<string>('');

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await fetch('/api/gallery');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Failed to load gallery:', err);
    }
  };

  const tabs: ('All' | 'Campus' | 'Classroom' | 'Labs' | 'Events')[] = ['All', 'Campus', 'Classroom', 'Labs', 'Events'];

  const filteredItems = activeTab === 'All'
    ? items
    : items.filter((item) => item.category === activeTab);

  return (
    <section className="py-20 bg-slate-950 border-t border-b border-slate-800" id="gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Title Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-black text-red-500 uppercase tracking-widest block">Campus Tour</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
            Our Learning Campus Gallery
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-red-600 mx-auto mt-2 rounded"></div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Explore our state-of-the-art physical labs, classroom learning spaces, student placement celebrations, and events held in Bhimavaram.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap justify-center gap-2">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-600 to-red-600 text-white shadow-lg shadow-blue-900/10'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -4 }}
                className="group relative bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden aspect-video shadow-lg cursor-pointer"
                onClick={() => {
                  setLightboxImg(item.image);
                  setLightboxTitle(item.title);
                }}
              >
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Dark Hover Mask */}
                <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                  <div className="flex justify-end">
                    <span className="p-2 bg-slate-900 border border-slate-800 text-blue-400 rounded-lg shadow">
                      <ZoomIn className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] bg-red-600 text-white font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-tight truncate">
                      {item.title}
                    </h4>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Lightbox Modal */}
        {lightboxImg && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
              title="Close Viewer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-w-4xl w-full flex flex-col gap-4 text-center">
              <div className="relative overflow-hidden rounded-2xl border border-slate-800 shadow-2xl bg-slate-950 max-h-[80vh] flex items-center justify-center">
                <img
                  src={lightboxImg}
                  alt={lightboxTitle}
                  referrerPolicy="no-referrer"
                  className="max-h-[80vh] w-auto max-w-full object-contain"
                />
              </div>
              <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-widest">{lightboxTitle}</h3>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
