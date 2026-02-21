import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  ArrowRight,
  Compass,
  ExternalLink,
  ArrowLeft,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { flowService } from '../../services/flowService';
import { watchSessionService } from '../../services/watchSessionService';
import type {
  FlowPlayerState,
  FlowEvent,
  FlowNextRequest,
} from '../../types/flow';

interface FlowPlayerProps {
  flowId: string;
  onExitToFullVideo: (videoId: string, timestamp: number) => void;
  onBackToLongVideo?: (lastNodeId: string) => void;
  userId: string | null;
}

interface EventBatch {
  events: FlowEvent[];
  lastSentAt: number;
}

const BATCH_INTERVAL_MS = 5000;
const MAX_BATCH_SIZE = 20;

export default function FlowPlayer({
  flowId,
  onExitToFullVideo,
  onBackToLongVideo,
  userId,
}: FlowPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const eventBatchRef = useRef<EventBatch>({ events: [], lastSentAt: Date.now() });
  const watchSessionIdRef = useRef<string | null>(null);
  const watchTimeRef = useRef<number>(0);
  const interactionsRef = useRef<number>(0);

  const [state, setState] = useState<FlowPlayerState>({
    currentNode: null,
    currentVideo: null,
    flowId: null,
    sessionId: null,
    jumpToSeconds: 0,
    isLoading: true,
    error: null,
    hasNextNode: true,
    lastNodeId: null,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [clipProgress, setClipProgress] = useState(0);

  const addEventToBatch = useCallback(
    (event: FlowEvent) => {
      eventBatchRef.current.events.push(event);

      if (
        eventBatchRef.current.events.length >= MAX_BATCH_SIZE ||
        Date.now() - eventBatchRef.current.lastSentAt >= BATCH_INTERVAL_MS
      ) {
        flushEvents();
      }
    },
    [state.flowId, state.sessionId]
  );

  const flushEvents = useCallback(async () => {
    if (!state.flowId || !state.sessionId || eventBatchRef.current.events.length === 0) {
      return;
    }

    const eventsToSend = [...eventBatchRef.current.events];
    eventBatchRef.current.events = [];
    eventBatchRef.current.lastSentAt = Date.now();

    try {
      await flowService.sendEvents({
        flow_id: state.flowId,
        session_id: state.sessionId,
        events: eventsToSend,
      });
    } catch (error) {
      console.error('Failed to send events:', error);
    }
  }, [state.flowId, state.sessionId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        eventBatchRef.current.events.length > 0 &&
        Date.now() - eventBatchRef.current.lastSentAt >= BATCH_INTERVAL_MS
      ) {
        flushEvents();
      }
    }, BATCH_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      flushEvents();
    };
  }, [flushEvents]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      flushEvents();
      if (watchSessionIdRef.current) {
        watchSessionService.updateSession(
          watchSessionIdRef.current,
          watchTimeRef.current,
          interactionsRef.current
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [flushEvents]);

  useEffect(() => {
    loadInitialFlow();
  }, [flowId]);

  const loadInitialFlow = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await flowService.resumeFlow({ flow_id: flowId });

      setState({
        currentNode: response.node,
        currentVideo: response.video,
        flowId: response.flow_id,
        sessionId: response.session_id,
        jumpToSeconds: response.jump_to_seconds,
        isLoading: false,
        error: null,
        hasNextNode: true,
        lastNodeId: response.node.id,
      });

      const sessionId = await watchSessionService.startSession(
        response.video.id,
        userId
      );
      watchSessionIdRef.current = sessionId;
      watchTimeRef.current = 0;
      interactionsRef.current = 0;

      const viewEvent = flowService.createEvent('view', response.node.id);
      addEventToBatch(viewEvent);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load flow',
      }));
    }
  };

  const loadNextNode = async (mode: FlowNextRequest['mode']) => {
    if (!state.currentNode || !state.flowId) return;

    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const response = await flowService.getNextNode({
        flow_id: state.flowId,
        current_node_id: state.currentNode.id,
        mode,
      });

      if (!response.success || !response.next_node || !response.video) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          hasNextNode: false,
          error: response.reason || 'No more nodes available',
        }));
        return;
      }

      if (watchSessionIdRef.current) {
        await watchSessionService.updateSession(
          watchSessionIdRef.current,
          watchTimeRef.current,
          interactionsRef.current
        );
      }

      const sessionId = await watchSessionService.startSession(
        response.video.id,
        userId
      );
      watchSessionIdRef.current = sessionId;
      watchTimeRef.current = 0;
      interactionsRef.current = 0;

      setState((prev) => ({
        ...prev,
        currentNode: response.next_node,
        currentVideo: response.video,
        jumpToSeconds: response.jump_to_seconds || 0,
        isLoading: false,
        error: null,
        lastNodeId: response.next_node?.id || prev.lastNodeId,
      }));

      setCurrentTime(0);
      setIsPlaying(false);

      const viewEvent = flowService.createEvent('view', response.next_node.id);
      addEventToBatch(viewEvent);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load next node',
      }));
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !state.currentNode) return;

    const clipStart = state.currentNode.clip.start_time;
    const clipEnd = state.currentNode.clip.end_time;
    const clipDuration = clipEnd - clipStart;

    const handleTimeUpdate = () => {
      const adjustedTime = video.currentTime - clipStart;
      setCurrentTime(adjustedTime);
      setClipProgress((adjustedTime / clipDuration) * 100);

      if (isPlaying) {
        watchTimeRef.current += 0.1;
      }

      if (video.currentTime >= clipEnd) {
        video.pause();
        setIsPlaying(false);

        const completeEvent = flowService.createEvent(
          'view',
          state.currentNode?.id,
          {
            watch_seconds: clipDuration,
            completed: true,
          }
        );
        addEventToBatch(completeEvent);

        loadNextNode('auto');
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(clipDuration);
      video.currentTime = clipStart;
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [state.currentNode, isPlaying, addEventToBatch]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video || !state.currentNode) return;

    if (isPlaying) {
      video.pause();
      const pauseEvent = flowService.createEvent('pause', state.currentNode.id, {
        watch_seconds: Math.floor(currentTime),
      });
      addEventToBatch(pauseEvent);
    } else {
      video.play();
      const resumeEvent = flowService.createEvent('resume', state.currentNode.id);
      addEventToBatch(resumeEvent);
    }
    setIsPlaying(!isPlaying);
    interactionsRef.current += 1;
  };

  const handleContinue = () => {
    interactionsRef.current += 1;
    const event = flowService.createEvent('swipe_up', state.currentNode?.id);
    addEventToBatch(event);
    loadNextNode('continue');
  };

  const handleExplore = () => {
    interactionsRef.current += 1;
    const event = flowService.createEvent('swipe_left', state.currentNode?.id);
    addEventToBatch(event);
    loadNextNode('explore');
  };

  const handleFullVideo = () => {
    if (!state.currentVideo) return;

    interactionsRef.current += 1;
    const event = flowService.createEvent('full_video_click', state.currentNode?.id);
    addEventToBatch(event);
    flushEvents();

    if (watchSessionIdRef.current) {
      watchSessionService.updateSession(
        watchSessionIdRef.current,
        watchTimeRef.current,
        interactionsRef.current
      );
    }

    onExitToFullVideo(state.currentVideo.id, state.jumpToSeconds);
  };

  const handleBack = () => {
    if (state.lastNodeId && onBackToLongVideo) {
      flushEvents();
      onBackToLongVideo(state.lastNodeId);
    }
  };

  const handleCTA = () => {
    if (!state.currentNode?.clip.cta_url) return;

    interactionsRef.current += 1;
    const event = flowService.createEvent('cta_click', state.currentNode.id);
    addEventToBatch(event);

    window.open(state.currentNode.clip.cta_url, '_blank');
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      interactionsRef.current += 1;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (state.isLoading && !state.currentNode) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Loading flow...</p>
        </div>
      </div>
    );
  }

  if (state.error && !state.currentNode) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-center p-6">
          <p className="text-red-500 mb-4">{state.error}</p>
          <button
            onClick={loadInitialFlow}
            className="px-6 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!state.currentNode || !state.currentVideo) {
    return null;
  }

  return (
    <div className="relative w-full h-full bg-black">
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        src={state.currentVideo.video_url}
        onClick={togglePlay}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 pointer-events-none" />

      <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-auto">
        <div className="flex-1 pr-4">
          <h2 className="text-white font-bold text-lg line-clamp-2 drop-shadow-lg">
            {state.currentNode.clip.title}
          </h2>
          {state.currentNode.clip.description && (
            <p className="text-white/90 text-sm mt-1 line-clamp-2 drop-shadow-lg">
              {state.currentNode.clip.description}
            </p>
          )}
        </div>
        <button
          onClick={toggleMute}
          className="w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      <div className="absolute top-20 left-4 right-4 h-1 bg-white/20 rounded-full overflow-hidden pointer-events-none">
        <div
          className="h-full bg-primary-500 transition-all duration-100"
          style={{ width: `${clipProgress}%` }}
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6 space-y-4 pointer-events-auto">
        <div className="flex items-center justify-between text-white text-sm">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleContinue}
            disabled={state.isLoading || !state.hasNextNode}
            className="flex items-center justify-center gap-2 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
            Continue
          </button>

          <button
            onClick={handleExplore}
            disabled={state.isLoading || !state.hasNextNode}
            className="flex items-center justify-center gap-2 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
          >
            <Compass className="w-5 h-5" />
            Explore
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleFullVideo}
            className="flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg font-semibold transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            Full Video
          </button>

          {onBackToLongVideo && (
            <button
              onClick={handleBack}
              className="flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg font-semibold transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          )}

          {!onBackToLongVideo && state.currentNode.clip.cta_text && state.currentNode.clip.cta_url && (
            <button
              onClick={handleCTA}
              className="flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-colors"
            >
              <SkipForward className="w-5 h-5" />
              {state.currentNode.clip.cta_text}
            </button>
          )}
        </div>

        {!state.hasNextNode && (
          <div className="text-center text-white/70 text-sm">
            End of flow reached
          </div>
        )}
      </div>
    </div>
  );
}
