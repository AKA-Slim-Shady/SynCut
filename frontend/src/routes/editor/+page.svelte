<script lang="ts">
  import { onMount } from 'svelte';
  // Remember to expose these in your .env or start.sh script
  import { PUBLIC_GOOGLE_CLIENT_ID, PUBLIC_GOOGLE_API_KEY } from '$env/static/public';
  import {
    Upload, Play, Pause, SkipBack, SkipForward, Scissors, Copy, Trash2, Plus, 
    Film, MonitorPlay, Image as ImageIcon, Music, Settings, Download,
    Type, Wand2, LayoutGrid, Search, ZoomIn, ZoomOut
  } from '@lucide/svelte';

  // --- UI STATE ---
  let isPlaying = $state(false);
  let currentTime = $state('00:00:00:00');
  let totalTime = $state('00:00:05:00');
  let activeTab = $state('media'); // Controls the left sidebar
  
  let uploadedAssets = $state([
    { name: 'clip_01.mp4', type: 'video', duration: '00:02:15' },
    { name: 'audio_mix.wav', type: 'audio', duration: '00:03:00' },
    { name: 'logo.png', type: 'image', duration: 'Image' },
  ]);

  // --- GOOGLE DRIVE LOGIC ---
  let accessToken: string | null = null;
  let isUploading = $state(false);

  function initGoogleSignIn() {
    if (typeof google !== 'undefined' && google.accounts?.id) {
      google.accounts.id.initialize({
        client_id: PUBLIC_GOOGLE_CLIENT_ID,
        callback: (res: any) => console.log('Signed in:', res)
      });
    }
  }

  function requestDriveAccess() {
    if (typeof google !== 'undefined' && google.accounts?.oauth2) {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: PUBLIC_GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/drive.readonly',
        callback: (tokenResponse: any) => {
          accessToken = tokenResponse.access_token;
          loadPicker();
        }
      });
      client.requestAccessToken();
    } else {
      console.error("Google APIs failed to load. Check your app.html scripts.");
    }
  }

  function loadPicker() {
    if (typeof gapi !== 'undefined' && gapi.load) {
      gapi.load('picker', () => {
        const picker = new google.picker.PickerBuilder()
          .setDeveloperKey(PUBLIC_GOOGLE_API_KEY)
          .setOAuthToken(accessToken!)
          .addView(google.picker.ViewId.DOCS)
          .setCallback(pickerCallback)
          .build();
        picker.setVisible(true);
      });
    }
  }

  async function pickerCallback(data: any) {
    if (data.action === google.picker.Action.PICKED) {
      isUploading = true;
      const file = data.docs[0];
      
      try {
        const response = await fetch('http://localhost:8080/postAsset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileId: file.id, fileName: file.name, accessToken })
        });

        if (response.ok) {
           uploadedAssets = [...uploadedAssets, {
               name: file.name,
               type: file.name.match(/\.(mp4|mov|avi|mkv)$/i) ? 'video' : 
                     file.name.match(/\.(mp3|wav|ogg|aac)$/i) ? 'audio' : 'image', 
               duration: 'Pending'
           }];
        } else {
            console.error("Backend error:", await response.text());
            alert("Failed to download file to backend.");
        }
      } catch (err) {
          console.error("Network error:", err);
      } finally {
          isUploading = false;
      }
    }
  }

  onMount(() => {
    initGoogleSignIn();
  });

  function togglePlay() {
    isPlaying = !isPlaying;
  }
</script>

