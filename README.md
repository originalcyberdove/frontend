# Fraudlock — Frontend

React + TypeScript + Tailwind + Vite frontend for the SMS fraud detection system.

## Quick Start

```bash
npm install
npm run dev
```

App runs at **http://localhost:5173**

The Vite dev server automatically proxies `/api/*` → `http://localhost:8000` (Django backend).
Make sure the backend is running before testing.

## Pages

| Route    | Description                                 |
|----------|---------------------------------------------|
| `/`      | SMS detection — paste any message to analyze |
| `/report`| Report a scam phone number                  |
| `/admin` | Admin dashboard (JWT login required)         |

## Project Structure

```
src/
  types/       TypeScript interfaces for API responses
  lib/api.ts   All backend API calls (axios)
  hooks/
    useDetect  Wraps the detect endpoint with loading/error state
    useAudio   YarnGPT audio player with gTTS fallback
  components/
    Navbar
    LanguageSelector
    RiskBadge / LabelBadge
    ResultCard            — full detection result with audio + feedback
  pages/
    DetectPage
    ReportPage
    AdminPage
```

## Audio (YarnGPT)

The `useAudio` hook calls `POST /api/audio/` which returns an MP3 blob.
- If `YARNGPT_API_KEY` is set in the backend `.env`, you get Nigerian-accented audio.
- Without a key, the backend uses gTTS and the hook falls back to browser `SpeechSynthesis` if the API is unavailable.

## Production Build

```bash
npm run build
# Output in dist/ — serve with any static file server
```

For production, set `VITE_API_BASE` in `.env`:
```
VITE_API_BASE=https://api.fraudlock.ng
```
