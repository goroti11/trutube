# Système de Navigation et Redirection des Univers

## Vue d'ensemble

Goroti utilise un système de navigation hiérarchique basé sur les univers et sous-univers. Ce document explique comment fonctionnent les redirections et la navigation entre les différents espaces de contenu.

---

## 1. Structure hiérarchique

### Niveaux de navigation

```
Goroti (Plateforme principale)
├── Univers Principaux (Domaines)
│   ├── Gaming
│   ├── Education
│   ├── Music
│   └── Tech
│
└── Sous-Univers (Catégories)
    ├── Gaming
    │   ├── FPS
    │   ├── RPG
    │   └── Streaming
    │
    ├── Education
    │   ├── Science
    │   ├── Mathematics
    │   └── Languages
    │
    └── ...
```

---

## 2. Système de routing actuel

### Routes de base

#### Page d'accueil
```
URL: /
Description: Page d'accueil avec feed personnalisé
Accessible à: Tous
```

#### Exploration des univers
```
URL: /universes
Description: Browse tous les univers disponibles
Accessible à: Tous
```

#### Vue d'un univers
```
URL: /universe/:universeId
Description: Page dédiée à un univers spécifique
Accessible à: Tous
Contient: Vidéos de l'univers, sous-univers, créateurs
```

#### Sous-univers
```
URL: /universe/:universeId/sub/:subUniverseId
Description: Page d'un sous-univers
Accessible à: Tous
Filtré par: Sous-catégorie spécifique
```

---

## 3. Système de sous-domaines (Future implémentation)

### Architecture proposée

#### Univers comme sous-domaines
```
gaming.goroti.com       → Univers Gaming
education.goroti.com    → Univers Education
music.goroti.com        → Univers Music
tech.goroti.com         → Univers Tech
```

#### Sous-univers comme chemins
```
gaming.goroti.com/fps       → Sous-univers FPS
gaming.goroti.com/rpg       → Sous-univers RPG
gaming.goroti.com/streaming → Sous-univers Streaming
```

#### Créateurs avec univers personnalisés
```
@username.goroti.com           → Univers d'un créateur
@username.goroti.com/series    → Série spécifique
@username.goroti.com/live      → Lives du créateur
```

---

## 4. Logique de redirection

### Redirection intelligente

#### Détection automatique
```javascript
// Exemple de logique de redirection
function handleUniverseRedirect(url: string) {
  const subdomain = url.split('.')[0];

  // Vérifier si c'est un sous-domaine d'univers
  if (isUniverseSubdomain(subdomain)) {
    return redirectToUniverse(subdomain);
  }

  // Vérifier si c'est un sous-domaine de créateur
  if (isCreatorSubdomain(subdomain)) {
    return redirectToCreatorUniverse(subdomain);
  }

  // Par défaut, rediriger vers la page d'accueil
  return redirectToHome();
}
```

#### Préservation du contexte
- L'historique de navigation est maintenu
- Les préférences utilisateur sont respectées
- Le fil d'Ariane est mis à jour automatiquement

---

## 5. Navigation au sein des univers

### Composant UniverseNavigation

#### Fonctionnalités
- Onglets pour naviguer entre sections
- Filtres de sous-univers
- Recherche contextuelle
- Fil d'Ariane dynamique

#### Sections d'un univers
```
/universe/:id
├── /feed          → Contenu récent
├── /trending      → Vidéos tendance
├── /top           → Meilleures vidéos
├── /creators      → Créateurs de l'univers
└── /about         → À propos de l'univers
```

---

## 6. Règles de redirection

### Redirections automatiques

#### Utilisateur non authentifié
```
/my-profile      → /auth
/settings        → /auth
/dashboard       → /auth
```

#### Utilisateur authentifié
```
/auth            → / (si déjà connecté)
```

#### Univers inexistant
```
/universe/invalid  → /universes (avec message d'erreur)
```

#### Contenu supprimé
```
/video/deleted     → /universes (avec notification)
```

---

## 7. Deep linking

### Support des liens profonds

#### Vidéo dans un univers
```
/universe/:universeId/video/:videoId
→ Ouvre la vidéo dans le contexte de l'univers
→ Bouton "retour" revient à l'univers
```

#### Partage de vidéo directe
```
/video/:videoId
→ Ouvre la vidéo avec contexte minimal
→ Suggestions basées sur l'univers de la vidéo
```

#### Profil créateur dans univers
```
/universe/:universeId/creator/:creatorId
→ Vue du profil filtré par l'univers
→ Seulement les vidéos de cet univers
```

---

