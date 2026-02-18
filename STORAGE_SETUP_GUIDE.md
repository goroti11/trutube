# Guide de Configuration du Stockage Vidéo

## Configuration du Bucket Supabase Storage

Le système d'upload de vidéos nécessite un bucket de stockage configuré dans Supabase.

### Étape 1: Créer le Bucket

1. Accédez à votre dashboard Supabase
2. Allez dans **Storage** dans le menu latéral
3. Cliquez sur **New Bucket**
4. Configurez le bucket avec les paramètres suivants:

```
Nom: video-content
Accès Public: ✓ Activé
Taille maximale de fichier: 2GB (2147483648 bytes)
Types MIME autorisés:
  - video/mp4
  - video/webm
  - video/quicktime
  - video/x-matroska
  - image/jpeg
  - image/png
  - image/webp
```

### Étape 2: Structure des Dossiers

Le bucket utilisera la structure suivante:

```
video-content/
├── videos/
│   └── {user_id}/
│       └── {video_id}.{ext}
└── thumbnails/
    └── {user_id}/
        └── {video_id}.{ext}
```

### Étape 3: Policies de Sécurité

Les policies suivantes doivent être configurées (peuvent être créées via SQL Editor):

#### 1. Lecture Publique (SELECT)

```sql
CREATE POLICY "Public can view videos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'video-content');
```

#### 2. Upload de Vidéos (INSERT)

```sql
CREATE POLICY "Creators can upload videos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'video-content'
    AND (storage.foldername(name))[1] = 'videos'
    AND auth.uid()::text = (storage.foldername(name))[2]
  );
```

#### 3. Upload de Miniatures (INSERT)

```sql
CREATE POLICY "Creators can upload thumbnails"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'video-content'
    AND (storage.foldername(name))[1] = 'thumbnails'
    AND auth.uid()::text = (storage.foldername(name))[2]
  );
```

#### 4. Mise à Jour (UPDATE)

```sql
CREATE POLICY "Creators can update own files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'video-content'
    AND auth.uid()::text = (storage.foldername(name))[2]
  )
  WITH CHECK (
    bucket_id = 'video-content'
    AND auth.uid()::text = (storage.foldername(name))[2]
  );
```

#### 5. Suppression (DELETE)

```sql
CREATE POLICY "Creators can delete own files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'video-content'
    AND auth.uid()::text = (storage.foldername(name))[2]
  );
```

### Étape 4: Vérification

Pour vérifier que tout fonctionne:

1. Connectez-vous en tant que créateur
2. Accédez au Dashboard Créateur
3. Cliquez sur "Publier une vidéo"
4. Essayez d'uploader une petite vidéo de test
5. Vérifiez que la vidéo apparaît dans votre dashboard

## Configuration via Supabase CLI (Alternative)

Si vous utilisez Supabase CLI, vous pouvez créer le bucket avec:

```bash
supabase storage create video-content --public
```

Puis appliquer les policies avec:

```bash
supabase migration up
```

## Limites et Recommandations

### Limites Techniques

- **Taille maximale**: 2GB par vidéo
- **Formats vidéo**: MP4, WebM, QuickTime, MKV
- **Formats miniature**: JPEG, PNG, WebP (max 5MB)
- **Stockage total**: Selon votre plan Supabase

### Recommandations de Production

1. **Compression Vidéo**
   - Utilisez H.264 pour MP4 (meilleure compatibilité)
   - Bitrate recommandé: 4-8 Mbps pour 1080p
   - Audio: AAC 128-192 kbps

2. **Miniatures**
   - Résolution: 1280x720 ou 1920x1080
   - Format: JPEG (qualité 80-90%)
   - Poids: < 500KB recommandé

3. **Optimisation**
   - Activez la compression côté Supabase si disponible
   - Utilisez un CDN pour la distribution
   - Implémentez le streaming adaptatif pour grandes vidéos

4. **Monitoring**
   - Surveillez l'utilisation du stockage
   - Configurez des alertes pour quota
   - Nettoyez régulièrement les vidéos non publiées

## Transcoding Vidéo (Optionnel)

Pour une solution de production complète, considérez:

### Option 1: Supabase Functions + FFmpeg

Créez une edge function qui:
1. Reçoit l'URL de la vidéo uploadée
2. Transcode en plusieurs qualités (360p, 720p, 1080p)
3. Génère automatiquement une miniature
4. Met à jour l'enregistrement vidéo

### Option 2: Service Externe

Intégrez un service de transcoding comme:
- Mux
- Cloudinary
- AWS MediaConvert
- Coconut

### Option 3: Client-Side Processing

Utilisez des libraries JavaScript comme:
- ffmpeg.wasm (transcoding dans le navigateur)
- video-metadata (extraction de métadonnées)

