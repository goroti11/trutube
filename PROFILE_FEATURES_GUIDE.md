# Guide des Fonctionnalités de Profil Goroti

## Vue d'ensemble

Ce guide documente toutes les nouvelles fonctionnalités de gestion de profil utilisateur implémentées dans Goroti.

## Fonctionnalités Principales

### 1. Gestion des Images

#### Photo de Profil et Bannière
- **Photo de profil** : Image circulaire de 160x160px minimum
- **Bannière** : Image d'arrière-plan 1920x480px recommandé
- Upload et modification via la page d'édition de profil
- Prévisualisation en temps réel

**Accès** : Bouton "Modifier" sur le profil → Icône caméra sur les images

### 2. Édition de Profil Complète

La page d'édition de profil (`EditProfilePage`) permet de modifier :

- **Nom d'affichage** : Nom public visible
- **Nom d'utilisateur** : Identifiant unique (@username)
- **URL de chaîne personnalisée** : URL conviviale (ex: goroti.com/channel/mon-url)
  - Génération automatique basée sur le nom d'utilisateur
  - Possibilité de copier l'URL complète
- **Bio** : Description courte (150 caractères max)
- **Description de la chaîne** : Description détaillée illimitée

### 3. Liens Externes

#### Plateformes Supportées
- Site web personnel
- Twitter
- Instagram
- YouTube
- TikTok
- Facebook
- LinkedIn
- Twitch
- Discord
- Autre

**Fonctionnalités** :
- Ajout de multiples liens
- Ordre personnalisable
- Visibilité contrôlable
- Ouverture dans un nouvel onglet

### 4. Système d'Avis

#### Fonctionnalités d'Avis
- **Noter un profil** : Étoiles de 1 à 5
- **Laisser un commentaire** : Avis textuel optionnel
- **Avis publics** : Visibles par tous les utilisateurs
- **Statistiques** : Note moyenne et nombre total d'avis
- **Gestion** : Modifier ou supprimer ses propres avis

**Limitations** :
- Un seul avis par utilisateur et par profil
- Impossible de noter son propre profil
- Les avis peuvent être marqués comme "utiles"

### 5. Partage de Profil

#### Méthodes de Partage
- **Copier le lien** : URL directe de la chaîne
- **Facebook** : Partage via Facebook
- **Twitter** : Tweet avec lien
- **WhatsApp** : Message avec lien
- **Email** : Envoi par email

**Tracking** : Chaque partage est enregistré pour les statistiques

### 6. Menu d'Options (3 Points)

#### Pour Son Propre Profil
- Paramètres
- Partager ma chaîne
- Ma communauté
- Confidentialité
- Mes données
- Notifications
- À propos de la chaîne
- Aide et commentaires
- Regarder sur téléviseur
- Rechercher dans la chaîne

#### Pour Profil d'Autrui
- Partager la chaîne
- À propos de la chaîne
- Rechercher dans la chaîne
- Regarder sur téléviseur
- Aide et commentaires
- Signaler la chaîne

### 7. Confidentialité

Page dédiée aux paramètres de confidentialité :

#### Visibilité du Profil
- Profil public
- Afficher l'email
- Afficher les abonnés
- Afficher l'activité
- Afficher les vidéos aimées
- Afficher les playlists

#### Interactions
- Autoriser les messages privés
- Autoriser les commentaires
- Autoriser les réponses vidéo

#### Contenu Sensible
- Avertissement contenu mature

### 8. Gestion des Données

Page de gestion complète des données utilisateur :

#### Export de Données
- Télécharger toutes ses données au format JSON
- Conforme au RGPD

#### Utilisation du Stockage
- Vue détaillée de l'espace utilisé
- Ventilation par type de fichier
- Quota disponible

#### Archivage et Suppression
- **Archiver le compte** : Désactivation temporaire
- **Supprimer le compte** : Suppression définitive (irréversible)

### 9. Badge Premium

Affichage du statut premium sur le profil :
- Badge **Premium** (bleu/cyan)
- Badge **Platine** (argenté)
- Badge **Gold** (or)

Chaque badge est animé et distinctif.

## Architecture Technique

### Base de Données

#### Nouvelles Tables

**profile_reviews**
```sql
- id: uuid
- reviewer_id: uuid
- profile_id: uuid
- rating: integer (1-5)
- review_text: text
- is_public: boolean
- helpful_count: integer
```

**social_links**
```sql
- id: uuid
- user_id: uuid
- platform: text
- url: text
- display_order: integer
- is_visible: boolean
```

**profile_shares**
```sql
- id: uuid
- profile_id: uuid
- shared_by_user_id: uuid
- share_method: text
```

