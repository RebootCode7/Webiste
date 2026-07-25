import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Users, Laptop, ArrowRight, Server, Database, Layers, CheckCircle } from 'lucide-react';
import { Course } from '../types';

interface CoursesProps {
  onSelectCourse: (courseName: string) => void;
}

const categoryColors: Record<string, { border: string; bg: string; text: string; header: string; shadow: string }> = {
  'Java Full Stack': {
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    header: 'bg-emerald-600',
    shadow: 'shadow-emerald-950/20'
  },
  'Python Full Stack': {
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    header: 'bg-blue-600',
    shadow: 'shadow-blue-950/20'
  },
  'Web Development': {
    border: 'border-sky-500/30',
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    header: 'bg-sky-600',
    shadow: 'shadow-sky-950/20'
  },
  '.NET Technology': {
    border: 'border-orange-500/30',
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    header: 'bg-orange-600',
    shadow: 'shadow-orange-950/20'
  },
  'AI Technologies & Tools': {
    border: 'border-pink-500/30',
    bg: 'bg-pink-500/10',
    text: 'text-pink-400',
    header: 'bg-pink-600',
    shadow: 'shadow-pink-950/20'
  },
  'Cloud Technology & DevOps': {
    border: 'border-indigo-500/30',
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    header: 'bg-indigo-600',
    shadow: 'shadow-indigo-950/20'
  },
  'ServiceNow': {
    border: 'border-teal-500/30',
    bg: 'bg-teal-500/10',
    text: 'text-teal-400',
    header: 'bg-teal-600',
    shadow: 'shadow-teal-950/20'
  },
  'Testing Tools': {
    border: 'border-red-500/30',
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    header: 'bg-red-600',
    shadow: 'shadow-red-950/20'
  },
  'Basic Technologies': {
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    header: 'bg-cyan-600',
    shadow: 'shadow-cyan-950/20'
  },
  'Aptitude & English': {
    border: 'border-rose-500/30',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    header: 'bg-rose-600',
    shadow: 'shadow-rose-950/20'
  },
  'Banking Jobs Coaching': {
    border: 'border-slate-500/30',
    bg: 'bg-slate-500/10',
    text: 'text-slate-400',
    header: 'bg-slate-600',
    shadow: 'shadow-slate-950/20'
  },
  'Non-IT Jobs Coaching': {
    border: 'border-violet-500/30',
    bg: 'bg-violet-500/10',
    text: 'text-violet-400',
    header: 'bg-violet-600',
    shadow: 'shadow-violet-950/20'
  },
};

