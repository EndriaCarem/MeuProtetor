# MeuProtetor

A personal safety application built with React + Vite. MeuProtetor monitors your environment 24/7, detecting keywords and threat patterns, and connects you to emergency contacts instantly.

## Features

- **Onboarding** – 3-slide introduction flow
- **Authentication** – Login / Register with localStorage persistence
- **Dashboard** – Animated status orb, SOS button, threat meter, contact ring, recent alerts
- **Emergency Screen** – 30-second countdown with simulated live audio transcription
- **Settings** – Manage keywords, emergency contacts, AI sensitivity, data retention
- **History** – Full alert log with map placeholder and audio player UI

## Tech Stack

- [Vite](https://vitejs.dev/) + [React 19](https://react.dev/)
- [React Router v6](https://reactrouter.com/)
- [Tailwind CSS v4](https://tailwindcss.com/) (via `@tailwindcss/vite`)
- [Lucide React](https://lucide.dev/) icons

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Project Structure

```
src/
├── context/       # AppContext (global state + localStorage)
├── components/    # StatusOrb, SOSButton, ThreatMeter, ContactRing, AlertCard, BottomNav
└── screens/       # OnboardingScreen, AuthScreen, DashboardScreen, EmergencyScreen, SettingsScreen, HistoryScreen
```
