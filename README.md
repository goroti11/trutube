# GOROTI Platform

The ultimate platform for creators to connect, stream, and monetize their content.

## Features

- 🎥 **Live Streaming** - Stream to your audience with advanced features and real-time interaction
- 💰 **Monetization** - Multiple revenue streams including subscriptions, tips, and merchandise
- 🎮 **Gaming Hub** - Compete in tournaments, earn rewards, and climb the leaderboards
- 🎵 **Music Platform** - Upload and monetize your music
- 🛍️ **Merchandise Store** - Sell custom merchandise to your fans
- 👥 **Communities** - Create and manage communities around your content
- 📊 **Analytics** - Track your performance with detailed analytics

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: Custom CSS with modern design patterns
- **Routing**: React Router v6

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run development server:
   ```bash
   npm run dev
   ```
5. Build for production:
   ```bash
   npm run build
   ```

## Database

The database schema includes 100+ tables for:
- User authentication and profiles
- Live streaming and chat
- Gaming tournaments and leaderboards
- Music albums and tracks
- Merchandise and digital products
- Monetization (subscriptions, tips, revenue tracking)
- Communities and social features
- Notifications and analytics

All data has been cleaned and the application is ready for production deployment.

## Environment Variables

Required environment variables:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Security

- Row Level Security (RLS) enabled on all tables
- Optimized auth policies using `(select auth.uid())`
- All foreign keys properly indexed
- No demo/test data in production database

## Deployment

The application is production-ready and can be deployed to:
- Vercel
- Netlify
- AWS Amplify
- Any static hosting service

Simply build the project and deploy the `dist` folder.

## License

All rights reserved - GOROTI Platform
