"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type MenuOption = { id: string; label: string; price: number };
type MenuItem = {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  options: MenuOption[];
};

function addToCart(id: string, name: string, price: number) {
  const saved = localStorage.getItem("bitehouse-cart");
  const cart: any[] = saved ? JSON.parse(saved) : [];
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }
  localStorage.setItem("bitehouse-cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
}

export default function CategoryClient({ category }: { category: string }) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pickerItem, setPickerItem] = useState<MenuItem | null>(null);
  const [justAdded, setJustAdded] = useState<string | null>(null);

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

    setItems(merged);
    setLoading(false);
  }

  function handleAdd(item: MenuItem, option: MenuOption) {
    const fullName = option.label ? `${item.name} - ${option.label}` : item.name;
    addToCart(`${item.id}-${option.label}`, fullName, option.price);
    setJustAdded(item.id + option.label);
    setTimeout(() => setJustAdded(null), 1200);
    setPickerItem(null);
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
        <Link href="/" className="text-2xl text-brand-red">
          ←
        </Link>
        <h1 className="font-display text-2xl font-bold text-brand-red">{category}</h1>
      </header>

      {loading && <p className="font-body text-center mt-8">جاري التحميل...</p>}

      <div className="px-4 mt-2 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl overflow-hidden flex bg-white shadow-[0_2px_10px_rgba(43,24,16,0.08)] border border-brand-orange/10"
          >
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-24 h-24 object-cover shrink-0"
              />
            )}
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-display font-bold text-lg">{item.name}</h3>
                {item.description && (
                  <p className="font-body text-sm text-charcoal/70 mt-1">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="font-body font-bold text-brand-red">
                  {item.options.length === 1
                    ? `${item.options[0].price} ج.م`
                    : item.options.map((o) => `${o.label}: ${o.price}`).join(" / ")}
                </p>
                {item.options.length === 1 ? (
                  <button
                    onClick={() => handleAdd(item, item.options[0])}
                    className="bg-brand-orange text-white font-body font-bold px-4 py-2 rounded-lg shrink-0"
                  >
                    {justAdded === item.id + item.options[0].label ? "تمت الإضافة" : "أضف"}
                  </button>
                ) : (
                  <button
                    onClick={() => setPickerItem(item)}
                    className="bg-brand-orange text-white font-body font-bold px-4 py-2 rounded-lg shrink-0"
                  >
                    اختر
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {pickerItem && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end z-50"
          onClick={() => setPickerItem(null)}
        >
          <div className="bg-white w-full rounded-t-2xl p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display font-bold text-xl mb-4">{pickerItem.name}</h3>
            <div className="space-y-3">
              {pickerItem.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAdd(pickerItem, option)}
                  className="w-full flex justify-between items-center border border-brand-orange/30 rounded-lg px-4 py-3"
                >
                  <span className="font-body font-bold">{option.label}</span>
                  <span className="font-body font-bold text-brand-red">{option.price} ج.م</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setPickerItem(null)}
              className="w-full mt-4 text-center font-body text-charcoal/60 py-2"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
    </main>
  );
  }
