# Guide de Démarrage Rapide - Goroti

## Bienvenue sur Goroti!

Ce guide vous aidera à démarrer rapidement avec toutes les fonctionnalités de Goroti.

---

## Table des Matières

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Base de Données](#base-de-données)
4. [Services Disponibles](#services-disponibles)
5. [Exemples de Code](#exemples-de-code)
6. [Fonctionnalités Principales](#fonctionnalités-principales)
7. [Documentation Complète](#documentation-complète)

---

## Installation

### Prérequis
- Node.js 18+
- npm ou yarn
- Compte Supabase

### Étapes

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Build pour production
npm run build
```

---

## Configuration

### 1. Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon
```

### 2. Récupérer les credentials Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet (ou utilisez un existant)
3. Dans Settings > API, copiez :
   - Project URL → `VITE_SUPABASE_URL`
   - anon/public key → `VITE_SUPABASE_ANON_KEY`

---

## Base de Données

### Statut : ✅ Tout est prêt!

**18 tables créées** avec Row Level Security activé :
- profiles, videos, comments, tips
- universes, sub_universes, creator_universes
- watch_sessions, video_scores, user_trust_scores
- content_reports, moderation_votes, content_status
- subscriptions, messages, creator_revenue
- user_preferences, user_settings, support_tickets

### Migrations Appliquées

Toutes les migrations sont déjà appliquées dans Supabase :
- ✅ Schéma principal
- ✅ Système d'univers
- ✅ Anti-fausses vues
- ✅ Profils utilisateurs
- ✅ Paramètres et support
- ✅ Fonctions helpers

---

## Services Disponibles

### 7 Services TypeScript Complets

Tous les services sont dans `src/services/` :

```typescript
// Profils
import { profileService } from './services/profileService';

// Vidéos
import { videoService } from './services/videoService';

// Sessions de visionnage
import { watchSessionService } from './services/watchSessionService';

// Commentaires
import { commentService } from './services/commentService';

// Univers
import { universeService } from './services/universeService';

// Revenus et tips
import { revenueService } from './services/revenueService';

// Modération
import { moderationService } from './services/moderationService';
```

---

## Exemples de Code

### Authentification et Profil Auto-créé

```typescript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // Le profil est créé automatiquement à la connexion!
  if (user) {
    console.log('User ID:', user.id);
    // Le profil existe déjà dans la table profiles
  }

  return <div>Welcome {user?.email}</div>;
}
```

### Charger et Afficher des Vidéos

```typescript
import { useState, useEffect } from 'react';
import { videoService } from './services/videoService';

function VideoList() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const loadVideos = async () => {
      const data = await videoService.getVideos(20);
      setVideos(data);
    };
    loadVideos();
  }, []);

  return (
    <div>
      {videos.map(video => (
        <div key={video.id}>
          <h3>{video.title}</h3>
          <p>Par {video.creator.display_name}</p>
          <p>{video.view_count} vues</p>
        </div>
      ))}
    </div>
  );
}
```

### Ajouter un Commentaire

```typescript
import { commentService } from './services/commentService';
import { useAuth } from './contexts/AuthContext';

function AddComment({ videoId }) {
  const { user } = useAuth();
  const [text, setText] = useState('');

  const handleSubmit = async () => {
    if (!user || !text) return;

    const comment = await commentService.addComment(
      videoId,
      user.id,
      text
    );

    if (comment) {
      alert('Commentaire ajouté!');
      setText('');
    }
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Votre commentaire..."
      />
      <button onClick={handleSubmit}>Publier</button>
    </div>
  );
}
```

### Envoyer un Tip

```typescript
import { revenueService } from './services/revenueService';
import { useAuth } from './contexts/AuthContext';

function TipButton({ creatorId }) {
  const { user } = useAuth();

  const sendTip = async (amount) => {
    if (!user) {
      alert('Connectez-vous pour envoyer un tip');
      return;
    }

    const tip = await revenueService.sendTip(
      user.id,
      creatorId,
      amount,
      'Continue comme ça!'
    );

    if (tip) {
      alert('Tip envoyé avec succès!');
    }
  };

  return (
    <div>
      <button onClick={() => sendTip(1)}>Tip 1€</button>
      <button onClick={() => sendTip(5)}>Tip 5€</button>
      <button onClick={() => sendTip(10)}>Tip 10€</button>
    </div>
  );
}
```

### Tracker une Session de Visionnage

```typescript
import { useEffect, useRef } from 'react';
import { watchSessionService } from './services/watchSessionService';
import { useAuth } from './contexts/AuthContext';

function VideoPlayer({ videoId }) {
  const { user } = useAuth();
  const sessionId = useRef(null);
  const watchTime = useRef(0);

  useEffect(() => {
    // Démarrer la session
    const startSession = async () => {
      const id = await watchSessionService.startSession(
        videoId,
        user?.id || null
      );
      sessionId.current = id;
    };

    startSession();

    // Tracker le temps
    const interval = setInterval(() => {
      watchTime.current += 1;
    }, 1000);

    // Nettoyer à la fin
    return () => {
      clearInterval(interval);
      if (sessionId.current) {
        watchSessionService.updateSession(
          sessionId.current,
          watchTime.current,
          0
        );
        watchSessionService.validateSession(sessionId.current);
      }
    };
  }, [videoId]);

  return <video src="..." controls />;
}
```

---

## Fonctionnalités Principales

### 1. Système Anti-Fausses Vues

**Automatique et transparent!**

- Device fingerprinting
- Trust score en temps réel
- Validation des sessions
- Détection de comportements suspects

**Aucune action requise** - Tout est géré automatiquement par `watchSessionService`.

### 2. Modération Communautaire

**Signaler du contenu :**

```typescript
import { moderationService } from './services/moderationService';

const report = await moderationService.reportContent(
  'video',      // Type: video, comment, profile
  videoId,      // ID du contenu
  userId,       // ID du signaleur
  'spam',       // Raison
  'Description détaillée'
);
```

**Voter sur un signalement :**

```typescript
const vote = await moderationService.voteOnReport(
  reportId,
  voterId,
  'remove',  // ou 'keep', 'warn'
  'Commentaire du vote'
);
```

### 3. Monétisation

**Tips directs :**
```typescript
await revenueService.sendTip(fromUserId, toCreatorId, 5.00, 'Super vidéo!');
```

**Voir les revenus :**
```typescript
const revenue = await revenueService.getCreatorRevenue(creatorId);
console.log('Total:', revenue.total_revenue);
console.log('Tips:', revenue.tips_revenue);
```

### 4. Univers et Sous-Univers

**Charger tous les univers :**
```typescript
const universes = await universeService.getAllUniverses();
```

**Charger les sous-univers :**
```typescript
const subs = await universeService.getSubUniverses(universeId);
```

**Filtrer les vidéos par univers :**
```typescript
const videos = await videoService.getVideos(20, universeId);
```

### 5. Paramètres Utilisateur

**Page déjà créée : `/settings`**

Gestion complète de :
- Notifications (email, push, marketing)
- Confidentialité (profil public, activité)
- Apparence (thème clair/sombre/auto)
- Mot de passe
- Suppression de compte

### 6. Support

**Page déjà créée : `/support`**

- FAQ interactive
- Formulaire de contact
- Système de tickets dans la base

**Créer un ticket :**
```typescript
await supabase.from('support_tickets').insert({
  user_id: userId,
  email: email,
  category: 'technical',
  subject: 'Problème de lecture',
  message: 'Description...',
  status: 'open'
});
```

---

## Pages Disponibles

### Pages Publiques
- `/` - Accueil
- `/auth` - Connexion/Inscription
- `/about` - À propos de Goroti
- `/terms` - CGU
- `/privacy` - Confidentialité
- `/support` - Support
- `/universes` - Explorer les univers

### Pages Authentifiées
- `/my-profile` - Mon profil
- `/settings` - Paramètres
- `/preferences` - Préférences de feed
- `/dashboard` - Dashboard créateur
- `/messages` - Messages

### Pages de Contenu
- `/universe/:id` - Vue d'un univers
- `/video/:id` - Lecteur vidéo
- `/profile/:id` - Profil public

---

## Documentation Complète

### Fichiers de Documentation

| Fichier | Description |
|---------|-------------|
| `DATABASE_INTEGRATION.md` | Vue d'ensemble complète de l'intégration |
| `DATABASE_SERVICES.md` | Guide détaillé des services |
| `NEW_FEATURES.md` | Liste des nouvelles fonctionnalités |
| `UNIVERSE_ROUTING.md` | Système de navigation |
| `ANTI_FAKE_VIEWS.md` | Détection de fraude |
| `QUICK_START.md` | Ce guide (démarrage rapide) |

### Commandes Utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Prévisualiser le build
npm run preview

# Linter
npm run lint

# Type checking
npm run typecheck
```

---

## Architecture du Projet

```
goroti/
├── src/
│   ├── components/         # Composants React
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   │
│   ├── pages/             # Pages de l'application
│   │   ├── HomePage.tsx
│   │   ├── AuthPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── ...
│   │
│   ├── services/          # Services de base de données
│   │   ├── profileService.ts     ⭐
│   │   ├── videoService.ts       ⭐
│   │   ├── commentService.ts     ⭐
│   │   ├── universeService.ts    ⭐
│   │   ├── revenueService.ts     ⭐
│   │   ├── moderationService.ts  ⭐
│   │   └── watchSessionService.ts ⭐
│   │
│   ├── contexts/          # Contexts React
│   │   └── AuthContext.tsx
│   │
│   ├── lib/              # Configuration
│   │   └── supabase.ts
│   │
│   └── types/            # Types TypeScript
│       └── index.ts
│
├── supabase/
│   └── migrations/       # Migrations de BDD (déjà appliquées)
│
└── docs/                 # Documentation
    ├── DATABASE_INTEGRATION.md
    ├── DATABASE_SERVICES.md
    └── ...
```

---

## Checklist de Démarrage

- [ ] Variables d'environnement configurées (`.env`)
- [ ] Dépendances installées (`npm install`)
- [ ] Serveur de dev lancé (`npm run dev`)
- [ ] Connexion à Supabase vérifiée
- [ ] Test d'authentification
- [ ] Test de chargement de vidéos
- [ ] Exploration des pages (settings, support, about)

---

## Support et Aide

### En cas de problème

1. **Vérifier la console du navigateur**
   - Erreurs JavaScript
   - Erreurs réseau
   - Logs des services

2. **Vérifier Supabase**
   - Connexion active
   - Politiques RLS correctes
   - Tables existantes

3. **Consulter la documentation**
   - `DATABASE_SERVICES.md` pour les services
   - `DATABASE_INTEGRATION.md` pour l'architecture

4. **Contacter le support**
   - Page interne : `/support`
   - Email : support@goroti.com

---

## Exemples de Workflows Complets

### Workflow 1 : Publier une Vidéo (à implémenter)

```typescript
// 1. Upload de la vidéo
const videoUrl = await uploadVideo(file);

// 2. Créer l'entrée dans la base
const video = await supabase
  .from('videos')
  .insert({
    creator_id: user.id,
    universe_id: selectedUniverseId,
    title: title,
    description: description,
    video_url: videoUrl,
    duration: duration,
  })
  .select()
  .single();

// 3. Initialiser le score
await supabase.rpc('calculate_video_score', { video_id: video.id });
```

### Workflow 2 : Regarder une Vidéo

```typescript
// 1. Démarrer la session
const sessionId = await watchSessionService.startSession(videoId, userId);

// 2. Jouer la vidéo et tracker le temps
// ... code du lecteur vidéo ...

// 3. Mettre à jour régulièrement
setInterval(() => {
  watchSessionService.updateSession(sessionId, currentTime, interactions);
}, 10000);

// 4. Valider à la fin
await watchSessionService.validateSession(sessionId);

// 5. Incrémenter les vues si validé
await videoService.incrementViewCount(videoId);
```

### Workflow 3 : Système de Modération

```typescript
// 1. Utilisateur signale un contenu
const report = await moderationService.reportContent(
  'video', videoId, userId, 'spam', 'Description'
);

// 2. Autres utilisateurs votent
const vote1 = await moderationService.voteOnReport(
  report.id, voter1Id, 'remove', 'Spam confirmé'
);
const vote2 = await moderationService.voteOnReport(
  report.id, voter2Id, 'remove', 'Violates rules'
);

// 3. Récupérer les votes et calculer le consensus
const votes = await moderationService.getReportVotes(report.id);

// 4. Si consensus → action automatique
if (consensusScore > 0.7) {
  await moderationService.updateContentStatus(
    'video', videoId, 'masked', 'Community decision'
  );
}
```

---

## Prochaines Étapes Recommandées

### Immédiat (Prêt à l'emploi)
1. ✅ Utiliser les services existants dans les composants
2. ✅ Tester l'authentification et la création de profil
3. ✅ Explorer les pages de paramètres et support

### Court terme
1. Implémenter l'upload de vidéos
2. Créer le dashboard créateur fonctionnel
3. Ajouter la messagerie temps réel

### Moyen terme
1. Implémenter les abonnements payants
2. Système de notifications
3. Analytics pour les créateurs

### Long terme
1. API publique
2. Application mobile
3. Système de livestreaming

---

## Félicitations!

Vous avez maintenant accès à une plateforme complète avec :

✅ 18 tables de base de données
✅ 7 services TypeScript
✅ Authentification automatique
✅ Système anti-fausses vues
✅ Modération communautaire
✅ Monétisation intégrée
✅ Documentation exhaustive

**Commencez à coder et créez du contenu authentique!** 🚀

---

Pour toute question : support@goroti.com
