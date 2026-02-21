# FLOW System Implementation

Complete implementation of the FLOW interactive video clip navigation system for GOROTI platform.

## Backend Implementation

### Edge Functions Deployed

#### 1. flow-resume
**Endpoint:** `POST /functions/v1/flow-resume`

**Request:**
```typescript
{
  flow_id: string (UUID)
}
```

**Response:**
```typescript
{
  flow_id: string;
  session_id: string;
  node: FlowNode;
  video: FlowVideo;
  jump_to_seconds: number;
  has_previous_progress: boolean;
}
```

**Features:**
- Authenticates user via Supabase JWT
- Checks for existing progress and resumes from last node
- Falls back to entry nodes or lowest sequence_hint
- Fully hydrates node with clip, video, and jump timestamp data
- Creates new flow session if needed
- Uses Zod validation for strict request typing

#### 2. flow-next
**Endpoint:** `POST /functions/v1/flow-next`

**Request:**
```typescript
{
  flow_id: string (UUID);
  current_node_id: string (UUID);
  mode: 'continue' | 'explore' | 'auto';
}
```

**Response:**
```typescript
{
  success: boolean;
  next_node: FlowNode | null;
  video: FlowVideo | null;
  jump_to_seconds: number | null;
  reason: string | null;
}
```

**Features:**
- Loads outgoing edges ordered by weight
- Supports mode filtering: continue-only, explore-only, or auto
- Auto mode prioritizes: continue → explore → recap
- Excludes already-viewed nodes via flow_node_progress
- Returns best weighted match or null with reason

#### 3. flow-events
**Endpoint:** `POST /functions/v1/flow-events`

**Request:**
```typescript
{
  flow_id: string (UUID);
  session_id: string (UUID);
  events: FlowEvent[] (max 50);
}
```

**Event Schema:**
```typescript
{
  client_event_id: string (UUID);
  node_id?: string (UUID);
  event_type: 'view' | 'swipe_up' | 'swipe_down' | 'swipe_left' |
              'swipe_right' | 'cta_click' | 'full_video_click' |
              'like' | 'comment' | 'share' | 'pause' | 'resume' |
              'seek' | 'quality_change' | 'exit';
  watch_seconds?: number;
  completed?: boolean;
  occurred_at?: string (ISO8601);
  event_data?: Record<string, unknown>;
}
```

**Response:**
```typescript
{
  success: boolean;
  processed_count: number;
  errors: string[];
}
```

**Features:**
- Validates up to 50 events per batch with strict Zod schemas
- Requires client_event_id UUID for idempotence
- Calls rpc_apply_flow_events for atomic transaction
- Updates node progress, flow progress, and session state
- Verifies session ownership before processing

### Security
- All functions require authenticated user (Supabase JWT)
- Consistent error shape: `{ code, error }` with proper HTTP status
- RLS policies respected for all database operations
- Session ownership verification before event processing

## Frontend Implementation

### Type System
**Location:** `/src/types/flow.ts`

Strict TypeScript types for:
- FlowNode, FlowClip, FlowVideo
- FlowResumeResponse, FlowNextResponse, FlowEventsResponse
- FlowEvent types and requests
- FlowPlayerState management
- FlowInfo for video metadata

No `any` types used - full type safety enforced.

### Service Layer
**Location:** `/src/services/flowService.ts`

**Methods:**
- `checkFlowForVideo(videoId)` - Check if video has active flow
- `resumeFlow(request)` - Start or resume flow session
- `getNextNode(request)` - Get next node recommendation
- `sendEvents(request)` - Batch send flow events
- `createEvent(type, nodeId, data)` - Create properly formatted event
- `generateEventId()` - Generate UUID for event tracking

**Features:**
- Automatic JWT header injection
- Error handling with typed responses
- Event batching support
- No placeholder data - real API integration only

### FlowPlayer Component
**Location:** `/src/components/video/FlowPlayer.tsx`

**Features:**
- Plays clip sequences from flow nodes
- Buttons: Continue, Explore, Full Video, Back to Flow
- Auto-advances to next node when clip completes
- Maintains watch session for anti-fake-view system
- Batched event emission (max 20 events or 5 second intervals)
- Proper cleanup on unmount
- Respects clip start/end boundaries
- Progress bar showing clip completion
- Volume controls and play/pause
- CTA button support when available

**Event Tracking:**
- `view` - Node impression
- `pause` / `resume` - Playback control
- `swipe_up` - Continue button click
- `swipe_left` - Explore button click
- `full_video_click` - Exit to long video
- `cta_click` - Call-to-action interaction
- All events include watch_seconds and completion status

**Watch Session Integration:**
- Creates new watch_session for each clip/video
- Updates watch_time_seconds continuously
- Tracks interactions_count
- Maintains device_fingerprint
- Validates sessions via existing anti-fake-view system
- NO BYPASS - full integration maintained