#### Champs Ajoutés à profiles
- `banner_url`: URL de la bannière
- `channel_url`: URL personnalisée de la chaîne
- `about`: Description détaillée
- `total_reviews`: Nombre total d'avis
- `average_rating`: Note moyenne
- `community_guidelines`: Règles de la communauté (JSON)
- `privacy_settings`: Paramètres de confidentialité (JSON)

### Services

#### profileEnhancedService

**Méthodes principales** :
```typescript
// Images
updateProfileImages(userId, avatarUrl?, bannerUrl?)

// Informations
updateProfileInfo(userId, data)
generateChannelUrl(username)

// Avis
addReview(reviewerId, profileId, rating, reviewText)
getProfileReviews(profileId, limit)
updateReview(reviewId, rating, reviewText)
deleteReview(reviewId)

// Liens sociaux
addSocialLink(userId, platform, url, displayOrder)
getSocialLinks(userId)
updateSocialLink(linkId, url, isVisible)
deleteSocialLink(linkId)

// Partage
trackProfileShare(profileId, sharedByUserId, shareMethod)
getProfileShareCount(profileId)

// Paramètres
updatePrivacySettings(userId, settings)
updateCommunityGuidelines(userId, guidelines)

// Profil
getEnhancedProfile(userId)
getProfileByChannelUrl(channelUrl)
```

### Composants

#### ShareProfileModal
Modal de partage avec toutes les options sociales

#### ProfileReviewsSection
Section d'affichage et gestion des avis

#### ProfileOptionsMenu
Menu déroulant avec toutes les options

#### PremiumBadge
Badge animé pour les abonnés premium

### Pages

- **EditProfilePage** : Édition complète du profil
- **EnhancedProfilePage** : Nouvelle page de profil enrichie
- **PrivacySettingsPage** : Gestion de la confidentialité
- **DataManagementPage** : Gestion des données personnelles

## Sécurité

### Row Level Security (RLS)

Toutes les tables ont des politiques RLS :

- Les avis publics sont visibles par tous
- Les utilisateurs peuvent modifier uniquement leurs propres données
- Les liens sociaux visibles sont publics
- Les partages sont trackés anonymement

### Validation

- Les notes sont limitées de 1 à 5
- Les URLs de chaîne sont uniques
- Un utilisateur ne peut pas noter son propre profil
- Les champs sensibles sont protégés

## Utilisation

### Pour les Utilisateurs

1. **Modifier son profil**
   - Aller sur son profil
   - Cliquer sur "Modifier le profil"
   - Apporter les modifications
   - Enregistrer

2. **Ajouter des liens sociaux**
   - Page d'édition de profil
   - Section "Liens externes"
   - Ajouter un lien
   - Choisir la plateforme et l'URL

3. **Gérer la confidentialité**
   - Menu 3 points → Confidentialité
   - Activer/désactiver les options
   - Enregistrer

4. **Laisser un avis**
   - Visiter un profil
   - Onglet "Avis"
   - Cliquer "Laisser un avis"
   - Choisir la note et écrire un commentaire

5. **Partager un profil**
   - Bouton partage sur le profil
   - Choisir la méthode
   - Partager

### Pour les Développeurs

#### Ajouter une Plateforme Sociale

1. Modifier le type dans `profileEnhancedService.ts`
2. Ajouter l'icône dans `EditProfilePage.tsx`
3. Mettre à jour la contrainte SQL

#### Personnaliser les Badges Premium

Modifier `PremiumBadge.tsx` pour changer les couleurs et animations

#### Ajouter des Champs au Profil

1. Créer une migration SQL
2. Mettre à jour l'interface `EnhancedProfile`
3. Ajouter le champ dans le service
4. Mettre à jour l'UI

## Migrations

### Migration Principale
`add_profile_reviews_and_social_links.sql`

Cette migration crée :
- Les 3 nouvelles tables
- Les champs supplémentaires dans profiles
- Les politiques RLS
- Les fonctions utilitaires
- Les triggers automatiques

### Fonctions SQL Utiles

**generate_channel_url(username)** : Génère une URL unique

**update_profile_review_stats()** : Mise à jour automatique des statistiques d'avis

## Améliorations Futures

- Upload d'images directement depuis l'interface
- Édition d'images (crop, filtres)
- Thèmes de profil personnalisables
- Badges et récompenses communautaires
- Statistiques détaillées pour créateurs
- API publique pour les profils

## Support

Pour toute question ou problème :
- Consulter la section Aide
- Contacter le support via le menu
- Signaler un bug dans les paramètres

## Conformité

Ce système est conforme :
- RGPD (droit à l'oubli, export de données)
- Lois sur la protection des données
- Standards de sécurité web modernes
