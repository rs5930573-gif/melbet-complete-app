# Melbet Complete App

A complete full-stack betting app with:
- Next.js frontend
- Express backend
- SQLite database
- JWT auth
- wallet + bets
- live sports layout
- promo page
- dark/light theme

## Quick start

1. Install dependencies:
```bash
npm install
cd backend && npm install && cd ..
```

2. Start app:
```bash
npm run dev
```

3. Open:
- http://localhost:3000
- http://localhost:5000

## Default routes
- `/` dashboard
- `/sports`
- `/live`
- `/bets`
- `/wallet`
- `/promo`
- `/login`
- `/signup`

## Notes
- The app uses SQLite file at `backend/melbet.db`
- Signup creates a user and initial wallet automatically
- Bet placement updates wallet balance and stores bet records
