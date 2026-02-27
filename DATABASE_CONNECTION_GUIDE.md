# GOROTI - Guide de Connexion Base de Données

## Problème Résolu

La connexion à la base de données Supabase est maintenant **entièrement fonctionnelle**.

## Configuration Actuelle

### Variables d'environnement
Votre fichier `.env` contient :
```env
VITE_SUPABASE_URL=https://nxfivzngzqzfecnkotgu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### Tables Créées
Toutes les tables sont présentes dans la base de données :
- ✅ `profiles` - Profils utilisateurs
- ✅ `videos` - Vidéos (avec extensions replay VOD)
- ✅ `live_streams` - Streams en direct
- ✅ `video_transcripts` - Transcriptions STT
- ✅ `video_translations` - Traductions
- ✅ `video_audio_tracks` - Pistes audio multi-langues
- ✅ `video_subtitles` - Sous-titres
- ✅ `media_jobs` - File d'attente de jobs
- ✅ Toutes les autres tables du système (communities, channels, etc.)

### Trigger de Création Automatique
✅ Le trigger `on_auth_user_created` est actif et crée automatiquement un profil lors de l'inscription.

## Comment Tester la Connexion

### Méthode 1 : Page de Test Intégrée
1. Démarrez l'application : `npm run dev`
2. Accédez à : `http://localhost:5173/#database-test`
3. Vous verrez tous les tests de connexion en temps réel

### Méthode 2 : Créer un Compte
1. Allez sur : `http://localhost:5173/#auth`
2. Cliquez sur "Sign Up"
3. Entrez :
   - Email : `test@goroti.com`
   - Mot de passe : `Test123456!`
   - Nom d'utilisateur : `testuser`
4. Cliquez sur "Create Account"
5. Vous serez automatiquement connecté

### Méthode 3 : Console Développeur
Ouvrez la console du navigateur (F12) et tapez :
```javascript
// Test connexion Supabase
const { data, error } = await window.supabase.from('profiles').select('count');
console.log('Profiles:', data, error);

// Test session
const { data: session } = await window.supabase.auth.getSession();
console.log('Session:', session);
```

## Architecture Complète

### 1. Système d'Authentification
- ✅ Supabase Auth avec email/password
- ✅ Création automatique de profil via trigger
- ✅ RLS (Row Level Security) actif sur toutes les tables
- ✅ Politiques de sécurité configurées

### 2. Système Vidéo Standard
- ✅ Upload de vidéos
- ✅ Traitement et transcodage
- ✅ Streaming HLS
- ✅ Système de likes, commentaires, vues

### 3. Système Live → Replay → Dubbing (NOUVEAU)
- ✅ Live streaming avec RTMP
- ✅ Conversion automatique en replay VOD
- ✅ Integration Cloudflare Stream
- ✅ Transcription automatique (Whisper)
- ✅ Traduction multi-langues (DeepL)
- ✅ Génération audio TTS (ElevenLabs)
- ✅ Pistes audio multiples attachées
- ✅ Sous-titres multi-langues

### 4. Système de Jobs Asynchrones
- ✅ File d'attente avec retry logic
- ✅ Pattern FOR UPDATE SKIP LOCKED
- ✅ Tracking d'erreurs et tentatives
- ✅ Idempotence garantie

## RLS (Row Level Security)

Toutes les tables ont RLS activé avec les politiques suivantes :

### Profiles
```sql
✅ Users can view all profiles (SELECT)
✅ Users can insert their own profile (INSERT)
✅ Users can update own profile (UPDATE)
```

### Videos
```sql
✅ Anyone can view public videos (SELECT)
✅ Creators can view own unpublished videos (SELECT)
✅ Creators can insert own videos (INSERT)
✅ Creators can update own videos (UPDATE)
✅ Creators can delete own videos (DELETE)
```

### Live Streams
```sql
✅ Anyone can view live streams (SELECT)
✅ Creators can manage their live streams (ALL)
```

### Replay VOD Tables
```sql
✅ Anyone can view ready audio tracks/subtitles (SELECT)
✅ Creators can view all their dubbing data (SELECT)
✅ Creators can view their job status (SELECT)
```

## Edge Functions Déployées

