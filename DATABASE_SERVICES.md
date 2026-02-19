# Services de Base de Données Goroti

## Vue d'ensemble

Ce document décrit tous les services disponibles pour interagir avec la base de données Supabase de Goroti.

---

## Architecture des Services

```
src/services/
├── profileService.ts       # Gestion des profils utilisateurs
├── videoService.ts         # Opérations sur les vidéos
├── watchSessionService.ts  # Tracking des sessions de visionnage
├── commentService.ts       # Système de commentaires
├── universeService.ts      # Gestion des univers et sous-univers
├── revenueService.ts       # Tips et revenus créateurs
└── moderationService.ts    # Système de modération
```

---

## 1. Profile Service (`profileService.ts`)

### Fonctions disponibles

#### `getProfile(userId: string)`
Récupère le profil d'un utilisateur.

```typescript
const profile = await profileService.getProfile(userId);
// Returns: Profile | null
```

#### `createProfile(userId: string, displayName: string)`
Crée un nouveau profil utilisateur.

```typescript
const profile = await profileService.createProfile(userId, 'JohnDoe');
// Returns: Profile | null
```

#### `updateProfile(userId: string, updates: Partial<Profile>)`
Met à jour les informations du profil.

```typescript
const updated = await profileService.updateProfile(userId, {
  bio: 'New bio',
  avatar_url: 'https://...'
});
// Returns: Profile | null
```

#### `getTrustScore(userId: string)`
Récupère le score de confiance d'un utilisateur.

```typescript
const score = await profileService.getTrustScore(userId);
// Returns: number (0-1)
```

### Interface Profile

```typescript
interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string;
  user_status: 'viewer' | 'supporter' | 'creator' | 'pro' | 'elite';
  subscriber_count: number;
  upload_frequency: number;
  trust_score: number;
  created_at: string;
  updated_at: string;
}
```

---

## 2. Video Service (`videoService.ts`)

### Fonctions disponibles

#### `getVideos(limit: number, universeId?: string)`
Récupère une liste de vidéos, optionnellement filtrée par univers.

```typescript
const videos = await videoService.getVideos(20, universeId);
// Returns: VideoWithCreator[]
```

#### `getVideoById(videoId: string)`
Récupère une vidéo spécifique avec les infos du créateur.

```typescript
const video = await videoService.getVideoById(videoId);
// Returns: VideoWithCreator | null
```

#### `getTrendingVideos(limit: number)`
Récupère les vidéos tendances.

```typescript
const trending = await videoService.getTrendingVideos(20);
// Returns: VideoWithCreator[]
```

#### `incrementViewCount(videoId: string)`
Incrémente le compteur de vues d'une vidéo.

```typescript
await videoService.incrementViewCount(videoId);
// Returns: void
```

### Interfaces

```typescript
interface Video {
  id: string;
  creator_id: string;
  universe_id: string | null;
  sub_universe_id: string | null;
  title: string;
  description: string;
  thumbnail_url: string | null;
  video_url: string | null;
  duration: number;
  is_short: boolean;
  is_premium: boolean;
  view_count: number;
  like_count: number;
  comment_count: number;
  avg_watch_time: number;
  quality_score: number;
  authenticity_score: number;
  is_masked: boolean;
  created_at: string;
}

interface VideoWithCreator extends Video {
  creator: {
    display_name: string;
    avatar_url: string | null;
    user_status: string;
  };
}
```

---

## 3. Watch Session Service (`watchSessionService.ts`)

### Fonctions disponibles

#### `startSession(videoId: string, userId: string | null)`
Démarre une nouvelle session de visionnage.

```typescript
const sessionId = await watchSessionService.startSession(videoId, userId);
// Returns: string | null
```

#### `updateSession(sessionId: string, watchTimeSeconds: number, interactionsCount: number)`
Met à jour une session avec le temps de visionnage et les interactions.

```typescript
await watchSessionService.updateSession(sessionId, 120, 3);
// Returns: void
```

#### `validateSession(sessionId: string)`
Valide une session et calcule son score de confiance.

```typescript
await watchSessionService.validateSession(sessionId);
// Returns: void
```

### Système anti-fausses vues

Le service génère automatiquement :
- **Device Fingerprint** : Identifiant unique de l'appareil
- **Trust Score** : Score basé sur le comportement de l'utilisateur
  - Mouvement de souris
  - Focus de la fenêtre
  - Visibilité de l'onglet
  - Interactions clavier

