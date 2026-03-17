# Goroti i18n (Internationalization) Guide

## Overview

Goroti now supports full UI internationalization using `react-i18next`. This allows the user interface to be displayed in multiple languages while keeping video content independent.

## Architecture

### Core Components

1. **i18n Configuration** (`src/i18n/i18n.ts`)
   - Initializes i18next with language detection
   - Configures fallback language (English)
   - Handles RTL language support
   - Updates document direction automatically

2. **Translation Files** (`src/locales/`)
   - Structured by language code: `en/`, `fr/`, `es/`, `pt/`, `ar/`
   - Each language has a `common.json` file
   - Easy to add new languages by creating new folders

3. **Language Switcher** (`src/components/LanguageSwitcher.tsx`)
   - Dropdown component for language selection
   - Persists language preference to localStorage
   - Updates user profile in database if logged in
   - Accessible from header

## Supported Languages

Currently supported languages:

- **English (en)** - Default
- **French (fr)** - Français
- **Spanish (es)** - Español
- **Portuguese (pt)** - Português
- **Arabic (ar)** - العربية (RTL)

## Usage in Components

### Basic Usage

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('navigation.home')}</h1>
      <button>{t('common.save')}</button>
    </div>
  );
}
```

### With Interpolation

```typescript
// In translation file:
// "welcome_message": "Welcome, {{name}}!"

const { t } = useTranslation();
<p>{t('welcome_message', { name: userName })}</p>
```

### Pluralization

```typescript
// In translation file:
// "video_count": "{{count}} video",
// "video_count_plural": "{{count}} videos"

const { t } = useTranslation();
<span>{t('video_count', { count: videoCount })}</span>
```

## Translation Keys Structure

Translations are organized by feature:

```json
{
  "navigation": { ... },
  "auth": { ... },
  "video": { ... },
  "studio": { ... },
  "live": { ... },
  "gaming": { ... },
  "legend": { ... },
  "marketplace": { ... },
  "community": { ... },
  "settings": { ... },
  "common": { ... },
  "notifications": { ... },
  "premium": { ... }
}
```

## Language Detection Order

1. User account preference (database: `user_profiles.language_preference`)
2. Browser localStorage (`i18nextLng`)
3. Browser language
4. Fallback to English

## RTL Support

Right-to-left languages (Arabic, Hebrew, etc.) are automatically detected and supported:

- Document direction is set to `rtl`
- CSS automatically adjusts layout
- No manual intervention needed

## Adding a New Language

### Step 1: Create Translation File

```bash
mkdir -p src/locales/de
cp src/locales/en/common.json src/locales/de/common.json
```

### Step 2: Translate Content

Edit `src/locales/de/common.json` with German translations.

### Step 3: Register Language

In `src/i18n/i18n.ts`:

```typescript
import deCommon from '../locales/de/common.json';

export const resources = {
  en: { common: enCommon },
  fr: { common: frCommon },
  es: { common: esCommon },
  pt: { common: ptCommon },
  ar: { common: arCommon },
  de: { common: deCommon } // Add new language
} as const;

export const SUPPORTED_LANGUAGES = [
  // ... existing languages
  { code: 'de', name: 'German', nativeName: 'Deutsch' }
];
```

### Step 4: If RTL Language

Add to RTL_LANGUAGES array:

```typescript
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur', 'yi'];
```

## Best Practices

### DO

- Use translation keys for all UI text
- Keep keys organized by feature
- Use descriptive key names
- Test with RTL languages
- Keep translations concise
- Use common keys for repeated text

### DON'T

- Translate dynamic user content (video titles, comments, usernames)
- Hardcode text in components
- Use translation keys for API responses
- Mix video dubbing with UI translation
- Translate brand names (Goroti, TruCoin, etc.)

## Performance

- Translations are loaded per language (not all at once)
- Language detection runs once at initialization
- Language changes are instant (no page reload)
- Translations are cached in memory

## Database Integration

When a user changes language:

1. UI updates immediately
2. Preference is saved to `localStorage`
3. If logged in, saved to `user_profiles.language_preference`

On next visit:
1. System checks user account preference first
2. Falls back to localStorage
3. Falls back to browser language
4. Falls back to English

## Testing

### Test Language Switching

```typescript
import { useTranslation } from 'react-i18next';

const { i18n } = useTranslation();
await i18n.changeLanguage('fr'); // Change to French
```

### Test RTL

```typescript
import { isRTL } from './i18n/i18n';

console.log(isRTL('ar')); // true
console.log(isRTL('en')); // false
```

## Separation from Video Multi-Language

**Important**: UI i18n is completely separate from video dubbing:

- **UI i18n**: Interface language (buttons, menus, labels)
- **Video dubbing**: Video audio tracks and subtitles
- **Independent**: User can have English UI with French video audio

## Future Enhancements

- Add more languages (German, Japanese, Chinese, etc.)
- Date/time localization
- Number formatting per locale
- Currency formatting
- Keyboard shortcuts per language
- Language-specific content filtering

## Troubleshooting

### Language not changing

1. Check browser console for errors
2. Verify translation file exists
3. Clear localStorage: `localStorage.removeItem('i18nextLng')`
4. Hard refresh: Ctrl+Shift+R

### Missing translation

Falls back to English key. Check:
1. Key exists in English file
2. Key exists in target language file
3. Correct namespace (default: 'common')

### RTL not working

1. Verify language is in RTL_LANGUAGES array
2. Check document.dir in DevTools
3. Test with Arabic (`ar`) language

## Support

For questions or issues with i18n:
- Check this guide first
- Review `src/i18n/i18n.ts` configuration
- Test with English (known working baseline)
- Check browser console for i18next errors
