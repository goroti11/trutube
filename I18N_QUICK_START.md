# GOROTI i18n - Quick Start Guide

## For Users

### How to Change Language

1. **Click the Globe Icon** in the header (top right)
2. **Select your language** from the dropdown:
   - English
   - Français (French)
   - Español (Spanish)
   - Português (Portuguese)
   - العربية (Arabic)
3. **UI updates instantly**
4. **Your choice is saved** and persists across sessions

### Language Preference

Your language preference is:
- Saved to your account (if logged in)
- Saved to your browser (localStorage)
- Automatically restored on your next visit

### RTL Languages

If you select Arabic, the interface automatically switches to right-to-left layout.

---

## For Developers

### Using Translations in Components

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

### Available Translation Categories

- `navigation.*` - Navigation items
- `auth.*` - Authentication (login, signup)
- `video.*` - Video player and features
- `studio.*` - Creator studio
- `live.*` - Live streaming
- `gaming.*` - Gaming universe
- `legend.*` - Legend system
- `marketplace.*` - Marketplace
- `community.*` - Communities
- `settings.*` - Settings pages
- `common.*` - Common UI elements
- `notifications.*` - Notifications
- `premium.*` - Premium features
- `errors.*` - Error messages

### Quick Reference

```typescript
// Get translation function
const { t } = useTranslation();

// Get current language
const { i18n } = useTranslation();
console.log(i18n.language); // 'en', 'fr', etc.

// Change language
await i18n.changeLanguage('fr');

// Check if RTL
import { isRTL } from './i18n/i18n';
const isRightToLeft = isRTL('ar'); // true
```

### Adding a New Translation Key

1. **Add to English file** (`src/locales/en/common.json`):
```json
{
  "myFeature": {
    "newKey": "New Value"
  }
}
```

2. **Add to other language files** (fr, es, pt, ar)

3. **Use in component**:
```typescript
<span>{t('myFeature.newKey')}</span>
```

### Testing Language Switching

```bash
# Run dev server
npm run dev

# Open browser: http://localhost:5173
# Click globe icon → Select language → Verify UI changes
```

---

## File Structure

```
src/
├── i18n/
│   └── i18n.ts                 # i18n configuration
├── locales/
│   ├── en/common.json          # English
│   ├── fr/common.json          # French
│   ├── es/common.json          # Spanish
│   ├── pt/common.json          # Portuguese
│   └── ar/common.json          # Arabic
└── components/
    └── LanguageSwitcher.tsx    # Language switcher
```

---

## Common Tasks

### Add a New Language

1. Create folder: `src/locales/de/`
2. Copy `en/common.json` to `de/common.json`
3. Translate content
4. Register in `src/i18n/i18n.ts`:
```typescript
import deCommon from '../locales/de/common.json';

export const resources = {
  // ... existing
  de: { common: deCommon }
};
```

### Update Translation

1. Edit JSON file (e.g., `src/locales/fr/common.json`)
2. Save
3. Refresh browser

### Check Current Language

```typescript
import { useTranslation } from 'react-i18next';

const { i18n } = useTranslation();
console.log('Current language:', i18n.language);
```

---

## Database Integration

User language preference is stored in:
- **Table:** `user_profiles`
- **Column:** `language_preference`
- **Type:** text (ISO 639-1 code)
- **Default:** 'en'

When logged in, language preference automatically syncs to database.

---

## Support

For detailed documentation, see:
- **Complete Guide:** [GOROTI_I18N_COMPLETE_DOCUMENTATION.md](./GOROTI_I18N_COMPLETE_DOCUMENTATION.md)
- **Technical Guide:** [I18N_GUIDE.md](./I18N_GUIDE.md)

---

**Status:** ✅ Production Ready
**Languages:** 5 supported (en, fr, es, pt, ar)
**Last Updated:** 2026-03-17
