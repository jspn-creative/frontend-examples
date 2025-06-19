import type { RouteMeta } from "../../api/routes/+server.js";
import screenshot from "$lib/images/screenshots/img-labels.jpeg";

export const meta: RouteMeta = {
  name: "Img Labels",
  status: "Completed",
  note: "Responsive image label cutouts. Might not seem like much, but I promise they're pretty neat.",
  tags: [],
  featured: false,
  screenshot: screenshot,
};
