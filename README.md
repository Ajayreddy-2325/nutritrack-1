# 🌿 NutriTrack — Setup Guide

## What's in this folder

| File | Purpose |
|------|---------|
| `server.js` | Secure Node.js backend — holds your API key |
| `package.json` | Backend dependencies |
| `.env` | Where you paste your Anthropic API key |
| `NutriTrack-frontend.jsx` | The React frontend (upload to Claude.ai) |

---

## Step 1 — Set up the backend

### Install dependencies
```bash
cd nutritrack-backend
npm install
```

### Add your API key
Open `.env` and replace the placeholder:
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxx
```
Get your key at: https://console.anthropic.com

### Start the backend
```bash
npm start
```
You should see:
```
🌿 NutriTrack backend running on http://localhost:3001
   API key loaded: ✅ Yes
```

---

## Step 2 — Run the frontend

The file `NutriTrack-frontend.jsx` is a React component.

**Option A — Use it in Claude.ai (easiest)**
1. Open claude.ai
2. Paste the contents of `NutriTrack-frontend.jsx` into a message and ask Claude to render it as an artifact
3. It will connect to your local backend automatically

**Option B — Run it as a standalone React app**
```bash
npx create-react-app nutritrack
cd nutritrack
# Replace src/App.js content with NutriTrack-frontend.jsx content
npm start
```

---

## How it works

```
You (browser)  →  localhost:3001/api/analyze  →  Anthropic API
                       ↑
               Your API key lives here,
               never exposed to the browser
```

Your API key stays in `.env` on your machine — the frontend never sees it.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Backend offline" in the app | Run `npm start` in this folder |
| "API key not configured" | Check your `.env` file |
| CORS error in browser | Backend is running — reload the frontend |
| Port 3001 in use | Change `PORT=3002` in `.env` and update `BACKEND_URL` in the frontend |
