"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getDemoOrders } from "@/lib/demoOrders";
import { getExtraItems, addExtraItem, getExtraCategories, addExtraCategory } from "@/lib/demoMenu";

const baseCategories = ["برجر", "بيتزا", "دجاج", "مشروبات"];

const fakeOrders = [
  { id: "1", name: "أحمد محمود", phone: "01012345678", address: "شارع النصر، المعادي", orderType: "delivery", items: "برجر كلاسيك × 2، بيبسي × 1", itemsList: [{ name: "برجر كلاسيك", price: 85, qty: 2 }, { name: "بيبسي", price: 20, qty: 1 }], total: 190, status: "قيد التحضير", time: "منذ 5 دقائق" },
  { id: "2", name: "سارة علي", phone: "01198765432", address: "استلام من الفرع", orderType: "pickup", items: "بيتزا مارجريتا × 1", itemsList: [{ name: "بيتزا مارجريتا", price: 95, qty: 1 }], total: 95, status: "جديد", time: "منذ دقيقتين" },
  { id: "3", name: "محمد حسن", phone: "01234567890", address: "شارع الهرم", orderType: "delivery", items: "دجاج مقرمش × 3", itemsList: [{ name: "دجاج مقرمش", price: 70, qty: 3 }], total: 210, status: "تم التسليم", time: "منذ 20 دقيقة" },
];

const initialMenu = [
  { id: "b1", name: "برجر كلاسيك", price: 85, category: "برجر" },
  { id: "b2", name: "برجر دبل تشيز", price: 120, category: "برجر" },
  { id: "p1", name: "بيتزا مارجريتا (صغير)", price: 95, category: "بيتزا" },
  { id: "p1l", name: "بيتزا مارجريتا (كبير)", price: 150, category: "بيتزا" },
  { id: "p2", name: "بيتزا بيبروني (صغير)", price: 110, category: "بيتزا" },
  { id: "p2l", name: "بيتزا بيبروني (كبير)", price: 170, category: "بيتزا" },
  { id: "c1", name: "دجاج مقرمش", price: 70, category: "دجاج" },
  { id: "c2", name: "ستربس دجاج", price: 85, category: "دجاج" },
  { id: "d1", name: "بيبسي", price: 20, category: "مشروبات" },
  { id: "d2", name: "عصير برتقال طازج", price: 35, category: "مشروبات" },
];

