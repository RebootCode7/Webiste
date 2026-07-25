import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Calendar, Clock, CheckCircle, Mail, Phone, BookOpen, MapPin, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Slot } from '../types';

interface DemoBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedCourse?: string;
  courses: string[];
}

interface FormInputs {
  fullName: string;
  phoneNumber: string;
  email: string;
  college: string;
  graduationYear: string;
  courseInterested: string;
  preferredDate: string;
  preferredTimeSlot: string;
  mode: 'Online' | 'Offline';
  message: string;
}

export default function DemoBookingModal({ isOpen, onClose, preSelectedCourse, courses }: DemoBookingModalProps) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormInputs>();

  useEffect(() => {
    if (isOpen) {
      fetchSlots();
      if (preSelectedCourse) {
        setValue('courseInterested', preSelectedCourse);
      }
    }
  }, [isOpen, preSelectedCourse]);

  const fetchSlots = async () => {
    try {
      const response = await fetch('/api/slots');
      if (response.ok) {
        const data = await response.json();
        setSlots(data);
      }
    } catch (error) {
      console.error('Failed to load available slots:', error);
    } finally {
      setLoadingSlots(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const onSubmit = async (data: FormInputs) => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/book-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-slate-900 border border-emerald-500/30 shadow-2xl rounded-2xl pointer-events-auto flex p-4 gap-3`}>
            <div className="text-emerald-500 p-1.5 bg-emerald-500/10 rounded-lg shrink-0 h-9 w-9 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-black text-white uppercase tracking-tight">Demo Slot Booked!</p>
              <p className="text-xs text-slate-400">
                Hi {data.fullName}, we have successfully recorded your booking. Check your inbox ({data.email}) for the confirmation receipt.
              </p>
            </div>
          </div>
        ), { duration: 6000 });

        reset();
        onClose();
      } else {
        toast.error(result.error || 'Something went wrong. Please check your form input.');
      }
    } catch (error) {
      console.error('Submit booking failed:', error);
      toast.error('Could not connect to server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-zoomIn my-8">
        
        {/* Banner header ribbon */}
        <div className="bg-gradient-to-r from-blue-600 via-royal-blue to-red-600 p-5 text-center text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-black tracking-widest uppercase">Admissions 2026</span>
          <h3 className="text-xl font-black uppercase tracking-tight mt-1">Book Your FREE Live Demo</h3>
          <p className="text-xs text-blue-100 font-medium mt-0.5">Learn • Build • Practice • Get Hired</p>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Section 1: Contact Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-2 flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
              1. Contact Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your first & last name"
                  {...register('fullName', { required: 'Please enter your full name.' })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {errors.fullName && <p className="text-[10px] text-red-500 font-semibold">{errors.fullName.message}</p>}
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    type="email"
                    placeholder="student@example.com"
                    {...register('email', {
                      required: 'Please enter your email address.',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address format.' }
                    })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                {errors.email && <p className="text-[10px] text-red-500 font-semibold">{errors.email.message}</p>}
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    {...register('phoneNumber', {
                      required: 'Please enter your mobile number.',
                      pattern: { value: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit mobile number.' }
                    })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                {errors.phoneNumber && <p className="text-[10px] text-red-500 font-semibold">{errors.phoneNumber.message}</p>}
              </div>

              {/* College */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">College / University</label>
                <input
                  type="text"
                  placeholder="Where did you study?"
                  {...register('college')}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Graduation Year */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Graduation Year</label>
                <select
                  {...register('graduationYear')}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                  <option value="2025">2025</option>
                  <option value="2024">Before 2024</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Demo Preferences */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-2 flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-red-500" />
              2. Demo Class Preferences
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Course Interested */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Course Interested</label>
                <select
                  {...register('courseInterested', { required: 'Please select a course.' })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Choose Course --</option>
                  {courses.map((c, idx) => (
                    <option key={idx} value={c}>{c}</option>
                  ))}
                </select>
                {errors.courseInterested && <p className="text-[10px] text-red-500 font-semibold">{errors.courseInterested.message}</p>}
              </div>

              {/* Mode of Class */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Mode of Teaching</label>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <label className="bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-300 font-bold flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="Offline" {...register('mode')} defaultChecked />
                    <span>Offline (Bhimavaram)</span>
                  </label>
                  <label className="bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-300 font-bold flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="Online" {...register('mode')} />
                    <span>Online (Live)</span>
                  </label>
                </div>
              </div>

              {/* Preferred Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Preferred Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    type="date"
                    min={getMinDate()}
                    {...register('preferredDate', { required: 'Please pick a preferred date.' })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                {errors.preferredDate && <p className="text-[10px] text-red-500 font-semibold">{errors.preferredDate.message}</p>}
              </div>

              {/* Preferred Time Slot */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Preferred Time Slot</label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <select
                    {...register('preferredTimeSlot', { required: 'Please select a preferred slot.' })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500"
                    disabled={loadingSlots}
                  >
                    <option value="">-- Choose Time Slot --</option>
                    {slots.map((s) => {
                      const isFull = s.bookedCount >= s.capacity;
                      return (
                        <option key={s.id} value={s.time} disabled={isFull}>
                          {s.time} {isFull ? '(Fully Booked)' : `(${s.capacity - s.bookedCount} left)`}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {errors.preferredTimeSlot && <p className="text-[10px] text-red-500 font-semibold">{errors.preferredTimeSlot.message}</p>}
              </div>
            </div>

            {/* Custom Message */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Additional message / questions</label>
              <textarea
                rows={3}
                placeholder="What objectives do you wish to achieve during this demo class?"
                {...register('message')}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Form Action Footer */}
          <div className="pt-4 border-t border-slate-900 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <p className="text-[10px] text-slate-500 font-semibold uppercase flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              Physical venue: Bhimavaram Campus, Andhra Pradesh
            </p>

            <div className="flex gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-bold uppercase rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-1/2 sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-xs text-white font-black uppercase tracking-wider rounded-xl shadow-lg hover:shadow-red-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Booking...</span>
                  </>
                ) : (
                  <span>Book Free Demo Now</span>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
