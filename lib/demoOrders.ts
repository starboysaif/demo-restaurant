export function addDemoOrder(order: any) {
  if (typeof window === "undefined") return;
  const w = window as any;
  w.__demoOrders = w.__demoOrders || [];
  w.__demoOrders.unshift(order);
}

export function getDemoOrders(): any[] {
  if (typeof window === "undefined") return [];
  const w = window as any;
  return w.__demoOrders || [];
}
