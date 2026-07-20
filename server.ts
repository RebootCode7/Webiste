import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;
const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

app.use(express.json());

// Helper function to read database safely
async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    // Return standard schema structure if empty or error
    return {
      categories: [],
      courses: [],
      bookings: [],
      slots: [],
      testimonials: [],
      gallery: [],
      faq: [],
      settings: {
        whatsappNumber: '919059556216',
        phoneNumber: '+91 90595 56216',
        email: 'rebootcode6@gmail.com',
        address: 'Reboot Code Academy, Bhimavaram, Andhra Pradesh, India - 534201',
        googleMapsUrl: 'https://maps.google.com/?q=Bhimavaram,+Andhra+Pradesh',
        socialLinks: { facebook: '', instagram: '', youtube: '', linkedin: '' },
        smtpHost: '',
        smtpPort: '587',
        smtpUser: '',
        smtpPass: ''
      },
      chatbotFaq: [],
      banner: { title: 'Your Reboot to a Successful Career', subtitle: 'Learn • Build • Practice • Get Hired', image: '' }
    };
  }
}

// Helper function to write to database
async function writeDB(data: any) {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
}

// Lazy initialization of nodemailer transporter
function getTransporter(dbSettings?: any) {
  const host = process.env.SMTP_HOST || dbSettings?.smtpHost;
  const port = parseInt(process.env.SMTP_PORT || dbSettings?.smtpPort || '587');
  const user = process.env.SMTP_USER || dbSettings?.smtpUser;
  const pass = process.env.SMTP_PASS || dbSettings?.smtpPass;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465 || port === 465,
      auth: { user, pass },
    });
  }
  return null;
}

// ==================== REST APIS ====================

// 1. Get entire settings / public data
app.get('/api/settings', async (req, res) => {
  const db = await readDB();
  const settings = { ...db.settings };
  
  // Clean sensitive fields if public access
  const authHeader = req.headers.authorization;
  if (authHeader !== 'reboot-admin-session-token-9988') {
    delete settings.smtpPass;
    delete settings.adminPassword;
  }
  res.json(settings);
});

app.post('/api/settings', async (req, res) => {
  const db = await readDB();
  db.settings = { ...db.settings, ...req.body };
  await writeDB(db);
  res.json(db.settings);
});

// Admin Login Authentication
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const db = await readDB();
  const dbUser = db.settings?.adminUsername || 'admin';
  const dbPass = db.settings?.adminPassword || 'rebootcode';
  
  if (username === dbUser && password === dbPass) {
    res.json({ success: true, token: 'reboot-admin-session-token-9988' });
  } else {
    res.status(401).json({ success: false, error: 'Invalid username or password' });
  }
});

// Banner management
app.get('/api/banner', async (req, res) => {
  const db = await readDB();
  res.json(db.banner || { title: 'Your Reboot to a Successful Career', subtitle: 'Learn • Build • Practice • Get Hired', image: '' });
});

app.post('/api/banner', async (req, res) => {
  const db = await readDB();
  db.banner = { ...db.banner, ...req.body };
  await writeDB(db);
  res.json(db.banner);
});

// 2. Courses Crud
app.get('/api/courses', async (req, res) => {
  const db = await readDB();
  res.json(db.courses);
});

app.post('/api/courses', async (req, res) => {
  const db = await readDB();
  const newCourse = { id: `course-${Date.now()}`, ...req.body };
  db.courses.push(newCourse);
  await writeDB(db);
  res.status(201).json(newCourse);
});

