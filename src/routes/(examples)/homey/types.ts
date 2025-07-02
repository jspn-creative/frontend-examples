import type { Component } from "svelte";
import { Icon } from "@lucide/svelte";

export interface NavItems {
  center: IconNavItem[];
  right: NavItem[];
}

interface NavItem {
  title: string;
  href?: string;
  items?: NavItem[];
  icon?: Component;
}

interface IconNavItem extends Omit<NavItem, "icon"> {
  icon: Component;
}