---

## 4. Comment Service (`commentService.ts`)

### Fonctions disponibles

#### `getComments(videoId: string)`
Récupère tous les commentaires d'une vidéo.

```typescript
const comments = await commentService.getComments(videoId);
// Returns: Comment[]
```

#### `addComment(videoId: string, userId: string, content: string)`
Ajoute un nouveau commentaire.

```typescript
const comment = await commentService.addComment(videoId, userId, 'Great video!');
// Returns: Comment | null
```

#### `deleteComment(commentId: string)`
Supprime un commentaire.

```typescript
const success = await commentService.deleteComment(commentId);
// Returns: boolean
```

### Interface Comment

```typescript
interface Comment {
  id: string;
  video_id: string;
  user_id: string;
  content: string;
  like_count: number;
  created_at: string;
  user?: {
    display_name: string;
    avatar_url: string | null;
    user_status: string;
  };
}
```

---

## 5. Universe Service (`universeService.ts`)

### Fonctions disponibles

#### `getAllUniverses()`
Récupère tous les univers disponibles.

```typescript
const universes = await universeService.getAllUniverses();
// Returns: Universe[]
```

#### `getUniverseById(universeId: string)`
Récupère un univers spécifique.

```typescript
const universe = await universeService.getUniverseById(universeId);
// Returns: Universe | null
```

#### `getUniverseBySlug(slug: string)`
Récupère un univers par son slug.

```typescript
const universe = await universeService.getUniverseBySlug('gaming');
// Returns: Universe | null
```

#### `getSubUniverses(universeId: string)`
Récupère tous les sous-univers d'un univers.

```typescript
const subs = await universeService.getSubUniverses(universeId);
// Returns: SubUniverse[]
```

### Interfaces

```typescript
interface Universe {
  id: string;
  name: string;
  slug: string;
  description: string;
  color_primary: string;
  color_secondary: string;
  created_at: string;
}

interface SubUniverse {
  id: string;
  universe_id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string;
}
```

---

## 6. Revenue Service (`revenueService.ts`)

### Fonctions disponibles

#### `sendTip(fromUserId: string, toCreatorId: string, amount: number, message: string)`
Envoie un tip à un créateur.

```typescript
const tip = await revenueService.sendTip(userId, creatorId, 5.00, 'Great content!');
// Returns: Tip | null
```

#### `getCreatorRevenue(creatorId: string)`
Récupère les revenus du mois en cours pour un créateur.

```typescript
const revenue = await revenueService.getCreatorRevenue(creatorId);
// Returns: CreatorRevenue | null
```

#### `getRevenueHistory(creatorId: string, months: number)`
Récupère l'historique des revenus.

```typescript
const history = await revenueService.getRevenueHistory(creatorId, 6);
// Returns: CreatorRevenue[]
```

#### `getTipsSent(userId: string)`
Récupère les tips envoyés par un utilisateur.

```typescript
const sent = await revenueService.getTipsSent(userId);
// Returns: Tip[]
```

#### `getTipsReceived(creatorId: string)`
Récupère les tips reçus par un créateur.

```typescript
const received = await revenueService.getTipsReceived(creatorId);
// Returns: Tip[]
```

### Interfaces

```typescript
interface Tip {
  id: string;
  from_user_id: string;
  to_creator_id: string;
  amount: number;
  message: string;
  created_at: string;
}

interface CreatorRevenue {
  id: string;
  creator_id: string;
  total_revenue: number;
  subscription_revenue: number;
  tips_revenue: number;
  premium_revenue: number;
  live_revenue: number;
  month: string;
  updated_at: string;
}
```

---

## 7. Moderation Service (`moderationService.ts`)

### Fonctions disponibles

#### `reportContent(contentType, contentId, reporterId, reason, description)`
Signale du contenu inapproprié.

```typescript
const report = await moderationService.reportContent(
  'video',
  videoId,
  userId,
  'spam',
  'This video is spam'
);
// Returns: ContentReport | null
```

#### `getPendingReports()`
Récupère les signalements en attente.

```typescript
const reports = await moderationService.getPendingReports();
// Returns: ContentReport[]
```

#### `voteOnReport(reportId, voterId, vote, comment)`
Vote sur un signalement (modération communautaire).

