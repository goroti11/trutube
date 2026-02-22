# GOROTI Unified Notification System

## Vue d'ensemble

Système de notifications centralisé, intelligent et scalable couvrant toute la plateforme GOROTI.

## Architecture

### Tables de la base de données

#### 1. `notifications` (Table centrale)
Table principale pour toutes les notifications de la plateforme.

**Colonnes principales:**
- `id` - Identifiant unique
- `user_id` - Destinataire
- `actor_id` - Qui a déclenché l'action
- `entity_type` - Type d'entité (video, live, flow, gift, wallet, game, marketplace, etc.)
- `entity_id` - ID de l'entité liée
- `type` - Type spécifique (ex: video:like, live:started, wallet:received)
- `title` - Titre de la notification
- `body` - Message de la notification
- `data` - Données additionnelles (JSON)
- `channel` - Canal (in_app, push, email)
- `priority` - Priorité (1-5, 5 étant critique)
- `is_read` - Lu ou non
- `is_seen` - Vu dans la liste
- `grouped_with` - ID du groupe si regroupé
- `created_at` - Date de création
- `read_at` - Date de lecture

**Indexes optimisés:**
- `(user_id, created_at DESC)` - Liste chronologique
- `(user_id, is_read)` WHERE is_read = false - Non lues
- `(user_id, is_seen)` WHERE is_seen = false - Non vues
- `(type)` - Par type
- `(entity_type, entity_id)` - Par entité
- `(priority DESC, created_at DESC)` - Par priorité

#### 2. `notification_preferences`
Préférences utilisateur par catégorie et canal.

**Catégories:**
- live_enabled, gift_enabled, video_enabled, flow_enabled
- studio_enabled, wallet_enabled, marketplace_enabled
- moderation_enabled, marketing_enabled, community_enabled
- game_enabled, premium_enabled

**Canaux:**
- email_enabled, push_enabled, in_app_enabled

**Fonctionnalités avancées:**
- smart_enabled - Notifications intelligentes
- digest_enabled - Résumés périodiques
- digest_frequency - Fréquence (hourly, daily, weekly)
- quiet_hours_start / quiet_hours_end - Heures de silence

#### 3. `notification_rules`
Règles anti-spam et de regroupement.

**Champs:**
- `type` - Type de notification (clé primaire)
- `entity_type` - Type d'entité
- `min_priority` - Priorité minimale
- `cooldown_seconds` - Temps avant pouvoir renvoyer
- `groupable` - Peut être regroupé
- `group_window_seconds` - Fenêtre de regroupement
- `max_group_size` - Taille max du groupe
- `description` - Description

**Exemples de règles:**
- `video:like` - Groupable, fenêtre 1h, max 20
- `video:comment` - Groupable, fenêtre 30min, max 10
- `live:started` - Non groupable, priorité 4
- `wallet:purchase` - Non groupable, priorité 5 (critique)

#### 4. `notification_groups`
Suivi des notifications regroupées.

**Structure:**
- Compte le nombre de notifications similaires
- Liste les acteurs impliqués
- Garde le dernier acteur
- Fenêtre temporelle active

## Fonctions RPC Intelligentes

### `create_smart_notification()`
Crée une notification avec logique anti-spam et regroupement.

**Logique:**
1. Vérifie la règle de notification
2. Contrôle la priorité minimale
3. Vérifie les préférences utilisateur
4. Respecte les heures de silence (quiet hours)
5. Applique le cooldown si défini
6. Groupe les notifications si possible
7. Crée ou met à jour la notification

**Retour:**
```json
{
  "success": true,
  "notification_id": "uuid",
  "grouped": false,
  "group_count": 1
}
```

### `mark_notifications_read(notification_ids)`
Marque plusieurs notifications comme lues.

### `mark_notifications_seen(notification_ids)`
Marque plusieurs notifications comme vues.

### `get_unread_notification_count()`
Retourne le nombre de notifications non lues.

### `get_unseen_notification_count()`
Retourne le nombre de notifications non vues.

### `delete_old_user_notifications()`
Supprime les anciennes notifications de l'utilisateur.

