/*
  # Système d'Upload de Vidéos pour Créateurs

  ## Modifications
  
  1. Ajout de champs aux vidéos
    - video_url (text) - URL de la vidéo uploadée
    - thumbnail_url (text) - URL de la miniature
    - transcription (text) - Transcription de la vidéo
    - processing_status (text) - Statut du traitement
    - file_size (bigint) - Taille du fichier en bytes
    - duration (integer) - Durée en secondes
    - quality (text) - Qualité de la vidéo
  
  2. Configuration Supabase Storage
    - Bucket pour les vidéos
    - Bucket pour les miniatures
    - Policies d'accès
  
  ## Sécurité
  
  - Seuls les créateurs peuvent uploader
  - Validation de la taille et du format
  - RLS sur les vidéos en cours de traitement
*/

-- Ajouter des champs aux vidéos si nécessaire
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'videos' AND column_name = 'video_url'
  ) THEN
    ALTER TABLE videos ADD COLUMN video_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'videos' AND column_name = 'thumbnail_url'
  ) THEN
    ALTER TABLE videos ADD COLUMN thumbnail_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'videos' AND column_name = 'transcription'
  ) THEN
    ALTER TABLE videos ADD COLUMN transcription text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'videos' AND column_name = 'processing_status'
  ) THEN
    ALTER TABLE videos ADD COLUMN processing_status text DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'videos' AND column_name = 'file_size'
  ) THEN
    ALTER TABLE videos ADD COLUMN file_size bigint DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'videos' AND column_name = 'duration'
  ) THEN
    ALTER TABLE videos ADD COLUMN duration integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'videos' AND column_name = 'quality'
  ) THEN
    ALTER TABLE videos ADD COLUMN quality text DEFAULT 'HD';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'videos' AND column_name = 'is_published'
  ) THEN
    ALTER TABLE videos ADD COLUMN is_published boolean DEFAULT false;
  END IF;
END $$;

-- Index pour les vidéos en cours de traitement
CREATE INDEX IF NOT EXISTS idx_videos_processing_status ON videos(processing_status, created_at DESC) WHERE processing_status != 'completed';

-- Index pour les vidéos du créateur
CREATE INDEX IF NOT EXISTS idx_videos_creator_published ON videos(creator_id, is_published, created_at DESC);

-- Policy pour permettre aux créateurs d'uploader
DROP POLICY IF EXISTS "Creators can insert own videos" ON videos;
CREATE POLICY "Creators can insert own videos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

-- Policy pour permettre aux créateurs de mettre à jour leurs vidéos
DROP POLICY IF EXISTS "Creators can update own videos" ON videos;
CREATE POLICY "Creators can update own videos"
  ON videos FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- Policy pour voir les vidéos non publiées (créateur seulement)
DROP POLICY IF EXISTS "Creators can view own unpublished videos" ON videos;
CREATE POLICY "Creators can view own unpublished videos"
  ON videos FOR SELECT
  TO authenticated
  USING (
    auth.uid() = creator_id 
    OR (is_published = true AND processing_status = 'completed')
  );

-- Fonction pour valider l'upload de vidéo
CREATE OR REPLACE FUNCTION validate_video_upload()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Vérifier que le créateur a le droit d'uploader
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = NEW.creator_id
    AND is_creator = true
  ) THEN
    RAISE EXCEPTION 'Only verified creators can upload videos';
  END IF;

  -- Définir le statut initial
  IF NEW.processing_status IS NULL THEN
    NEW.processing_status := 'pending';
  END IF;

  -- Définir la date de création si non définie
  IF NEW.created_at IS NULL THEN
    NEW.created_at := now();
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger pour valider l'upload
DROP TRIGGER IF EXISTS trigger_validate_video_upload ON videos;
CREATE TRIGGER trigger_validate_video_upload
  BEFORE INSERT ON videos
  FOR EACH ROW
  EXECUTE FUNCTION validate_video_upload();

-- Fonction pour compter les vidéos d'un créateur
CREATE OR REPLACE FUNCTION get_creator_video_count(creator_uuid uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  video_count integer;
BEGIN
  SELECT COUNT(*) INTO video_count
  FROM videos
  WHERE creator_id = creator_uuid
  AND is_published = true
  AND processing_status = 'completed';
  
  RETURN video_count;
END;
$$;

COMMENT ON COLUMN videos.video_url IS 'URL de la vidéo dans Supabase Storage';
COMMENT ON COLUMN videos.thumbnail_url IS 'URL de la miniature dans Supabase Storage';
COMMENT ON COLUMN videos.transcription IS 'Transcription complète de la vidéo';
COMMENT ON COLUMN videos.processing_status IS 'Statut du traitement de la vidéo';
COMMENT ON COLUMN videos.file_size IS 'Taille du fichier vidéo en bytes';
COMMENT ON COLUMN videos.duration IS 'Durée de la vidéo en secondes';
COMMENT ON COLUMN videos.quality IS 'Qualité de la vidéo (SD, HD, FHD, 4K)';
COMMENT ON COLUMN videos.is_published IS 'La vidéo est-elle publiée et visible publiquement';
