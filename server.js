/**
 * VELOCITY ARENA — Backend Server
 * Node.js + Express REST API
 * 
 * Run: npm install && node server.js
 * API runs on http://localhost:3000
 */

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── MIDDLEWARE ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ─── SIMPLE FILE-BASED "DATABASE" ────────────────────────────────────────────
const DB_FILE = path.join(__dirname, 'bookings.json');

function readDB() {
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, '[]');
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ─── AVAILABLE DATA ───────────────────────────────────────────────────────────
const KARTS = [
  {
    id: 1, class: 'Class 1', name: 'Sprint Blade',
    description: 'Speed-focused. Lightweight chassis engineered for raw acceleration and maximum top-end velocity.',
    specs: { speed: 5, handling: 2, weight: 'Lightweight', stability: 2 },
    priceAddon: 0, topSpeed: '95 km/h', bestFor: 'Straight-line tracks'
  },
  {
    id: 2, class: 'Class 2', name: 'Drift King',
    description: 'Smooth handling meets a lightweight build — the perfect weapon for technical, corner-heavy tracks.',
    specs: { speed: 3, handling: 5, weight: 'Lightweight', stability: 4 },
    priceAddon: 200, topSpeed: '88 km/h', bestFor: 'Technical circuits'
  },
  {
    id: 3, class: 'Class 3', name: 'Thunder Beast',
    description: 'Heavyweight champion. Massive grip, smooth cornering, and brutal top-speed — the full package.',
    specs: { speed: 5, handling: 4, weight: 'Heavy', stability: 5 },
    priceAddon: 400, topSpeed: '92 km/h', bestFor: 'Championship layouts'
  }
];

const TRACKS = [
  {
    id: 'A', name: 'Velocity Oval', type: 'High-speed',
    length: '0.9 km', corners: 4, lapRecord: '54s',
    description: 'Classic oval circuit built for pure speed.'
  },
  {
    id: 'B', name: 'Dragon Circuit', type: 'Technical',
    length: '1.2 km', corners: 9, lapRecord: '58s',
    description: '9 technical corners rewarding precision driving.'
  },
  {
    id: 'C', name: 'Night Serpent', type: 'Night',
    length: '1.1 km', corners: 11, lapRecord: '61s',
    description: 'Undulating serpentine layout under floodlights. Available 7PM+.'
  },
  {
    id: 'D', name: 'Grand Prix Arena', type: 'Championship',
    length: '1.5 km', corners: 12, lapRecord: '67s',
    description: 'Full championship layout with pit-lane section. Experts only.'
  }
];

const PACKAGES = [
  { id: 'sprint',       name: 'Sprint Race',    duration: '10 min',  price: 499  },
  { id: 'grandprix',    name: 'Grand Prix',      duration: '20 min',  price: 899  },
  { id: 'championship', name: 'Championship',    duration: '30 min',  price: 1299 },
  { id: 'night',        name: 'Night Race',      duration: '20 min',  price: 999  },
  { id: 'junior',       name: 'Junior Race',     duration: '10 min',  price: 349  },
  { id: 'corporate',    name: 'Corporate Event', duration: 'Custom',  price: null }
];

// ─── API ROUTES ───────────────────────────────────────────────────────────────

// GET all kart classes
app.get('/api/karts', (req, res) => {
  res.json({ success: true, data: KARTS });
});

// GET all tracks
app.get('/api/tracks', (req, res) => {
  res.json({ success: true, data: TRACKS });
});

// GET all packages
app.get('/api/packages', (req, res) => {
  res.json({ success: true, data: PACKAGES });
});

// GET all bookings (admin)
app.get('/api/bookings', (req, res) => {
  const bookings = readDB();
  res.json({ success: true, count: bookings.length, data: bookings });
});

// GET single booking by reference
app.get('/api/bookings/:ref', (req, res) => {
  const bookings = readDB();
  const booking  = bookings.find(b => b.ref === req.params.ref);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  res.json({ success: true, data: booking });
});