```typescript
const vote = await moderationService.voteOnReport(
  reportId,
  voterId,
  'remove',
  'Violates guidelines'
);
// Returns: ModerationVote | null
```

#### `getReportVotes(reportId: string)`
Récupère tous les votes sur un signalement.

```typescript
const votes = await moderationService.getReportVotes(reportId);
// Returns: ModerationVote[]
```

#### `getContentStatus(contentType, contentId)`
Vérifie le statut de modération d'un contenu.

```typescript
const status = await moderationService.getContentStatus('video', videoId);
// Returns: ContentStatus | null
```

#### `updateContentStatus(contentType, contentId, status, reason)`
Met à jour le statut d'un contenu.

```typescript
const updated = await moderationService.updateContentStatus(
  'video',
  videoId,
  'masked',
  'Violates community guidelines'
);
// Returns: ContentStatus | null
```

### Interfaces

```typescript
interface ContentReport {
  id: string;
  content_type: 'video' | 'comment' | 'profile';
  content_id: string;
  reporter_id: string;
  reason: 'spam' | 'harassment' | 'misinformation' | 'copyright' | 'inappropriate' | 'other';
  description: string;
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  reporter_trust_at_time: number;
  created_at: string;
}

interface ModerationVote {
  id: string;
  report_id: string;
  voter_id: string;
  vote: 'remove' | 'keep' | 'warn';
  comment: string;
  voter_trust_at_time: number;
  created_at: string;
}

interface ContentStatus {
  id: string;
  content_type: 'video' | 'comment' | 'profile';
  content_id: string;
  status: 'visible' | 'masked' | 'under_review' | 'removed';
  reason: string;
  can_appeal: boolean;
  appeal_deadline: string | null;
  masked_at: string | null;
  updated_at: string;
}
```

---

## 8. Fonctions RPC de la Base de Données

### Fonctions disponibles directement via Supabase

#### `increment_view_count(video_id: uuid)`
Incrémente de manière atomique le compteur de vues.

```typescript
await supabase.rpc('increment_view_count', { video_id: videoId });
```

#### `increment_comment_count(video_id: uuid)`
Incrémente le compteur de commentaires.

```typescript
await supabase.rpc('increment_comment_count', { video_id: videoId });
```

#### `update_creator_revenue(p_creator_id, p_amount, p_type)`
Met à jour les revenus d'un créateur.

```typescript
await supabase.rpc('update_creator_revenue', {
  p_creator_id: creatorId,
  p_amount: 10.00,
  p_type: 'tips'
});
```

#### `calculate_video_score(video_id: uuid)`
Calcule le score d'engagement d'une vidéo.

```typescript
const { data } = await supabase.rpc('calculate_video_score', { video_id: videoId });
```

#### `get_personalized_feed(p_user_id, p_limit)`
Récupère un feed personnalisé basé sur les préférences utilisateur.

```typescript
const { data } = await supabase.rpc('get_personalized_feed', {
  p_user_id: userId,
  p_limit: 20
});
```

---

## 9. Sécurité et Row Level Security (RLS)

### Principes de sécurité

Toutes les tables ont RLS activé avec les règles suivantes :

#### Tables profiles
- Les utilisateurs peuvent lire tous les profils publics
- Les utilisateurs peuvent modifier uniquement leur propre profil

#### Tables videos
- Tout le monde peut lire les vidéos non masquées
- Seuls les créateurs peuvent modifier/supprimer leurs vidéos

#### Tables comments
- Tout le monde peut lire les commentaires
- Les utilisateurs authentifiés peuvent créer des commentaires
- Les utilisateurs peuvent supprimer uniquement leurs propres commentaires

#### Tables user_settings
- Les utilisateurs peuvent uniquement accéder à leurs propres paramètres

#### Tables support_tickets
- Les utilisateurs peuvent voir uniquement leurs propres tickets
- Les utilisateurs anonymes peuvent créer des tickets

#### Tables moderation
- Les utilisateurs avec un trust score > 0.7 peuvent voter
- Tous les utilisateurs authentifiés peuvent signaler du contenu

---

## 10. Bonnes pratiques d'utilisation

### Gestion des erreurs

```typescript
try {
  const videos = await videoService.getVideos(20);
  if (!videos || videos.length === 0) {
    console.log('No videos found');
  }
} catch (error) {
  console.error('Error fetching videos:', error);
}
```

