import { json } from "@sveltejs/kit";

export type RouteMeta = {
  name?: string;
  status?: "WIP" | "Completed" | "Inactive";
  note?: string;
  tags?: string[];
  featured?: boolean;
  hidden?: boolean;
  screenshot?: string;
};

const pageModules = import.meta.glob("/src/routes/**/+page.svelte");
const metaModules = import.meta.glob<{ meta: RouteMeta }>("/src/routes/**/route-meta.{ts,svelte.ts}", { eager: true });

export async function GET({ url }) {
  const routes: Array<{
    path: string;
    name: string;
    status?: "WIP" | "Completed" | "Inactive";
    note?: string;
    tags?: string[];
    featured?: boolean;
  }> = [];

  const targetDirectory = url.searchParams.get("directory");

  // Add the root route
  // routes.push({
  //   path: '/',
  //   name: 'Home',
  //   status: 'Completed'
  // });

  for (const path in pageModules) {
    // Convert from "/src/routes/my-page/+page.svelte" to "/my-page"
    const routePath = path.replace("/src/routes", "").replace("/+page.svelte", "");

    // Skip non-route paths, API routes, and root
    if (routePath === "" || routePath.includes("/_") || routePath.includes("/+") || routePath.includes("/api")) {
      continue;
    }

    // If a target directory is specified, only include routes from that directory
    if (targetDirectory && !routePath.startsWith(`/${targetDirectory}`)) {
      continue;
    }

    // Convert path to readable name (my-component → My Component)
    const segments = routePath.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    const routeName = lastSegment
      .split("-")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const cleanedPath = routePath.replace(/\/\([^)]+\)/g, "");

    const routeObject = {
      path: cleanedPath,
      name: routeName,
      internalPath: routePath,
    };

    // Check for both .ts and .svelte.ts route-meta files
    const metaPathTs = `/src/routes${routePath}/route-meta.ts`;
    const metaPathSvelteTs = `/src/routes${routePath}/route-meta.svelte.ts`;

    let metaData = null;
    if (metaPathSvelteTs in metaModules && metaModules[metaPathSvelteTs].meta) {
      metaData = metaModules[metaPathSvelteTs].meta;
    } else if (metaPathTs in metaModules && metaModules[metaPathTs].meta) {
      metaData = metaModules[metaPathTs].meta;
    }

    if (metaData) {
      // Merge the metadata with the route object
      Object.assign(routeObject, metaData);
    }

    routes.push(routeObject);
  }

  // Sort routes alphabetically, keeping Home at the top
  routes.sort((a, b) => {
    if (a.path === "/") return -1;
    if (b.path === "/") return 1;
    return a.name.localeCompare(b.name);
  });

  return json(routes);
}
