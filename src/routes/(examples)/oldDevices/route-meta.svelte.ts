import type { RouteMeta } from "../../api/routes/+server.js";
import screenshot from "$lib/images/screenshots/oldDevices.jpeg";

export const meta: RouteMeta = {
  name: "OldDevices",
  status: "WIP",
  note: "For reference only.",
  tags: ["3d"],
  featured: false,
  hidden: true,
  screenshot: screenshot,
};