### Page Integrations

#### WatchPage
**Location:** `/src/pages/WatchPage.tsx`

**Integration:**
- Checks for active flow on video load
- Shows "FLOW Mode" toggle button when flow available
- Displays node count: "FLOW Mode (X clips)"
- Switches between EnhancedVideoPlayer and FlowPlayer
- Preserves last node ID for "Back to Flow" functionality
- Handles exit to full video at jump timestamp
- Supports initialFlowMode and initialFlowId props

#### VideoPlayerPage
**Location:** `/src/pages/VideoPlayerPage.tsx`

**Integration:**
- Full FLOW mode toggle with gradient button styling
- Checks flow availability on mount
- Seamless switch between VideoPlayer and FlowPlayer
- Back to Flow support after exiting
- Preserves video context during flow navigation

#### MobileVideoPage
**Location:** `/src/pages/MobileVideoPage.tsx`

**Integration:**
- Mobile-optimized FLOW controls
- Full-width FLOW toggle button
- Replaces MobileVideoPlayer when in flow mode
- Touch-friendly interface
- Maintains mobile layout consistency

## User Flow

### Starting FLOW Mode
1. User watches long-form video
2. System checks for active flow via `flowService.checkFlowForVideo()`
3. If flow exists, "FLOW Mode (X clips)" button appears
4. User clicks button to enter FLOW mode
5. `flowService.resumeFlow()` called to start/resume session
6. First clip plays with interactive controls

### Navigation
1. Clip plays automatically
2. User sees progress bar and controls
3. Options:
   - **Continue** - Next node in sequence (edge_type: continue)
   - **Explore** - Related content (edge_type: explore)
   - **Full Video** - Exit to timestamp in long video
   - **Back** - Return to long video (if previously exited)
4. System auto-advances when clip completes
5. Events batched and sent every 5 seconds or 20 events

### Exit Flow
1. User clicks "Exit FLOW" button
2. Returns to normal video player
3. Can re-enter FLOW mode anytime
4. Progress preserved in database

## Watch Session Anti-Fake-View Integration

### Critical Preservation
The FLOW system fully integrates with the existing watch_sessions system:

1. **Session Creation**
   - New session created for each clip view
   - Uses `watchSessionService.startSession(videoId, userId)`
   - Generates device_fingerprint
   - Initializes trust_score

2. **Session Updates**
   - `watch_time_seconds` incremented during playback
   - `interactions_count` tracked for all user actions
   - Updated on pause, resume, navigation
   - Final update on unmount/exit

3. **Session Validation**
   - Trust score calculation maintained
   - All anti-fake-view checks applied
   - No bypass mechanisms

4. **Event Correlation**
   - Flow events supplement watch sessions
   - Both systems track engagement independently
   - Flow events provide interaction detail
   - Watch sessions provide view validation

## Database Requirements

The FLOW system expects these tables to exist:

- `flows` - Flow definitions
- `flow_nodes` - Individual clip nodes
- `flow_clips` - Clip metadata with timestamps
- `flow_edges` - Navigation between nodes
- `flow_sessions` - User session tracking
- `flow_progress` - User overall progress
- `flow_node_progress` - Per-node completion
- `flow_events` - Event tracking
- `clip_deeplinks` - Optional jump timestamps
- `watch_sessions` - Existing anti-fake-view system

## Error Handling

### Backend
- All endpoints return consistent error format
- HTTP status codes properly set
- Detailed error messages for debugging
- No sensitive data in error responses

### Frontend
- Try-catch blocks on all API calls
- User-friendly error messages
- Retry functionality on failures
- Loading states during operations
- No silent failures

## Performance Considerations

### Event Batching
- Maximum 20 events per batch
- 5-second batch interval
- Flush on unmount
- Flush on beforeunload
- Prevents excessive API calls

### State Management
- Local state for playback controls
- Ref-based tracking for counters
- No unnecessary re-renders
- Efficient event handling

### Video Loading
- Respects clip boundaries
- Seeks to start_time on load
- Stops at end_time automatically
- No full video buffering

## Testing Checklist

### Backend
- ✓ Edge functions deployed successfully
- ✓ JWT authentication working
- ✓ Zod validation active
- ✓ Session verification enforced
- ✓ Event batching functional
- ✓ RLS policies respected

### Frontend
- ✓ Build completes without errors
- ✓ Type safety enforced (no `any`)
- ✓ Flow detection working
- ✓ Player controls functional
- ✓ Watch sessions created
- ✓ Events batched and sent
- ✓ Mode switching seamless
- ✓ Mobile responsive

## Future Enhancements

Potential improvements:
- Analytics dashboard for flow performance
- A/B testing different node sequences
- Personalized flow recommendations
- Social sharing of flow positions
- Creator tools for flow management
- Flow templates and presets
