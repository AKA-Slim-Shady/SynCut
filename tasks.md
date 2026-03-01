# SyncCut MVP — Daily 1-Hour Roadmap (Detailed with Dates)
Start: **10 Feb 2026**  
Break: **15 Feb – 22 Feb (no work scheduled)**  
Goal: Working collaborative proxy-based editing + render MVP

---

## Phase 1 — Asset Ingestion

### DAY 1 — 10 Feb 2026
- [ ] Create backend endpoint `POST /assets/register`
- [x] Create files:
  - `assetRoutes.ts`
  - `assetController.ts`
  - `assetService.ts`
- [ ] Endpoint should accept:
  - `fileId`
  - `fileName`
  - `accessToken`
- [ ] Return a temporary JSON success response.
**Outcome:** Frontend can notify backend that an asset was selected.

---

### DAY 2 — 11 Feb 2026
- [ ] Implement `googleDriveService.downloadFile(fileId, token)`
- [ ] Use Google Drive API `files/{fileId}?alt=media`
- [ ] Save downloaded file into:
    - `uploads/originals/`

**Outcome:** Backend successfully ingests the original media.

---

### DAY 3 — 12 Feb 2026
- [ ] Initialize FFmpeg service at server startup
- [ ] Implement `ffmpegService.generateProxy(videoPath)`
- [ ] Generate **360p proxy version**
- [ ] Save into:
    - `uploads/proxy/`

---

## (Break: 15 Feb – 22 Feb)

---

## Phase 2 — Project System

### DAY 6 — 23 Feb 2026
- [ ] Create `POST /projects`
- [ ] Return generated `projectId`
**Outcome:** Projects can be created.

---

### DAY 7 — 24 Feb 2026
- [ ] Implement `GET /projects/:id`
- [ ] Return:
- project metadata
- associated assets
**Outcome:** Projects retrievable.

---

## Phase 3 — Timeline Editing Foundation

### DAY 8 — 25 Feb 2026
- [ ] Create basic timeline UI container in frontend
- [ ] Load proxy video inside timeline preview
**Outcome:** Visual editing foundation begins.

---

### DAY 9 — 26 Feb 2026
- [ ] Implement drag-and-drop clip placement
- [ ] Maintain local `edit.json` timeline structure
**Outcome:** Basic editing interaction exists.

---

### DAY 10 — 27 Feb 2026
- [ ] Persist `edit.json` locally in browser state
- [ ] Reload timeline from saved state
**Outcome:** Timeline persistence working.

---

## Phase 4 — Realtime Collaboration

### DAY 11 — 28 Feb 2026
- [ ] Add backend WebSocket server
- [ ] Create project collaboration channel
**Outcome:** Realtime transport ready.

---

### DAY 12 — 1 Mar 2026
- [ ] Integrate Yjs CRDT document
- [ ] Sync timeline edits across peers
**Outcome:** Multi-user timeline sync works.

---

### DAY 13 — 2 Mar 2026
- [ ] Emit `asset_added` websocket event
- [ ] Ensure peers download proxy automatically
**Outcome:** Collaborative ingestion working.

---

## Phase 5 — Rendering Pipeline

### DAY 14 — 3 Mar 2026
- [ ] Add "Render Project" button
- [ ] Freeze timeline snapshot → `render_version`
**Outcome:** Render process initialization exists.

---

### DAY 15 — 4 Mar 2026
- [ ] Implement renderer vote UI
- [ ] Select rendering peer
**Outcome:** Peer-selected rendering model ready.

---

### DAY 16 — 5 Mar 2026
- [ ] Renderer downloads original high-res assets
- [ ] Load `edit.json`
**Outcome:** Renderer preparation pipeline complete.

---

### DAY 17 — 6 Mar 2026
- [ ] Run FFmpeg render locally
- [ ] Produce `final_render.mp4`
**Outcome:** Local rendering works.

---

### DAY 18 — 7 Mar 2026
- [ ] Upload rendered file via backend endpoint
- [ ] Broadcast `render_complete` event
**Outcome:** Render distribution works.

---

## Phase 6 — MVP Polish

### DAY 19 — 8 Mar 2026
- [ ] Implement asset lifecycle states:
- uploading
- proxy_processing
- ready
**Outcome:** Clear ingestion state management.

---

### DAY 20 — 9 Mar 2026
- [ ] Create Project Home dashboard page
- [ ] Show project assets list
**Outcome:** Project navigation usable.

---

### DAY 21 — 10 Mar 2026
- [ ] Add ingestion + render error handling
- [ ] Show frontend status indicators
**Outcome:** Stability improved.

---

### DAY 22 — 11 Mar 2026
- [ ] Full end-to-end test:
- 2 users join project
- Import asset
- Proxy syncs
- Timeline edits sync
- One user renders
**Outcome:** **Functional SyncCut MVP achieved**
