export type ExtraMenuItem = {
  id: string;
  name: string;
  description?: string;
  category: string;
  image_url?: string;
  options: { label: string; price: number }[];
};

export function getExtraItems(): ExtraMenuItem[] {
  if (typeof window === "undefined") return [];
  const w = window as any;
  return w.__demoItems || [];
}

export function addExtraItem(item: ExtraMenuItem) {
  if (typeof window === "undefined") return;
  const w = window as any;
  w.__demoItems = w.__demoItems || [];
  w.__demoItems.push(item);
}

export function getExtraCategories(): string[] {
  if (typeof window === "undefined") return [];
  const w = window as any;
  return w.__demoCategories || [];
}

export function addExtraCategory(name: string) {
  if (typeof window === "undefined") return;
  const w = window as any;
  w.__demoCategories = w.__demoCategories || [];
  if (!w.__demoCategories.includes(name)) {
    w.__demoCategories.push(name);
  }
}
