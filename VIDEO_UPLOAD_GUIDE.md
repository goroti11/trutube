# Guide d'Upload de Vidéos Goroti

## Vue d'ensemble

Le système d'upload de vidéos Goroti permet aux créateurs de publier leur contenu directement dans leurs univers avec description, transcription et métadonnées complètes.

## Fonctionnalités Principales

### 1. Upload de Vidéos

#### Formats Supportés
- **Vidéo**: MP4, WebM, QuickTime (MOV), Matroska (MKV)
- **Miniature**: JPEG, PNG, WebP
- **Taille maximale**: 2GB par vidéo
- **Durée**: Illimitée

#### Processus d'Upload

1. **Sélection du fichier**
   - Drag & drop ou sélection via bouton
   - Prévisualisation instantanée
   - Validation automatique du format

2. **Métadonnées**
   - Titre (3-100 caractères, obligatoire)
   - Description (10-5000 caractères, obligatoire)
   - Transcription (optionnel, améliore l'accessibilité)
   - Univers et sous-univers (obligatoire)
   - Tags (optionnel, séparés par virgules)
   - Qualité (SD, HD, FHD, 4K)

3. **Miniature**
   - Upload optionnel d'une image personnalisée
   - Formats: JPEG, PNG, WebP
   - Taille recommandée: 1280x720 ou 1920x1080
   - Poids max: 5MB

4. **Publication**
   - Upload avec barre de progression
   - Traitement automatique
   - Publication immédiate

### 2. Dashboard Créateur

Le dashboard offre une vue complète de votre contenu:

#### Statistiques Globales
- **Nombre total de vidéos**
- **Vues totales**
- **Likes totaux**
- **Commentaires totaux**

#### Gestion des Vidéos
- **Liste complète** avec miniatures
- **Statuts de traitement**:
  - Brouillon (non publié)
  - En attente (pending)
  - En traitement (processing)
  - Publié (completed)
  - Échec (failed)
- **Actions rapides**:
  - Voir la vidéo
  - Modifier les métadonnées
  - Supprimer

#### Filtrage et Tri
- Par statut de publication
- Par univers
- Par date de création
- Par performances

## Architecture Technique

### Base de Données

#### Nouveaux Champs Vidéos

```typescript
interface Video {
  // Champs existants...
  video_url: string;              // URL de la vidéo
  thumbnail_url: string;          // URL de la miniature
  transcription: string;          // Transcription complète
  processing_status: string;      // Statut du traitement
  file_size: number;              // Taille en bytes
  duration: number;               // Durée en secondes
  quality: string;                // SD, HD, FHD, 4K
  is_published: boolean;          // Publié ou brouillon
}
```

#### Statuts de Traitement

| Statut | Description |
|--------|-------------|
| `pending` | En attente de traitement |
| `processing` | Traitement en cours |
| `completed` | Prêt et publié |
| `failed` | Échec du traitement |

### Services

#### videoUploadService

Service principal pour la gestion des uploads:

```typescript
// Valider un fichier vidéo
validateVideoFile(file: File): { valid: boolean; error?: string }

// Valider une miniature
validateThumbnailFile(file: File): { valid: boolean; error?: string }

// Obtenir la durée d'une vidéo
getVideoDuration(file: File): Promise<number>

// Uploader une vidéo complète
uploadVideo(
  data: VideoUploadData,
  onProgress?: (progress: VideoUploadProgress) => void
): Promise<{ success: boolean; videoId?: string; error?: string }>

// Récupérer les vidéos d'un créateur
getCreatorVideos(
  creatorId: string,
  includeUnpublished?: boolean
): Promise<Video[]>

// Supprimer une vidéo
deleteVideo(videoId: string): Promise<boolean>

// Mettre à jour une vidéo
updateVideo(
  videoId: string,
  updates: Partial<Video>
): Promise<boolean>

// Formater la taille de fichier
formatFileSize(bytes: number): string

// Formater la durée
formatDuration(seconds: number): string
```

### Pages

#### VideoUploadPage

Page dédiée à l'upload de nouvelles vidéos.

**Fonctionnalités**:
- Formulaire complet avec validation
- Upload avec barre de progression
- Prévisualisation vidéo et miniature
- Sélection d'univers dynamique
- Compteurs de caractères
- Gestion d'erreurs détaillée

**Navigation**:
- Accessible depuis le dashboard créateur
- Bouton "Publier une vidéo" dans le header
- Retour automatique au dashboard après succès

#### CreatorDashboardV2Page

Dashboard complet pour les créateurs.

**Sections**:
1. **Cartes statistiques**: Vidéos, vues, likes, commentaires
2. **Liste des vidéos**: Avec filtres et actions
3. **Bouton d'action**: Upload rapide

## Utilisation

### Pour les Créateurs

#### 1. Accéder à l'Upload

**Option A: Via le Dashboard**
1. Cliquez sur votre avatar
2. Sélectionnez "Dashboard Créateur"
3. Cliquez sur "Publier une vidéo"

**Option B: Via le Menu**
1. Ouvrez le menu principal
2. Cliquez sur "Upload"

#### 2. Préparer votre Vidéo

**Avant l'Upload**:
- Assurez-vous que la vidéo est au bon format
- Préparez une miniature attrayante
- Rédigez un titre accrocheur
- Écrivez une description détaillée
- Choisissez l'univers approprié

**Recommandations**:
- **Titre**: Court, descriptif, avec mots-clés
- **Description**: Détaillée, avec liens et timestamps
- **Tags**: 3-10 tags pertinents
- **Transcription**: Améliore l'accessibilité et le SEO

#### 3. Uploader

1. **Sélectionnez votre vidéo**
   - Cliquez ou déposez le fichier
   - Vérifiez la prévisualisation

2. **Ajoutez une miniature** (optionnel)
   - Image personnalisée recommandée
   - Attire plus de vues

3. **Remplissez les informations**
   - Tous les champs obligatoires
   - Soyez précis et descriptif

4. **Choisissez l'univers**
   - Univers principal (obligatoire)
   - Sous-univers si applicable

5. **Ajoutez des tags**
   - Séparés par des virgules
   - Facilitent la découverte

6. **Sélectionnez la qualité**
   - Selon votre fichier source
   - Affecte l'expérience de visionnage

7. **Publiez**
   - Cliquez sur "Publier la vidéo"
   - Attendez la fin de l'upload
   - Confirmation automatique

#### 4. Gérer vos Vidéos

**Depuis le Dashboard**:
- Voir toutes vos vidéos
- Filtrer par statut
- Éditer les métadonnées
- Supprimer si nécessaire
- Suivre les performances

### Pour les Développeurs

#### Intégration

```typescript
import { videoUploadService } from '../services/videoUploadService';

// Upload d'une vidéo
const result = await videoUploadService.uploadVideo(
  {
    title: 'Ma vidéo',
    description: 'Description',
    universe_id: 'uuid',
    video: videoFile,
    thumbnail: thumbnailFile
  },
  (progress) => {
    console.log(`${progress.progress}%: ${progress.message}`);
  }
);

if (result.success) {
  console.log('Vidéo uploadée:', result.videoId);
} else {
  console.error('Erreur:', result.error);
}
```

#### Validation Personnalisée

```typescript
// Validation côté client
const validation = videoUploadService.validateVideoFile(file);
if (!validation.valid) {
  alert(validation.error);
  return;
}

// Obtenir les métadonnées
const duration = await videoUploadService.getVideoDuration(file);
console.log(`Durée: ${duration} secondes`);
```

#### Gestion du Stockage

```typescript
// Récupérer les vidéos
const videos = await videoUploadService.getCreatorVideos(userId, true);

// Supprimer une vidéo
const deleted = await videoUploadService.deleteVideo(videoId);

// Mettre à jour
const updated = await videoUploadService.updateVideo(videoId, {
  title: 'Nouveau titre',
  is_published: true
});
```

## Sécurité

### Validation Côté Client

Tous les fichiers sont validés avant upload:
- Type MIME vérifié
- Taille contrôlée
- Format confirmé

### Sécurité Côté Serveur

Row Level Security (RLS) appliqué:
- Seuls les créateurs peuvent uploader
- Impossible d'uploader pour un autre créateur
- Impossible de modifier les vidéos d'autrui
- Suppression restreinte au propriétaire

### Policies Supabase

```sql
-- Créateurs peuvent créer leurs vidéos
CREATE POLICY "Creators can insert own videos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

-- Créateurs peuvent modifier leurs vidéos
CREATE POLICY "Creators can update own videos"
  ON videos FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- Accès aux vidéos non publiées
CREATE POLICY "Creators can view own unpublished videos"
  ON videos FOR SELECT
  TO authenticated
  USING (
    auth.uid() = creator_id
    OR (is_published = true AND processing_status = 'completed')
  );
```

## Optimisations

### Performances

1. **Upload par Chunks**
   - Fichiers > 50MB uploadés en morceaux
   - Reprise possible en cas d'interruption
   - Meilleure gestion mémoire

2. **Prévisualisation Lazy**
   - Miniatures chargées à la demande
   - Optimisation du scroll
   - Cache navigateur activé

3. **Validation Asynchrone**
   - Fichiers validés en background
   - UI reste réactive
   - Feedback immédiat

### SEO et Accessibilité

1. **Transcription**
   - Améliore le référencement
   - Permet sous-titres automatiques
   - Accessibilité malentendants

2. **Métadonnées Riches**
   - Tags pour découvrabilité
   - Description pour contexte
   - Univers pour catégorisation

3. **Miniatures Attrayantes**
   - Augmente le CTR
   - Représente le contenu
   - Résolution optimale

## Limites et Quotas

### Limites Techniques

| Paramètre | Limite |
|-----------|--------|
| Taille max vidéo | 2GB |
| Taille max miniature | 5MB |
| Durée max vidéo | Aucune |
| Uploads par jour | 100 |
| Formats vidéo | 4 |
| Formats image | 3 |

### Quotas par Plan

| Plan | Stockage | Bande passante |
|------|----------|----------------|
| Gratuit | 10GB | 50GB/mois |
| Basic | 100GB | 500GB/mois |
| Pro | 500GB | 2TB/mois |
| Enterprise | Illimité | Illimité |

## Résolution de Problèmes

### Upload Échoue

**Symptôme**: La vidéo ne s'uploade pas

**Causes possibles**:
1. Fichier trop volumineux (> 2GB)
2. Format non supporté
3. Connexion interrompue
4. Stockage Supabase plein

**Solutions**:
1. Compressez la vidéo
2. Convertissez au format MP4
3. Réessayez avec meilleure connexion
4. Contactez le support

### Vidéo Non Visible

**Symptôme**: Vidéo uploadée mais invisible

**Causes possibles**:
1. Statut = 'pending' ou 'processing'
2. is_published = false
3. Erreur de traitement

**Solutions**:
1. Attendez la fin du traitement
2. Vérifiez le statut dans le dashboard
3. Republiez si échec

### Miniature Manquante

**Symptôme**: Pas de miniature affichée

**Causes possibles**:
1. Upload miniature échoué
2. URL incorrecte
3. Format non supporté

**Solutions**:
1. Ré-uploadez la miniature
2. Vérifiez le format (JPEG/PNG/WebP)
3. Utilisez une image < 5MB

### Mauvaise Qualité

**Symptôme**: Vidéo floue ou pixelisée

**Causes possibles**:
1. Source basse qualité
2. Mauvaise compression
3. Paramètre qualité incorrect

**Solutions**:
1. Uploadez source haute qualité
2. Utilisez encodage H.264
3. Sélectionnez la bonne qualité

## Meilleures Pratiques

### Contenu

1. **Qualité > Quantité**
   - Privilégiez contenu de qualité
   - Ne spammez pas
   - Restez cohérent

2. **Optimisation**
   - Compressez avant upload
   - Format MP4 H.264
   - Résolution adaptée

3. **Métadonnées**
   - Titre descriptif
   - Description complète
   - Tags pertinents

### Engagement

1. **Régularité**
   - Calendrier de publication
   - Horaires optimaux
   - Fréquence constante

2. **Interaction**
   - Répondez aux commentaires
   - Analysez les performances
   - Adaptez le contenu

3. **Promotion**
   - Partagez sur réseaux sociaux
   - Créez des playlists
   - Collaborez avec autres créateurs

## Futures Améliorations

### Prévues

1. **Transcoding Automatique**
   - Plusieurs qualités générées
   - Streaming adaptatif
   - Miniature auto-générée

2. **Édition En Ligne**
   - Trim/Cut basique
   - Filtres et effets
   - Sous-titres intégrés

3. **Upload Programmé**
   - Planifier publication
   - Publication récurrente
   - File d'attente

4. **Analytics Avancées**
   - Rétention audience
   - Sources de trafic
   - Démographie viewers

5. **Monétisation Améliorée**
   - Revenus par vidéo
   - PPV (Pay Per View)
   - Contenu premium

## Support

Pour toute question ou problème:
- FAQ: /help/upload
- Email: upload@goroti.com
- Discord: #help-upload
- Documentation: docs.goroti.com/upload

## Changelog

### v1.0.0 (2024-02-14)
- Système d'upload initial
- Dashboard créateur v2
- Support formats MP4, WebM, MOV, MKV
- Upload avec progression
- Gestion complète des métadonnées
- Transcription optionnelle
- Sélection univers/sous-univers
- Validation fichiers
- RLS complet
- Documentation complète
