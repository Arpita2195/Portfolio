const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST']
}));
app.use(express.json({ limit: '10kb' }));

// Rate limit: max 10 contact requests per 15 min per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many requests. Please try again later.' }
});
app.use('/api/contact', limiter);

// ─── MongoDB ──────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => { console.error('❌ MongoDB error:', err); process.exit(1); });

// ─── Schema ───────────────────────────────────────────────────
const messageSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true, maxlength: 100 },
  email:     { type: String, required: true, trim: true, lowercase: true },
  message:   { type: String, required: true, trim: true, maxlength: 2000 },
  ip:        { type: String },
  createdAt: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

// ─── Email transporter (Gmail) ────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS   // Gmail App Password
  }
});

// ─── Routes ───────────────────────────────────────────────────

// Health check
app.get('/', (req, res) => {
  res.json({ status: '✅ Portfolio backend running', time: new Date() });
});

// POST /api/contact — Save message + send email notification
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate
    if (!name || !email || !message)
      return res.status(400).json({ error: 'All fields are required.' });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ error: 'Invalid email address.' });

    if (name.length > 100 || message.length > 2000)
      return res.status(400).json({ error: 'Input too long.' });

    // Save to MongoDB
    const msg = new Message({ name, email, message, ip: req.ip });
    await msg.save();

    // Send email notification (optional — only if EMAIL_USER is set)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `New Portfolio Message from ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
            <div style="background:linear-gradient(135deg,#FF2E88,#8B5CF6);padding:24px 32px;border-radius:12px 12px 0 0;">
              <h2 style="color:#fff;margin:0;font-size:1.3rem;">New Portfolio Message</h2>
            </div>
            <div style="background:#f9f9f9;padding:28px 32px;border-radius:0 0 12px 12px;border:1px solid #eee;">
              <p style="margin:0 0 6px;color:#666;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.08em;">From</p>
              <p style="margin:0 0 20px;font-size:1.1rem;font-weight:600;color:#111;">${name}</p>
              <p style="margin:0 0 6px;color:#666;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.08em;">Email</p>
              <p style="margin:0 0 20px;"><a href="mailto:${email}" style="color:#8B5CF6;">${email}</a></p>
              <p style="margin:0 0 6px;color:#666;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.08em;">Message</p>
              <p style="margin:0;background:#fff;border-left:3px solid #FF2E88;padding:14px 18px;border-radius:0 8px 8px 0;color:#222;line-height:1.7;">${message.replace(/\n/g, '<br/>')}</p>
              <p style="margin-top:20px;font-size:0.75rem;color:#999;">Sent from arpita-portfolio · ${new Date().toLocaleString()}</p>
            </div>
          </div>
        `
      }).catch(e => console.warn('Email send failed (non-critical):', e.message));
    }

    res.status(201).json({ success: true, message: 'Message transmitted successfully!' });

  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// GET /api/messages — View all messages (protected)
app.get('/api/messages', async (req, res) => {
  if (req.headers['x-admin-key'] !== process.env.ADMIN_KEY)
    return res.status(401).json({ error: 'Unauthorized' });
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(100);
    res.json({ count: messages.length, messages });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── Start ────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server on port ${PORT}`);
  console.log(`📬 POST http://localhost:${PORT}/api/contact`);
  console.log(`📋 GET  http://localhost:${PORT}/api/messages`);
});
