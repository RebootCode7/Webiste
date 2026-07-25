import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Component Imports
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import Courses from './components/Courses';
import DemoBookingModal from './components/DemoBookingModal';
import Testimonials from './components/Testimonials';
import Placement from './components/Placement';
import Gallery from './components/Gallery';
import FAQ from './components/FAQ';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';

function MainLayout() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseName, setSelectedCourseName] = useState<string>('');
  const [courseListNames, setCourseListNames] = useState<string[]>([]);

  useEffect(() => {
    // Fetch courses on mount to populate select list inside modal
    fetch('/api/courses')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCourseListNames(data.map((c: any) => c.name));
        }
      })
      .catch((err) => console.error('Failed to pre-fetch course list:', err));
  }, []);

  const handleOpenModal = (courseName: string = '') => {
    setSelectedCourseName(courseName);
    setIsModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div>
        {/* Branding header bar */}
        <Header onBookDemo={() => handleOpenModal('')} />

        {/* Hero Section */}
        <Hero onBookDemo={() => handleOpenModal('')} />

        {/* Directory catalog of courses */}
        <Courses onSelectCourse={(courseName) => handleOpenModal(courseName)} />

        {/* Animated Counter Badges & Mission Section */}
        <About />

        {/* Feature pillars */}
        <Features />

        {/* Placements and hiring MNC brands */}
        <Placement />

        {/* Slider Student Reviews */}
        <Testimonials />

        {/* Campus gallery */}
        <Gallery />

        {/* Accordions */}
        <FAQ />
      </div>

      {/* Multi-column footer with contact actions */}
      <Footer />

      {/* Admissions AI chatbot support */}
      <Chatbot />

      {/* Popup interactive booking form */}
      <DemoBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        preSelectedCourse={selectedCourseName}
        courses={courseListNames}
      />
    </div>
  );
}

function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <AdminPanel />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Dynamic toast notifications positioning */}
      <Toaster position="top-center" reverseOrder={false} />
      
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/admin" element={<AdminLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
