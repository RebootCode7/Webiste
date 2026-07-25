export interface Category {
  id: string;
  name: string;
  color: string; // Tailwind class color preset (e.g. 'green', 'blue', 'orange', 'pink')
}

export interface Course {
  id: string;
  name: string;
  category: string; // Category name or ID
  description: string;
  duration: string;
  mode: 'Online' | 'Offline' | 'Both';
  image: string;
  details: {
    frontend?: string[];
    backend?: string[];
    database?: string[];
    other?: string[];
  };
  projects?: string; // e.g., "2 Projects" or "1 Project"
}

export interface Booking {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  college: string;
  graduationYear: number;
  courseInterested: string;
  preferredDate: string;
  preferredTimeSlot: string;
  mode: 'Online' | 'Offline';
  message: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

export interface Slot {
  id: string;
  time: string; // e.g. "09:00 AM - 10:30 AM", "11:00 AM - 12:30 PM", "02:00 PM - 03:30 PM", "04:00 PM - 05:30 PM"
  capacity: number;
  bookedCount: number;
}

export interface Testimonial {
  id: string;
  name: string;
  review: string;
  course: string;
  image: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: 'Campus' | 'Classroom' | 'Labs' | 'Events';
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface SiteSettings {
  whatsappNumber: string;
  phoneNumber: string;
  email: string;
  address: string;
  googleMapsUrl: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    youtube: string;
    linkedin: string;
  };
  smtpHost?: string;
  smtpPort?: string;
  smtpUser?: string;
  smtpPass?: string;
  adminUsername?: string;
  adminPassword?: string;
}

export interface ChatbotFAQ {
  id: string;
  keywords: string[];
  question: string;
  answer: string;
}

export interface HomepageBanner {
  title: string;
  subtitle: string;
  image: string;
}

export interface DatabaseSchema {
  courses: Course[];
  categories: Category[];
  bookings: Booking[];
  slots: Slot[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  faq: FAQ[];
  settings: SiteSettings;
  chatbotFaq: ChatbotFAQ[];
  banner: HomepageBanner;
}
