# 🏁 VELOCITY ARENA
### Full-Stack Go-Kart Racing Booking Platform
**Final Year Project — Web Development**

---

## 🚀 Project Overview

Velocity Arena is a full-stack web application for a premium go-kart racing facility. Customers can browse kart classes, select tracks, and make live bookings. Staff can manage all bookings through the built-in Admin Dashboard.

---

## 🛠️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | HTML5, CSS3, Vanilla JavaScript   |
| Backend   | Node.js + Express.js              |
| Database  | JSON file-based (bookings.json)   |
| Fonts     | Google Fonts (Orbitron, Barlow)   |

---

## 📦 Installation & Setup

### Prerequisites
- Node.js v18+ installed
- npm installed

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start

# 3. Open in browser
http://localhost:3000
```

For development with auto-reload:
```bash
npm run dev
```

---

## 🌐 REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/karts` | Get all 3 kart classes |
| `GET` | `/api/tracks` | Get all 4 race tracks |
| `GET` | `/api/packages` | Get all packages & pricing |
| `POST` | `/api/bookings` | **Create a booking** |
| `GET` | `/api/bookings` | Get all bookings (admin) |
| `GET` | `/api/bookings/:ref` | Get one booking by reference |
| `PUT` | `/api/bookings/:ref/status` | Update booking status |
| `DELETE` | `/api/bookings/:ref` | Delete a booking |
| `GET` | `/api/admin/stats` | Dashboard statistics |

### Sample POST /api/bookings Request
```json
{
  "firstName": "Ayrton",
  "lastName": "Senna",
  "email": "racer@example.com",
  "phone": "+91 98765 43210",
  "riders": "2 Riders",
  "kart": "Thunder Beast",
  "track": "Grand Prix Arena",
  "package": "Grand Prix",
  "date": "2026-04-15"
}
```

### Sample Response
```json
{
  "success": true,
  "message": "Booking confirmed! Reference: VA-987654ABC",
  "data": {
    "ref": "VA-987654ABC",
    "firstName": "Ayrton",
    "kart": "Thunder Beast",
    "track": "Grand Prix Arena",
    "totalPrice": 1299,
    "status": "Confirmed",
    "createdAt": "2026-03-04T10:00:00.000Z"
  }
}
```

---

## 🏎️ Kart Classes

| Class | Name | Speed | Handling | Weight |
|-------|------|-------|----------|--------|
| Class 1 | Sprint Blade | ★★★★★ | ★★ | Lightweight |
| Class 2 | Drift King | ★★★ | ★★★★★ | Lightweight |
| Class 3 | Thunder Beast | ★★★★★ | ★★★★ | Heavy |

---

## 🛣️ Race Circuits

| Track | Type | Length | Corners |
|-------|------|--------|---------|
| Velocity Oval | High-speed | 0.9 km | 4 |
| Dragon Circuit | Technical | 1.2 km | 9 |
| Night Serpent | Night (7PM+) | 1.1 km | 11 |
| Grand Prix Arena | Championship | 1.5 km | 12 |

---

## ⚙️ Admin Dashboard

Click the **"Admin Dashboard"** button (bottom-right corner) to access:
- Total bookings count
- Thunder Beast popularity counter
- Grand Prix Arena usage stats
- Estimated revenue
- Full bookings table with references, customer details, kart/track choices

---

## 📁 Project Structure

```
velocity-arena/
│
├── index.html        ← Frontend (single-page app)
├── server.js         ← Backend (Express REST API)
├── package.json      ← Node.js config
├── bookings.json     ← Auto-generated database (created on first booking)
└── README.md         ← This file
```

---

## ✅ Features Implemented

- [x] Renamed to **Velocity Arena**
- [x] 3 kart class selection with performance stats (speed bars)
- [x] 4 track choices with SVG circuit maps
- [x] Live booking form with kart + track auto-fill
- [x] Booking confirmation modal with reference number
- [x] Full REST API (GET, POST, PUT, DELETE)
- [x] Admin dashboard with booking table + revenue stats
- [x] File-based booking database (bookings.json)
- [x] Custom cursor, scroll reveal animations, ticker tape
- [x] Responsive pricing section
- [x] Input validation on both frontend and backend

---

*Built by shlok surwase 