export default function DemoAdmin() {
  const [tab, setTab] = useState<"orders" | "menu">("orders");
  const [menu, setMenu] = useState(initialMenu);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [demoOrders, setDemoOrders] = useState<any[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<any | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [categories, setCategories] = useState(baseCategories);

  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newCategory, setNewCategory] = useState(baseCategories[0]);
  const [addingNewCategory, setAddingNewCategory] = useState(false);
  const [brandNewCategory, setBrandNewCategory] = useState("");
  const [newOptions, setNewOptions] = useState([{ label: "", price: "" }]);

  useEffect(() => {
    setDemoOrders(getDemoOrders());
    const extraCats = getExtraCategories();
    setCategories([...baseCategories, ...extraCats]);
  }, []);

  function updatePrice(id: string, price: number) {
    setMenu((prev) => prev.map((item) => (item.id === id ? { ...item, price } : item)));
    setEditingId(null);
  }

  function addOptionRow() {
    setNewOptions([...newOptions, { label: "", price: "" }]);
  }

  function updateNewOption(index: number, field: "label" | "price", value: string) {
    const updated = [...newOptions];
    updated[index][field] = value;
    setNewOptions(updated);
  }

  function removeNewOption(index: number) {
    setNewOptions(newOptions.filter((_, i) => i !== index));
  }

  function addItem() {
    let finalCategory = addingNewCategory ? brandNewCategory.trim() : newCategory;
    if (!newName || !finalCategory || newOptions.some((o) => !o.price)) {
      alert("اكتب اسم الصنف والقسم وسعر واحد على الأقل");
      return;
    }

    if (addingNewCategory) {
      const existingMatch = categories.find(
        (c) => c.trim().toLowerCase() === finalCategory.toLowerCase()
      );
      if (existingMatch) {
        finalCategory = existingMatch;
      } else {
        addExtraCategory(finalCategory);
        setCategories((prev) => [...prev, finalCategory]);
      }
    }

    const id = "extra-" + Date.now();
    addExtraItem({
      id,
      name: newName,
      category: finalCategory,
      image_url: newImage || undefined,
      options: newOptions.map((o) => ({ label: o.label, price: Number(o.price) })),
    });

    const displayEntries = newOptions.map((opt, i) => ({
      id: id + "-" + i,
      name: opt.label ? `${newName} (${opt.label})` : newName,
      price: Number(opt.price),
      category: finalCategory,
    }));
    setMenu((prev) => [...prev, ...displayEntries]);

    setNewName("");
    setNewImage("");
    setNewCategory(baseCategories[0]);
    setAddingNewCategory(false);
    setBrandNewCategory("");
    setNewOptions([{ label: "", price: "" }]);
    setShowAddForm(false);
  }

  const allOrders = [...demoOrders, ...fakeOrders];

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
        <h1 className="font-display text-xl font-bold text-brand-red">لوحة تحكم Bite House (نموذج)</h1>
      </header>

      <p className="font-body text-xs text-charcoal/50 px-4 mb-4">
        جرب تعمل طلب من المنيو وهيظهر هنا فورًا، وهيختفي لو عملت ريفريش. أي صنف تضيفه من هنا هيظهر فعليًا في القسم بتاعه على الموقع.
      </p>

      <div className="flex gap-2 px-4 mb-5">
        <button onClick={() => setTab("orders")} className={`flex-1 py-2 rounded-lg font-body font-bold border ${tab === "orders" ? "bg-brand-orange text-white border-brand-orange" : "border-brand-orange/30 text-charcoal"}`}>الطلبات</button>
        <button onClick={() => setTab("menu")} className={`flex-1 py-2 rounded-lg font-body font-bold border ${tab === "menu" ? "bg-brand-orange text-white border-brand-orange" : "border-brand-orange/30 text-charcoal"}`}>إدارة المنيو</button>
      </div>

      {tab === "orders" && (
        <div className="px-4 space-y-3">
          {allOrders.map((order) => (
            <button
              key={order.id}
              onClick={() => setExpandedOrder(order)}
              className="w-full text-right rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(43,24,16,0.08)] border border-brand-orange/10"
            >
              <div className="flex justify-between items-start mb-1">
                <div>
                  <p className="font-display font-bold">{order.name}</p>
                  <p className="font-body text-sm text-charcoal/60">{order.phone}</p>
                </div>
                <span className={`font-body text-xs px-3 py-1 rounded-full ${order.isDemo ? "bg-brand-red/10 text-brand-red" : "bg-brand-orange/10 text-brand-orange"}`}>
                  {order.isDemo ? "طلبك التجريبي" : order.status}
                </span>
              </div>
              <p className="font-body text-sm text-charcoal/70 mt-2">{order.items}</p>
              <div className="flex justify-between items-center mt-3">
                <p className="font-body text-xs text-charcoal/40">{order.time}</p>
                <p className="font-display font-bold">{order.total} ج.م</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {tab === "menu" && (
        <div className="px-4 space-y-3">
          <button onClick={() => setShowAddForm(!showAddForm)} className="w-full bg-brand-orange text-white font-body font-bold py-3 rounded-lg mb-2">
            {showAddForm ? "إلغاء" : "+ إضافة صنف جديد"}
          </button>

          {showAddForm && (
            <div className="rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(43,24,16,0.08)] border border-brand-orange/10 space-y-3 mb-3">
              <input type="text" placeholder="اسم الصنف" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full border border-brand-orange/30 rounded-lg px-3 py-2 font-body text-sm" />
              <input type="text" placeholder="رابط الصورة (اختياري)" value={newImage} onChange={(e) => setNewImage(e.target.value)} className="w-full border border-brand-orange/30 rounded-lg px-3 py-2 font-body text-sm" />

              {!addingNewCategory ? (
                <div className="space-y-2">
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full border border-brand-orange/30 rounded-lg px-3 py-2 font-body text-sm">
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <button onClick={() => setAddingNewCategory(true)} className="text-brand-orange font-body text-sm underline">
                    + قسم جديد بدل ده
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input type="text" placeholder="اسم القسم الجديد" value={brandNewCategory} onChange={(e) => setBrandNewCategory(e.target.value)} className="w-full border border-brand-orange/30 rounded-lg px-3 py-2 font-body text-sm" />
                  <button onClick={() => setAddingNewCategory(false)} className="text-brand-orange font-body text-sm underline">
                    استخدم قسم موجود بدل كده
                  </button>
                </div>
              )}

              <p className="font-body font-bold text-sm">الأسعار / الخيارات</p>
              {newOptions.map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" placeholder="اسم الخيار (فاضي لو سعر واحد بس)" value={opt.label} onChange={(e) => updateNewOption(i, "label", e.target.value)} className="flex-1 border border-brand-orange/30 rounded-lg px-3 py-2 font-body text-sm" />
                  <input type="number" placeholder="السعر" value={opt.price} onChange={(e) => updateNewOption(i, "price", e.target.value)} className="w-24 border border-brand-orange/30 rounded-lg px-3 py-2 font-body text-sm" />
                  {newOptions.length > 1 && (
                    <button onClick={() => removeNewOption(i)} className="text-red-600 px-2">✕</button>
                  )}
                </div>
              ))}
              <button onClick={addOptionRow} className="text-brand-orange font-body text-sm underline">
                + إضافة خيار سعر تاني
              </button>

              <button onClick={addItem} className="w-full bg-brand-red text-white font-body font-bold py-3 rounded-lg mt-2">
                حفظ الصنف
              </button>
            </div>
          )}

          {categories.map((cat) => {
            const catItems = menu.filter((item) => item.category === cat);
            if (catItems.length === 0) return null;
            return (
              <div key={cat} className="mb-4">
                <h3 className="font-display font-bold text-brand-orange mb-2">{cat}</h3>
                <div className="space-y-2">
                  {catItems.map((item) => (
                    <div key={item.id} className="rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(43,24,16,0.08)] border border-brand-orange/10 flex justify-between items-center">
                      <p className="font-body font-bold">{item.name}</p>
                      {editingId === item.id ? (
                        <input
                          type="number"
                          defaultValue={item.price}
                          autoFocus
                          onBlur={(e) => updatePrice(item.id, Number(e.target.value))}
                          onKeyDown={(e) => { if (e.key === "Enter") updatePrice(item.id, Number((e.target as HTMLInputElement).value)); }}
                          className="w-20 border border-brand-orange/30 rounded-lg px-2 py-1 font-body text-sm text-left"
                        />
                      ) : (
                        <button onClick={() => setEditingId(item.id)} className="font-body font-bold text-brand-red underline">
                          {item.price} ج.م
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {expandedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50" onClick={() => setExpandedOrder(null)}>
          <div className="bg-white w-full rounded-t-2xl p-5 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display font-bold text-xl mb-1">{expandedOrder.name}</h3>
            <p className="font-body text-sm text-charcoal/60 mb-3">{expandedOrder.phone}</p>

            <div className="space-y-1 mb-3 font-body text-sm text-charcoal/70">
              <p>{expandedOrder.orderType === "pickup" ? "استلام من الفرع" : expandedOrder.address}</p>
              <p>{expandedOrder.time}</p>
            </div>

            <div className="border-t border-brand-orange/10 pt-3 space-y-1 mb-3">
              {(expandedOrder.itemsList || []).map((it: any, i: number) => (
                <p key={i} className="font-body text-sm flex justify-between">
                  <span>{it.name} × {it.qty}</span>
                  <span>{it.price * it.qty} ج.م</span>
                </p>
              ))}
            </div>

            <p className="font-display font-bold text-left mb-4">الإجمالي: {expandedOrder.total} ج.م</p>

            <button onClick={() => setExpandedOrder(null)} className="w-full bg-brand-orange text-white font-body font-bold py-3 rounded-xl">
              إغلاق
            </button>
          </div>
        </div>
      )}
    </main>
  );
                   }
