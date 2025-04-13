import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const { url, route, request } = event;

  let shouldSkipSplash = false;
  if (route.id?.includes("(api)")) {
    return resolve(event);
  }

  // Handle no-JS cases, but will also disable splash screen on page refresh: SvelteKit will not reset the 'Referer' header on page refresh, so we would have to manually catch beforeunload and do it ourselves if we want shouldSkipSplash to remain false on page refresh. I think.
  // const referer = request.headers.get("Referer");
  // if (referer) {
  //   const urlReferer = new URL(referer);
  //   if (urlReferer.origin === url.origin) {
  //     shouldSkipSplash = true;
  //   }
  // }

  if (route.id?.includes('(api)')) {
  	shouldSkipSplash = true;
  }

  const response = await resolve(event, {
    transformPageChunk: ({ html }) => html.replace("%splash-skip%", String(shouldSkipSplash)),
  });

  return response;
};