## Sécurité Avancée

### Validation Côté Serveur

Créez une edge function pour valider:

```typescript
// supabase/functions/validate-upload/index.ts
export async function validateUpload(file: File, userId: string) {
  // Vérifier le type MIME réel
  const buffer = await file.arrayBuffer();
  const realType = detectFileType(buffer);

  // Vérifier la durée
  const duration = await getVideoDuration(buffer);
  if (duration > 7200) { // Max 2h
    throw new Error('Vidéo trop longue');
  }

  // Scanner pour malware
  const isSafe = await scanFile(buffer);
  if (!isSafe) {
    throw new Error('Fichier suspect détecté');
  }

  return { valid: true };
}
```

### Rate Limiting

Limitez les uploads par utilisateur:

```sql
-- Table pour suivre les uploads
CREATE TABLE upload_limits (
  user_id uuid PRIMARY KEY REFERENCES profiles(id),
  uploads_today integer DEFAULT 0,
  last_upload timestamptz DEFAULT now()
);

-- Fonction pour vérifier la limite
CREATE FUNCTION check_upload_limit(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  today_uploads integer;
BEGIN
  SELECT uploads_today INTO today_uploads
  FROM upload_limits
  WHERE user_id = user_uuid
  AND last_upload::date = CURRENT_DATE;

  IF today_uploads IS NULL THEN
    INSERT INTO upload_limits (user_id, uploads_today)
    VALUES (user_uuid, 0);
    RETURN true;
  END IF;

  RETURN today_uploads < 10; -- Max 10 uploads par jour
END;
$$;
```

## Streaming et Performance

### Streaming Progressif

Pour permettre le streaming pendant l'upload:

```typescript
// Utiliser des chunks
const uploadInChunks = async (file: File) => {
  const chunkSize = 5 * 1024 * 1024; // 5MB chunks
  const totalChunks = Math.ceil(file.size / chunkSize);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    await uploadChunk(chunk, i, totalChunks);
  }
};
```

### CDN Integration

Pour de meilleures performances:

1. Activez Supabase CDN si disponible
2. Ou configurez Cloudflare devant Supabase
3. Utilisez des URLs signées avec expiration

## Backup et Récupération

### Stratégie de Backup

1. **Backup Automatique**: Configuré par Supabase
2. **Backup Externe**: Copiez vers S3/GCS périodiquement
3. **Versioning**: Activez sur le bucket

### Script de Backup

```typescript
// Script pour backup externe
async function backupVideos() {
  const { data } = await supabase.storage
    .from('video-content')
    .list('videos');

  for (const file of data) {
    const { data: blob } = await supabase.storage
      .from('video-content')
      .download(file.name);

    // Upload vers backup externe
    await uploadToExternalStorage(blob, file.name);
  }
}
```

## Monitoring et Analytics

### Métriques à Suivre

1. **Stockage**
   - Espace utilisé total
   - Croissance journalière
   - Top utilisateurs par stockage

2. **Performance**
   - Temps d'upload moyen
   - Taux d'échec
   - Temps de transcoding

3. **Utilisation**
   - Nombre d'uploads par jour
   - Formats les plus utilisés
   - Taille moyenne des vidéos

### Dashboard Query

```sql
-- Vue pour les statistiques de stockage
CREATE VIEW storage_stats AS
SELECT
  DATE(created_at) as date,
  COUNT(*) as uploads,
  SUM(file_size) as total_size,
  AVG(file_size) as avg_size,
  COUNT(DISTINCT creator_id) as unique_creators
FROM videos
WHERE processing_status = 'completed'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

## Dépannage

### Problèmes Courants

#### Upload échoue avec "403 Forbidden"

**Cause**: Policies mal configurées
**Solution**: Vérifiez les policies de storage avec:

```sql
SELECT * FROM storage.policies
WHERE bucket_id = 'video-content';
```

#### Upload échoue avec "413 Request Entity Too Large"

**Cause**: Fichier trop volumineux
**Solution**:
1. Vérifiez la limite du bucket (2GB)
2. Augmentez si nécessaire ou compressez la vidéo

#### Vidéo non accessible après upload

**Cause**: Bucket non public
**Solution**: Vérifiez que le bucket est public:

```sql
SELECT public FROM storage.buckets
WHERE id = 'video-content';
```

#### Performances lentes

**Causes possibles**:
1. Réseau lent
2. Fichier non optimisé
3. Région Supabase éloignée

**Solutions**:
- Utilisez des chunks pour l'upload
- Compressez la vidéo avant upload
- Utilisez un CDN

## Support

Pour plus d'aide:
- Documentation Supabase Storage: https://supabase.com/docs/guides/storage
- Issues GitHub du projet
- Email: support@trutube.com
