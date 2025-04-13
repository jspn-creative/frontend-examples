<script lang="ts">
  import { page } from "$app/state";
  import { ExternalLinkIcon, Grid, List, ChevronRight, Server, ArrowUpRight, Layers, ExternalLink, Image, Command, RefreshCcw, Star, Plus, ArrowUpDown } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu2/index.js";
  import { onMount } from "svelte";

  type Route = {
    path: string;
    name: string;
    internalPath?: string; // Path including (examples) for file system operations
    previewUrl?: string; // Optional URL to a screenshot/thumbnail of the route
    status?: "WIP" | "Completed" | "Inactive";
    note?: string;
    tags?: string[];
    featured?: boolean;
  };

  let routes = $state<Route[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let isGridView = $state(false);
  let showPreviews = $state(true);
  let mouseX = $state(0);
  let mouseY = $state(0);
  let hoveredRouteIndex = $state<number | null>(null);
  let hoveredRoutes = $state<number[]>([]);
  let previewsLoaded = $state<boolean[]>([]);
  let previewsContainer: HTMLDivElement | null = $state(null);
  let searchQuery = $state("");
  let sortOrder = $state<"asc" | "desc">("asc");
  let activeStatusFilter = $state<"WIP" | "Completed" | "Inactive" | null>(null);
  let activeTagFilter = $state<string | null>(null);
  let isGeneratingMetadata = $state(false);
  let visiblePreviews = $state<Set<number>>(new Set());
  let previewObserver: IntersectionObserver | null = $state(null);

  const currentPath = $derived(page.url.pathname);

  function isCurrentRoute(routePath: string): boolean {
    const normalizedCurrentPath = currentPath.endsWith("/") ? currentPath.slice(0, -1) : currentPath;
    const normalizedRoutePath = routePath.endsWith("/") ? routePath.slice(0, -1) : routePath;
    return normalizedCurrentPath === normalizedRoutePath;
  }

  const sortedAndFilteredRoutes = $derived(
    (() => {
      if (!routes.length) return [];
      let filtered = [...routes];
      if (searchQuery) {
        filtered = filtered.filter((route) => route.name.toLowerCase().includes(searchQuery.toLowerCase()) || route.path.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      if (activeStatusFilter !== null) {
        filtered = filtered.filter((route) => route.status === activeStatusFilter);
      }
      if (activeTagFilter) {
        filtered = filtered.filter((route) => route.tags?.some((tag) => tag === activeTagFilter));
      }
      return filtered.sort((a, b) => {
        if (a.path === "/") return -1;
        if (b.path === "/") return 1;
        const sortFactor = sortOrder === "asc" ? 1 : -1;
        return sortFactor * a.name.localeCompare(b.name);
      });
    })()
  );

  const uniqueTags = $derived(
    (() => {
      if (!routes.length) return [];

      const tagSet = new Set<string>();
      routes.forEach((route) => {
        if (route.tags && route.tags.length) {
          route.tags.forEach((tag) => tagSet.add(tag));
        }
      });

      return Array.from(tagSet).sort();
    })()
  );

  $effect(() => {
    fetchRoutes();
  });

  $effect(() => {
    if (routes.length > 0) {
      previewsLoaded = Array(routes.length).fill(false);
    }
  });

  onMount(() => {
    previewObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const iframe = entry.target;
          const indexAttr = iframe.getAttribute("data-index");

          if (entry.isIntersecting && indexAttr) {
            const index = parseInt(indexAttr, 10);
            if (!visiblePreviews.has(index)) {
              visiblePreviews.add(index);
              visiblePreviews = new Set(visiblePreviews); // Trigger reactivity
            }
          }
        });
      },
      { rootMargin: "100px", threshold: 0.1 }
    );

    return () => {
      if (previewObserver) {
        previewObserver.disconnect();
      }
    };
  });

  function observeElement(node: HTMLElement, index: number) {
    if (previewObserver) {
      node.setAttribute("data-index", index.toString());
      previewObserver.observe(node);

      return {
        destroy() {
          if (previewObserver) {
            previewObserver.unobserve(node);
          }
        },
      };
    }
  }

  async function fetchRoutes() {
    try {
      loading = true;
      error = null;
      const response = await fetch("/api/routes?directory=(examples)");

      if (!response.ok) {
        throw new Error(`Failed to fetch routes: ${response.statusText}`);
      }

      routes = await response.json();
    } catch (err) {
      console.error("Error fetching routes:", err);
      error = err instanceof Error ? err.message : "An unknown error occurred";
    } finally {
      loading = false;
    }
  }

  function toggleView() {
    isGridView = !isGridView;
  }

  function togglePreviews() {
    showPreviews = !showPreviews;
  }

  function handleMouseMove(event: MouseEvent) {
    if (hoveredRouteIndex !== null && showPreviews && !isGridView) {
      mouseX = event.clientX;
      mouseY = event.clientY;
    }
  }

  function handleRouteMouseEnter(index: number) {
    hoveredRouteIndex = index;
    !hoveredRoutes.includes(index) ? hoveredRoutes.push(index) : null;
    // console.log("hoveredRoutes", $state.snapshot(hoveredRoutes));
  }

  function handleRouteMouseLeave() {
    hoveredRouteIndex = null;
  }

  function handleIframeLoad(index: number) {
    const newLoaded = [...previewsLoaded];
    newLoaded[index] = true;
    previewsLoaded = newLoaded;
  }

  function toggleSortOrder() {
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
  }

  async function generateMetadata(route: Route) {
    try {
      isGeneratingMetadata = true;
      const routePath = route.internalPath || route.path;
      const formattedPath = routePath.startsWith("/") ? routePath : `/${routePath}`;
      const response = await fetch(`/api/generate-metadata?routePath=${encodeURIComponent(formattedPath)}`);
      const data = await response.json();

      if (response.ok) {
        if (data.success) {
          toast.success(`${data.message}`, {
            action: data.filePath
              ? {
                  label: "🔗",
                  onClick: () => openInEditor(data.filePath),
                }
              : undefined,
            duration: 8000,
          });
          try {
            const fetchResponse = await fetch("/api/routes?directory=(examples)");
            if (fetchResponse.ok) {
              routes = await fetchResponse.json();
            }
          } catch (fetchErr) {
            console.error("Error refreshing routes:", fetchErr);
          }
        } else {
          toast.error(data.message, { duration: 8000 });
        }
      } else {
        throw new Error(data.message || "Failed to generate metadata");
      }
    } catch (err) {
      console.error("Error generating metadata:", err);
      toast.error(err instanceof Error ? err.message : "Failed to generate metadata", { duration: 8000 });
    } finally {
      isGeneratingMetadata = false;
    }
  }

  function hasMetadata(route: Route): boolean {
    return !!(route.status || route.note || route.tags || route.featured);
  }

  function handleMetadataButtonClick(event: MouseEvent, route: Route) {
    event.preventDefault();
    event.stopPropagation();
    generateMetadata(route);
    return false;
  }

  function openInEditor(filePath: string) {
    const isAbsolutePath = filePath.startsWith("/");
    const vscodePath = isAbsolutePath ? `vscode://file/${filePath}` : `vscode://file/${window.location.origin}/${filePath}`;

    const editors = {
      vscode: vscodePath,
      cursor: `cursor://open?url=file://${encodeURIComponent(filePath)}`,
      webstorm: `webstorm://open?file=${filePath}`,
      atom: `atom://core/open/file?filename=${encodeURIComponent(filePath)}`,
      sublime: `subl://open?url=file://${encodeURIComponent(filePath)}`,
    };

    window.open(editors.cursor);

    // TODO: Make this configurable with a dropdown?
  }
