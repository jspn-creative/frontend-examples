import type { RouteMeta } from "../../api/routes/+server.js";
import screenshot from "$lib/images/screenshots/eclipse.jpeg";

export const meta: RouteMeta = {
  name: "Eclipse",
  status: "Completed",
  note: "",
  tags: ["3d"],
  featured: true,
  screenshot: screenshot,
};
