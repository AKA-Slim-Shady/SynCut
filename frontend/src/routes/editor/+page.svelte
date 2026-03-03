<script lang="ts">
  import {
    Upload,
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Scissors,
    Copy,
    Trash2,
    Plus,
    Film,
    MonitorPlay,
    Image,
    Music,
    Settings,
    Download
  } from '@lucide/svelte';

  let isPlaying = $state(false);
  let currentTime = $state('00:00:00:00');
  let totalTime = $state('00:00:05:00');
  let uploadedAssets = $state([
    { name: 'clip_01.mp4', type: 'video', duration: '00:02:15' },
    { name: 'audio_mix.wav', type: 'audio', duration: '00:03:00' },
    { name: 'logo.png', type: 'image', duration: 'Image' },
  ]);

  function togglePlay() {
    isPlaying = !isPlaying;
  }
</script>

<div class="flex h-screen w-full flex-col bg-slate-950 text-slate-200 overflow-hidden font-sans">
  <!-- Header -->
  <header class="flex h-12 items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4">
    <div class="flex items-center gap-2">
      <div class="bg-indigo-600 p-1.5 rounded text-white shadow-[0_0_10px_rgba(79,70,229,0.3)]">
        <MonitorPlay class="h-4 w-4" />
      </div>
      <span class="text-sm font-bold tracking-wide text-slate-100">VideoEditor <span class="text-xs font-normal text-slate-500 ml-1">Beta</span></span>
    </div>
    <div class="flex items-center gap-3">
      <button class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition group">
        <Settings class="h-3.5 w-3.5 group-hover:rotate-45 transition-transform duration-300" /> Settings
      </button>
      <button class="flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 transition shadow-[0_0_10px_rgba(79,70,229,0.3)] hover:shadow-[0_0_15px_rgba(79,70,229,0.5)]">
        <Download class="h-3.5 w-3.5" /> Export
      </button>
    </div>
  </header>

  <!-- Main Workspace -->
  <main class="flex flex-1 overflow-hidden">
    <!-- Left panel: Media Library / Upload -->
    <aside class="flex w-72 shrink-0 flex-col border-r border-slate-800 bg-slate-900/40">
      <div class="flex items-center justify-between border-b border-slate-800 px-4 py-2.5">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-400">Media Pool</h2>
        <button class="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition" title="Add Media">
          <Plus class="h-4 w-4" />
        </button>
      </div>

      <!-- Upload Zone -->
      <div class="p-4">
        <button class="w-full group flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-700 bg-slate-800/30 px-4 py-8 text-center transition hover:border-indigo-500/50 hover:bg-slate-800/60">
          <Upload class="mb-2 h-6 w-6 text-slate-400 group-hover:-translate-y-1 group-hover:text-indigo-400 transition-all duration-300" />
          <span class="text-xs font-medium text-slate-300">Click or Drag to Upload</span>
          <span class="mt-1 text-[10px] text-slate-500">Video, Audio, Images</span>
        </button>
      </div>

      <!-- Assets List -->
      <div class="flex-1 overflow-y-auto px-2 pb-4">
        <div class="space-y-1">
          {#each uploadedAssets as asset (asset.name)}
            <div class="flex cursor-grab items-center gap-3 rounded-md px-2 py-2.5 hover:bg-slate-800/60 transition group">
              <div class="flex h-8 w-8 items-center justify-center rounded bg-slate-800 text-slate-400 group-hover:bg-slate-700 transition-colors">
                {#if asset.type === 'video'}
                  <Film class="h-4 w-4 text-indigo-400" />
                {:else if asset.type === 'audio'}
                  <Music class="h-4 w-4 text-emerald-400" />
                {:else}
                  <Image class="h-4 w-4 text-amber-400" />
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
    </aside>

    <!-- Center panel: Video Playback -->
    <section class="flex flex-1 flex-col bg-black/95 relative overflow-hidden">
        <!-- Background Ambient Glow -->
        <div class="absolute inset-0 bg-indigo-900/5 opacity-50 blur-[100px] pointer-events-none"></div>

      <div class="flex flex-1 items-center justify-center p-4 md:p-8 z-10">
        <!-- Video Monitor Container -->
        <div class="relative w-full max-w-5xl aspect-video overflow-hidden rounded-xl bg-slate-900/80 shadow-2xl ring-1 ring-white/5 flex items-center justify-center backdrop-blur-sm">
            
            <div class="text-slate-600 flex flex-col items-center gap-3 px-8 text-center">
              <MonitorPlay class="h-10 w-10 opacity-30" />
              <span class="text-sm font-medium text-slate-400">Preview Monitor</span>
              <p class="text-xs text-slate-500 max-w-xs">Drag clips from the Media Pool to the timeline to preview them here.</p>
            </div>

            <!-- Optional Timecode Overlay on Video -->
            <div class="absolute right-4 top-4 rounded bg-black/60 px-2 py-1 backdrop-blur-md">
              <span class="font-mono text-xs font-medium text-white/90">{currentTime}</span>
            </div>
        </div>
      </div>

      <!-- Transport Controls -->
      <div class="flex items-center justify-between border-t border-slate-800 bg-slate-900/90 px-6 py-3 z-10 backdrop-blur-sm">
        <div class="flex items-center gap-4 w-1/3">
          <span class="font-mono text-[11px] text-slate-400 tracking-wider">
            <span class="text-indigo-400">{currentTime}</span>
            <span class="text-slate-600 mx-1">/</span> 
            {totalTime}
          </span>
        </div>

        <div class="flex flex-1 justify-center items-center gap-4">
          <button class="text-slate-400 hover:text-white hover:scale-110 transition-all"><SkipBack class="h-4 w-4 fill-current" /></button>
          <button class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:bg-white hover:scale-105 transition-all" onclick={togglePlay}>
            {#if isPlaying}
              <Pause class="h-4 w-4 fill-current" />
            {:else}
              <Play class="h-4 w-4 ml-0.5 fill-current" />
            {/if}
          </button>
          <button class="text-slate-400 hover:text-white hover:scale-110 transition-all"><SkipForward class="h-4 w-4 fill-current" /></button>
        </div>

        <div class="flex items-center justify-end w-1/3 gap-1">
            <button class="p-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-md transition-colors" title="Cut (C)"><Scissors class="h-4 w-4" /></button>
            <button class="p-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-md transition-colors" title="Copy (Cmd+C)"><Copy class="h-4 w-4" /></button>
            <div class="w-[1px] h-4 bg-slate-700 mx-1"></div>
            <button class="p-2 text-slate-400 hover:bg-red-500/20 hover:text-red-400 rounded-md transition-colors" title="Delete (Del)"><Trash2 class="h-4 w-4" /></button>
        </div>
      </div>
    </section>
  </main>

  <!-- Timeline Panel -->
  <footer class="flex h-72 flex-col border-t border-slate-800 bg-[#0a0f18] shrink-0">
    <!-- Timeline Toolbar -->
    <div class="flex h-9 items-center justify-between px-4 border-b border-slate-800/80 bg-slate-900">
      <div class="flex items-center gap-4">
        <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Timeline</span>
      </div>
      <div class="flex items-center gap-3">
          <div class="h-1 w-24 rounded-full bg-slate-800 relative cursor-pointer hover:bg-slate-700 transition-colors">
              <div class="absolute left-1/4 h-2.5 w-2.5 top-1/2 -translate-y-1/2 rounded-full bg-slate-400 shadow backdrop-blur-sm"></div>
          </div>
          <span class="text-[10px] text-slate-500 font-medium">100%</span>
      </div>
    </div>

    <!-- Timeline Tracks -->
    <div class="flex-1 overflow-x-auto overflow-y-auto flex relative hide-scrollbar">
      <!-- Playhead Line -->
      <div class="absolute bottom-0 top-0 z-20 w-[1px] bg-red-500/80 pointer-events-none" style="left: 200px;">
        <!-- Playhead Handle -->
        <div class="absolute -top-[1px] left-1/2 -translate-x-1/2 w-3.5 h-[14px] bg-red-500 clip-playhead shadow-md shadow-red-500/20"></div>
      </div>

      <!-- Track Headers -->
      <div class="sticky left-0 z-30 flex w-44 shrink-0 flex-col border-r border-slate-800 bg-slate-900 shadow-[4px_0_12px_rgba(0,0,0,0.5)]">
        
        <!-- Timeline Ruler Header Empty Space -->
        <div class="h-6 w-full border-b border-slate-800/50 bg-slate-900/90"></div>

        <!-- Video Track Header -->
        <div class="flex h-16 w-full items-center justify-between border-b border-slate-800/50 bg-slate-900 px-3">
          <div class="flex items-center gap-2.5">
            <Film class="h-3.5 w-3.5 text-indigo-400" />
            <span class="text-[11px] font-medium text-slate-300">V1</span>
          </div>
          <div class="flex gap-1.5 flex-col">
            <div class="flex gap-1">
              <button class="h-4 w-4 rounded bg-slate-800 text-[8px] font-medium flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition">M</button>
              <button class="h-4 w-4 rounded bg-slate-800 text-[8px] font-medium flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition">S</button>
            </div>
          </div>
        </div>
        
        <!-- Audio Track Header -->
        <div class="flex h-16 w-full items-center justify-between border-b border-slate-800/50 bg-slate-900 px-3">
          <div class="flex items-center gap-2.5">
            <Music class="h-3.5 w-3.5 text-emerald-400" />
            <span class="text-[11px] font-medium text-slate-300">A1</span>
          </div>
          <div class="flex gap-1.5 flex-col">
            <div class="flex gap-1">
              <button class="h-4 w-4 rounded bg-slate-800 text-[8px] font-medium flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition">M</button>
              <button class="h-4 w-4 rounded bg-slate-800 text-[8px] font-medium flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition">S</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Track Content Area -->
      <div class="flex flex-1 flex-col min-w-[2000px] relative">
        <!-- Ruler -->
        <div class="h-6 w-full border-b border-slate-800/50 bg-[#0c121e] flex items-end sticky top-0 z-10 font-mono text-[9px] text-slate-600 select-none overflow-hidden" style="background-image: linear-gradient(to right, rgba(30, 41, 59, 0.5) 1px, transparent 1px); background-size: 50px 100%; background-position: -1px 0;">
             <span class="absolute" style="left: 0px; bottom: 1px;">00:00:00</span>
             <span class="absolute" style="left: 100px; bottom: 1px;">00:00:01</span>
             <span class="absolute" style="left: 200px; bottom: 1px;">00:00:02</span>
             <span class="absolute" style="left: 300px; bottom: 1px;">00:00:03</span>
             <span class="absolute" style="left: 400px; bottom: 1px;">00:00:04</span>
             <span class="absolute" style="left: 500px; bottom: 1px;">00:00:05</span>
        </div>

        <!-- Grid Lines Background -->
        <div class="absolute inset-0 top-6 pointer-events-none z-0" style="background-image: linear-gradient(to right, rgba(30, 41, 59, 0.2) 1px, transparent 1px); background-size: 50px 100%; background-position: -1px 0;"></div>

        <!-- Video Track -->
        <div class="relative h-16 w-full border-b border-slate-800/40 hover:bg-slate-800/10 transition-colors z-0">
          <!-- Clip Block -->
          <div class="absolute left-[50px] top-1/2 flex h-[52px] w-[250px] -translate-y-1/2 items-start rounded-[3px] border border-indigo-400/40 bg-indigo-500/20 px-2.5 py-1.5 overflow-hidden group cursor-pointer hover:border-indigo-400 hover:bg-indigo-500/30 transition-colors shadow-sm">
            <!-- Thumbnail pattern to look like video frames -->
            <div class="absolute inset-0 opacity-10" style="background-image: linear-gradient(to right, #000 1px, transparent 1px); background-size: 40px 100%;"></div>
            
            <div class="absolute top-0 bottom-0 left-0 w-1 bg-indigo-500 group-hover:bg-indigo-400 cursor-ew-resize"></div>
            <div class="absolute top-0 bottom-0 right-0 w-1 bg-indigo-500 group-hover:bg-indigo-400 cursor-ew-resize"></div>
            
            <div class="relative flex items-center w-full z-10">
                <Film class="mr-2 h-3.5 w-3.5 text-indigo-300 drop-shadow-md" />
                <span class="text-[10px] font-medium text-white/90 truncate drop-shadow-md tracking-wide">clip_01.mp4</span>
            </div>
          </div>
        </div>
        
        <!-- Audio Track -->
         <div class="relative h-16 w-full border-b border-slate-800/40 hover:bg-slate-800/10 transition-colors z-0">
          <div class="absolute left-[50px] top-1/2 flex h-[52px] w-[250px] -translate-y-1/2 items-start rounded-[3px] border border-emerald-400/40 bg-emerald-500/20 px-2.5 py-1.5 overflow-hidden group cursor-pointer hover:border-emerald-400 hover:bg-emerald-500/30 transition-colors shadow-sm">
             <div class="absolute top-0 bottom-0 left-0 w-1 bg-emerald-500 group-hover:bg-emerald-400 cursor-ew-resize"></div>
            <div class="absolute top-0 bottom-0 right-0 w-1 bg-emerald-500 group-hover:bg-emerald-400 cursor-ew-resize"></div>
            
            <div class="relative flex items-center z-10 w-full mb-1">
                 <Music class="mr-2 h-3.5 w-3.5 text-emerald-300 drop-shadow-md" />
                 <span class="text-[10px] font-medium text-white/90 truncate drop-shadow-md tracking-wide">clip_01_audio</span>
            </div>

            <!-- Waveform SVG representation -->
            <div class="absolute bottom-1.5 left-2.5 right-2.5 h-6 pointer-events-none opacity-60 flex items-center">
                <svg width="100%" height="80%" preserveAspectRatio="none" viewBox="0 0 100 24">
                    <path d="M0,12 L2,8 L4,16 L6,6 L8,18 L10,12 L12,4 L14,20 L16,10 L18,14 L20,2 L22,22 L24,8 L26,16 L28,12 L30,6 L32,18 L34,10 L36,14 L38,4 L40,20 L42,12 L44,8 L46,16 L48,6 L50,18 L52,10 L54,14 L56,2 L58,22 L60,8 L62,16 L64,12 L66,6 L68,18 L70,10 L72,14 L74,4 L76,20 L78,12 L80,8 L82,16 L84,6 L86,18 L88,10 L90,14 L92,2 L94,22 L96,8 L98,16 L100,12" fill="none" class="stroke-emerald-300" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"></path>
                </svg>
            </div>
          </div>
          
           <!-- Music Background Track -->
          <div class="absolute left-[300px] top-1/2 flex h-[52px] w-[300px] -translate-y-1/2 items-start rounded-[3px] border border-amber-400/40 bg-amber-500/20 px-2.5 py-1.5 overflow-hidden group cursor-pointer hover:border-amber-400 hover:bg-amber-500/30 transition-colors shadow-sm">
             <div class="absolute top-0 bottom-0 left-0 w-1 bg-amber-500 group-hover:bg-amber-400 cursor-ew-resize"></div>
            <div class="absolute top-0 bottom-0 right-0 w-1 bg-amber-500 group-hover:bg-amber-400 cursor-ew-resize"></div>
            
            <div class="relative flex items-center z-10 w-full mb-1">
                 <Music class="mr-2 h-3.5 w-3.5 text-amber-300 drop-shadow-md" />
                 <span class="text-[10px] font-medium text-white/90 truncate drop-shadow-md tracking-wide">audio_mix.wav</span>
            </div>

            <div class="absolute bottom-1.5 left-2.5 right-2.5 h-6 pointer-events-none opacity-60 flex items-center">
                <svg width="100%" height="80%" preserveAspectRatio="none" viewBox="0 0 100 24">
                     <!-- Different waveform pattern -->
                    <path d="M0,12 L5,8 L10,16 L15,4 L20,20 L25,12 L30,10 L35,14 L40,6 L45,18 L50,12 L55,4 L60,20 L65,8 L70,16 L75,12 L80,6 L85,18 L90,10 L95,14 L100,12" fill="none" class="stroke-amber-300" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"></path>
                </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</div>

<style>
  :global(body) {
    margin: 0;
    overflow: hidden;
  }

  .clip-playhead {
    clip-path: polygon(0 0, 100% 0, 100% 60%, 50% 100%, 0 60%);
  }

  /* Custom scrollbar to hide by default but keep functionality or look sleek */
  .hide-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .hide-scrollbar::-webkit-scrollbar-track {
    background: transparent; 
  }
  .hide-scrollbar::-webkit-scrollbar-thumb {
    background: #1e293b; 
    border-radius: 3px;
  }
  .hide-scrollbar:hover::-webkit-scrollbar-thumb {
    background: #334155; 
  }
</style>
