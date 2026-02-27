# GOROTI Live → Replay VOD → Auto Dubbing System

## Overview

Production-ready pipeline that converts live streams into replay VODs with automatic multi-language dubbing using Cloudflare Stream for video delivery and AI services for transcription, translation, and text-to-speech.

## Architecture

```
Live Stream Ends
    ↓
Create Replay Video Record
    ↓
Enqueue replay_finalize Job
    ↓
Upload to Cloudflare Stream (VOD)
    ↓
STT (Speech-to-Text) → Transcription
    ↓
Translation (per target language)
    ↓
TTS (Text-to-Speech) → Generate Audio
    ↓
Attach Audio Tracks to Cloudflare Stream
    ↓
Generate & Attach Captions (VTT)
    ↓
Replay Ready with Multi-Audio
```

## Required Environment Variables

### Cloudflare Stream
```env
VITE_CLOUDFLARE_ACCOUNT_ID=your_account_id
VITE_CLOUDFLARE_STREAM_API_TOKEN=your_api_token
VITE_CLOUDFLARE_CUSTOMER_SUBDOMAIN=your_subdomain (optional)
```

### AI Pipeline Services
```env
# For Speech-to-Text (Whisper)
VITE_OPENAI_API_KEY=sk-...

# For Translation
VITE_DEEPL_API_KEY=your_deepl_key

# For Text-to-Speech
VITE_ELEVENLABS_API_KEY=your_elevenlabs_key
```

## Database Schema

The system creates the following tables:

- **live_streams** - Live streaming sessions
- **video_transcripts** - STT results with timestamps
- **video_translations** - Translated text segments
- **video_audio_tracks** - Generated audio tracks (TTS)
- **video_subtitles** - Caption files (VTT format)
- **media_jobs** - Async job queue with retry logic

Extended **videos** table with:
- `cloudflare_uid` - Cloudflare Stream video UID
- `playback_hls_url` - HLS playback URL
- `is_replay` - Boolean flag for replay videos
- `source_live_id` - Link to source live stream
- `dub_status` - Overall dubbing status

## Edge Functions

### 1. live-end
**Endpoint:** `/functions/v1/live-end`
**Auth:** Required (creator only)
**Purpose:** End a live stream and create replay video

**Request:**
```json
{
  "live_id": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "video_id": "uuid",
  "message": "Live ended, replay processing started"
}
```

### 2. dub-control
**Endpoint:** `/functions/v1/dub-control`
**Auth:** Required (creator only)
**Purpose:** Enable/disable dubbing and select target languages

**Request (Enable Dubbing):**
```json
{
  "video_id": "uuid",
  "enabled": true,
  "languages": ["fr", "es", "de"],
  "voice_type": "standard"
}
```

**Request (Retry Failed Job):**
```json
{
  "action": "retry_job",
  "job_id": "uuid"
}
```

## Job Queue System

### Job Types
1. **replay_finalize** - Upload video to Cloudflare Stream
2. **stt** - Transcribe audio to text with timestamps
3. **translate** - Translate to target language
4. **tts** - Generate audio from translated text
5. **attach_audio** - Attach audio track to Cloudflare Stream
6. **attach_captions** - Attach VTT captions to Cloudflare Stream

### Job Processing
Jobs are processed by a worker function that:
- Uses `FOR UPDATE SKIP LOCKED` for concurrent safety
- Implements retry logic (max 3 attempts)
- Tracks status: queued → processing → done/failed
- Stores detailed error messages

### Worker Implementation
The worker should run on a schedule (e.g., every 30 seconds):

```typescript
// Pseudocode for worker
while (true) {
  const job = await lockNextJob(['replay_finalize', 'stt', 'translate', 'tts', 'attach_audio', 'attach_captions']);

  if (job) {
    try {
      await processJob(job);
      await markJobDone(job.id);
    } catch (error) {
      await markJobFailed(job.id, error.message);
    }
  }

  await sleep(30000); // 30 seconds
}
```

## Frontend Integration

### 1. Live Studio UI
Add `ReplayDubPanel` component to Live Studio:

```tsx
import ReplayDubPanel from '../components/studio/live/ReplayDubPanel';

// In LiveStudioPage or CreatorStudioPage
<ReplayDubPanel liveId={currentLiveId} />
```

### 2. Watch Page Multi-Audio Player
The existing `MultiAudioPlayer` component automatically works with replay videos that have multiple audio tracks.

**Usage in WatchPage:**
```tsx
import MultiAudioPlayer from '../components/video/MultiAudioPlayer';

// In video player controls
<MultiAudioPlayer videoId={videoId} onLanguageChange={handleLanguageChange} />
```

### 3. Service Usage

