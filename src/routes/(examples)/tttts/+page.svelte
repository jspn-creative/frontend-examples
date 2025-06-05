<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Textarea } from "$lib/components/ui/textarea";
  import * as Select from "$lib/components/ui/select/index";
  import { cn } from "$lib/utils";
  import { AlertCircle, Loader2, Play, Save, Pause, Volume2, VolumeX } from "@lucide/svelte";

  type VoiceCategories = {
    [category: string]: {
      [displayName: string]: string;
    };
  };

  const voices: VoiceCategories = {
    "Disney Voices": {
      "Ghost Face": "en_us_ghostface",
      Chewbacca: "en_us_chewbacca",
      C3PO: "en_us_c3po",
      Stitch: "en_us_stitch",
      Stormtrooper: "en_us_stormtrooper",
      Rocket: "en_us_rocket",
      "Madame Leota": "en_female_madam_leota",
      "Ghost Host": "en_male_ghosthost",
      Pirate: "en_male_pirate",
    },
    "English Voices": {
      "English AU - Female": "en_au_001",
      "English AU - Male": "en_au_002",
      "English UK - Male 1": "en_uk_001",
      "English UK - Male 2": "en_uk_003",
      "English US - Female 1": "en_us_001",
      "English US - Female 2": "en_us_002",
      "English US - Male 1": "en_us_006",
      "English US - Male 2": "en_us_007",
      "English US - Male 3": "en_us_009",
      "English US - Male 4": "en_us_010",
    },
    "English Voices (Other)": {
      Narrator: "en_male_narration",
      Wacky: "en_male_funny",
      Peaceful: "en_female_emotional",
      Serious: "en_male_cody",
    },
    "Western European": {
      "French - Male 1": "fr_001",
      "French - Male 2": "fr_002",
      "German - Female": "de_001",
      "German - Male": "de_002",
      "Spanish - Male": "es_002",
    },
    Vocals: {
      Alto: "en_female_f08_salut_damour",
      Tenor: "en_male_m03_lobby",
      "Sunshine Soon": "en_male_m03_sunshine_soon",
      "Warmy Breeze": "en_female_f08_warmy_breeze",
      Glorious: "en_female_ht_f08_glorious",
      "It Goes Up": "en_male_sing_funny_it_goes_up",
      Chipmunk: "en_male_m2_xhxs_m03_silly",
      Dramatic: "en_female_ht_f08_wonderful_world",
    },
  };

  let voice = $state("en_male_m03_lobby");
  let text = $state("Ellius pooped in his pants this morning. I woke up to the smell of stanky poop.");
  let audioUrl = $state<string | null>(null);
  let isGenerating = $state(false);
  let error = $state<string | null>(null);
  let audioElement = $state<HTMLAudioElement | null>(null);
  let isPlaying = $state(false);
  let isMuted = $state(false);
  let currentTime = $state(0);
  let duration = $state(0);

  // Function to find display name for a voice ID
  function getDisplayName(voiceId: string): string {
    for (const category in voices) {
      for (const displayName in voices[category]) {
        if (voices[category][displayName] === voiceId) {
          return displayName;
        }
      }
    }
    return voiceId;
  }

  const displayVoiceName = $derived(getDisplayName(voice));

  async function generateSpeech() {
    if (!text.trim()) return;

    isGenerating = true;
    error = null;
    audioUrl = null;

    try {
      const response = await fetch("https://tiktok-tts.weilnet.workers.dev/api/generation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          voice,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate speech");
      }

      const data = await response.json();
      const base64Audio = data.data;

      // Convert base64 to blob URL
      const byteCharacters = atob(base64Audio);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "audio/mp3" });
      audioUrl = URL.createObjectURL(blob);
    } catch (err) {
      console.error("Error generating speech:", err);
      error = err instanceof Error ? err.message : "An unknown error occurred";
    } finally {
      isGenerating = false;
    }
  }

  function downloadAudio() {
    if (!audioUrl) return;

    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `tts-${text.substring(0, 10).replace(/\s+/g, "_")}-${Date.now()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function togglePlay() {
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
  }

  function toggleMute() {
    if (!audioElement) return;

    audioElement.muted = !audioElement.muted;
    isMuted = audioElement.muted;
  }

  function updateAudioProgress(e: Event) {
    if (!audioElement) return;

    const rangeInput = e.target as HTMLInputElement;
    const newTime = (parseFloat(rangeInput.value) / 100) * duration;
    audioElement.currentTime = newTime;
    currentTime = newTime;
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }
</script>

<div class="container mx-auto px-4 py-6 md:py-8 max-w-3xl">
  <div class="space-y-4 md:space-y-6">
    <div>
      <h1 class="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Text-to-Speech</h1>
      <p class="text-sm md:text-base text-muted-foreground">Generate speech from text using TikTok's text-to-speech API</p>
    </div>

    <div class="grid md:grid-cols-2 gap-4">
      <div class="w-full">
        <label for="voice-select" class="block text-sm font-medium mb-1">Voice</label>
        <Select.Root type="single" bind:value={voice}>
          <Select.Trigger id="voice-select" class="w-full">
            {displayVoiceName || "Select a voice"}
          </Select.Trigger>
          <Select.Content class="max-h-[50vh] overflow-y-auto">
            {#each Object.entries(voices) as [category, voiceOptions]}
              <Select.Group>
                <div class="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{category}</div>
                {#each Object.entries(voiceOptions) as [displayName, voiceId]}
                  <Select.Item value={voiceId}>{displayName}</Select.Item>
                {/each}
              </Select.Group>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>

      <div class="w-full md:col-span-2">
        <label for="text-input" class="block text-sm font-medium mb-1">Text</label>
        <Textarea id="text-input" bind:value={text} placeholder="Enter text to convert to speech" class="min-h-24 md:min-h-32 w-full" />
        <div class="flex justify-between mt-1 text-xs">
          <span class={cn("text-muted-foreground", text.length >= 250 && text.length < 300 && "text-orange-500", text.length >= 300 && "text-red-500 font-medium")}>
            {text.length} / 300 characters
          </span>
          {#if text.length >= 250 && text.length < 300}
            <span class="text-orange-500">Approaching limit</span>
          {:else if text.length >= 300}
            <span class="text-red-500">Character limit reached!</span>
          {/if}
        </div>
      </div>

      <div class="md:col-span-2 flex flex-col sm:flex-row gap-2">
        <Button onclick={generateSpeech} disabled={isGenerating || !text.trim()} class="w-full sm:flex-1">
          {#if isGenerating}
            <Loader2 class="mr-2 h-4 w-4 animate-spin" />
            Generating...
          {:else}
            Generate Speech
          {/if}
        </Button>
      </div>

      {#if error}
        <div class="md:col-span-2 bg-destructive/15 p-3 rounded-md flex items-start gap-2 text-destructive">
          <AlertCircle class="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p class="text-sm">{error}</p>
        </div>
      {/if}

      {#if audioUrl}
        <div class="md:col-span-2 border rounded-lg p-4 bg-card shadow-sm">
          <audio
            src={audioUrl}
            bind:this={audioElement}
            onplay={() => (isPlaying = true)}
            onpause={() => (isPlaying = false)}
            ontimeupdate={() => {
              if (audioElement) {
                currentTime = audioElement.currentTime;
                duration = audioElement.duration || 0;
              }
            }}
            class="hidden"
          ></audio>

          <div class="flex items-center justify-between mb-3">
            <h3 class="font-medium text-sm md:text-base">Audio Preview</h3>
            <Button variant="outline" size="sm" onclick={downloadAudio} class="h-8 px-3 flex gap-1.5 items-center">
              <Save class="h-3.5 w-3.5" />
              <span class="text-xs">Download</span>
            </Button>
          </div>

          <div class="bg-gradient-to-br from-muted/50 to-muted/90 rounded-lg p-3 shadow-sm flex flex-col gap-3">
            <div class="flex items-center gap-3">
              <Button type="button" variant="ghost" size="icon" class="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm flex-shrink-0 transition-transform hover:scale-105" onclick={togglePlay}>
                {#if isPlaying}
                  <Pause class="h-5 w-5" />
                {:else}
                  <Play class="h-5 w-5 ml-0.5" />
                {/if}
              </Button>

              <div class="flex-1 flex items-center gap-2">
                <span class="text-xs font-medium text-muted-foreground w-10 text-right">{formatTime(currentTime)}</span>
                <div class="flex-1 relative group">
                  <input type="range" min="0" max="100" value={(currentTime / (duration || 1)) * 100} onchange={updateAudioProgress} class="w-full h-2 rounded-full outline-none cursor-pointer transition-all" />
                </div>
                <span class="text-xs font-medium text-muted-foreground w-10">{formatTime(duration)}</span>
              </div>

              <Button type="button" variant="ghost" size="icon" class="h-8 w-8 rounded-full hover:bg-muted/80 flex-shrink-0 transition-colors" onclick={toggleMute}>
                {#if isMuted}
                  <VolumeX class="h-4 w-4" />
                {:else}
                  <Volume2 class="h-4 w-4" />
                {/if}
              </Button>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
