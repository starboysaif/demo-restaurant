"use client";

import { useState } from "react";
import Link from "next/link";

const fakeOrders = [
  {
    id: "1",
    name: "أحمد محمود",
    phone: "01012345678",
    items: "برجر كلاسيك × 2، بيبسي × 1",
    total: 145,
    status: "قيد التحضير",
    time: "منذ 5 دقائق",
  },
  {
    id: "2",
    name: "سارة علي",
    phone: "01198765432",
    items: "بيتزا مارجريتا × 1",
    total: 90,
    status: "جديد",
    time: "منذ دقيقتين",
  },
  {
    id: "3",
    name: "محمد حسن",
    phone: "01234567890",
    items: "دجاج مقرمش × 3، بطاطس × 2",
    total: 210,
    status: "تم التسليم",
    time: "منذ 20 دقيقة",
  },
];

const initialMenu = [
  { id: "m1", name: "برجر كلاسيك", price: 65, category: "برجر" },
  { id: "m2", name: "بيتزا مارجريتا", price: 90, category: "بيتزا" },
  { id: "m3", name: "دجاج مقرمش", price: 55, category: "دجاج" },
  { id: "m4", name: "بيبسي", price: 15, category: "مشروبات" },
];

export default function DemoAdmin() {
  const [tab, setTab] = useState<"orders" | "menu">("orders");
  const [menu, setMenu] = useState(initialMenu);
  const [editingId, setEditingId] = useState<string | null>(null);

  function updatePrice(id: string, price: number) {
    setMenu((prev) => prev.map((item) => (item.id === id ? { ...item, price } : item)));
    setEditingId(null);
  }

  return (
    <main
      className="min-h-screen pb-10"
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
        <h1 className="font-display text-xl font-bold text-brand-red">
          لوحة تحكم Bite House (نموذج)
        </h1>
      </header>

      <p className="font-body text-xs text-charcoal/50 px-4 mb-4">
        ده نموذج توضيحي — البيانات هنا وهمية وبترجع زي ما هي بعد أي تحديث للصفحة
      </p>

      <div className="flex gap-2 px-4 mb-5">
        <button
          onClick={() => setTab("orders")}
          className={`flex-1 py-2 rounded-lg font-body font-bold border ${
            tab === "orders"
              ? "bg-brand-orange text-white border-brand-orange"
              : "border-brand-orange/30 text-charcoal"
          }`}
        >
          الطلبات
        </button>
        <button
          onClick={() => setTab("menu")}
          className={`flex-1 py-2 rounded-lg font-body font-bold border ${
            tab === "menu"
              ? "bg-brand-orange text-white border-brand-orange"
              : "border-brand-orange/30 text-charcoal"
          }`}
        >
          إدارة المنيو
        </button>
      </div>

      {tab === "orders" && (
        <div className="px-4 space-y-3">
          {fakeOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(43,24,16,0.08)] border border-brand-orange/10"
            >
              <div className="flex justify-between items-start mb-1">
                <div>
                  <p className="font-display font-bold">{order.name}</p>
                  <p className="font-body text-sm text-charcoal/60">{order.phone}</p>
                </div>
                <span className="bg-brand-orange/10 text-brand-orange font-body text-xs px-3 py-1 rounded-full">
                  {order.status}
                </span>
              </div>
              <p className="font-body text-sm text-charcoal/70 mt-2">{order.items}</p>
              <div className="flex justify-between items-center mt-3">
                <p className="font-body text-xs text-charcoal/40">{order.time}</p>
                <p className="font-display font-bold">{order.total} ج.م</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "menu" && (
        <div className="px-4 space-y-3">
          {menu.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(43,24,16,0.08)] border border-brand-orange/10 flex justify-between items-center"
            >
              <div>
                <p className="font-body font-bold">{item.name}</p>
                <p className="font-body text-xs text-charcoal/50">{item.category}</p>
              </div>
              {editingId === item.id ? (
                <input
                  type="number"
                  defaultValue={item.price}
                  autoFocus
                  onBlur={(e) => updatePrice(item.id, Number(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") updatePrice(item.id, Number((e.target as HTMLInputElement).value));
                  }}
                  className="w-20 border border-brand-orange/30 rounded-lg px-2 py-1 font-body text-sm text-left"
                />
              ) : (
                <button
                  onClick={() => setEditingId(item.id)}
                  className="font-body font-bold text-brand-red underline"
                >
                  {item.price} ج.م
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
        }
