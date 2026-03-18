# Arpita Nathwani — Portfolio Website

A premium, fully responsive dark-theme portfolio website for Arpita Nathwani, MERN Stack Developer.

## Features

- Live animated background (particles, aurora waves, hex grid, shooting stars)
- Custom cursor with trail effect
- Smooth scroll-reveal animations
- Glassmorphism UI cards
- Cormorant Garamond + DM Sans + DM Mono font stack
- Photo with gradient border frame
- All projects link to GitHub
- Contact form with localStorage database
- Fully responsive (mobile + desktop)

## Folder Structure

```
arpita-portfolio/
├── index.html          ← Main portfolio (open this in browser)
├── README.md           ← This file
├── backend/
│   ├── server.js       ← Node.js + Express backend
│   ├── package.json    ← Dependencies
│   ├── .env.example    ← Environment variables template
│   ├── .gitignore      ← Git ignore rules
│   └── README.md       ← Backend setup guide
```

## How to Run

### Frontend Only (just open in browser)
1. Double-click `index.html` — it works instantly, no server needed
2. Contact form saves messages to browser localStorage automatically

### With Backend (for real email delivery + MongoDB storage)
1. See `backend/README.md` for full setup instructions
2. Deploy backend on Render (free)
3. Update `BACKEND_URL` in `index.html`

## Deploy Frontend

**Netlify Drop (easiest — 30 seconds):**
1. Go to netlify.com/drop
2. Drag the entire `arpita-portfolio` folder onto the page
3. Get a live URL instantly

**GitHub Pages:**
1. Push to a repo named `Arpita2195.github.io`
2. Enable GitHub Pages in repo settings
3. Live at `https://Arpita2195.github.io`

## View Saved Messages

Open browser Console (F12) and type:
```js
JSON.parse(localStorage.getItem('arpita_portfolio_messages'))
```

## Tech Stack
- HTML5 + CSS3 + Vanilla JavaScript
- Canvas API (live background animations)
- Google Fonts (Cormorant Garamond, DM Sans, DM Mono)
- localStorage (contact form database)
- Node.js + Express + MongoDB (optional backend)