### `cleanup_old_notifications()`
Fonction système pour nettoyer automatiquement:
- Notifications lues de plus de 30 jours
- Notifications non lues de faible priorité de plus de 90 jours
- Groupes inactifs de plus de 7 jours

## Service Frontend

### `unifiedNotificationService.ts`

**Méthodes principales:**

#### Création
- `createNotification(params)` - Créer une notification

#### Lecture
- `getNotifications(options)` - Récupérer les notifications
- `getUnreadCount()` - Compter les non lues
- `getUnseenCount()` - Compter les non vues

#### Actions
- `markAsRead(notificationIds)` - Marquer comme lu
- `markAsSeen(notificationIds)` - Marquer comme vu
- `deleteNotification(notificationId)` - Supprimer

#### Préférences
- `getPreferences()` - Récupérer les préférences
- `updatePreferences(preferences)` - Mettre à jour les préférences

#### Utilitaires
- `subscribeToNotifications(userId, callback)` - S'abonner aux nouvelles notifications (Realtime)
- `getNotificationIcon(type)` - Obtenir l'emoji du type
- `getPriorityColor(priority)` - Obtenir la couleur de priorité

## Composant React

### `NotificationCenter.tsx`

**Fonctionnalités:**
- Badge avec compteur de non lues
- Dropdown avec liste de notifications
- Filtres (toutes / non lues)
- Actions individuelles (lire, supprimer)
- Action globale (tout marquer comme lu)
- Navigation vers les entités liées
- Abonnement Realtime pour mises à jour instantanées

**Design:**
- Interface moderne et fluide
- Animations et transitions
- Responsive
- Dark mode
- Icônes personnalisées par type

## Types de Notifications

### Vidéo
- `video:like` - Like sur vidéo (groupable)
- `video:comment` - Commentaire (groupable)
- `video:reply` - Réponse à commentaire
- `video:published` - Nouvelle vidéo d'un créateur suivi
- `video:milestone` - Milestone atteint

### Live
- `live:started` - Live démarré (priorité 4)
- `live:scheduled` - Rappel de live programmé
- `live:gift_received` - Cadeau reçu (groupable)
- `live:milestone` - Palier atteint
- `live:top_supporter` - Devenu top supporter

### Flow
- `flow:started` - Session Flow démarrée
- `flow:completed` - Session Flow terminée
- `flow:new` - Nouveau Flow disponible
- `flow:recommendation` - Recommandation personnalisée

### Cadeaux
- `gift:received` - Cadeau reçu (groupable)
- `gift:badge_unlocked` - Badge débloqué
- `gift:status_reached` - Nouveau statut atteint
- `gift:leaderboard` - Position classement changée

### Wallet (TruCoins)
- `wallet:purchase` - Achat validé (priorité 5)
- `wallet:received` - TruCoins reçus
- `wallet:sent` - TruCoins envoyés
- `wallet:low_balance` - Solde faible
- `wallet:earnings` - Gains crédités

### Jeux
- `game:duel_started` - Défi reçu
- `game:victory` - Victoire
- `game:leaderboard` - Mise à jour classement
- `game:reward` - Récompense gagnée

### Marketplace
- `marketplace:order` - Commande reçue
- `marketplace:payment` - Paiement traité (priorité 5)
- `marketplace:delivery` - Livraison confirmée
- `marketplace:dispute` - Litige ouvert (priorité 5)
- `marketplace:review` - Avis reçu (groupable)

### Modération
- `moderation:warning` - Avertissement (priorité 5)
- `moderation:suspension` - Suspension (priorité 5)
- `moderation:report_resolved` - Signalement traité
- `moderation:appeal` - Décision d'appel

### Studio
- `studio:milestone` - Milestone chaîne atteint
- `studio:monetization` - Seuil monétisation atteint (priorité 5)
- `studio:analytics` - Nouvelles analytics disponibles
- `studio:verification` - Statut vérification changé

### Premium
- `premium:activated` - Abonnement activé
- `premium:expiring` - Abonnement expirant
- `premium:expired` - Abonnement expiré
- `premium:content` - Nouveau contenu premium

### Communauté
- `community:post` - Nouveau post (groupable)
- `community:mention` - Mention dans communauté
- `community:role` - Rôle changé

