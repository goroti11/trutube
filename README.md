# GOROTI Platform

**Version:** 1.0.0
**Status:** ✅ Production Ready
**Last Updated:** 2026-03-17

---

## Overview

GOROTI is a next-generation video platform featuring comprehensive content creation, live streaming, gaming, marketplace, and community features. The platform now supports **5 languages** with a complete internationalization system.

---

## Key Features

### 🌍 Internationalization (NEW)
- **5 languages supported:** English, French, Spanish, Portuguese, Arabic
- **RTL support** for Arabic and other right-to-left languages
- **Automatic language detection** from user preferences
- **Database-integrated** user language preferences
- **Instant language switching** without page reload

### 🎥 Video Platform
- HD video streaming with HLS support
- Multi-audio track support
- Automatic subtitles and dubbing
- Advanced video player with quality selection
- Video upload and management

### 📺 Live Streaming
- Real-time live streaming
- Interactive chat
- Gifts and monetization
- Stream replay and dubbing
- Multi-language support

### 🎮 Gaming Universe
- Tournaments and competitions
- Team management
- Leaderboards
- Arena fund system
- Gaming-specific monetization

### ⭐ Legend System
- Creator ranking and voting
- Legend badges and status
- Hall of fame
- Community-driven nominations

### 🛒 Marketplace
- Service listings and sales
- Order management
- Reviews and ratings
- Secure transactions

### 👥 Community System
- Community creation and management
- Posts and discussions
- Moderation tools
- Premium communities

### 💎 Premium Features
- Ad-free experience
- Exclusive content
- Advanced features
- Priority support

---

## Quick Start

### Installation

```bash
# Clone repository
git clone <repository-url>

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Run development server
npm run dev
```

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm run typecheck
npm run lint
```

---

## Language Support

### Changing Language

1. Click the **globe icon** in the header
2. Select your preferred language
3. UI updates instantly
4. Preference is saved automatically

### Supported Languages

| Language | Code | Status | RTL |
|----------|------|--------|-----|
| English | en | ✅ Complete | No |
| French | fr | ✅ Complete | No |
| Spanish | es | ✅ Complete | No |
| Portuguese | pt | ✅ Complete | No |
| Arabic | ar | ✅ Complete | Yes |

---

## Documentation

### User Guides
- [Quick Start](./I18N_QUICK_START.md) - Get started quickly
- [Help Center](https://goroti.com/help) - User support

### Developer Documentation
- [i18n Guide](./I18N_GUIDE.md) - Basic i18n usage
- [Complete i18n Documentation](./GOROTI_I18N_COMPLETE_DOCUMENTATION.md) - Comprehensive guide
- [Platform Update Summary](./GOROTI_PLATFORM_UPDATE_COMPLETE.md) - Latest changes

### Technical Documentation
- [Database Connection Guide](./DATABASE_CONNECTION_GUIDE.md)
- [Security Configuration](./SECURITY_CONFIGURATION_GUIDE.md)
- [Video Upload Guide](./VIDEO_UPLOAD_GUIDE.md)
- [Live Studio Guide](./GUIDE_COMPLET_STUDIO_LIVE_V7.3.md)

---

## Technology Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite
- react-i18next (internationalization)
- React Router
- Zustand (state management)

### Backend
- Supabase (Database, Auth, Storage)
- PostgreSQL
- Row Level Security (RLS)

### Media
- HLS.js (video streaming)
- Cloudflare Stream (video hosting)
- WebRTC (live streaming)

### i18n
- i18next
- react-i18next
- i18next-browser-languagedetector

---

## Project Structure

```
goroti-platform/
├── src/
│   ├── i18n/                  # i18n configuration
│   ├── locales/               # Translation files
│   │   ├── en/               # English
│   │   ├── fr/               # French
│   │   ├── es/               # Spanish
│   │   ├── pt/               # Portuguese
│   │   └── ar/               # Arabic
│   ├── components/           # React components
│   ├── pages/                # Page components
│   ├── services/             # Business logic
│   ├── contexts/             # React contexts
│   ├── lib/                  # Utilities
│   └── types/                # TypeScript types
├── supabase/
│   └── migrations/           # Database migrations
├── public/                   # Static assets
└── docs/                     # Documentation
```

---

## Environment Variables

Required environment variables:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## Database

### Setup

1. Create Supabase project
2. Copy environment variables
3. Apply migrations:

```bash
supabase db push
```

### Key Tables

- `user_profiles` - User information and preferences
- `channels` - Creator channels
- `videos` - Video content
- `live_streams` - Live streaming sessions
- `communities` - Community data
- `marketplace_services` - Marketplace listings

### Language Preference

User language preferences are stored in:
- **Table:** `user_profiles`
- **Column:** `language_preference`
- **Type:** text (ISO 639-1 code)

---

## Features by Universe

### Video Universe
- Video upload and management
- HD streaming
- Comments and engagement
- Recommendations
- Multi-language audio/subtitles

### Live Universe
- Live streaming studio
- Real-time chat
- Gifts and monetization
- Stream replay
- Multi-language dubbing

### Gaming Universe
- Tournaments
- Team management
- Leaderboards
- Arena fund
- Gaming analytics

### Legend Universe
- Creator rankings
- Voting system
- Legend badges
- Hall of fame

### Marketplace Universe
- Service listings
- Order management
- Reviews
- Secure payments

### Community Universe
- Community creation
- Posts and discussions
- Moderation
- Premium communities

---

## Contributing

### Adding Translations

1. Add keys to `src/locales/en/common.json`
2. Translate in other language files
3. Use in components: `t('category.key')`
4. Test in all languages

### Code Style

- Use TypeScript strict mode
- Follow existing patterns
- Add translations for all UI text
- Test across languages

---

## License

Proprietary - All rights reserved

---

## Support

- **Documentation:** See `/docs` folder
- **Issues:** Contact support team
- **Updates:** Check `GOROTI_PLATFORM_UPDATE_COMPLETE.md`

---

## Recent Updates

### Version 1.0.0 (2026-03-17)

✅ **Complete Internationalization System**
- Added 5 language support (en, fr, es, pt, ar)
- RTL support for Arabic
- Database integration for user preferences
- Automatic language detection
- Language switcher component

✅ **Production Ready**
- Build tested and verified
- Performance optimized
- Type-safe implementation
- Comprehensive documentation

For detailed information, see [GOROTI_PLATFORM_UPDATE_COMPLETE.md](./GOROTI_PLATFORM_UPDATE_COMPLETE.md)

---

**Made with ❤️ by the GOROTI Team**
