"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getExtraItems } from "@/lib/demoMenu";

type MenuOption = { id: string; label: string; price: number };
type MenuItem = {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  options: MenuOption[];
};

function commitToCart(id: string, name: string, price: number, qty: number) {
  const saved = localStorage.getItem("bitehouse-cart");
  const cart: any[] = saved ? JSON.parse(saved) : [];
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, name, price, qty });
  }
  localStorage.setItem("bitehouse-cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
}

export default function CategoryClient({ category }: { category: string }) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<MenuOption | null>(null);
  const [pendingQty, setPendingQty] = useState(0);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    loadItems();
  }, [category]);

  async function loadItems() {
    setLoading(true);
    const { data: itemsData } = await supabase
      .from("menu_items")
      .select("*")
      .eq("category", category)
      .eq("available", true)
      .order("sort_order", { ascending: true });

    const itemIds = (itemsData || []).map((i) => i.id);
    const { data: optionsData } = itemIds.length
      ? await supabase.from("menu_options").select("*").in("menu_item_id", itemIds)
      : { data: [] };

    const merged = (itemsData || []).map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      image_url: item.image_url,
      options: (optionsData || []).filter((o) => o.menu_item_id === item.id),
    }));

    const extra = getExtraItems()
      .filter((e) => e.category === category)
      .map((e) => ({
        id: e.id,
        name: e.name,
        description: e.description || "",
        image_url: e.image_url || null,
        options: e.options.map((o, i) => ({ id: e.id + "-" + i, label: o.label, price: o.price })),
      }));

    setItems([...merged, ...extra]);
    setLoading(false);
  }

  function commitPending(item: MenuItem) {
    if (pendingQty > 0 && selectedOption) {
      const fullName = selectedOption.label ? `${item.name} - ${selectedOption.label}` : item.name;
      commitToCart(`${item.id}-${selectedOption.label}`, fullName, selectedOption.price, pendingQty);
    }
    setPendingQty(0);
    setSelectedOption(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  }

  function toggleExpand(item: MenuItem) {
    if (expandedId === item.id) {
      commitPending(item);
      setExpandedId(null);
    } else {
      if (expandedId) {
        const prev = items.find((i) => i.id === expandedId);
        if (prev) commitPending(prev);
      }
      setExpandedId(item.id);
      setSelectedOption(item.options.length === 1 ? item.options[0] : null);
      setPendingQty(0);
    }
  }

  function startAdd(item: MenuItem) {
    if (!selectedOption) return;
    setPendingQty(1);
    resetTimer(item);
  }

  function resetTimer(item: MenuItem) {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => commitPending(item), 2500);
  }

  function changeQty(item: MenuItem, delta: number) {
    setPendingQty((prev) => {
      const next = prev + delta;
      if (next <= 0) {
        if (timerRef.current) clearTimeout(timerRef.current);
        return 0;
      }
      resetTimer(item);
      return next;
    });
  }

  return (
    <main
      className="min-h-screen pb-24"
      style={{
        backgroundColor: "#FFF8EE",
        backgroundImage:
          "repeating-linear-gradient(135deg, rgba(241,103,31,0.035) 0px, rgba(241,103,31,0.035) 2px, transparent 2px, transparent 22px)",
      }}
    >
      <header className="py-5 px-4 flex items-center gap-3">
        <Link href="/" className="text-2xl text-brand-red">←</Link>
        <h1 className="font-display text-2xl font-bold text-brand-red">{category}</h1>
      </header>

      {loading && <p className="font-body text-center mt-8">جاري التحميل...</p>}
      {!loading && items.length === 0 && (
        <p className="font-body text-center text-charcoal/50 mt-8">لا توجد أصناف في هذا القسم بعد</p>
      )}

      <div className="px-4 mt-2 space-y-4">
        {items.map((item) => {
          const isOpen = expandedId === item.id;
          return (
            <div key={item.id} className="rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(43,24,16,0.12)]">
              <button
                onClick={() => toggleExpand(item)}
                className="relative w-full h-40 block"
                style={{
                  backgroundImage: item.image_url
                    ? `linear-gradient(180deg, rgba(20,10,5,0) 40%, rgba(20,10,5,0.75) 100%), url('${item.image_url}')`
                    : "none",
                  backgroundColor: item.image_url ? undefined : "#F1671F1A",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute bottom-0 right-0 left-0 p-3 flex items-center justify-between">
                  <span className="font-display font-bold text-lg text-white drop-shadow">{item.name}</span>
                  <span className="text-white/90 text-xl">{isOpen ? "▲" : "▼"}</span>
                </div>
              </button>

              {isOpen && (
                <div className="bg-white p-4">
                  {item.description && (
                    <p className="font-body text-sm text-charcoal/70 mb-3">{item.description}</p>
                  )}

                  {item.options.length > 1 && (
                    <div className="space-y-2 mb-3">
                      {item.options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setSelectedOption(option)}
                          className={`w-full flex justify-between items-center rounded-lg px-4 py-2.5 border-2 ${
                            selectedOption?.id === option.id ? "border-brand-red bg-brand-red/5" : "border-brand-orange/20"
                          }`}
                        >
                          <span className="font-body font-bold text-sm">{option.label}</span>
                          <span className="font-body font-bold text-sm text-brand-red">{option.price} ج.م</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {item.options.length === 1 && (
                    <p className="font-body font-bold text-brand-red mb-3">{item.options[0].price} ج.م</p>
                  )}

                  {pendingQty === 0 ? (
                    <button
                      onClick={() => startAdd(item)}
                      disabled={!selectedOption}
                      className="w-full bg-brand-orange text-white font-body font-bold py-2.5 rounded-lg disabled:opacity-40"
                    >
                      أضف
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-4 bg-brand-orange/10 rounded-lg py-2">
                      <button onClick={() => changeQty(item, -1)} className="w-9 h-9 rounded-full bg-white font-bold shadow-sm">-</button>
                      <span className="font-display font-bold text-lg">{pendingQty}</span>
                      <button onClick={() => changeQty(item, 1)} className="w-9 h-9 rounded-full bg-white font-bold shadow-sm">+</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