### Système
- `system:announcement` - Annonce plateforme
- `system:maintenance` - Maintenance programmée
- `system:security` - Alerte sécurité (priorité 5)

## Niveaux de Priorité

| Niveau | Type | Exemples |
|--------|------|----------|
| 5 | Critique | Wallet, Modération, Disputes, Sécurité |
| 4 | Important | Live démarré, Gains, Premium expirant |
| 3 | Normal | Cadeaux, Commentaires, Nouvelles vidéos |
| 2 | Faible | Analytics, Recommandations |
| 1 | Marketing | Promotions, Newsletters |

## Système Anti-Spam

### Cooldown
Empêche l'envoi répété de notifications du même type.

**Exemples:**
- Likes: 5 minutes
- Commentaires: 1 minute
- Recommandations Flow: 1 heure
- Solde faible: 24 heures

### Grouping
Regroupe automatiquement les notifications similaires.

**Exemple:**
```
Au lieu de:
- Jean a aimé votre vidéo
- Marie a aimé votre vidéo
- Pierre a aimé votre vidéo

On obtient:
- Jean et 2 autres ont aimé votre vidéo
```

**Configuration:**
- Fenêtre de regroupement (ex: 1 heure)
- Taille maximale du groupe (ex: 20 likes)

## Heures de Silence

Les utilisateurs peuvent définir des heures de silence.

**Comportement:**
- Notifications de priorité < 4 sont bloquées
- Notifications critiques (priorité 5) passent toujours
- Notifications importantes (priorité 4) passent toujours

## Intégration dans l'Application

### Dans le Header
```tsx
import NotificationCenter from './components/NotificationCenter';

// Utilisation
<NotificationCenter onNavigate={onNavigate} />
```

### Création de notification (côté serveur ou edge function)
```typescript
import { unifiedNotificationService } from './services/unifiedNotificationService';

await unifiedNotificationService.createNotification({
  user_id: 'user-uuid',
  actor_id: 'actor-uuid',
  entity_type: 'video',
  entity_id: 'video-uuid',
  type: 'video:like',
  title: 'Nouveau like',
  body: 'Jean a aimé votre vidéo',
  data: { video_title: 'Ma super vidéo' },
  priority: 2
});
```

## Sécurité

### Row Level Security (RLS)
- Les utilisateurs ne voient que leurs propres notifications
- Les préférences sont accessibles uniquement par leur propriétaire
- Les règles sont visibles par tous (lecture seule)

### Validation
- Types d'entités validés par constraint CHECK
- Priorités limitées à 1-5
- Canaux limités à in_app, push, email

## Performance

### Indexes
- Tous les index sont optimisés pour les requêtes fréquentes
- Index partiels pour les notifications non lues/vues

### Cleanup automatique
- Suppression des notifications lues > 30 jours
- Suppression des notifications faible priorité non lues > 90 jours
- Désactivation des groupes inactifs > 7 jours

### Realtime
- Abonnement aux changements via Supabase Realtime
- Mises à jour instantanées dans l'UI

## Évolutions futures

### Smart Notifications (Phase 2)
- Basées sur les habitudes de visionnage
- Score TruPower de l'utilisateur
- Créateurs préférés
- Heures d'activité optimales

**Exemple:**
> "Ton créateur préféré est live et il a déjà reçu un disque diamant aujourd'hui!"

### Digest Email (Phase 2)
- Résumés intelligents par email
- Fréquence configurable (hourly, daily, weekly)
- Agrégation des notifications importantes

### Push Notifications (Phase 2)
- Support FCM (Android) et APNS (iOS)
- Tokens stockés dans preferences
- Envoi via edge function

## Résultat

Le système de notifications GOROTI est:
- **Centralisé** - Une seule source de vérité
- **Intelligent** - Anti-spam et grouping automatiques
- **Scalable** - Architecture optimisée pour des millions de notifications
- **Personnalisable** - Préférences granulaires par utilisateur
- **Non-intrusif** - Respect des heures de silence
- **Temps réel** - Mises à jour instantanées
- **Sécurisé** - RLS et validation stricte
- **Performant** - Indexes et cleanup automatiques