</script>

<svelte:head>
  {#each sortedAndFilteredRoutes as route}
    <link rel="preconnect" href={route.path} />
  {/each}
</svelte:head>

<svelte:window onmousemove={handleMouseMove} />

<div class="min-h-screen h-full w-full bg-black text-white flex flex-col relative overflow-auto">
  <!-- Background -->
  <div class="absolute bottom-0 left-0 right-0 top-0 opacity-50 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_150%_40%_at_50%_0%,#000_30%,transparent_50%),radial-gradient(ellipse_150%_60%_at_50%_100%,#000_0%,transparent_50%)]"></div>
  <main class="container mx-auto flex-1 py-16 px-4 relative z-10 max-w-7xl">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-3xl font-normal mb-2 text-white tracking-tighter">Page Routes</h1>
        <div class="flex items-center">
          <Command size={14} class="text-zinc-400 mr-1.5" />
          <p class="text-zinc-400 text-sm font-normal">{sortedAndFilteredRoutes.length} of {routes.length} examples</p>
        </div>
      </div>

      {#if !loading && !error && routes.length > 0}
        <div class="mt-6 sm:mt-0 flex items-center gap-3">
          <button
            onclick={toggleView}
            class="group relative h-8 px-2.5 rounded-md transition-all duration-200
                  border bg-zinc-950 border-zinc-800 hover:border-zinc-700"
            aria-label={isGridView ? "Switch to list view" : "Switch to grid view"}
          >
            {#if isGridView}
              <Grid size={16} class="text-white" />
            {:else}
              <List size={16} class="text-white" />
            {/if}
          </button>

          <button
            onclick={togglePreviews}
            class="group relative h-8 px-2.5 rounded-md transition-all duration-200 hover:border-zinc-700
                   border {showPreviews ? 'bg-primary/20 border-primary/30' : 'border-zinc-800'}
                   "
            aria-label={showPreviews ? "Hide previews" : "Show previews"}
          >
            <Image size={16} class={showPreviews ? "text-primary" : "text-zinc-400"} />
          </button>
        </div>
      {/if}
    </div>

    {#if !loading && !error && routes.length > 0}
      <div class="mb-6 flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1">
          <Input type="text" placeholder="Search examples..." bind:value={searchQuery} class="w-full bg-zinc-900/60 border-zinc-800 text-zinc-300 placeholder:text-zinc-600" />
          {#if searchQuery}
            <button onclick={() => (searchQuery = "")} aria-label="Clear search" class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          {/if}
        </div>

        <!-- Status Filter Dropdown -->
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button variant="outline" class="{activeStatusFilter ? 'bg-zinc-800/80 border-zinc-700' : 'bg-zinc-900/60 border-zinc-800'} sm:w-auto w-full text-zinc-300 hover:border-zinc-700 transition-all flex items-center justify-center gap-2">
              <span class="text-sm whitespace-nowrap">Status: {activeStatusFilter || "All"}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content class="bg-zinc-900 border border-zinc-800 rounded-md shadow-lg overflow-hidden">
            <DropdownMenu.Item
              onclick={() => (activeStatusFilter = null)}
              class="px-3 py-2 text-left text-sm hover:bg-zinc-800 text-zinc-300
                    {activeStatusFilter === null ? 'bg-zinc-800' : ''}"
            >
              All
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onclick={() => (activeStatusFilter = "WIP")}
              class="px-3 py-2 text-left text-sm hover:bg-zinc-800 text-amber-300
                    {activeStatusFilter === 'WIP' ? 'bg-zinc-800' : ''}"
            >
              WIP
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onclick={() => (activeStatusFilter = "Completed")}
              class="px-3 py-2 text-left text-sm hover:bg-zinc-800 text-green-300
                    {activeStatusFilter === 'Completed' ? 'bg-zinc-800' : ''}"
            >
              Completed
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onclick={() => (activeStatusFilter = "Inactive")}
              class="px-3 py-2 text-left text-sm hover:bg-zinc-800 text-zinc-400
                    {activeStatusFilter === 'Inactive' ? 'bg-zinc-800' : ''}"
            >
              Inactive
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        <!-- Tags Filter Dropdown -->
        {#if uniqueTags.length > 0}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button
                variant="outline"
                class="sm:w-auto w-full bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700 transition-all flex items-center justify-center gap-2
                      {activeTagFilter ? 'bg-zinc-800/80 border-zinc-700' : ''}"
              >
                <span class="text-sm whitespace-nowrap truncate">Tag: {activeTagFilter || "All"}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content class="min-w-full w-max max-w-[200px] bg-zinc-900 border border-zinc-800 rounded-md shadow-lg overflow-hidden">
              <DropdownMenu.Item
                onclick={() => (activeTagFilter = null)}
                class="px-3 py-2 text-left text-sm hover:bg-zinc-800 text-zinc-300
                      {!activeTagFilter ? 'bg-zinc-800' : ''}"
              >
                All Tags
              </DropdownMenu.Item>

              {#each uniqueTags as tag}
                <DropdownMenu.Item
                  onclick={() => (activeTagFilter = tag)}
                  class="px-3 py-2 text-left text-sm hover:bg-zinc-800 text-zinc-300
                        {activeTagFilter === tag ? 'bg-zinc-800' : ''}"
                >
                  {tag}
                </DropdownMenu.Item>
              {/each}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        {/if}

        <Button
          variant="outline"
          onclick={toggleSortOrder}
          class="sm:w-auto w-full bg-zinc-900/60 border-zinc-800 text-zinc-300
                hover:border-zinc-700 transition-all flex items-center justify-center gap-2"
        >
          <span class="text-sm">Sort {sortOrder === "asc" ? "A → Z" : "Z → A"}</span>
          <ArrowUpDown size={14} class="transition-transform {sortOrder === 'desc' ? 'rotate-180' : ''}" />
        </Button>
      </div>
    {/if}

    {#if loading}
      <div class="flex justify-center py-20">
        <div class="h-5 w-5 rounded-full border-2 border-zinc-800 border-t-white animate-spin"></div>
      </div>
    {:else if error}
      <div class="p-6 mb-6 border border-red-800 bg-red-500/5 rounded-lg">
        <div class="flex items-center mb-2">
          <p class="text-red-400 font-medium">Error loading examples</p>
        </div>
        <p class="text-zinc-400 text-sm">{error}</p>
        <button
          onclick={fetchRoutes}
          class="mt-4 px-4 py-1.5 text-sm bg-zinc-950 hover:bg-zinc-900 text-white
                 border border-zinc-800 rounded-md transition-colors duration-200
                 flex items-center gap-2"
        >
          <span>Retry</span>
          <RefreshCcw size={14} class="text-zinc-400" />
        </button>
      </div>
    {:else if sortedAndFilteredRoutes.length === 0}
      <div class="p-8 border border-zinc-800 bg-zinc-900/40 rounded-lg flex flex-col items-center justify-center text-center">
        <div class="w-12 h-12 rounded-full bg-zinc-800/60 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-zinc-300 mb-2">No examples found</h3>
        <p class="text-zinc-500 text-sm max-w-md">We couldn't find any example routes matching your search query. Try using different keywords or clear the search.</p>
        <button
          onclick={() => (searchQuery = "")}
          class="mt-4 px-4 py-1.5 text-sm bg-zinc-950 hover:bg-zinc-900 text-white
                 border border-zinc-800 rounded-md transition-colors duration-200"
        >
          Clear search
        </button>
      </div>
    {:else}
      <div class="grid grid-cols-1 grid-rows-1 mb-12">
        <!-- Grid View -->
        <div
          id="grid-view"
          class="col-start-1 row-start-1 w-full transition-all duration-300 ease-in-out
                {isGridView ? 'opacity-100 blur-0 translate-y-0 z-10' : 'h-0 overflow-clip opacity-0 blur-sm translate-y-1 -z-10 pointer-events-none'}"
        >
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {#each sortedAndFilteredRoutes as route, i}
              <a
                href={route.path}
                class="group relative block overflow-hidden rounded-lg transition-all duration-200 p-3
                     {isCurrentRoute(route.path) ? 'ring-2 ring-primary/30 bg-zinc-900/80' : 'bg-zinc-900/40 border border-zinc-800/40 hover:border-zinc-700/60'}"
              >
                <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {#if showPreviews}
                  <div class="relative aspect-video w-full overflow-hidden bg-zinc-950 rounded-md mb-3" use:observeElement={i}>
                    {#if isCurrentRoute(route.path)}
                      <div class="absolute top-2 right-2 z-20 flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded text-xs uppercase text-white/90">Active</div>
                    {/if}
                    <div class="w-full h-full absolute inset-0 z-10 opacity-70 bg-gradient-to-b from-transparent via-transparent to-zinc-950/80 group-hover:opacity-0 transition-opacity duration-300"></div>
                    <div class="w-full h-full absolute inset-0 z-[5] opacity-80 group-hover:opacity-0 transition-all duration-300 pattern"></div>

                    {#if visiblePreviews.has(i) || isCurrentRoute(route.path)}
                      <iframe src={route.path} title={route.name} class="w-[200%] h-[200%] scale-[0.5] origin-top-left border-0 pointer-events-none" loading="lazy" sandbox="allow-scripts"></iframe>
                    {:else}
                      <div class="absolute inset-0 flex items-center justify-center bg-zinc-900">
                        <div class="w-6 h-6 rounded-full border border-zinc-700 border-t-primary animate-pulse"></div>
                      </div>
                    {/if}
                  </div>
                {/if}

                <div class="space-y-3">
                  <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2">
                      {#if isCurrentRoute(route.path)}
                        <div class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                      {/if}
                      <h2 class="text-sm font-medium {isCurrentRoute(route.path) ? 'text-white' : 'text-zinc-300 group-hover:text-white'} transition-colors duration-200">
                        {route.name}
                      </h2>

                      {#if route.featured}
                        <span class="flex items-center justify-center">
                          <Star size={12} class="text-primary" />
                        </span>
                      {/if}
                    </div>

                    {#if isCurrentRoute(route.path)}
                      <div class="flex items-center px-2 py-1 rounded bg-primary/10 border border-primary/20">
                        <div class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse mr-1.5"></div>
                        <span class="text-xs uppercase text-zinc-300">Active</span>
                      </div>
                    {:else if route.status}
                      <div class="flex items-center px-2 py-1 rounded {route.status === 'WIP' ? 'bg-amber-500/10 border border-amber-500/20' : route.status === 'Completed' ? 'bg-green-500/10 border border-green-500/20' : 'bg-zinc-500/10 border border-zinc-500/20'}">
                        <span class="text-[10px] {route.status === 'WIP' ? 'text-amber-300' : route.status === 'Completed' ? 'text-green-300' : 'text-zinc-400'}">{route.status}</span>
                      </div>
                    {/if}
                  </div>

                  <p class="font-mono text-[10px] text-zinc-500 group-hover:text-zinc-400 transition-colors duration-200 flex items-center gap-1">
                    {route.path}
                    <ExternalLink size={10} class="inline text-zinc-600 group-hover:text-zinc-400" />
                  </p>

                  {#if route.note}
                    <p class="mt-2 text-xs text-zinc-500 line-clamp-2">{route.note}</p>
                  {/if}

                  <div class="mt-3 flex flex-wrap gap-1.5 items-center">
                    {#if route.tags && route.tags.length > 0}
                      {#each route.tags as tag}
                        <span class="px-2.5 py-1 text-[10px] bg-zinc-800/50 text-zinc-400 rounded-full">
                          {tag}
                        </span>
                      {/each}
                    {/if}
                  </div>

                  {#if !hasMetadata(route)}
                    <button
                      onclick={(e) => handleMetadataButtonClick(e, route)}
                      class="px-2 py-1 text-xs border border-zinc-700 rounded bg-zinc-800 text-zinc-300
                             hover:bg-zinc-700 hover:text-white transition-colors flex items-center relative z-10 group/meta"
                      disabled={isGeneratingMetadata}
                    >
                      {#if isGeneratingMetadata}
                        <div class="w-3 h-3 rounded-full border border-zinc-500 border-t-zinc-300 animate-spin mr-1"></div>
                        <span>Adding...</span>
                      {:else}
                        <Plus size={10} class="currentColor" />
                        <span class="w-0 overflow-hidden group-hover/meta:w-auto group-hover/meta:ml-1 transition-all duration-200">Metadata</span>
                      {/if}
                    </button>
                  {/if}
                </div>
              </a>
            {/each}
          </div>
        </div>

        <!-- List View -->
        <div
          id="list-view"
          class="col-start-1 row-start-1 w-full transition-all duration-300 ease-in-out
                {!isGridView ? 'opacity-100 blur-0 translate-y-0 z-10' : 'opacity-0 blur-sm translate-y-1 -z-10 pointer-events-none'}"
        >
          <div class="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900/40">
            <!-- Table header -->
            <div class="bg-zinc-900/60 border-b border-zinc-800 py-3 px-4 hidden sm:grid sm:grid-cols-[80px_2fr_1fr_100px_80px] gap-4 sm:gap-6 text-xs text-zinc-500 sticky top-0">
              <div>ID</div>
              <div>NAME</div>
              <div>PATH</div>
              <div>STATUS</div>
              <div class="text-center">LINKS</div>
            </div>

            {#each sortedAndFilteredRoutes as route, i}
              <a
                href={route.path}
                class="group relative block transition-all duration-200 border-b border-zinc-800/50 last:border-0
                      {isCurrentRoute(route.path) ? 'bg-zinc-800/50' : 'hover:bg-zinc-800/30'}"
                onmousemove={handleMouseMove}
                onmouseenter={() => handleRouteMouseEnter(i)}
                onmouseleave={handleRouteMouseLeave}
              >
                <div class="flex sm:grid sm:grid-cols-[80px_2fr_1fr_100px_80px] gap-4 sm:gap-6 items-center p-4">
                  <!-- Index/ID column -->
                  <div class="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded font-mono text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700 transition-colors">{(i + 1).toString().padStart(2, "0")}</div>

                  <!-- Name column - only shown on mobile -->
                  <div class="flex flex-col sm:hidden flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <h2 class="text-sm font-medium text-zinc-300 group-hover:text-white truncate">{route.name}</h2>
                      {#if route.featured}
                        <span class="flex items-center justify-center">
                          <Star size={12} class="text-primary" />
                        </span>
                      {/if}
                    </div>
                    <p class="text-xs text-zinc-500 truncate">{route.path}</p>

                    {#if route.tags && route.tags.length > 0}
                      <div class="flex flex-wrap gap-1 mt-1.5">
                        {#each route.tags.slice(0, 2) as tag}
                          <span class="px-1 py-0.5 text-[9px] bg-zinc-800/50 text-zinc-400 rounded-full">
                            {tag}
                          </span>
                        {/each}
                        {#if route.tags.length > 2}
                          <span class="px-1 py-0.5 text-[9px] bg-zinc-800/50 text-zinc-400 rounded-full">
                            +{route.tags.length - 2}
                          </span>
                        {/if}
                      </div>
                    {/if}
                  </div>

                  <!-- Name column - desktop -->
                  <div class="hidden sm:flex items-center gap-2 truncate">
                    <h2 class="text-sm font-medium text-zinc-300 group-hover:text-white truncate">{route.name}</h2>
                    {#if route.featured}
                      <span class="flex items-center justify-center">
                        <Star size={12} class="text-primary" />
                      </span>
                    {/if}
                  </div>

                  <!-- Path column - desktop -->
                  <div class="hidden sm:block">
                    <p class="text-xs text-zinc-500 truncate">{route.path}</p>
                    {#if route.tags && route.tags.length > 0}
                      <div class="flex flex-wrap gap-1 mt-1">
                        {#each route.tags.slice(0, 3) as tag}
                          <span class="px-1.5 py-0.5 text-[9px] bg-zinc-800/50 text-zinc-400 rounded-full">
                            {tag}
                          </span>
                        {/each}
                        {#if route.tags.length > 3}
                          <span class="px-1 py-0.5 text-[9px] bg-zinc-800/50 text-zinc-400 rounded-full">
                            +{route.tags.length - 3}
                          </span>
                        {/if}
                      </div>
                    {/if}
                  </div>

                  <!-- Status column -->
                  <div class="ml-auto sm:ml-0">
                    {#if isCurrentRoute(route.path)}
                      <div class="flex items-center px-2 py-1 rounded bg-primary/10 border border-primary/20">
                        <div class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse mr-1.5"></div>
                        <span class="text-xs uppercase text-zinc-300">Active</span>
                      </div>
                    {:else if route.status}
                      <div class="flex items-center justify-evenly px-2 py-1 rounded {route.status === 'WIP' ? 'bg-amber-500/10 border border-amber-500/20' : route.status === 'Completed' ? 'bg-green-500/10 border border-green-500/20' : 'bg-zinc-500/10 border border-zinc-500/20'}">
                        <span class="text-xs {route.status === 'WIP' ? 'text-amber-300' : route.status === 'Completed' ? 'text-green-300' : 'text-zinc-400'}">{route.status}</span>
                      </div>
                    {:else if !hasMetadata(route)}
                      <button
                        onclick={(e) => handleMetadataButtonClick(e, route)}
                        class="px-2 py-1 text-xs border border-zinc-700 rounded bg-zinc-800 text-zinc-300
                              hover:bg-zinc-700 hover:text-white transition-colors flex items-center relative z-10 group/meta"
                        disabled={isGeneratingMetadata}
                      >
                        {#if isGeneratingMetadata}
                          <div class="w-3 h-3 rounded-full border border-zinc-500 border-t-zinc-300 animate-spin mr-1"></div>
                          <span>Adding...</span>
                        {:else}
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                          <span class="w-0 overflow-hidden group-hover/meta:w-auto group-hover/meta:ml-0.5 transition-all duration-200">Metadata</span>
                        {/if}
                      </button>
                    {:else}
                      <div class="w-6 h-6 rounded opacity-60 flex items-center justify-center group-hover:opacity-100 transition-opacity">
                        <ArrowUpRight size={14} class="text-zinc-500 group-hover:text-white transition-colors duration-200" />
                      </div>
                    {/if}
                  </div>

                  <!-- Links column -->
                  <div class="hidden sm:flex items-center justify-center">
                    <ArrowUpRight size={16} class="text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                  </div>
                </div>
              </a>
            {/each}
          </div>
        </div>

        <div bind:this={previewsContainer} class="{showPreviews && !isGridView ? '' : 'hidden'} fixed z-50 pointer-events-none">
          {#each sortedAndFilteredRoutes as route, i}
            <div
              class="w-72 lg:w-96 aspect-video absolute top-0 left-0"
              style="
                  opacity: {hoveredRouteIndex === i ? 1 : 0}; 
                  visibility: {hoveredRouteIndex === i ? 'visible' : 'hidden'};
                  transform: translate({mouseX + 10}px, {mouseY - 190}px);
                  transition: opacity 150ms ease-out, visibility 150ms ease-out;
                  will-change: transform;
                "
            >
              <div class="w-full h-full overflow-hidden rounded-md relative bg-zinc-950 shadow-[0_8px_30px_rgba(0,0,0,0.7)] {isCurrentRoute(route.path) ? 'border-2 border-primary' : 'border border-zinc-700'}">
                <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none z-10"></div>

                {#if isCurrentRoute(route.path)}
                  <div class="absolute top-2 right-2 z-20 flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded-sm">
                    <div class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                    <span class="text-xs uppercase text-white">Active</span>
                  </div>
                {/if}

                <!-- Show spinner while loading -->
                {#if !previewsLoaded[i]}
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="w-6 h-6 rounded-full border border-zinc-700 border-t-primary animate-spin"></div>
                  </div>
                {/if}

                {#if hoveredRoutes.includes(i)}
                  <iframe src={route.path} title={route.name} class="w-[250%] h-[250%] scale-[0.4] origin-top-left border-0 pointer-events-none" loading="lazy" sandbox="allow-scripts" onload={() => handleIframeLoad(i)}></iframe>
                {/if}

                <div class="absolute bottom-2 left-2 right-2 text-xs uppercase text-zinc-400 truncate z-20">
                  <span class="text-zinc-300 mr-1">Preview:</span>
                  {route.path}
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-6 pt-4 border-t border-zinc-800/50 flex justify-between items-center">
        <div class="text-xs text-zinc-500">
          <span class="text-zinc-400">{sortedAndFilteredRoutes.length}</span> of {routes.length} routes
        </div>
        <div class="text-xs text-zinc-500 flex items-center gap-1.5">
          <a href="https://jaspin.io" target="_blank" class="hover:text-primary transition-colors duration-200">jspn<span class="font-extrabold">creative</span></a>
        </div>
      </div>
    {/if}
  </main>
</div>