## 8. Gestion du cache et préchargement

### Stratégie de cache

#### Univers récemment visités
```javascript
// Cache des 5 derniers univers visités
const recentUniverses = [
  { id: 'gaming', name: 'Gaming', lastVisit: Date },
  { id: 'tech', name: 'Tech', lastVisit: Date },
  // ...
];
```

#### Préchargement intelligent
```javascript
// Précharger les données d'un univers au survol
onUniverseHover(universeId) {
  prefetchUniverseData(universeId);
  prefetchTrendingVideos(universeId);
}
```

---

## 9. SEO et métadonnées

### Métadonnées dynamiques par univers

```html
<!-- Exemple pour l'univers Gaming -->
<head>
  <title>Gaming Universe - Goroti</title>
  <meta name="description" content="Découvrez les meilleures vidéos gaming sur Goroti" />
  <meta property="og:title" content="Gaming Universe - Goroti" />
  <meta property="og:url" content="https://goroti.com/universe/gaming" />
  <link rel="canonical" href="https://goroti.com/universe/gaming" />
</head>
```

### URLs friendly
```
✅ /universe/gaming-fps-competitive
❌ /universe/a1b2c3d4-e5f6-7890
```

---

## 10. Système de permissions

### Accès aux univers

#### Univers publics
- Accessibles à tous
- Indexés par les moteurs de recherche
- Partageables librement

#### Univers privés
```
Accès requis: Abonnement au créateur
Redirection: /subscribe/:creatorId si non abonné
```

#### Univers restreints par âge
```
Vérification: Confirmation de l'âge
Redirection: /age-verification si nécessaire
```

---

## 11. Analytics et tracking

### Métriques de navigation

```javascript
// Tracking de la navigation entre univers
trackUniverseNavigation({
  from: 'gaming',
  to: 'tech',
  method: 'direct_link', // ou 'search', 'recommendation'
  timestamp: Date.now()
});
```

### Patterns de navigation
- Univers les plus visités
- Chemins de navigation courants
- Taux de rebond par univers
- Durée moyenne dans un univers

---

## 12. Implémentation technique

### Router personnalisé

```typescript
interface UniverseRoute {
  path: string;
  universeId: string;
  subUniverseId?: string;
  component: React.ComponentType;
  requiresAuth?: boolean;
}

const universeRoutes: UniverseRoute[] = [
  {
    path: '/universe/:universeId',
    universeId: 'dynamic',
    component: UniverseViewPage,
    requiresAuth: false
  },
  {
    path: '/universe/:universeId/sub/:subUniverseId',
    universeId: 'dynamic',
    subUniverseId: 'dynamic',
    component: SubUniverseViewPage,
    requiresAuth: false
  }
];
```

### Gestion d'état

```typescript
interface NavigationState {
  currentUniverse: string | null;
  currentSubUniverse: string | null;
  navigationHistory: string[];
  lastVisitedUniverses: Universe[];
}
```

---

## 13. Fonctionnalités avancées futures

### Univers personnalisés
- URL personnalisée pour chaque créateur
- Branding customisé
- Règles de modération spécifiques

### Cross-universe navigation
- Suggestions inter-univers
- Playlists multi-univers
- Découverte intelligente

### Univers temporaires
- Événements spéciaux
- Challenges
- Collaborations

---

## 14. Best practices

### Pour les créateurs
1. Choisir un nom d'univers descriptif et unique
2. Organiser le contenu en sous-univers clairs
3. Utiliser des redirections pour l'ancien contenu
4. Maintenir une structure cohérente

### Pour les développeurs
1. Toujours valider l'existence d'un univers
2. Gérer les erreurs de redirection gracieusement
3. Implémenter le lazy loading des données
4. Optimiser les requêtes de navigation

---

## 15. Documentation API

### Endpoints de navigation

#### Obtenir les détails d'un univers
```
GET /api/universes/:universeId
Response: { id, name, description, subUniverses[], stats }
```

#### Naviguer vers un univers
```
POST /api/navigation/universe
Body: { universeId, fromPage, timestamp }
Response: { success, redirectUrl }
```

#### Historique de navigation
```
GET /api/user/navigation-history
Response: { history: [{ universe, timestamp, duration }] }
```

---

## Conclusion

Le système de navigation et redirection de Goroti est conçu pour offrir une expérience fluide et intuitive tout en maintenant une structure organisée et évolutive. L'implémentation future des sous-domaines permettra une séparation encore plus claire entre les différents univers de contenu.

Pour toute question ou suggestion sur ce système, contactez l'équipe technique via support@goroti.com.