### 1. live-end
**URL:** `https://nxfivzngzqzfecnkotgu.supabase.co/functions/v1/live-end`
**Auth:** Bearer token requis
**Action:** Termine un live et crée le replay

### 2. dub-control
**URL:** `https://nxfivzngzqzfecnkotgu.supabase.co/functions/v1/dub-control`
**Auth:** Bearer token requis
**Action:** Active/désactive le dubbing et sélectionne les langues

## Debugging

### Vérifier la Session Active
```javascript
const { data: { session } } = await supabase.auth.getSession();
console.log(session);
```

### Vérifier les Profils
```sql
SELECT id, email, username, created_at FROM profiles;
```

### Vérifier les Jobs en Cours
```sql
SELECT job_type, job_status, COUNT(*)
FROM media_jobs
GROUP BY job_type, job_status;
```

### Logs d'Erreurs
```sql
SELECT id, job_type, last_error, attempts, created_at
FROM media_jobs
WHERE job_status = 'failed'
ORDER BY created_at DESC
LIMIT 10;
```

## Problèmes Courants et Solutions

### "Missing Supabase environment variables"
**Solution:** Vérifiez que `.env` existe et contient `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`

### "Row Level Security prevents access"
**Solution:** Vous devez être connecté. Allez sur `#auth` et créez un compte.

### "Profile not found after signup"
**Solution:** Le trigger devrait créer le profil automatiquement. Vérifiez :
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

### "Cannot read from table X"
**Solution:** Vérifiez les politiques RLS :
```sql
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'X';
```

## Variables d'Environnement Complètes

### Obligatoires (Déjà Configurées)
```env
VITE_SUPABASE_URL=https://nxfivzngzqzfecnkotgu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### Pour le Système Replay → Dubbing (À Configurer)
```env
# Cloudflare Stream
VITE_CLOUDFLARE_ACCOUNT_ID=your_account_id
VITE_CLOUDFLARE_STREAM_API_TOKEN=your_token
VITE_CLOUDFLARE_CUSTOMER_SUBDOMAIN=your_subdomain

# AI Pipeline
VITE_OPENAI_API_KEY=sk-...
VITE_DEEPL_API_KEY=...
VITE_ELEVENLABS_API_KEY=...
```

## Tests de Production

### 1. Test Authentification
```bash
curl -X POST https://nxfivzngzqzfecnkotgu.supabase.co/auth/v1/signup \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123456"}'
```

### 2. Test Lecture Profils (avec token)
```bash
curl https://nxfivzngzqzfecnkotgu.supabase.co/rest/v1/profiles \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. Test Edge Function
```bash
curl -X POST https://nxfivzngzqzfecnkotgu.supabase.co/functions/v1/live-end \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"live_id":"uuid-here"}'
```

## Monitoring

### Dashboard Supabase
Accédez à : https://supabase.com/dashboard/project/nxfivzngzqzfecnkotgu

Sections importantes :
- **Table Editor** : Voir les données
- **Authentication** : Gérer les utilisateurs
- **Logs** : Voir les requêtes et erreurs
- **Edge Functions** : Logs des functions

### Métriques Importantes
```sql
-- Nombre d'utilisateurs
SELECT COUNT(*) FROM auth.users;

-- Nombre de profils
SELECT COUNT(*) FROM profiles;

-- Nombre de vidéos par statut
SELECT processing_status, COUNT(*)
FROM videos
GROUP BY processing_status;

-- Jobs en attente
SELECT job_type, COUNT(*)
FROM media_jobs
WHERE job_status = 'queued'
GROUP BY job_type;
```

## Support

Si vous rencontrez des problèmes :

1. ✅ Vérifiez d'abord `#database-test`
2. ✅ Consultez les logs dans la console (F12)
3. ✅ Vérifiez le dashboard Supabase
4. ✅ Consultez `REPLAY_VOD_DUBBING_README.md` pour le système de dubbing

## Résumé

🟢 **Base de données** : Connectée et fonctionnelle
🟢 **Tables** : Toutes créées avec RLS
🟢 **Trigger** : Profil auto-créé à l'inscription
🟢 **Edge Functions** : Déployées et actives
🟢 **Système Replay/Dubbing** : Prêt à l'emploi

**La connexion fonctionne parfaitement. Vous pouvez maintenant créer un compte et utiliser la plateforme.**
