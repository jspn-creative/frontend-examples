<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Menubar from "./menubar";

  import type { NavItems } from "./types";
  import { Search, ChevronDown, LifeBuoy } from "@lucide/svelte";
  let resources = ["Mortgages", "Insurance", "Moving"];
  let showOtherServices = $state(false);
  let { center, right }: NavItems = $props();
</script>

<header class="bg-background shadow-sm py-3">
  <nav class="container mx-auto flex items-center justify-between">
    <a href="/" class="group text-stone-700 text-2xl font-bold font-display">
      <span class="text-stone-500 transition-colors duration-1000 group-hover:text-rose-700">Gebentley</span>McKay
      <!-- <span class="text-stone-500">Hurdy</span>McGurdly -->
    </a>
    <div class="flex items-center rounded-md p-1.5">
      <ul class="hidden lg:flex">
        {#each center as item}
          <li class="px-2">
            <Button class="hover:bg-background group transition-colors duration-500" variant="ghost" href={item.href}
              ><svelte:component this={item.icon} class="mr-1.5 w-4 h-4 text-stone-700/30 transition-colors duration-500 group-hover:text-rose-400/100 " />
              {item.title}</Button
            >
          </li>
        {/each}
        <!-- <li class="px-2">
					<Button class="hover:bg-background" variant="ghost" href="/commercial"
						><LandPlot class="mr-1.5 w-4 h-4" /> Search</Button
					>
				</li>
				<li class="px-2">
					<Button class="hover:bg-background" variant="ghost" href="/buy"
						><Home class="mr-1.5 w-4 h-4" /> Buy</Button
					>
				</li>
				<li class="px-2">
					<Button class="hover:bg-background" variant="ghost" href="/rent"
						><Building2 class="mr-1.5 w-4 h-4" /> Sell</Button
					>
				</li> -->
      </ul>
    </div>
    <div class="flex items-center space-x-4">
      <div class="relative hidden md:block">
        <Menubar.Root>
          <Menubar.Menu>
            <Menubar.Trigger><LifeBuoy class="mr-1 w-4 h-4" />Other Resources <ChevronDown class="ml-1 w-4 h-4" /></Menubar.Trigger>
            <Menubar.Content>
              {#each right as item}
                {#if item.items && item.items.length > 0}
                  <Menubar.Sub>
                    <Menubar.SubTrigger class="inline-flex items-center w-full gap-1.5">
                      <svelte:component this={item.icon} class="w-4 h-4" />
                      {item.title}
                    </Menubar.SubTrigger>
                    <Menubar.SubContent class="w-full">
                      {#each item.items as subItem}
                        <Menubar.Item>
                          {@render menuLink(subItem)}
                        </Menubar.Item>
                      {/each}
                    </Menubar.SubContent>
                  </Menubar.Sub>
                {:else}
                  <Menubar.Item>
                    {@render menuLink(item)}
                    <!-- <Menubar.Shortcut>⌘T</Menubar.Shortcut> -->
                  </Menubar.Item>
                  <!-- <Menubar.Separator /> -->
                {/if}
              {/each}
            </Menubar.Content>
          </Menubar.Menu>
        </Menubar.Root>
        {#if showOtherServices}
          <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            {#each resources as resource}
              <a href="#{resource.toLowerCase()}" class="block px-4 py-2 text-sm leading-none text-stone-700 hover:bg-stone-100">{resource}</a>
            {/each}
          </div>
        {/if}
      </div>
      <Button href="https://www.google.com/search?q=homes+4+sale">Start your Search <Search class="ml-2 h-4 w-4" /></Button>
    </div>
  </nav>
</header>

{#snippet menuLink(item)}
  <a href={item.href} class="inline-flex items-center gap-1.5">
    {#if item.icon}
      <svelte:component this={item.icon} class="w-4 h-4" />
    {/if}
    {item.title}
  </a>
{/snippet}