// POST create a new booking
app.post('/api/bookings', (req, res) => {
  const { firstName, lastName, email, phone, riders, kart, track, package: pkg, date } = req.body;

  // Validation
  if (!firstName || !lastName || !email || !kart || !track || !date || !pkg) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: firstName, lastName, email, kart, track, package, date'
    });
  }

  // Email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }

  // Date validation — must be today or future
  const today = new Date(); today.setHours(0,0,0,0);
  const bookDate = new Date(date);
  if (bookDate < today) {
    return res.status(400).json({ success: false, message: 'Booking date must be today or in the future' });
  }

  // Look up kart and package pricing
  const kartData    = KARTS.find(k => k.name === kart);
  const packageData = PACKAGES.find(p => p.name === pkg || p.id === pkg);

  const basePrice   = packageData ? packageData.price : 0;
  const kartAddon   = kartData    ? kartData.priceAddon : 0;
  const totalPrice  = basePrice + kartAddon;

  // Generate unique reference
  const ref = 'VA-' + Date.now().toString().slice(-6) + Math.random().toString(36).slice(2,5).toUpperCase();

  const booking = {
    ref,
    firstName, lastName, email,
    phone: phone || '',
    riders: riders || '1 Rider',
    kart, track,
    package: pkg,
    date,
    basePrice,
    kartAddon,
    totalPrice,
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  const bookings = readDB();
  bookings.push(booking);
  writeDB(bookings);

  console.log(`✅ New booking: ${ref} — ${firstName} ${lastName} | ${kart} | ${track} | ${date}`);

  res.status(201).json({
    success: true,
    message: `Booking confirmed! Reference: ${ref}`,
    data: booking
  });
});

// PUT update booking status (admin)
app.put('/api/bookings/:ref/status', (req, res) => {
  const { status } = req.body;
  if (!['Confirmed', 'Pending', 'Cancelled', 'Completed'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }
  const bookings = readDB();
  const idx = bookings.findIndex(b => b.ref === req.params.ref);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Booking not found' });
  bookings[idx].status = status;
  writeDB(bookings);
  res.json({ success: true, data: bookings[idx] });
});

// DELETE booking (admin)
app.delete('/api/bookings/:ref', (req, res) => {
  const bookings = readDB();
  const filtered = bookings.filter(b => b.ref !== req.params.ref);
  if (filtered.length === bookings.length) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }
  writeDB(filtered);
  res.json({ success: true, message: 'Booking deleted' });
});

// GET admin dashboard stats
app.get('/api/admin/stats', (req, res) => {
  const bookings = readDB();
  const confirmed  = bookings.filter(b => b.status === 'Confirmed').length;
  const revenue    = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const kartCounts = { 'Sprint Blade': 0, 'Drift King': 0, 'Thunder Beast': 0 };
  const trackCounts = {};
  bookings.forEach(b => {
    if (kartCounts[b.kart] !== undefined) kartCounts[b.kart]++;
    trackCounts[b.track] = (trackCounts[b.track] || 0) + 1;
  });
  res.json({
    success: true,
    data: {
      totalBookings: bookings.length,
      confirmedBookings: confirmed,
      totalRevenue: revenue,
      popularKart: Object.entries(kartCounts).sort((a,b) => b[1]-a[1])[0]?.[0] || 'N/A',
      popularTrack: Object.entries(trackCounts).sort((a,b) => b[1]-a[1])[0]?.[0] || 'N/A',
      kartBreakdown: kartCounts,
      trackBreakdown: trackCounts
    }
  });
});

// Serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  ██╗   ██╗███████╗██╗      ██████╗  ██████╗██╗████████╗██╗   ██╗');
  console.log('  ██║   ██║██╔════╝██║     ██╔═══██╗██╔════╝██║╚══██╔══╝╚██╗ ██╔╝');
  console.log('  ██║   ██║█████╗  ██║     ██║   ██║██║     ██║   ██║    ╚████╔╝ ');
  console.log('  ╚██╗ ██╔╝██╔══╝  ██║     ██║   ██║██║     ██║   ██║     ╚██╔╝  ');
  console.log('   ╚████╔╝ ███████╗███████╗╚██████╔╝╚██████╗██║   ██║      ██║   ');
  console.log('    ╚═══╝  ╚══════╝╚══════╝ ╚═════╝  ╚═════╝╚═╝   ╚═╝      ╚═╝   ');
  console.log('');
  console.log(`  🏁  VELOCITY ARENA — Server running on http://localhost:${PORT}`);
  console.log('');
  console.log('  API Endpoints:');
  console.log(`  GET  /api/karts         — All kart classes`);
  console.log(`  GET  /api/tracks        — All tracks`);
  console.log(`  GET  /api/packages      — All packages & pricing`);
  console.log(`  POST /api/bookings      — Create a booking`);
  console.log(`  GET  /api/bookings      — Get all bookings (admin)`);
  console.log(`  GET  /api/bookings/:ref — Get single booking`);
  console.log(`  PUT  /api/bookings/:ref/status — Update status`);
  console.log(`  DELETE /api/bookings/:ref     — Delete booking`);
  console.log(`  GET  /api/admin/stats   — Dashboard statistics`);
  console.log('');
});