export default function Courses({ onSelectCourse }: CoursesProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...Array.from(new Set(courses.map(c => c.category)))];

  const filteredCourses = selectedCategory === 'All'
    ? courses
    : courses.filter(c => c.category === selectedCategory);

  return (
    <section className="py-20 bg-slate-900 border-t border-b border-slate-800" id="courses">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Course Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-black text-red-500 uppercase tracking-widest block">Dynamic Catalog</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
            Our Interactive Courses
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-red-600 mx-auto mt-2 rounded"></div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Explore our specialized developer pathways. Fully customizable dynamically from the Admin panel without modifying hardcoded client code. No pricing section, pure focus on education.
          </p>
        </div>

        {/* Dual Mode Subtitle (from the flyer!) */}
        <div className="grid grid-cols-1 md:grid-cols-3 border border-slate-800 rounded-2xl overflow-hidden shadow-lg text-center font-bold">
          <div className="bg-blue-600/10 border-r border-slate-800 p-4 text-blue-400 text-sm flex items-center justify-center gap-2">
            <Laptop className="w-5 h-5" />
            <span>OFFLINE CLASSES AVAILABLE</span>
          </div>
          <div className="bg-red-600 text-white p-4 text-sm flex items-center justify-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
            <span>BOTH ONLINE & OFFLINE COOPERATIVE CLASSES</span>
          </div>
          <div className="bg-emerald-600/10 border-l border-slate-800 p-4 text-emerald-400 text-sm flex items-center justify-center gap-2">
            <Users className="w-5 h-5" />
            <span>ONLINE CLASSES & LAB WORK</span>
          </div>
        </div>

        {/* Categories Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2" id="category-tabs">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-blue-600 to-red-600 text-white shadow-lg shadow-blue-900/20'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Courses Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 h-96 animate-pulse flex flex-col gap-4">
                <div className="w-full h-40 bg-slate-900 rounded-xl"></div>
                <div className="w-2/3 h-6 bg-slate-900 rounded"></div>
                <div className="w-full h-20 bg-slate-900 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => {
              const theme = categoryColors[course.category] || {
                border: 'border-blue-500/30',
                bg: 'bg-blue-500/10',
                text: 'text-blue-400',
                header: 'bg-blue-600',
                shadow: 'shadow-blue-950/20'
              };

              return (
                <motion.div
                  key={course.id}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-slate-950 border ${theme.border} rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl ${theme.shadow}`}
                >
                  {/* Card Colorful Header ribbon (matches flyer style!) */}
                  <div className={`${theme.header} p-4 text-white text-center font-black uppercase tracking-wider relative`}>
                    <div className="flex justify-between items-center text-xs">
                      <span>{course.category}</span>
                      {course.projects && (
                        <span className="bg-black/30 px-2 py-0.5 rounded font-black text-[10px]">
                          {course.projects}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Course Image & Basic Info */}
                  <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-slate-800 rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-slate-950/90 border border-slate-800 rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      <span>{course.mode}</span>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 space-y-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight leading-tight">
                        {course.name}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        {course.description}
                      </p>

                      {/* Modular technology breakdown lists (reproducing flyer lists!) */}
                      <div className="space-y-3 pt-2 border-t border-slate-900">
                        {course.details.frontend && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                              <Layers className="w-3 h-3 text-emerald-500" />
                              Front End Technologies
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {course.details.frontend.map((item, idx) => (
                                <span key={idx} className="text-[10px] bg-slate-900 border border-slate-800/80 text-slate-300 px-2 py-0.5 rounded font-medium">
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {course.details.backend && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                              <Server className="w-3 h-3 text-blue-500" />
                              Back End Core
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {course.details.backend.map((item, idx) => (
                                <span key={idx} className="text-[10px] bg-slate-900 border border-slate-800/80 text-slate-300 px-2 py-0.5 rounded font-medium">
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {course.details.database && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                              <Database className="w-3 h-3 text-red-500" />
                              Database Systems
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {course.details.database.map((item, idx) => (
                                <span key={idx} className="text-[10px] bg-slate-900 border border-slate-800/80 text-slate-300 px-2 py-0.5 rounded font-medium">
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Book Button */}
                    <button
                      onClick={() => onSelectCourse(course.name)}
                      className="w-full mt-6 py-3 bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 hover:border-slate-700 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 cursor-pointer"
                    >
                      <span>Book Free Demo</span>
                      <ArrowRight className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Extra flyer items row: Essential Tools (Git, GitHub, VS Code, Eclipse, Notepad) */}
        <div className="border border-slate-800/80 rounded-2xl bg-slate-950 p-6 text-center space-y-6 shadow-md">
          <div className="space-y-1">
            <span className="text-[10px] text-red-500 font-black uppercase tracking-widest">Industry Standard Tools</span>
            <h4 className="text-sm sm:text-base font-extrabold text-white uppercase">How To Use & Learn – Essential Tools</h4>
            <div className="w-8 h-0.5 bg-blue-500 mx-auto rounded"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="p-3 bg-slate-900 border border-slate-800/60 rounded-xl space-y-1">
              <span className="text-xs font-extrabold text-white">Git</span>
              <p className="text-[9px] text-slate-500">Version control & branching</p>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800/60 rounded-xl space-y-1">
              <span className="text-xs font-extrabold text-white">GitHub</span>
              <p className="text-[9px] text-slate-500">Cloud repository hosting</p>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800/60 rounded-xl space-y-1">
              <span className="text-xs font-extrabold text-white">VS Code</span>
              <p className="text-[9px] text-slate-500">Powerful code IDE extensions</p>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800/60 rounded-xl space-y-1">
              <span className="text-xs font-extrabold text-white">Eclipse IDE</span>
              <p className="text-[9px] text-slate-500">Enterprise Java framework</p>
            </div>
            <div className="col-span-2 sm:col-span-1 p-3 bg-slate-900 border border-slate-800/60 rounded-xl space-y-1">
              <span className="text-xs font-extrabold text-white">Notepad++</span>
              <p className="text-[9px] text-slate-500">Simple rapid text coding editor</p>
            </div>
          </div>
        </div>

        {/* Perfect For Banner */}
        <div className="bg-gradient-to-r from-blue-900/30 via-slate-950 to-red-900/30 border border-slate-800/80 p-6 rounded-2xl text-center space-y-3">
          <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest">Target Audience</span>
          <h4 className="text-sm sm:text-base font-extrabold text-white uppercase">Reboot Academy is Perfect For</h4>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-slate-300">
            <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              Anyone Interested
            </span>
            <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              2nd / 3rd Year Students
            </span>
            <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              Final Year Students
            </span>
            <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              Graduates & Job Seekers
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Shape Your Future With In-Demand High-Volume Skills</p>
        </div>

      </div>
    </section>
  );
}
