"use client";

import { useState, useEffect } from "react";
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
  const [selectedOption, setSelectedOption] = useState<MenuOption | null>(null);
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

  function openPicker(item: MenuItem) {
    setPickerItem(item);
    setSelectedOption(item.options.length === 1 ? item.options[0] : null);
  }

  function confirmAdd() {
    if (!pickerItem || !selectedOption) return;
    const fullName = selectedOption.label ? `${pickerItem.name} - ${selectedOption.label}` : pickerItem.name;
    addToCart(`${pickerItem.id}-${selectedOption.label}`, fullName, selectedOption.price);
    setJustAdded(pickerItem.id);
    setTimeout(() => setJustAdded(null), 1200);
    setPickerItem(null);
    setSelectedOption(null);
  }

  function quickAdd(item: MenuItem) {
    const option = item.options[0];
    addToCart(`${item.id}-${option.label}`, item.name, option.price);
    setJustAdded(item.id);
    setTimeout(() => setJustAdded(null), 1200);
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
      {!loading && items.length === 0 && (
        <p className="font-body text-center text-charcoal/50 mt-8">لا توجد أصناف في هذا القسم بعد</p>
      )}

      <div className="px-4 mt-2 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl overflow-hidden flex bg-white shadow-[0_2px_10px_rgba(43,24,16,0.08)] border border-brand-orange/10"
          >
            {item.image_url && (
              <img src={item.image_url} alt={item.name} className="w-24 h-24 object-cover shrink-0" />
            )}
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-display font-bold text-lg">{item.name}</h3>
                {item.description && (
                  <p className="font-body text-sm text-charcoal/70 mt-1">{item.description}</p>
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
                    onClick={() => quickAdd(item)}
                    className="bg-brand-orange text-white font-body font-bold px-4 py-2 rounded-lg shrink-0"
                  >
                    {justAdded === item.id ? "تمت الإضافة" : "أضف"}
                  </button>
                ) : (
                  <button
                    onClick={() => openPicker(item)}
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
            <div className="space-y-3 mb-4">
              {pickerItem.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedOption(option)}
                  className={`w-full flex justify-between items-center rounded-lg px-4 py-3 border-2 ${
                    selectedOption?.id === option.id
                      ? "border-brand-red bg-brand-red/5"
                      : "border-brand-orange/20"
                  }`}
                >
                  <span className="font-body font-bold">{option.label}</span>
                  <span className="font-body font-bold text-brand-red">{option.price} ج.م</span>
                </button>
              ))}
            </div>
            <button
              onClick={confirmAdd}
              disabled={!selectedOption}
              className="w-full bg-brand-red text-white font-body font-bold py-3 rounded-xl disabled:opacity-40"
            >
              أضف للسلة
            </button>
            <button
              onClick={() => setPickerItem(null)}
              className="w-full mt-2 text-center font-body text-charcoal/60 py-2"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