```typescript
import { replayDubbingService } from '../services/replayDubbingService';

// End live and create replay
const result = await replayDubbingService.endLive(liveId);

// Get replay status
const status = await replayDubbingService.getReplayStatus(videoId);

// Enable dubbing for specific languages
await replayDubbingService.setDubOptions(videoId, {
  enabled: true,
  languages: ['fr', 'es', 'de'],
  voice_type: 'standard',
});

// Retry failed job
await replayDubbingService.retryFailedJob(jobId);
```

## Cloudflare Stream Integration

### Video Upload
Videos are uploaded to Cloudflare Stream via URL or direct upload.

### Multi-Audio Tracks
Audio tracks are added using the Cloudflare Stream API:
```
POST /accounts/{account_id}/stream/{video_uid}/audio
{
  "url": "https://storage.url/audio.mp3",
  "language": "fr",
  "label": "Français (AI)"
}
```

### Captions
Captions are added as VTT files:
```
PUT /accounts/{account_id}/stream/{video_uid}/captions/{language}
{
  "url": "https://storage.url/captions.vtt",
  "label": "Français"
}
```

### Playback
HLS playlist URL:
```
https://{subdomain}.cloudflarestream.com/{uid}/manifest/video.m3u8
```

## Security & RLS

- All tables have Row Level Security enabled
- Creators can only access their own videos/jobs
- Public users can only access published replay videos
- Service role key used only in edge functions
- Never expose API tokens to client

## Idempotency & Transactions

- Live end is idempotent (calling twice won't duplicate)
- Job insertion uses `ON CONFLICT DO NOTHING`
- Status updates use row-level locks where needed
- Worker uses `FOR UPDATE SKIP LOCKED` for concurrent safety

## Monitoring & Debugging

### Check Job Status
```sql
SELECT
  job_type,
  job_status,
  COUNT(*)
FROM media_jobs
WHERE video_id = 'your-video-id'
GROUP BY job_type, job_status;
```

### Check Failed Jobs
```sql
SELECT
  id,
  job_type,
  last_error,
  attempts,
  created_at
FROM media_jobs
WHERE job_status = 'failed'
ORDER BY created_at DESC
LIMIT 10;
```

### View Replay Processing Progress
```sql
SELECT
  v.id,
  v.title,
  v.dub_status,
  COUNT(DISTINCT vat.language_code) as audio_tracks,
  COUNT(DISTINCT vs.language_code) as subtitles
FROM videos v
LEFT JOIN video_audio_tracks vat ON vat.video_id = v.id AND vat.job_status = 'ready'
LEFT JOIN video_subtitles vs ON vs.video_id = v.id AND vs.job_status = 'ready'
WHERE v.is_replay = true
GROUP BY v.id, v.title, v.dub_status;
```

## Testing End-to-End

1. **Start a Live Stream**
   - Create live stream record
   - Start streaming via RTMP

2. **End the Live**
   ```typescript
   await replayDubbingService.endLive(liveId);
   ```

3. **Monitor Replay Creation**
   - Check `videos` table for new replay record
   - Check `media_jobs` for `replay_finalize` job

4. **Enable Dubbing**
   ```typescript
   await replayDubbingService.setDubOptions(videoId, {
     enabled: true,
     languages: ['fr', 'es'],
   });
   ```

5. **Watch Jobs Process**
   - Monitor job queue
   - Check for errors in `last_error` column

6. **Verify Playback**
   - Open Watch page for replay video
   - Test language switching in player

## Troubleshooting

### Jobs Stuck in "processing"
- Check if worker is running
- Look for locked_at timestamp (stale locks > 10 minutes)
- Reset manually if needed:
  ```sql
  UPDATE media_jobs
  SET job_status = 'queued', locked_at = NULL, locked_by = NULL
  WHERE job_status = 'processing' AND locked_at < now() - interval '10 minutes';
  ```

### Audio Track Not Appearing
- Verify Cloudflare Stream API response
- Check `video_audio_tracks.cloudflare_track_id` is populated
- Verify audio URL is publicly accessible

### Transcription Errors
- Check audio format (must be compatible with Whisper)
- Verify OpenAI API key is valid
- Check API rate limits

## Performance Considerations

- Large videos take longer to process
- STT can take 10-30% of video duration
- TTS depends on text length
- Parallel job processing recommended
- Consider regional Cloudflare storage

## Cost Optimization

- Enable dubbing only for videos with high view potential
- Use standard voices instead of premium for most content
- Batch process during off-peak hours
- Cache translated segments for re-use
- Monitor API usage across providers

## Future Enhancements

- [ ] Voice cloning for creator's own voice
- [ ] Lip sync video generation
- [ ] Real-time translation during live
- [ ] Auto-detect optimal languages based on audience
- [ ] Quality scoring for translations
- [ ] Manual transcript editing UI
- [ ] Batch replay processing
- [ ] Analytics for multi-language viewership