### Chargement progressif

```typescript
const [videos, setVideos] = useState<VideoWithCreator[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadVideos = async () => {
    setLoading(true);
    const data = await videoService.getVideos(20);
    setVideos(data);
    setLoading(false);
  };

  loadVideos();
}, []);
```

### Validation côté client

Toujours valider les données avant de les envoyer :

```typescript
const sendTip = async () => {
  if (amount <= 0) {
    setError('Amount must be positive');
    return;
  }

  if (message.length > 500) {
    setError('Message too long');
    return;
  }

  await revenueService.sendTip(userId, creatorId, amount, message);
};
```

---

## 11. Exemples d'utilisation complète

### Exemple 1 : Charger et afficher des vidéos

```typescript
import { useEffect, useState } from 'react';
import { videoService, VideoWithCreator } from '../services/videoService';

function VideoList() {
  const [videos, setVideos] = useState<VideoWithCreator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      const data = await videoService.getVideos(20);
      setVideos(data);
      setLoading(false);
    };

    loadVideos();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {videos.map(video => (
        <div key={video.id}>
          <h3>{video.title}</h3>
          <p>By {video.creator.display_name}</p>
          <p>{video.view_count} views</p>
        </div>
      ))}
    </div>
  );
}
```

### Exemple 2 : Système de commentaires

```typescript
import { useState, useEffect } from 'react';
import { commentService, Comment } from '../services/commentService';
import { useAuth } from '../contexts/AuthContext';

function CommentSection({ videoId }: { videoId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    loadComments();
  }, [videoId]);

  const loadComments = async () => {
    const data = await commentService.getComments(videoId);
    setComments(data);
  };

  const handleSubmit = async () => {
    if (!user || !newComment.trim()) return;

    const comment = await commentService.addComment(
      videoId,
      user.id,
      newComment
    );

    if (comment) {
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  return (
    <div>
      {user && (
        <div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button onClick={handleSubmit}>Post</button>
        </div>
      )}

      {comments.map(comment => (
        <div key={comment.id}>
          <strong>{comment.user?.display_name}</strong>
          <p>{comment.content}</p>
        </div>
      ))}
    </div>
  );
}
```

### Exemple 3 : Tracking de session de visionnage

```typescript
import { useEffect, useRef } from 'react';
import { watchSessionService } from '../services/watchSessionService';
import { useAuth } from '../contexts/AuthContext';

function VideoPlayer({ videoId }: { videoId: string }) {
  const { user } = useAuth();
  const sessionIdRef = useRef<string | null>(null);
  const watchTimeRef = useRef(0);

  useEffect(() => {
    const startTracking = async () => {
      const sessionId = await watchSessionService.startSession(
        videoId,
        user?.id || null
      );
      sessionIdRef.current = sessionId;
    };

    startTracking();

    const interval = setInterval(() => {
      watchTimeRef.current += 1;

      if (sessionIdRef.current && watchTimeRef.current % 10 === 0) {
        watchSessionService.updateSession(
          sessionIdRef.current,
          watchTimeRef.current,
          0
        );
      }
    }, 1000);

    return () => {
      clearInterval(interval);

      if (sessionIdRef.current) {
        watchSessionService.updateSession(
          sessionIdRef.current,
          watchTimeRef.current,
          0
        );
        watchSessionService.validateSession(sessionIdRef.current);
      }
    };
  }, [videoId, user]);

  return <video src={videoUrl} controls />;
}
```

---

## 12. Performance et Optimisation

### Utilisation du cache

Les services n'incluent pas de cache par défaut. Pour optimiser :

```typescript
// Cache simple avec React Query (exemple)
import { useQuery } from '@tanstack/react-query';

function useVideos(universeId?: string) {
  return useQuery({
    queryKey: ['videos', universeId],
    queryFn: () => videoService.getVideos(20, universeId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### Pagination

```typescript
async function getVideosPaginated(page: number, pageSize: number) {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .range(page * pageSize, (page + 1) * pageSize - 1)
    .order('created_at', { ascending: false });

  return data || [];
}
```

---

## Support

Pour toute question sur les services de base de données :
- Documentation Supabase : https://supabase.com/docs
- Support Goroti : support@goroti.com
- Page support interne : `/support`