<div class="flex h-screen w-full flex-col bg-slate-950 text-slate-200 overflow-hidden font-sans">
  
  <header class="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950 px-4">
    <div class="flex items-center gap-3 w-1/3">
      <div class="bg-indigo-600 p-1.5 rounded text-white shadow-[0_0_10px_rgba(79,70,229,0.3)]">
        <MonitorPlay class="h-5 w-5" />
      </div>
      <span class="text-sm font-bold tracking-wide text-slate-100">VideoEditor <span class="text-xs font-normal text-slate-500 ml-1">Beta</span></span>
    </div>
    
    <div class="flex items-center justify-center w-1/3">
        <span class="text-xs font-medium text-slate-400 bg-slate-900 px-3 py-1.5 rounded-md border border-slate-800">Untitled Project</span>
    </div>

    <div class="flex items-center justify-end gap-3 w-1/3">
      <button class="text-slate-400 hover:text-white transition">
        <Settings class="h-4 w-4" />
      </button>
      <button class="flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 transition shadow-[0_0_10px_rgba(79,70,229,0.3)] hover:shadow-[0_0_15px_rgba(79,70,229,0.5)]">
        <Download class="h-3.5 w-3.5" /> Export
      </button>
    </div>
  </header>

  <div class="flex flex-1 overflow-hidden">
    
    <aside class="w-16 shrink-0 flex flex-col items-center py-4 border-r border-slate-800 bg-slate-950 gap-6 z-20">
      <button onclick={() => activeTab = 'media'} class="flex flex-col items-center gap-1.5 {activeTab === 'media' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'} transition-colors">
        <LayoutGrid class="h-5 w-5" />
        <span class="text-[9px] font-semibold uppercase tracking-wider">Media</span>
      </button>
      <button onclick={() => activeTab = 'audio'} class="flex flex-col items-center gap-1.5 {activeTab === 'audio' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'} transition-colors">
        <Music class="h-5 w-5" />
        <span class="text-[9px] font-semibold uppercase tracking-wider">Audio</span>
      </button>
      <button onclick={() => activeTab = 'text'} class="flex flex-col items-center gap-1.5 {activeTab === 'text' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'} transition-colors">
        <Type class="h-5 w-5" />
        <span class="text-[9px] font-semibold uppercase tracking-wider">Text</span>
      </button>
      <button onclick={() => activeTab = 'effects'} class="flex flex-col items-center gap-1.5 {activeTab === 'effects' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'} transition-colors">
        <Wand2 class="h-5 w-5" />
        <span class="text-[9px] font-semibold uppercase tracking-wider">Effects</span>
      </button>
    </aside>

    <aside class="w-72 shrink-0 flex flex-col border-r border-slate-800 bg-[#0f141f] z-10">
      {#if activeTab === 'media'}
        <div class="flex h-12 items-center justify-between border-b border-slate-800/80 px-4">
            <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-300">Project Files</h2>
            <button class="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition" title="Add Media">
            <Plus class="h-4 w-4" />
            </button>
        </div>

        <div class="p-4">
            <button 
            onclick={requestDriveAccess}
            disabled={isUploading}
            class="w-full group flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-700 bg-slate-800/30 px-4 py-8 text-center transition hover:border-indigo-500/50 hover:bg-slate-800/60 disabled:opacity-50 disabled:cursor-not-allowed"
            >
            {#if isUploading}
                <div class="mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-indigo-400"></div>
                <span class="text-xs font-medium text-slate-300">Downloading...</span>
            {:else}
                <Upload class="mb-2 h-6 w-6 text-slate-400 group-hover:-translate-y-1 group-hover:text-indigo-400 transition-all duration-300" />
                <span class="text-xs font-medium text-slate-300">Import from Drive</span>
                <span class="mt-1 text-[10px] text-slate-500">Video, Audio, Images</span>
            {/if}
            </button>
        </div>

        <div class="flex-1 overflow-y-auto px-2 pb-4">
            <div class="space-y-1">
            {#each uploadedAssets as asset (asset.name)}
                <div class="flex cursor-grab items-center gap-3 rounded-md px-2 py-2.5 hover:bg-slate-800/60 transition group">
                <div class="flex h-8 w-8 items-center justify-center rounded bg-slate-800 text-slate-400 group-hover:bg-slate-700 transition-colors shrink-0">
                    {#if asset.type === 'video'}
                    <Film class="h-4 w-4 text-indigo-400" />
                    {:else if asset.type === 'audio'}
                    <Music class="h-4 w-4 text-emerald-400" />
                    {:else}
                    <ImageIcon class="h-4 w-4 text-amber-400" />
                    {/if}
                </div>
                <div class="flex flex-1 flex-col overflow-hidden">
                    <span class="truncate text-xs font-medium text-slate-200 group-hover:text-white">{asset.name}</span>
                    <span class="text-[10px] text-slate-500">{asset.duration}</span>
                </div>
                </div>
            {/each}
            </div>
        </div>
      {:else}
        <div class="flex h-full items-center justify-center text-slate-500 text-xs uppercase tracking-widest font-semibold">
            {activeTab} Tools
        </div>
      {/if}
    </aside>

    <main class="flex flex-1 flex-col bg-[#050505] overflow-hidden relative">
      
      <section class="flex-1 flex flex-col items-center justify-center p-4 relative min-h-[40vh]">
        <div class="absolute inset-0 bg-indigo-900/5 opacity-30 blur-[100px] pointer-events-none"></div>

        <div class="relative w-full max-w-4xl aspect-video rounded-lg bg-black shadow-2xl ring-1 ring-white/10 flex items-center justify-center overflow-hidden z-10">
            <div class="text-slate-600 flex flex-col items-center gap-3 px-8 text-center">
              <MonitorPlay class="h-12 w-12 opacity-20" />
              <span class="text-sm font-medium text-slate-500">Preview Monitor</span>
            </div>
            
            <div class="absolute right-4 top-4 rounded bg-black/60 px-2 py-1 backdrop-blur-md">
              <span class="font-mono text-xs font-medium text-white/90">{currentTime}</span>
            </div>
        </div>
      </section>

      <div class="h-12 border-t border-slate-800 bg-slate-950 flex items-center justify-between px-4 z-20">
        <div class="flex items-center gap-1 w-1/3">
            <button class="flex items-center gap-1.5 px-2 py-1.5 text-slate-400 hover:bg-slate-800 hover:text-white rounded-md transition-colors text-xs font-medium"><Scissors class="h-3.5 w-3.5" /> Split</button>
            <div class="w-[1px] h-4 bg-slate-800 mx-1"></div>
            <button class="p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white rounded-md transition-colors"><Copy class="h-3.5 w-3.5" /></button>
            <button class="p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-400 rounded-md transition-colors"><Trash2 class="h-3.5 w-3.5" /></button>
        </div>

        <div class="flex items-center justify-center gap-4 w-1/3">
            <button class="text-slate-400 hover:text-white transition-colors"><SkipBack class="h-4 w-4 fill-current" /></button>
            <button class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-md" onclick={togglePlay}>
              {#if isPlaying}
                <Pause class="h-3.5 w-3.5 fill-current" />
              {:else}
                <Play class="h-3.5 w-3.5 ml-0.5 fill-current" />
              {/if}
            </button>
            <button class="text-slate-400 hover:text-white transition-colors"><SkipForward class="h-4 w-4 fill-current" /></button>
            
            <span class="font-mono text-[11px] text-slate-400 tracking-wider ml-4">
                <span class="text-slate-200">{currentTime}</span> / {totalTime}
            </span>
        </div>

        <div class="flex items-center justify-end gap-3 w-1/3">
             <ZoomOut class="h-3.5 w-3.5 text-slate-500" />
             <div class="h-1 w-24 rounded-full bg-slate-800 relative cursor-pointer">
                 <div class="absolute left-1/3 h-2.5 w-2.5 top-1/2 -translate-y-1/2 rounded-full bg-indigo-500 shadow-sm"></div>
             </div>
             <ZoomIn class="h-3.5 w-3.5 text-slate-500" />
             <span class="text-[10px] text-slate-500 font-medium ml-2">Fit</span>
        </div>
      </div>

      <footer class="h-[35%] min-h-[250px] flex flex-col border-t border-slate-800 bg-[#0a0f18] z-10 shrink-0">
        <div class="flex-1 overflow-x-auto overflow-y-auto flex relative hide-scrollbar">
          
          <div class="absolute bottom-0 top-0 z-20 w-[1px] bg-red-500/80 pointer-events-none" style="left: 200px;">
            <div class="absolute -top-[1px] left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 clip-playhead shadow-md shadow-red-500/20"></div>
          </div>

          <div class="sticky left-0 z-30 flex w-36 shrink-0 flex-col border-r border-slate-800 bg-slate-950 shadow-[4px_0_12px_rgba(0,0,0,0.5)]">
            <div class="h-6 w-full border-b border-slate-800/50 bg-slate-900/90"></div>

            <div class="flex h-16 w-full items-center justify-between border-b border-slate-800/50 bg-slate-950 px-3">
              <div class="flex items-center gap-2">
                <Film class="h-3.5 w-3.5 text-indigo-400" />
                <span class="text-[10px] font-medium text-slate-300">Video 1</span>
              </div>
              <div class="flex gap-1">
                <button class="h-4 w-4 rounded bg-slate-800 text-[8px] font-medium flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition">M</button>
              </div>
            </div>
            
            <div class="flex h-16 w-full items-center justify-between border-b border-slate-800/50 bg-slate-950 px-3">
              <div class="flex items-center gap-2">
                <Music class="h-3.5 w-3.5 text-emerald-400" />
                <span class="text-[10px] font-medium text-slate-300">Audio 1</span>
              </div>
              <div class="flex gap-1">
                <button class="h-4 w-4 rounded bg-slate-800 text-[8px] font-medium flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition">M</button>
              </div>
            </div>
          </div>

          <div class="flex flex-1 flex-col min-w-[2000px] relative bg-[#0c121e]">
            <div class="h-6 w-full border-b border-slate-800/50 bg-[#0f141f] flex items-end sticky top-0 z-10 font-mono text-[9px] text-slate-600 select-none overflow-hidden" style="background-image: linear-gradient(to right, rgba(30, 41, 59, 0.5) 1px, transparent 1px); background-size: 50px 100%; background-position: -1px 0;">
                 <span class="absolute" style="left: 0px; bottom: 1px;">00:00.0</span>
                 <span class="absolute" style="left: 100px; bottom: 1px;">00:01.0</span>
                 <span class="absolute" style="left: 200px; bottom: 1px;">00:02.0</span>
                 <span class="absolute" style="left: 300px; bottom: 1px;">00:03.0</span>
                 <span class="absolute" style="left: 400px; bottom: 1px;">00:04.0</span>
            </div>

            <div class="absolute inset-0 top-6 pointer-events-none z-0" style="background-image: linear-gradient(to right, rgba(30, 41, 59, 0.2) 1px, transparent 1px); background-size: 50px 100%; background-position: -1px 0;"></div>

            <div class="relative h-16 w-full border-b border-slate-800/40 hover:bg-slate-800/10 transition-colors z-0">
              <div class="absolute left-[50px] top-1/2 flex h-[50px] w-[250px] -translate-y-1/2 items-start rounded-[4px] border border-indigo-500/40 bg-indigo-600/20 px-2 py-1.5 overflow-hidden group cursor-pointer hover:border-indigo-400 hover:bg-indigo-600/30 transition-colors shadow-sm">
                <div class="absolute inset-0 opacity-10" style="background-image: linear-gradient(to right, #000 1px, transparent 1px); background-size: 40px 100%;"></div>
                
                <div class="absolute top-0 bottom-0 left-0 w-1.5 bg-indigo-500/80 group-hover:bg-indigo-400 cursor-ew-resize"></div>
                <div class="absolute top-0 bottom-0 right-0 w-1.5 bg-indigo-500/80 group-hover:bg-indigo-400 cursor-ew-resize"></div>
                
                <div class="relative flex items-center w-full z-10">
                    <span class="text-[10px] font-medium text-indigo-100 truncate drop-shadow-md tracking-wide">clip_01.mp4</span>
                </div>
              </div>
            </div>
            
             <div class="relative h-16 w-full border-b border-slate-800/40 hover:bg-slate-800/10 transition-colors z-0">
              <div class="absolute left-[50px] top-1/2 flex h-[50px] w-[250px] -translate-y-1/2 items-start rounded-[4px] border border-emerald-500/40 bg-emerald-600/20 px-2 py-1.5 overflow-hidden group cursor-pointer hover:border-emerald-400 hover:bg-emerald-600/30 transition-colors shadow-sm">
                 <div class="absolute top-0 bottom-0 left-0 w-1.5 bg-emerald-500/80 group-hover:bg-emerald-400 cursor-ew-resize"></div>
                <div class="absolute top-0 bottom-0 right-0 w-1.5 bg-emerald-500/80 group-hover:bg-emerald-400 cursor-ew-resize"></div>
                
                <div class="relative flex items-center z-10 w-full mb-1">
                     <span class="text-[10px] font-medium text-emerald-100 truncate drop-shadow-md tracking-wide">clip_01_audio</span>
                </div>

                <div class="absolute bottom-1.5 left-2 right-2 h-5 pointer-events-none opacity-50 flex items-center">
                    <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 24">
                        <path d="M0,12 L2,8 L4,16 L6,6 L8,18 L10,12 L12,4 L14,20 L16,10 L18,14 L20,2 L22,22 L24,8 L26,16 L28,12 L30,6 L32,18 L34,10 L36,14 L38,4 L40,20 L42,12 L44,8 L46,16 L48,6 L50,18 L52,10 L54,14 L56,2 L58,22 L60,8 L62,16 L64,12 L66,6 L68,18 L70,10 L72,14 L74,4 L76,20 L78,12 L80,8 L82,16 L84,6 L86,18 L88,10 L90,14 L92,2 L94,22 L96,8 L98,16 L100,12" fill="none" class="stroke-emerald-300" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"></path>
                    </svg>
                </div>
              </div>
              
              <div class="absolute left-[300px] top-1/2 flex h-[50px] w-[300px] -translate-y-1/2 items-start rounded-[4px] border border-amber-500/40 bg-amber-600/20 px-2 py-1.5 overflow-hidden group cursor-pointer hover:border-amber-400 hover:bg-amber-600/30 transition-colors shadow-sm">
                 <div class="absolute top-0 bottom-0 left-0 w-1.5 bg-amber-500/80 group-hover:bg-amber-400 cursor-ew-resize"></div>
                <div class="absolute top-0 bottom-0 right-0 w-1.5 bg-amber-500/80 group-hover:bg-amber-400 cursor-ew-resize"></div>
                
                <div class="relative flex items-center z-10 w-full mb-1">
                     <span class="text-[10px] font-medium text-amber-100 truncate drop-shadow-md tracking-wide">audio_mix.wav</span>
                </div>

                <div class="absolute bottom-1.5 left-2 right-2 h-5 pointer-events-none opacity-50 flex items-center">
                    <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 24">
                        <path d="M0,12 L5,8 L10,16 L15,4 L20,20 L25,12 L30,10 L35,14 L40,6 L45,18 L50,12 L55,4 L60,20 L65,8 L70,16 L75,12 L80,6 L85,18 L90,10 L95,14 L100,12" fill="none" class="stroke-amber-300" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"></path>
                    </svg>
                </div>
              </div>
            </div>
            
            <div class="h-16 w-full"></div>
          </div>
        </div>
      </footer>
    </main>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    overflow: hidden;
  }

  .clip-playhead {
    clip-path: polygon(0 0, 100% 0, 100% 50%, 50% 100%, 0 50%);
  }

  .hide-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  .hide-scrollbar::-webkit-scrollbar-track {
    background: #0a0f18; 
  }
  .hide-scrollbar::-webkit-scrollbar-thumb {
    background: #1e293b; 
    border-radius: 4px;
  }
  .hide-scrollbar:hover::-webkit-scrollbar-thumb {
    background: #334155; 
  }
</style>