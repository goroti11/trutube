# GOROTI i18n Configuration

This folder contains the internationalization (i18n) configuration for the GOROTI platform.

## Files

- **i18n.ts** - Main i18n configuration and initialization

## What This Does

1. **Initializes i18next** with React integration
2. **Configures language detection** from user preferences, localStorage, and browser
3. **Sets up RTL support** for Arabic and other right-to-left languages
4. **Manages document direction** automatically when language changes
5. **Exports utilities** for language checking and management

## How It Works

### Language Detection Order

1. User account preference (from database)
2. Browser localStorage (`i18nextLng`)
3. Browser language setting
4. Default to English

### Supported Languages

- **en** - English (default)
- **fr** - French (Français)
- **es** - Spanish (Español)
- **pt** - Portuguese (Português)
- **ar** - Arabic (العربية) with RTL support

### RTL Support

Languages in the `RTL_LANGUAGES` array automatically trigger:
- `document.dir = 'rtl'`
- Right-to-left layout
- Proper text alignment

## Usage

### In Components

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1>{t('navigation.home')}</h1>
      <button onClick={() => i18n.changeLanguage('fr')}>
        Français
      </button>
    </div>
  );
}
```

### Utility Functions

```typescript
import { isRTL, updateDocumentDirection } from './i18n/i18n';

// Check if language is RTL
const isArabic = isRTL('ar'); // true

// Update document direction (done automatically)
updateDocumentDirection('ar');
```

## Translation Files

Translation files are located in `src/locales/`:

```
src/locales/
├── en/common.json    # English
├── fr/common.json    # French
├── es/common.json    # Spanish
├── pt/common.json    # Portuguese
└── ar/common.json    # Arabic
```

## Adding a New Language

1. Create folder: `src/locales/xx/`
2. Create `common.json` with translations
3. Import in `i18n.ts`:
   ```typescript
   import xxCommon from '../locales/xx/common.json';
   ```
4. Add to resources:
   ```typescript
   export const resources = {
     // ... existing
     xx: { common: xxCommon }
   };
   ```
5. Add to SUPPORTED_LANGUAGES:
   ```typescript
   { code: 'xx', name: 'Language', nativeName: 'Native Name' }
   ```
6. If RTL, add to RTL_LANGUAGES array

## Configuration

### Detection Options

```typescript
detection: {
  order: ['localStorage', 'navigator', 'htmlTag'],
  caches: ['localStorage'],
  lookupLocalStorage: 'i18nextLng'
}
```

### Namespaces

- **Default namespace:** 'common'
- All translations use the common namespace

### Interpolation

- **escapeValue:** false (React handles XSS)

## Events

### languageChanged Event

Triggered when language changes:

```typescript
i18n.on('languageChanged', (lng) => {
  updateDocumentDirection(lng);
  // Your custom logic here
});
```

## Performance

- **Lazy loading:** Translations loaded on-demand per language
- **Caching:** Translations cached in memory after first load
- **Bundle size:** ~2 KB per language (gzipped)

## Documentation

For more information, see:
- [I18N_GUIDE.md](../../I18N_GUIDE.md)
- [GOROTI_I18N_COMPLETE_DOCUMENTATION.md](../../GOROTI_I18N_COMPLETE_DOCUMENTATION.md)
- [I18N_QUICK_START.md](../../I18N_QUICK_START.md)

## Status

✅ Production Ready
