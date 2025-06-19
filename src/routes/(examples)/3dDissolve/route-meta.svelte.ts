import type { RouteMeta } from "../../api/routes/+server.js";
import screenshot from "$lib/images/screenshots/3dDissolve.jpeg";

export const meta: RouteMeta = {
  name: "3dDissolve",
  status: "WIP",
  note: "An exploration in post processing. Need to fix resolution issues.",
  tags: ["3d"],
  featured: false,
  screenshot: screenshot,
};
