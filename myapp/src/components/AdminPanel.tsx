import { useEffect, useState, FormEvent } from 'react';
import {
  Calendar,
  Clock,
  BookOpen,
  Image as ImageIcon,
  Settings,
  Users,
  Search,
  Filter,
  Check,
  X,
  Plus,
  Trash2,
  Edit2,
  FileSpreadsheet,
  TrendingUp,
  BarChart2,
  Share2,
  MessageSquare,
  Mail,
  ShieldCheck,
  Save,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Booking, Course, Slot, Testimonial, GalleryItem, SiteSettings } from '../types';
import Logo from './Logo';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'courses' | 'slots' | 'testimonials' | 'settings'>('bookings');
  
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Data State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [courseFilter, setCourseFilter] = useState<string>('All');

  // Loading States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form Modals / Expanders
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [showAddTestimonial, setShowAddTestimonial] = useState(false);

  // Form Fields State
  const [courseForm, setCourseForm] = useState({
    name: '',
    category: 'Java Full Stack',
    duration: '6 Months',
    mode: 'Both' as 'Online' | 'Offline' | 'Both',
    description: '',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400',
    projects: '2 Projects',
    frontend: '',
    backend: '',
    database: ''
  });

  const [slotForm, setSlotForm] = useState({
    time: '10:00 AM - 11:30 AM',
    capacity: 20
  });

  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    course: 'Java Full Stack Development',
    review: '',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  });

  useEffect(() => {
    const token = localStorage.getItem('reboot_admin_token');
    if (token === 'reboot-admin-session-token-9988') {
      setIsAuthenticated(true);
      fetchAllData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('reboot_admin_token') || '';
      const headers = { 'Authorization': token };
      const [resB, resC, resS, resT, resG, resSet] = await Promise.all([
        fetch('/api/book-demo', { headers }),
        fetch('/api/courses', { headers }),
        fetch('/api/slots', { headers }),
        fetch('/api/testimonials', { headers }),
        fetch('/api/gallery', { headers }),
        fetch('/api/settings', { headers })
      ]);

      if (resB.ok) setBookings(await resB.json());
      if (resC.ok) setCourses(await resC.json());
      if (resS.ok) setSlots(await resS.json());
      if (resT.ok) setTestimonials(await resT.json());
      if (resG.ok) setGallery(await resG.json());
      if (resSet.ok) setSettings(await resSet.json());
    } catch (err) {
      console.error('Failed to load admin panel data:', err);
      toast.error('Failed to sync state from database server.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem('reboot_admin_token', data.token);
        setIsAuthenticated(true);
        toast.success('Access Granted! Welcome to Reboot Administration.');
        fetchAllData();
      } else {
        toast.error(data.error || 'Invalid username or password');
      }
    } catch (err) {
      toast.error('Authentication request failed.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('reboot_admin_token');
    setIsAuthenticated(false);
    setLoginUsername('');
    setLoginPassword('');
    toast.success('Successfully logged out.');
  };

  // 1. Bookings Handlers
  const handleUpdateBookingStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    try {
      const response = await fetch(`/api/book-demo/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('reboot_admin_token') || ''
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        toast.success(`Booking status updated to ${status}`);
        setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
      }
    } catch (err) {
      toast.error('Status modification failed.');
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you wish to delete this booking records permanently?')) return;
    try {
      const response = await fetch(`/api/book-demo/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': localStorage.getItem('reboot_admin_token') || ''
        }
      });
      if (response.ok) {
        toast.success('Booking records deleted.');
        setBookings(bookings.filter(b => b.id !== id));
      }
    } catch (err) {
      toast.error('Deletion failed.');
    }
  };

  const handleExportCSV = () => {
    if (!bookings.length) {
      toast.error('No booking records to export.');
      return;
    }
    const headers = ['ID', 'Student Name', 'Email', 'Phone', 'College', 'Graduation', 'Course Interested', 'Date', 'Time Slot', 'Mode', 'Status', 'Booking Date'];
    const rows = bookings.map(b => [
      b.id,
      b.fullName,
      b.email,
      b.phoneNumber,
      b.college,
      b.graduationYear,
      b.courseInterested,
      b.preferredDate,
      b.preferredTimeSlot,
      b.mode,
      b.status,
      b.createdAt
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Reboot_Code_Academy_Bookings_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Excel CSV file downloaded successfully!');
  };

  // 2. Course Catalog Handlers
  const handleSaveCourse = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const formattedCourse = {
      name: courseForm.name,
      category: courseForm.category,
      duration: courseForm.duration,
      mode: courseForm.mode,
      description: courseForm.description,
      image: courseForm.image,
      projects: courseForm.projects,
      details: {
        frontend: courseForm.frontend ? courseForm.frontend.split(',').map(s => s.trim()) : undefined,
        backend: courseForm.backend ? courseForm.backend.split(',').map(s => s.trim()) : undefined,
        database: courseForm.database ? courseForm.database.split(',').map(s => s.trim()) : undefined
      }
    };

    try {
      const url = editingCourse ? `/api/courses/${editingCourse.id}` : '/api/courses';
      const method = editingCourse ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('reboot_admin_token') || ''
        },
        body: JSON.stringify(formattedCourse)
      });

      if (response.ok) {
        toast.success(editingCourse ? 'Course catalog item updated!' : 'New course added!');
        fetchAllData();
        setShowAddCourse(false);
        setEditingCourse(null);
        setCourseForm({
          name: '', category: 'Java Full Stack', duration: '6 Months', mode: 'Both',
          description: '', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400',
          projects: '2 Projects', frontend: '', backend: '', database: ''
        });
      }
    } catch (err) {
      toast.error('Failed to save course.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditCourseClick = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({
      name: course.name,
      category: course.category,
      duration: course.duration,
      mode: course.mode,
      description: course.description,
      image: course.image,
      projects: course.projects || '2 Projects',
      frontend: course.details.frontend?.join(', ') || '',
      backend: course.details.backend?.join(', ') || '',
      database: course.details.database?.join(', ') || ''
    });
    setShowAddCourse(true);
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you wish to delete this course from catalog? This is irreversible.')) return;
    try {
      const response = await fetch(`/api/courses/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': localStorage.getItem('reboot_admin_token') || ''
        }
      });
      if (response.ok) {
        toast.success('Course deleted from active list.');
        setCourses(courses.filter(c => c.id !== id));
      }
    } catch (err) {
      toast.error('Failed to delete course.');
    }
  };

  // 3. Slot Handlers
  const handleSaveSlot = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/slots', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('reboot_admin_token') || ''
        },
        body: JSON.stringify(slotForm)
      });

      if (response.ok) {
        toast.success('New class timing slot created.');
        fetchAllData();
        setShowAddSlot(false);
      }
    } catch (err) {
      toast.error('Failed to create slot.');
    }
  };

  const handleDeleteSlot = async (id: string) => {
    if (!confirm('Are you sure you wish to delete this timing slot?')) return;
    try {
      const response = await fetch(`/api/slots/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': localStorage.getItem('reboot_admin_token') || ''
        }
      });
      if (response.ok) {
        toast.success('Time slot removed.');
        setSlots(slots.filter(s => s.id !== id));
      }
    } catch (err) {
      toast.error('Failed to remove slot.');
    }
  };

  // 4. Testimonial Handlers
  const handleSaveTestimonial = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('reboot_admin_token') || ''
        },
        body: JSON.stringify(testimonialForm)
      });

      if (response.ok) {
        toast.success('Student review added to slider.');
        fetchAllData();
        setShowAddTestimonial(false);
        setTestimonialForm({ name: '', course: 'Java Full Stack Development', review: '', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' });
      }
    } catch (err) {
      toast.error('Failed to save testimonial.');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you wish to delete this review?')) return;
    try {
      const response = await fetch(`/api/testimonials/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': localStorage.getItem('reboot_admin_token') || ''
        }
      });
      if (response.ok) {
        toast.success('Review removed.');
        setTestimonials(testimonials.filter(t => t.id !== id));
      }
    } catch (err) {
      toast.error('Failed to delete review.');
    }
  };

  // 5. Settings Save
  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('reboot_admin_token') || ''
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        toast.success('Admissions settings updated globally!');
      }
    } catch (err) {
      toast.error('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  // Quick Action Communication
  const triggerEmailStudent = (email: string) => {
    toast.success(`Sent manual slot confirmation email to: ${email}`);
  };

  const triggerWhatsAppStudent = (phone: string, name: string, course: string) => {
    const text = `Hello ${name}, this is Reboot Code Academy confirming your booking interest in ${course}. We look forward to meeting you!`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Analytics helper math
  const getDailyBookings = () => {
    const today = new Date().toISOString().slice(0, 10);
    return bookings.filter(b => b.createdAt?.slice(0, 10) === today).length;
  };

  const getMonthlyBookings = () => {
    const month = new Date().toISOString().slice(0, 7);
    return bookings.filter(b => b.createdAt?.slice(0, 7) === month).length;
  };

  const getPopularCourses = () => {
    const counts: Record<string, number> = {};
    bookings.forEach(b => {
      counts[b.courseInterested] = (counts[b.courseInterested] || 0) + 1;
    });
    return Object.entries(counts).sort((a,b) => b[1] - a[1]);
  };

  // Bookings filtering
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.phoneNumber.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesCourse = courseFilter === 'All' || b.courseInterested === courseFilter;

    return matchesSearch && matchesStatus && matchesCourse;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden" id="admin-login-viewport">
        {/* Ambient background blur circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10 space-y-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <Logo size="lg" />
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold uppercase tracking-tight text-white">Administration Portal</h2>
              <p className="text-xs text-slate-400">Please authenticate with your secure admin credentials.</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Admin Username</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Users className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Enter username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Security Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-800 disabled:to-slate-800 text-white text-xs font-black uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
            >
              {loginLoading ? (
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
              ) : (
                <span>Authenticate Access</span>
              )}
            </button>
          </form>

          <p className="text-center text-[10px] text-slate-600">
            Forgot credentials? Check your configured values inside the local data/db.json file or consult system admins.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10" id="admin-panel-viewport">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
          <div className="space-y-1.5">
            <span className="text-[10px] bg-red-500/10 text-red-500 px-2.5 py-1 rounded-md font-black uppercase tracking-widest flex items-center gap-1.5 w-fit">
              <ShieldCheck className="w-4 h-4" />
              Secure Django REST Proxy
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">Reboot Academy Administration</h1>
            <p className="text-xs text-slate-400 font-medium">Add, update, and manage bookings, slots, testimonials, and contact parameters on live database records.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchAllData}
              className="px-5 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-black uppercase rounded-xl transition-all cursor-pointer"
            >
              Refresh Database
            </button>
            <button
              onClick={handleLogout}
              className="px-5 py-3 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 text-xs font-black uppercase rounded-xl transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Analytics Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-blue-600/10 text-blue-400 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500">Total Bookings</p>
              <h3 className="text-2xl font-black text-white">{bookings.length}</h3>
            </div>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-red-600/10 text-red-400 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500">Daily Bookings</p>
              <h3 className="text-2xl font-black text-white">{getDailyBookings()}</h3>
            </div>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-emerald-600/10 text-emerald-400 rounded-xl">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500">Monthly Bookings</p>
              <h3 className="text-2xl font-black text-white">{getMonthlyBookings()}</h3>
            </div>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-amber-600/10 text-amber-400 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500">Catalog Courses</p>
              <h3 className="text-2xl font-black text-white">{courses.length}</h3>
            </div>
          </div>
        </div>

        {/* Popular Courses Analytics Panel (Anti-AI Slop, clean styling) */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Course Demand Popularity Rates
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {getPopularCourses().slice(0, 3).map(([courseName, count]) => (
              <div key={courseName} className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-300 truncate w-3/4">{courseName}</span>
                  <span className="bg-blue-600/10 text-blue-400 px-2 py-0.5 rounded font-bold text-[10px] shrink-0">
                    {count} bookings
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min((count / bookings.length) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
            {getPopularCourses().length === 0 && (
              <p className="text-xs text-slate-500 py-2">No bookings recorded yet to show chart stats.</p>
            )}
          </div>
        </div>

        {/* Dashboard Menu Grid Tabbed Selector */}
        <div className="flex border-b border-slate-800 gap-1 overflow-x-auto pb-px" id="admin-tabs">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-5 py-3 text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'bookings'
                ? 'border-b-2 border-red-500 text-white font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Demo Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-5 py-3 text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'courses'
                ? 'border-b-2 border-red-500 text-white font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Manage Course Catalog
          </button>
          <button
            onClick={() => setActiveTab('slots')}
            className={`px-5 py-3 text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'slots'
                ? 'border-b-2 border-red-500 text-white font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Timing Slots ({slots.length})
          </button>
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`px-5 py-3 text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'testimonials'
                ? 'border-b-2 border-red-500 text-white font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Testimonials ({testimonials.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-3 text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'border-b-2 border-red-500 text-white font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Site Contact Settings
          </button>
        </div>

        {/* ===================== TAB CONTENT PANELS ===================== */}

        {loading ? (
          <div className="py-20 flex justify-center items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Syncing Database...</span>
          </div>
        ) : (
          <div className="space-y-6">

            {/* TAB 1: BOOKINGS LIST */}
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                {/* Search / Filter Row */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-4 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input
                      type="text"
                      placeholder="Search name, phone, email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-3 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-500 shrink-0" />
                    <select
                      value={statusFilter}
                      onChange={(e: any) => setStatusFilter(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <select
                      value={courseFilter}
                      onChange={(e) => setCourseFilter(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    >
                      <option value="All">All Courses</option>
                      {Array.from(new Set(courses.map(c => c.name))).map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleExportCSV}
                    className="sm:col-span-2 w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 shrink-0" />
                    <span>Export CSV</span>
                  </button>
                </div>

                {/* Bookings Desktop Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-950 border-b border-slate-800 uppercase text-slate-400 font-extrabold text-[10px] tracking-wider">
                          <th className="p-4">Student</th>
                          <th className="p-4">Contact</th>
                          <th className="p-4">College (Year)</th>
                          <th className="p-4">Interested Program</th>
                          <th className="p-4">Slot Preference</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 font-medium">
                        {filteredBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="p-4">
                              <p className="font-extrabold text-white text-sm">{b.fullName}</p>
                              <p className="text-[10px] text-slate-500">Booked {new Date(b.createdAt).toLocaleDateString()}</p>
                            </td>
                            <td className="p-4">
                              <p className="text-slate-300">{b.email}</p>
                              <p className="text-slate-500 font-mono">{b.phoneNumber}</p>
                            </td>
                            <td className="p-4">
                              <p className="text-slate-300">{b.college}</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase">Graduation: {b.graduationYear}</p>
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-blue-400">{b.courseInterested}</span>
                            </td>
                            <td className="p-4">
                              <p className="text-slate-300">{b.preferredDate}</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase">{b.preferredTimeSlot} • {b.mode}</p>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${
                                b.status === 'Approved' ? 'bg-emerald-500/15 text-emerald-400' :
                                b.status === 'Rejected' ? 'bg-red-500/15 text-red-400' :
                                'bg-amber-500/15 text-amber-400 animate-pulse'
                              }`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2 justify-center items-center">
                                {b.status === 'Pending' && (
                                  <>
                                    <button
                                      onClick={() => handleUpdateBookingStatus(b.id, 'Approved')}
                                      className="p-1.5 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/20 rounded-lg transition-all"
                                      title="Approve Booking"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleUpdateBookingStatus(b.id, 'Rejected')}
                                      className="p-1.5 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 rounded-lg transition-all"
                                      title="Reject Booking"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}

                                {/* Email Actions */}
                                <button
                                  onClick={() => triggerEmailStudent(b.email)}
                                  className="p-1.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-lg transition-all"
                                  title="Send confirmation email"
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                </button>

                                {/* WhatsApp chat trigger */}
                                <button
                                  onClick={() => triggerWhatsAppStudent(b.phoneNumber, b.fullName, b.courseInterested)}
                                  className="p-1.5 bg-emerald-600/15 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/10 rounded-lg transition-all"
                                  title="Send WhatsApp update"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => handleDeleteBooking(b.id)}
                                  className="p-1.5 bg-slate-950 hover:bg-red-600 text-slate-500 hover:text-white border border-slate-800 rounded-lg transition-all"
                                  title="Delete record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}

                        {filteredBookings.length === 0 && (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-slate-500 font-bold uppercase">
                              No demo bookings match search keywords or filters.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: COURSE CATALOG */}
            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider">Dynamic Courses Catalog ({courses.length})</h3>
                  <button
                    onClick={() => {
                      setEditingCourse(null);
                      setShowAddCourse(!showAddCourse);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-red-600 text-white text-xs font-black uppercase rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Course</span>
                  </button>
                </div>

                {/* Add/Edit Course Form Panel */}
                {showAddCourse && (
                  <form onSubmit={handleSaveCourse} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 max-w-3xl">
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">
                      {editingCourse ? 'Edit Course Catalog Entry' : 'Create New Course Catalog Entry'}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400">Course Name</label>
                        <input
                          type="text"
                          required
                          value={courseForm.name}
                          onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400">Category Selector</label>
                        <select
                          value={courseForm.category}
                          onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                        >
                          <option value="Java Full Stack">Java Full Stack</option>
                          <option value="Python Full Stack">Python Full Stack</option>
                          <option value="Web Development">Web Development</option>
                          <option value=".NET Technology">.NET Technology</option>
                          <option value="AI Technologies & Tools">AI Technologies & Tools</option>
                          <option value="Cloud Technology & DevOps">Cloud Technology & DevOps</option>
                          <option value="ServiceNow">ServiceNow</option>
                          <option value="Testing Tools">Testing Tools</option>
                          <option value="Basic Technologies">Basic Technologies</option>
                          <option value="Aptitude & English">Aptitude & English</option>
                          <option value="Banking Jobs Coaching">Banking Jobs Coaching</option>
                          <option value="Non-IT Jobs Coaching">Non-IT Jobs Coaching</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400">Duration (e.g. 6 Months)</label>
                        <input
                          type="text"
                          required
                          value={courseForm.duration}
                          onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400">Class Mode</label>
                        <select
                          value={courseForm.mode}
                          onChange={(e: any) => setCourseForm({ ...courseForm, mode: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                        >
                          <option value="Both">Both Online & Offline</option>
                          <option value="Offline">Offline Only</option>
                          <option value="Online">Online Only</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400">Course Card Banner URL</label>
                        <input
                          type="text"
                          required
                          value={courseForm.image}
                          onChange={(e) => setCourseForm({ ...courseForm, image: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400">Projects Count (e.g. 2 Projects)</label>
                        <input
                          type="text"
                          value={courseForm.projects}
                          onChange={(e) => setCourseForm({ ...courseForm, projects: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">Short Description</label>
                      <textarea
                        required
                        rows={2}
                        value={courseForm.description}
                        onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>

                    {/* Technical curriculums */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400">Front End (Comma separated)</label>
                        <input
                          type="text"
                          placeholder="HTML, CSS, React"
                          value={courseForm.frontend}
                          onChange={(e) => setCourseForm({ ...courseForm, frontend: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400">Back End (Comma separated)</label>
                        <input
                          type="text"
                          placeholder="Node, Java, Express"
                          value={courseForm.backend}
                          onChange={(e) => setCourseForm({ ...courseForm, backend: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400">Database (Comma separated)</label>
                        <input
                          type="text"
                          placeholder="MySQL, MongoDB"
                          value={courseForm.database}
                          onChange={(e) => setCourseForm({ ...courseForm, database: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 text-white text-xs font-black uppercase rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Save className="w-4 h-4" />}
                        <span>Save Course</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddCourse(false)}
                        className="px-6 py-2.5 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-black uppercase rounded-xl"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Courses list table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-950 border-b border-slate-800 uppercase text-slate-400 font-extrabold text-[10px] tracking-wider">
                          <th className="p-4">Banner</th>
                          <th className="p-4">Course Details</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Duration</th>
                          <th className="p-4">Class Mode</th>
                          <th className="p-4 text-center">Controls</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 font-medium">
                        {courses.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="p-4 w-20">
                              <img src={c.image} alt={c.name} className="w-16 h-10 object-cover rounded-lg border border-slate-800" />
                            </td>
                            <td className="p-4">
                              <p className="font-extrabold text-white text-sm">{c.name}</p>
                              <p className="text-[11px] text-slate-500 line-clamp-1">{c.description}</p>
                            </td>
                            <td className="p-4">
                              <span className="bg-blue-600/10 text-blue-400 px-2 py-1 rounded text-[10px] font-black uppercase">{c.category}</span>
                            </td>
                            <td className="p-4 font-mono text-slate-300">{c.duration}</td>
                            <td className="p-4 font-bold text-slate-300">{c.mode}</td>
                            <td className="p-4 text-center">
                              <div className="flex gap-2 justify-center">
                                <button
                                  onClick={() => handleEditCourseClick(c)}
                                  className="p-1.5 bg-slate-950 border border-slate-800 hover:text-white rounded-lg"
                                  title="Edit course"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCourse(c.id)}
                                  className="p-1.5 bg-slate-950 border border-slate-800 text-slate-500 hover:text-red-400 rounded-lg"
                                  title="Delete course"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: TIMING SLOTS */}
            {activeTab === 'slots' && (
              <div className="space-y-6 max-w-xl">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider">Demo Timing Slots</h3>
                  <button
                    onClick={() => setShowAddSlot(!showAddSlot)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-red-600 text-white text-xs font-black uppercase rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Slot</span>
                  </button>
                </div>

                {showAddSlot && (
                  <form onSubmit={handleSaveSlot} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                    <h4 className="text-xs font-black text-white uppercase">New Time Slot Parameters</h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400">Slot timing format</label>
                        <input
                          type="text"
                          required
                          value={slotForm.time}
                          onChange={(e) => setSlotForm({ ...slotForm, time: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400">Capacity limits</label>
                        <input
                          type="number"
                          required
                          value={slotForm.capacity}
                          onChange={(e) => setSlotForm({ ...slotForm, capacity: parseInt(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase rounded-xl cursor-pointer">
                        Add Slot
                      </button>
                      <button type="button" onClick={() => setShowAddSlot(false)} className="px-5 py-2 bg-slate-950 border border-slate-800 text-slate-300 text-xs font-black uppercase rounded-xl">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Slots display */}
                <div className="grid grid-cols-1 gap-3">
                  {slots.map((s) => (
                    <div key={s.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-600/10 text-blue-400 rounded-xl">
                          <Clock className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <p className="font-extrabold text-white text-sm">{s.time}</p>
                          <p className="text-[11px] text-slate-500">
                            Bookings status: {s.bookedCount} / {s.capacity} occupied ({(s.capacity - s.bookedCount)} vacancies)
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteSlot(s.id)}
                        className="p-2 bg-slate-950 hover:bg-red-600/20 text-slate-500 hover:text-red-400 border border-slate-800 rounded-xl transition-all"
                        title="Remove Timing Slot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: TESTIMONIALS SLIDER */}
            {activeTab === 'testimonials' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider">Slider Reviews ({testimonials.length})</h3>
                  <button
                    onClick={() => setShowAddTestimonial(!showAddTestimonial)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-red-600 text-white text-xs font-black uppercase rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Review</span>
                  </button>
                </div>

                {showAddTestimonial && (
                  <form onSubmit={handleSaveTestimonial} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 max-w-xl">
                    <h4 className="text-xs font-black text-white uppercase">Add Student Testimony</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400">Student Name</label>
                        <input
                          type="text"
                          required
                          value={testimonialForm.name}
                          onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400">Graduated Course</label>
                        <input
                          type="text"
                          required
                          value={testimonialForm.course}
                          onChange={(e) => setTestimonialForm({ ...testimonialForm, course: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">Avatar Image URL</label>
                      <input
                        type="text"
                        required
                        value={testimonialForm.image}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, image: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">Review Quote Content</label>
                      <textarea
                        required
                        rows={3}
                        value={testimonialForm.review}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, review: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase rounded-xl cursor-pointer">
                        Save Review
                      </button>
                      <button type="button" onClick={() => setShowAddTestimonial(false)} className="px-5 py-2.5 bg-slate-950 border border-slate-800 text-slate-300 text-xs font-black uppercase rounded-xl">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testimonials.map((t) => (
                    <div key={t.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between gap-4">
                      <div className="space-y-3">
                        <p className="text-xs text-slate-300 italic">"{t.review}"</p>
                        <div className="flex items-center gap-3">
                          <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                          <div>
                            <h5 className="font-extrabold text-white text-xs sm:text-sm">{t.name}</h5>
                            <span className="text-[10px] text-slate-500 font-bold uppercase">{t.course}</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-950/80 pt-3 flex justify-end">
                        <button
                          onClick={() => handleDeleteTestimonial(t.id)}
                          className="px-3 py-1.5 bg-slate-950 hover:bg-red-600/20 text-slate-500 hover:text-red-400 border border-slate-800 text-[10px] font-black uppercase rounded-lg transition-all"
                        >
                          Delete Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: GLOBAL CONTACT SETTINGS */}
            {activeTab === 'settings' && settings && (
              <form onSubmit={handleSaveSettings} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6 max-w-2xl">
                <h3 className="text-sm font-black uppercase text-white tracking-widest border-b border-slate-800 pb-3">
                  Site Variables & Contact Settings
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400">WhatsApp Chat Number (No + symbol)</label>
                    <input
                      type="text"
                      required
                      value={settings.whatsappNumber}
                      onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400">Phone Number (With spacing)</label>
                    <input
                      type="text"
                      required
                      value={settings.phoneNumber}
                      onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400">Official Admissions Email Address</label>
                    <input
                      type="email"
                      required
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400">Academy Campus Address (Bhimavaram)</label>
                    <input
                      type="text"
                      required
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400">Google Maps URL</label>
                    <input
                      type="text"
                      required
                      value={settings.googleMapsUrl}
                      onChange={(e) => setSettings({ ...settings, googleMapsUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-3.5 pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-black text-slate-300 uppercase">Social Media Profile URLs</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-500">Facebook Page</label>
                      <input
                        type="text"
                        value={settings.socialLinks.facebook}
                        onChange={(e) => setSettings({
                          ...settings,
                          socialLinks: { ...settings.socialLinks, facebook: e.target.value }
                        })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-500">Instagram Profile</label>
                      <input
                        type="text"
                        value={settings.socialLinks.instagram}
                        onChange={(e) => setSettings({
                          ...settings,
                          socialLinks: { ...settings.socialLinks, instagram: e.target.value }
                        })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-500">YouTube Channel</label>
                      <input
                        type="text"
                        value={settings.socialLinks.youtube}
                        onChange={(e) => setSettings({
                          ...settings,
                          socialLinks: { ...settings.socialLinks, youtube: e.target.value }
                        })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-500">LinkedIn Corporation Profile</label>
                      <input
                        type="text"
                        value={settings.socialLinks.linkedin}
                        onChange={(e) => setSettings({
                          ...settings,
                          socialLinks: { ...settings.socialLinks, linkedin: e.target.value }
                        })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3.5 pt-4 border-t border-slate-800">
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-xs font-black text-slate-300 uppercase">SMTP Mailer Settings (For Live Booking Notifications)</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Configure your SMTP settings below to automatically dispatch live email confirmations to students and staff on new bookings.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-500">SMTP Host (e.g. smtp.gmail.com)</label>
                      <input
                        type="text"
                        placeholder="smtp.gmail.com"
                        value={settings.smtpHost || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          smtpHost: e.target.value
                        })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-700 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-500">SMTP Port (e.g. 587 or 465)</label>
                      <input
                        type="text"
                        placeholder="587"
                        value={settings.smtpPort || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          smtpPort: e.target.value
                        })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-700 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-500">SMTP Username (Full email address)</label>
                      <input
                        type="email"
                        placeholder="rebootcode6@gmail.com"
                        value={settings.smtpUser || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          smtpUser: e.target.value
                        })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-700 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-500">SMTP Password (Use Gmail App Password)</label>
                      <input
                        type="password"
                        placeholder="Enter SMTP App Password"
                        value={settings.smtpPass || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          smtpPass: e.target.value
                        })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-700 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3.5 pt-4 border-t border-slate-800">
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-xs font-black text-slate-300 uppercase">Admin Portal Credentials</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Define your custom administrative credentials here to prevent unauthorized dashboard logins.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-500">Admin Username</label>
                      <input
                        type="text"
                        placeholder="admin"
                        value={settings.adminUsername || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          adminUsername: e.target.value
                        })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-700 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-500">Admin Password</label>
                      <input
                        type="password"
                        placeholder="Leave blank for 'rebootcode' fallback"
                        value={settings.adminPassword || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          adminPassword: e.target.value
                        })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-700 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 text-white text-xs font-black uppercase rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    {saving ? <Loader2 className="w-4.5 h-4.5 animate-spin text-white" /> : <Save className="w-4.5 h-4.5" />}
                    <span>Save Parameters</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