app.put('/api/courses/:id', async (req, res) => {
  const db = await readDB();
  const index = db.courses.findIndex((c: any) => c.id === req.params.id);
  if (index !== -1) {
    db.courses[index] = { ...db.courses[index], ...req.body };
    await writeDB(db);
    res.json(db.courses[index]);
  } else {
    res.status(404).json({ error: 'Course not found' });
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  const db = await readDB();
  const filtered = db.courses.filter((c: any) => c.id !== req.params.id);
  db.courses = filtered;
  await writeDB(db);
  res.json({ success: true });
});

// Categories Crud
app.get('/api/categories', async (req, res) => {
  const db = await readDB();
  res.json(db.categories);
});

app.post('/api/categories', async (req, res) => {
  const db = await readDB();
  const newCat = { id: `cat-${Date.now()}`, ...req.body };
  db.categories.push(newCat);
  await writeDB(db);
  res.status(201).json(newCat);
});

app.delete('/api/categories/:id', async (req, res) => {
  const db = await readDB();
  db.categories = db.categories.filter((c: any) => c.id !== req.params.id);
  await writeDB(db);
  res.json({ success: true });
});

// 3. Slots Crud
app.get('/api/slots', async (req, res) => {
  const db = await readDB();
  res.json(db.slots);
});

app.post('/api/slots', async (req, res) => {
  const db = await readDB();
  const newSlot = { id: `slot-${Date.now()}`, bookedCount: 0, ...req.body };
  db.slots.push(newSlot);
  await writeDB(db);
  res.status(201).json(newSlot);
});

app.put('/api/slots/:id', async (req, res) => {
  const db = await readDB();
  const index = db.slots.findIndex((s: any) => s.id === req.params.id);
  if (index !== -1) {
    db.slots[index] = { ...db.slots[index], ...req.body };
    await writeDB(db);
    res.json(db.slots[index]);
  } else {
    res.status(404).json({ error: 'Slot not found' });
  }
});

app.delete('/api/slots/:id', async (req, res) => {
  const db = await readDB();
  db.slots = db.slots.filter((s: any) => s.id !== req.params.id);
  await writeDB(db);
  res.json({ success: true });
});

// 4. Testimonials Crud
app.get('/api/testimonials', async (req, res) => {
  const db = await readDB();
  res.json(db.testimonials);
});

app.post('/api/testimonials', async (req, res) => {
  const db = await readDB();
  const newTestimonial = { id: `testimonial-${Date.now()}`, ...req.body };
  db.testimonials.push(newTestimonial);
  await writeDB(db);
  res.status(201).json(newTestimonial);
});

app.delete('/api/testimonials/:id', async (req, res) => {
  const db = await readDB();
  db.testimonials = db.testimonials.filter((t: any) => t.id !== req.params.id);
  await writeDB(db);
  res.json({ success: true });
});

// 5. Gallery Crud
app.get('/api/gallery', async (req, res) => {
  const db = await readDB();
  res.json(db.gallery);
});

app.post('/api/gallery', async (req, res) => {
  const db = await readDB();
  const newItem = { id: `gallery-${Date.now()}`, ...req.body };
  db.gallery.push(newItem);
  await writeDB(db);
  res.status(201).json(newItem);
});

app.delete('/api/gallery/:id', async (req, res) => {
  const db = await readDB();
  db.gallery = db.gallery.filter((g: any) => g.id !== req.params.id);
  await writeDB(db);
  res.json({ success: true });
});

// 6. FAQ Crud
app.get('/api/faq', async (req, res) => {
  const db = await readDB();
  res.json(db.faq);
});

app.post('/api/faq', async (req, res) => {
  const db = await readDB();
  const newFaq = { id: `faq-${Date.now()}`, ...req.body };
  db.faq.push(newFaq);
  await writeDB(db);
  res.status(201).json(newFaq);
});

app.delete('/api/faq/:id', async (req, res) => {
  const db = await readDB();
  db.faq = db.faq.filter((f: any) => f.id !== req.params.id);
  await writeDB(db);
  res.json({ success: true });
});

// 7. Chatbot FAQ settings Crud
app.get('/api/chatbot-faq', async (req, res) => {
  const db = await readDB();
  res.json(db.chatbotFaq);
});

app.post('/api/chatbot-faq', async (req, res) => {
  const db = await readDB();
  const newFaq = { id: `cbfaq-${Date.now()}`, ...req.body };
  db.chatbotFaq.push(newFaq);
  await writeDB(db);
  res.status(201).json(newFaq);
});

app.delete('/api/chatbot-faq/:id', async (req, res) => {
  const db = await readDB();
  db.chatbotFaq = db.chatbotFaq.filter((f: any) => f.id !== req.params.id);
  await writeDB(db);
  res.json({ success: true });
});

// 8. Book Demo & Process Booking Workflow
app.get('/api/book-demo', async (req, res) => {
  const db = await readDB();
  res.json(db.bookings);
});

app.post('/api/book-demo', async (req, res) => {
  const db = await readDB();
  const {
    fullName,
    phoneNumber,
    email,
    college,
    graduationYear,
    courseInterested,
    preferredDate,
    preferredTimeSlot,
    mode,
    message
  } = req.body;

  // Validate required parameters (without strict * Required markers, handled programmatically)
  if (!fullName || !phoneNumber || !email || !courseInterested || !preferredDate || !preferredTimeSlot || !mode) {
    return res.status(400).json({ error: 'Please provide all required parameters.' });
  }

  // Find slot and check capacity if relevant
  const slotIndex = db.slots.findIndex((s: any) => s.time === preferredTimeSlot);
  if (slotIndex !== -1) {
    const slot = db.slots[slotIndex];
    if (slot.bookedCount >= slot.capacity) {
      return res.status(400).json({ error: 'This preferred time slot is fully booked. Please choose a different slot.' });
    }
    // Update bookedCount
    db.slots[slotIndex].bookedCount += 1;
  }

  const newBooking = {
    id: `booking-${Date.now()}`,
    fullName,
    phoneNumber,
    email,
    college: college || 'Not Specified',
    graduationYear: graduationYear ? parseInt(graduationYear.toString()) : 2026,
    courseInterested,
    preferredDate,
    preferredTimeSlot,
    mode,
    message: message || '',
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  db.bookings.push(newBooking);
  await writeDB(db);

  // Email notifications triggered lazily
  let emailStatus = 'Simulated';
  const transporter = getTransporter(db.settings);
  const smtpSender = process.env.SMTP_USER || db.settings.smtpUser || 'rebootcode6@gmail.com';
  const academyMail = db.settings.email || 'rebootcode6@gmail.com';

  const studentSubject = 'Demo Booking Confirmation';
  const studentBody = `Hello ${fullName},

Thank you for booking a FREE Demo Session with Reboot Code Academy.

We have successfully received your booking.
Details:
- Course: ${courseInterested}
- Date: ${preferredDate}
- Time Slot: ${preferredTimeSlot}
- Mode: ${mode}

Our team will contact you shortly at ${phoneNumber} to confirm your preferred slot.

We look forward to helping you build your career.

Regards,
Reboot Code Academy`;

  const adminSubject = `New Demo Booking: ${fullName} - ${courseInterested}`;
  const adminBody = `A new free demo session has been booked!

Student Details:
- Name: ${fullName}
- Email: ${email}
- Phone Number: ${phoneNumber}
- College: ${college || 'N/A'}
- Graduation Year: ${graduationYear || 'N/A'}

Booking Details:
- Selected Course: ${courseInterested}
- Preferred Date: ${preferredDate}
- Preferred Time Slot: ${preferredTimeSlot}
- Mode: ${mode}
- Message: ${message || 'No additional message.'}`;

  if (transporter) {
    try {
      // Send confirmation to Student
      await transporter.sendMail({
        from: `"Reboot Code Academy" <${smtpSender}>`,
        to: email,
        subject: studentSubject,
        text: studentBody,
      });

      // Send alert to Academy Email
      await transporter.sendMail({
        from: `"Reboot Notification" <${smtpSender}>`,
        to: academyMail,
        subject: adminSubject,
        text: adminBody,
      });

      emailStatus = 'Sent';
    } catch (err) {
      console.error('Nodemailer failed sending SMTP emails:', err);
      emailStatus = 'Failed but saved';
    }
  } else {
    console.log('====== SIMULATED BOOKING EMAILS ======');
    console.log(`To Student (${email}):\nSubject: ${studentSubject}\nBody:\n${studentBody}`);
    console.log(`\nTo Admin (${academyMail}):\nSubject: ${adminSubject}\nBody:\n${adminBody}`);
    console.log('======================================');
  }

  res.status(201).json({
    booking: newBooking,
    emailStatus,
    message: 'Booking created successfully! ' + (emailStatus === 'Sent' ? 'Confirmation emails sent.' : 'Saved successfully (Simulated notification logs printed).')
  });
});

// Approve/Reject Bookings
app.put('/api/book-demo/:id/status', async (req, res) => {
  const db = await readDB();
  const { status } = req.body; // 'Approved' | 'Rejected' | 'Pending'
  const index = db.bookings.findIndex((b: any) => b.id === req.params.id);
  if (index !== -1) {
    db.bookings[index].status = status;
    await writeDB(db);
    res.json(db.bookings[index]);
  } else {
    res.status(404).json({ error: 'Booking not found' });
  }
});

// Delete Booking
app.delete('/api/book-demo/:id', async (req, res) => {
  const db = await readDB();
  const booking = db.bookings.find((b: any) => b.id === req.params.id);
  if (booking) {
    // Release slot capacity if relevant
    const slotIndex = db.slots.findIndex((s: any) => s.time === booking.preferredTimeSlot);
    if (slotIndex !== -1 && db.slots[slotIndex].bookedCount > 0) {
      db.slots[slotIndex].bookedCount -= 1;
    }
    db.bookings = db.bookings.filter((b: any) => b.id !== req.params.id);
    await writeDB(db);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Booking not found' });
  }
});


// 9. AI Chatbot endpoint
app.post('/api/chatbot', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const db = await readDB();
  const lowerMsg = message.toLowerCase();

  // Try standard keyword triggers from ChatbotFAQ database
  let matchedAnswer = '';
  for (const item of db.chatbotFaq || []) {
    const matched = item.keywords.some((kw: string) => lowerMsg.includes(kw.toLowerCase()));
    if (matched) {
      matchedAnswer = item.answer;
      break;
    }
  }

  // If we have Gemini API Key, use it to generate an intelligent natural-language response!
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const systemInstruction = `You are the friendly AI Admissions Chatbot of Reboot Code Academy, located in Bhimavaram, Andhra Pradesh.
The academy provides highly interactive, colorful, practical IT and Non-IT courses.
Here are the official site details from the database:
- Courses: ${JSON.stringify(db.courses.map((c: any) => ({ name: c.name, category: c.category, duration: c.duration, mode: c.mode, description: c.description })))}
- Contact Details: Phone: ${db.settings.phoneNumber}, Email: ${db.settings.email}, Address: ${db.settings.address}
- Placement: 100% placement assistance, mock tests, resume building, mock interviews.
- FAQ Context: ${JSON.stringify(db.faq)}

IMPORTANT INSTRUCTION:
1. Speak professionally, concisely, and with energy!
2. DO NOT mention fees or pricing packages at all. If asked about fees/price, say: "Our courses are highly affordable and we offer flexible payment installment options. Please book a free demo session to get the detailed customized schedule and fee plans."
3. Encourage them to book a free demo session!
4. Keep the answer friendly, under 3-4 sentences if possible.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\nStudent question: "${message}"` }] }
        ],
      });

      if (response && response.text) {
        return res.json({ response: response.text.trim() });
      }
    } catch (err) {
      console.error('Gemini API call failed, falling back to local database faq matching:', err);
    }
  }

  // Fallback if no matching keyword OR Gemini fails/unconfigured
  if (!matchedAnswer) {
    // Generate a default helper response using the database information
    matchedAnswer = `Thank you for contacting Reboot Code Academy! We specialize in Java Full Stack, Python Full Stack, ServiceNow, Web Development, and Testing Tools at our Bhimavaram campus. We offer both online and offline modes with 100% placement support. To get specific information or to arrange a call, please click "Book Free Demo" to schedule a session with our advisors!`;
  }

  res.json({ response: matchedAnswer });
});

// ==================== VITE & STATIC SERVING ====================

// Serve static assets or run Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
