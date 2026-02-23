# 🚀 GOROTI Platform

Plateforme nouvelle génération pour le streaming, le gaming et la musique.

## ✨ Fonctionnalités

### Design System
- **Palette de couleurs moderne** : Cyan/Blue (primaire), Orange/Red (accent), Emerald/Teal (succès)
- **Pas de violet/indigo** : Design épuré et professionnel
- **Animations fluides** : Fade-in, slide-up, scale-in, shimmer
- **Responsive** : Optimisé mobile-first

### Pages Principales

#### 🏠 Homepage
- Hero section avec gradient animé
- Statistiques en temps réel
- 4 sections principales (LÉGENDE, Gaming, Live, Music)
- Section TruCoins avec métriques
- Call-to-action

#### 🔐 Authentification
- Page login moderne avec gradients
- Protection des routes
- Gestion session Supabase
- Design accessible et UX soignée

#### 📱 Layout
- Header sticky avec navigation
- Footer complet avec liens
- Routes protégées et publiques
- Loading states

### Modules Intégrés

1. **LÉGENDE** (`/legende`)
   - Système de prestige à 4 niveaux
   - Badge visuel doré/orange

2. **Gaming** (`/gaming`)
   - Tournois et classements
   - Icône trophée cyan

3. **Live Streaming** (`/live`)
   - Indicateur live rouge pulsant
   - Section dédiée

4. **Music** (`/music`)
   - Plateforme musicale
   - Thème vert émeraude

## 🎨 Design Tokens

### Couleurs
```css
Primary (Cyan-Blue): from-cyan-500 to-blue-600
Accent (Orange-Red): from-orange-500 to-red-600
Success (Emerald): from-emerald-400 to-teal-500
Legend Gold: from-amber-500 to-orange-600
```

### Composants Tailwind
Tous les composants utilisent les utilitaires Tailwind v4 :
- Buttons avec variantes (primary, secondary, accent, outline)
- Cards avec hover effects
- Inputs stylisés avec focus states
- Badges de statut
- Layout responsive avec container

## 🛠️ Stack Technique

- **Framework** : React 18 + TypeScript
- **Build** : Vite
- **Styling** : Tailwind CSS v4
- **Routing** : React Router v6
- **Backend** : Supabase
- **Icons** : Lucide React
- **Auth** : Supabase Auth

## 📦 Installation

```bash
npm install
```

## ⚙️ Configuration

Créer un fichier `.env` :

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚀 Développement

```bash
npm run dev
```

## 🏗️ Build

```bash
npm run build
```

Build réussi ✅ :
- TypeScript compilation OK
- Vite build OK
- Bundle size optimisé (426KB JS, 35KB CSS)

## 📁 Structure

```
src/
├── components/       # Composants réutilisables
│   ├── Header.tsx   # Navigation principale
│   └── Footer.tsx   # Footer avec liens
├── contexts/         # Contexts React
│   └── AuthContext.tsx  # Gestion auth
├── pages/           # Pages de l'application
│   ├── HomePage.tsx     # Landing page
│   └── LoginPage.tsx    # Authentification
├── lib/             # Utilitaires
│   └── supabase.ts      # Client Supabase
├── styles/          # Design system
│   └── design-system.ts # Tokens de design
├── App.tsx          # App principale avec routes
├── main.tsx         # Entry point
└── index.css        # Styles globaux + animations
```

## 🎯 Routes

- `/` - Homepage (publique)
- `/login` - Authentification (publique)
- `/legende` - LÉGENDE system (protégée)
- `/gaming` - Gaming division (protégée)
- `/live` - Live streaming (protégée)
- `/music` - Music platform (protégée)

## 🔐 Authentification

Utilise Supabase Auth avec :
- Email/Password
- Session management automatique
- Protected routes avec redirect
- Public routes (login accessible si non connecté)
- Loading states pendant vérification session

## 🎨 Thème & Design

### Principes de design
1. **Contraste élevé** : Texte blanc (#fafafa) sur fond noir (#0a0a0a)
2. **Gradients stratégiques** : CTA et éléments importants
3. **Glassmorphism léger** : Cards avec subtle borders
4. **Animations subtiles** : Transitions douces, pas excessif
5. **Espacement généreux** : Breathing room

### Hiérarchie visuelle
1. **Primary** : Gradients cyan-blue (from-cyan-500 to-blue-600)
2. **Secondary** : Neutral gray (bg-neutral-800)
3. **Accent** : Gradients orange-red (from-orange-500 to-red-600)
4. **Success** : Emerald tones
5. **LÉGENDE** : Gold/amber gradients

### Animations disponibles
- `animate-fade-in` : Apparition en douceur
- `animate-slide-up` : Montée depuis le bas
- `animate-scale-in` : Zoom subtil
- `.shimmer` : Effet de brillance

## 🎯 Caractéristiques Homepage

### Hero Section
- Gradient background avec orbes animées
- Badge "Nouvelle ère du streaming"
- Titre avec text-gradient cyan-blue
- CTA double (Commencer + Explorer)
- Stats en temps réel

### Features Grid
4 cards cliquables :
- LÉGENDE (gold gradient)
- Gaming (cyan gradient)
- Live (red gradient avec pulse)
- Music (emerald gradient)

### TruCoins Section
- Explication économie virtuelle
- 4 métriques avec icons
- Design avec glassmorphism

### CTA Final
- Gradient background subtil
- Double CTA (Register + Learn more)

## 🚦 Next Steps

Extensions possibles :
- [ ] Développer pages LÉGENDE complètes
- [ ] Ajouter Gaming Hub détaillé
- [ ] Créer Live Streaming interface
- [ ] Développer Music Player
- [ ] TruCoins wallet complet
- [ ] User profiles avancés
- [ ] Système de notifications
- [ ] Search & discover

## 📝 Notes Techniques

- **Tailwind v4** : Utilise @import "tailwindcss" (pas de @tailwind directives)
- **Type imports** : Utilise `type` pour imports TypeScript (verbatimModuleSyntax)
- **Responsive** : Mobile-first avec breakpoints md: lg:
- **Performance** : Code-splitting automatique via Vite
- **SEO ready** : Structure semantic HTML
- **Accessibilité** : Focus states, ARIA labels préparés

## 🎨 Palette Complète

```
Neutral: 50-950 (gray scale)
Cyan: 400-600 (primary blues)
Orange: 400-600 (accents warm)
Red: 500-600 (live, alerts)
Emerald: 400-600 (success)
Amber: 400-600 (legend gold)
```

---

**Status** : ✅ Build réussi, plateforme fonctionnelle
**Version** : 1.0.0
**Built with** : React + TypeScript + Vite + Tailwind CSS v4
