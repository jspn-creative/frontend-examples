<script lang="ts">
  import Nav from "./nav.svelte";
  import { Home, Book, Search, HousePlus, LandPlot, Landmark, Calculator, PocketKnife } from "@lucide/svelte";
  import type { NavItems } from "./types";
  const navItems: NavItems = {
    center: [
      { title: "Buyers", href: "#", icon: LandPlot },
      { title: "Sellers", href: "#", icon: Home },
      { title: "Financing", href: "#", icon: Landmark },
      // { title: "Home Buying 101", href: "#", icon: HousePlus },
    ],
    right: [
      {
        title: "Calculators",
        icon: Calculator,
        items: [
          { title: "Mortgage Calculator", href: "#" },
          { title: "Rent Calculator", href: "#" },
          { title: "Home Equity Calculator", href: "#" },
          { title: "Home Value Calculator", href: "#" },
          { title: "Sale Price Calculator", href: "#" },
          { title: "Monthly Payment Calculator", href: "#" },
          { title: "Property Tax Calculator", href: "#" },
        ],
      },

      {
        title: "Guides",
        icon: Book,
        items: [
          { title: "Maximizing You Home's Value", href: "#" },
          { title: "Finding the Right Home", href: "#" },
          { title: "Finding a Home Buyer", href: "#" },
          { title: "Home Buying 101", href: "#" },
          { title: "Home Selling 101", href: "#" },
          { title: "Financing 101", href: "#" },
        ],
      },
      {
        title: "Homeowner Resources",
        icon: PocketKnife,
        href: "#",
      },
    ],
  };
  let { children } = $props();
</script>

<div data-theme="light">
  <Nav center={navItems.center} right={navItems.right} />
  {@render children()}
</div>

<style>
  :global(html) {
    color-scheme: light !important;
  }

  :root {
    /* --background: 0 0% 100%; */
    --background: hsl(60deg 5% 96%); /* bg-stone-100 */
    --foreground: hsl(240deg 10% 3.9%);
    --card: hsl(60deg 5% 96%);
    --card-foreground: hsl(240deg 10% 3.9%);
    --popover: hsl(60deg 5% 96%);
    --popover-foreground: hsl(240deg 10% 3.9%);
    --primary: hsl(346.8deg 77.2% 49.8%);
    --primary-foreground: hsl(355.7deg 100% 97.3%);
    --secondary: hsl(240deg 4.8% 95.9%);
    --secondary-foreground: hsl(240deg 5.9% 10%);
    --muted: hsl(240deg 4.8% 95.9%);
    --muted-foreground: hsl(240deg 3.8% 46.1%);
    /* --accent: 240 4.8% 95.9%; */
    /* --accent: 353 96% 90%; bg-rose-200 */
    /* --accent: 24 5.75% 82.94%; bg-stone-300 */
    --accent: hsl(20 5.88% 90%); /* bg-stone-200 */
    /* --accent: 356 100% 95%;bg-rose-100 */
    --accent-foreground: hsl(240deg 5.9% 10%);
    --destructive: hsl(0 72.22% 50.59%);
    --destructive-foreground: hsl(0 0% 98%);
    --border: hsl(240deg 5.9% 90%);
    --input: hsl(240deg 5.9% 90%);
    --ring: hsl(346.8deg 77.2% 49.8%);
    --radius: 0.75rem;
  }
</style>
