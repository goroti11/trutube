export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
  confidence?: number;
}

export interface STTProvider {
  transcribe(audioUrl: string, language?: string): Promise<TranscriptSegment[]>;
}

export interface TranslationProvider {
  translate(segments: TranscriptSegment[], targetLanguage: string, sourceLanguage: string): Promise<TranscriptSegment[]>;
}

export interface TTSProvider {
  synthesize(segments: TranscriptSegment[], language: string, voiceId?: string): Promise<Blob>;
}

class WhisperSTTProvider implements STTProvider {
  private apiKey: string;
  private apiEndpoint: string;

  constructor(apiKey: string, apiEndpoint?: string) {
    this.apiKey = apiKey;
    this.apiEndpoint = apiEndpoint || 'https://api.openai.com/v1/audio/transcriptions';
  }

  async transcribe(audioUrl: string, language?: string): Promise<TranscriptSegment[]> {
    const audioResponse = await fetch(audioUrl);
    const audioBlob = await response.blob();

    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.mp3');
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'verbose_json');
    if (language) {
      formData.append('language', language);
    }

    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Whisper API error: ${response.status}`);
    }

    const data = await response.json();

    return (data.segments || []).map((seg: any) => ({
      start: seg.start,
      end: seg.end,
      text: seg.text.trim(),
      confidence: seg.confidence || seg.no_speech_prob ? 1 - seg.no_speech_prob : undefined,
    }));
  }
}

class DeepLTranslationProvider implements TranslationProvider {
  private apiKey: string;
  private apiEndpoint: string;

  constructor(apiKey: string, pro: boolean = false) {
    this.apiKey = apiKey;
    this.apiEndpoint = pro
      ? 'https://api.deepl.com/v2/translate'
      : 'https://api-free.deepl.com/v2/translate';
  }

  async translate(
    segments: TranscriptSegment[],
    targetLanguage: string,
    sourceLanguage: string
  ): Promise<TranscriptSegment[]> {
    const texts = segments.map(s => s.text);

    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: texts,
        target_lang: targetLanguage.toUpperCase(),
        source_lang: sourceLanguage.toUpperCase(),
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepL API error: ${response.status}`);
    }

    const data = await response.json();
    const translations = data.translations || [];

    return segments.map((seg, i) => ({
      ...seg,
      text: translations[i]?.text || seg.text,
    }));
  }
}

class ElevenLabsTTSProvider implements TTSProvider {
  private apiKey: string;
  private apiEndpoint: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.apiEndpoint = 'https://api.elevenlabs.io/v1';
  }

  async synthesize(
    segments: TranscriptSegment[],
    language: string,
    voiceId: string = 'default'
  ): Promise<Blob> {
    const fullText = segments.map(s => s.text).join(' ');

    const response = await fetch(`${this.apiEndpoint}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: fullText,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    return response.blob();
  }
}

export class AIPipelineService {
  private sttProvider: STTProvider;
  private translationProvider: TranslationProvider;
  private ttsProvider: TTSProvider;

  constructor(
    sttProvider: STTProvider,
    translationProvider: TranslationProvider,
    ttsProvider: TTSProvider
  ) {
    this.sttProvider = sttProvider;
    this.translationProvider = translationProvider;
    this.ttsProvider = ttsProvider;
  }

  async transcribe(audioUrl: string, language?: string): Promise<TranscriptSegment[]> {
    return this.sttProvider.transcribe(audioUrl, language);
  }

  async translate(
    segments: TranscriptSegment[],
    targetLanguage: string,
    sourceLanguage: string
  ): Promise<TranscriptSegment[]> {
    return this.translationProvider.translate(segments, targetLanguage, sourceLanguage);
  }

  async synthesize(
    segments: TranscriptSegment[],
    language: string,
    voiceId?: string
  ): Promise<Blob> {
    return this.ttsProvider.synthesize(segments, language, voiceId);
  }
}

export function createAIPipelineService(): AIPipelineService | null {
  const whisperKey = import.meta.env.VITE_OPENAI_API_KEY;
  const deeplKey = import.meta.env.VITE_DEEPL_API_KEY;
  const elevenLabsKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

  if (!whisperKey || !deeplKey || !elevenLabsKey) {
    console.warn('AI Pipeline not fully configured');
    return null;
  }

  return new AIPipelineService(
    new WhisperSTTProvider(whisperKey),
    new DeepLTranslationProvider(deeplKey),
    new ElevenLabsTTSProvider(elevenLabsKey)
  );
}

export function generateVTT(segments: TranscriptSegment[]): string {
  let vtt = 'WEBVTT\n\n';

  segments.forEach((seg, index) => {
    const startTime = formatVTTTime(seg.start);
    const endTime = formatVTTTime(seg.end);
    vtt += `${index + 1}\n${startTime} --> ${endTime}\n${seg.text}\n\n`;
  });

  return vtt;
}

function formatVTTTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}
