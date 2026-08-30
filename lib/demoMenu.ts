export type ExtraMenuItem = {
  id: string;
  name: string;
  description?: string;
  category: string;
  image_url?: string;
  options: { label: string; price: number }[];
};

const ITEMS_KEY = "demoExtraItems";
const CATS_KEY = "demoExtraCategories";

export function getExtraItems(): ExtraMenuItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(ITEMS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addExtraItem(item: ExtraMenuItem) {
  if (typeof window === "undefined") return;
  const items = getExtraItems();
  items.push(item);
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("demo-menu-updated"));
}

export function getExtraCategories(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CATS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addExtraCategory(name: string) {
  if (typeof window === "undefined") return;
  const cats = getExtraCategories();
  if (!cats.includes(name)) {
    cats.push(name);
    localStorage.setItem(CATS_KEY, JSON.stringify(cats));
  }
  window.dispatchEvent(new Event("demo-menu-updated"));
}
