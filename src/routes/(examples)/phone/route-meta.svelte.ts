import type { RouteMeta } from "../../api/routes/+server.js";
import screenshot from "$lib/images/screenshots/phone.jpeg";

export const meta: RouteMeta = {
  name: "Phone",
  status: "Completed",
  note: "",
  tags: ["3d"],
  featured: false,
  screenshot: screenshot,
};
