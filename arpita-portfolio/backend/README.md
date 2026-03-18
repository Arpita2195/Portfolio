# Portfolio Backend — Setup Guide

Node.js + Express + MongoDB backend for the contact form.
Saves every message to MongoDB Atlas and sends you a Gmail notification.

---

## Quick Setup (5 minutes)

### Step 1 — Install dependencies
```bash
cd backend
npm install
```

### Step 2 — Create your .env file
```bash
cp .env.example .env
```
Fill in each value in `.env` (see below).

---

## Get MongoDB Atlas (free)

1. Go to **mongodb.com/cloud/atlas** → Sign up free
2. Create a free **M0 cluster** (Shared, free forever)
3. **Database Access** → Add Database User → username + password
4. **Network Access** → Add IP Address → Allow Access from Anywhere (`0.0.0.0/0`)
5. **Clusters → Connect → Drivers** → Copy connection string
6. Paste into `.env` as `MONGO_URI`, replace `<username>` and `<password>`

Example:
```
MONGO_URI=mongodb+srv://arpita:mypassword@cluster0.abc123.mongodb.net/portfolio
```

---

## Get Gmail App Password

1. Enable **2-Step Verification** on your Google Account
2. Go to **Google Account → Security → App Passwords**
3. Select app: Mail, device: Other → Generate
4. Copy the 16-character code → paste as `EMAIL_PASS` in `.env`

---

## Run Locally

```bash
npm run dev    # development (auto-restarts on changes)
npm start      # production
```

Test it:
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Hello!"}'
```

---

## Deploy Free on Render

1. Push the `backend` folder to a **new GitHub repo**
2. Go to **render.com** → Sign up with GitHub → New → Web Service
3. Connect your repo
4. Set:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add Environment Variables (same as your `.env` values)
6. Click Deploy
7. Copy your Render URL: `https://your-app.onrender.com`

---

## Connect Frontend to Backend

In `index.html`, find this line near the bottom and update the URL:

```js
// Change this:
var BACKEND_URL = "https://YOUR-RENDER-URL.onrender.com";

// To your actual Render URL:
var BACKEND_URL = "https://arpita-portfolio-backend.onrender.com";
```

Also update the form submit handler to call the backend instead of just localStorage.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/api/contact` | Submit contact message |
| GET | `/api/messages` | View all messages (admin only) |

### View all saved messages
```bash
curl https://your-app.onrender.com/api/messages \
  -H "x-admin-key: your_admin_key_from_env"
```

---

## Notes

- Free Render instances sleep after 15 min of inactivity (first request takes ~30s to wake up)
- MongoDB Atlas M0 free tier: 512MB storage — more than enough for a portfolio
- Rate limited to 10 contact submissions per 15 minutes per IP (prevents spam)
