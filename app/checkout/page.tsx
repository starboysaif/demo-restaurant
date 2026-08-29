"use client";

import { useState, useEffect } from "react";

type CartItem = { id: string; name: string; price: number; qty: number };

export default function Checkout() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("bitehouse-cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  function updateQty(id: string, delta: number) {
    setCart((prev) => {
      const updated = prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0);
      localStorage.setItem("bitehouse-cart", JSON.stringify(updated));
      window.dispatchEvent(new Event("cart-updated"));
      return updated;
    });
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = orderType === "delivery" ? 35 : 0;
  const total = subtotal + deliveryFee;

  async function submitOrder() {
    setError("");
    if (!name || !phone || (orderType === "delivery" && !address)) {
      setError("من فضلك اكمل البيانات المطلوبة");
      return;
    }
    if (cart.length === 0) {
      setError("السلة فارغة");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name,
          customer_phone: phone,
          customer_address: orderType === "pickup" ? "استلام من الفرع" : address,
          total,
          order_type: orderType,
          items: cart,
        }),
      });
      if (!res.ok) throw new Error("فشل إرسال الطلب");
      localStorage.removeItem("bitehouse-cart");
      window.dispatchEvent(new Event("cart-updated"));
      setDone(true);
    } catch (err) {
      setError("حصل خطأ، حاول تاني");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
        style={{
          backgroundColor: "#FFF8EE",
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(241,103,31,0.035) 0px, rgba(241,103,31,0.035) 2px, transparent 2px, transparent 22px)",
        }}
      >
        <h1 className="font-display text-3xl font-bold text-brand-red mb-3">تم إرسال طلبك!</h1>
        <p className="font-body text-charcoal/70">هنتواصل معاك على {phone} لتأكيد الطلب</p>
        <a href="/" className="mt-6 bg-brand-orange text-white font-body font-bold px-6 py-3 rounded-lg">
          رجوع للمنيو
        </a>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen px-4 py-8 pb-32"
      style={{
        backgroundColor: "#FFF8EE",
        backgroundImage:
          "repeating-linear-gradient(135deg, rgba(241,103,31,0.035) 0px, rgba(241,103,31,0.035) 2px, transparent 2px, transparent 22px)",
      }}
    >
      <h1 className="font-display text-2xl font-bold text-brand-red mb-6">السلة والطلب</h1>

      {cart.length === 0 ? (
        <p className="font-body text-charcoal/60">السلة فارغة</p>
      ) : (
        <div className="space-y-3 mb-8">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b border-brand-orange/20 pb-3">
              <div>
                <p className="font-body font-bold">{item.name}</p>
                <p className="font-body text-sm text-charcoal/60">{item.price} ج.م</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 rounded-full bg-brand-orange/10 font-bold">-</button>
                <span className="font-body font-bold">{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 rounded-full bg-brand-orange/10 font-bold">+</button>
              </div>
            </div>
          ))}
          <div className="pt-2 space-y-1">
            <p className="font-body text-sm text-charcoal/70 flex justify-between"><span>المجموع الفرعي</span><span>{subtotal} ج.م</span></p>
            {orderType === "delivery" && (
              <p className="font-body text-sm text-charcoal/70 flex justify-between"><span>رسوم التوصيل</span><span>{deliveryFee} ج.م</span></p>
            )}
            <p className="font-display text-xl font-bold flex justify-between"><span>الإجمالي</span><span>{total} ج.م</span></p>
          </div>
        </div>
      )}

      <div className="flex gap-3 mb-5">
        <button onClick={() => setOrderType("delivery")} className={`flex-1 py-3 rounded-lg font-body font-bold border ${orderType === "delivery" ? "bg-brand-orange text-white border-brand-orange" : "border-brand-orange/30 text-charcoal"}`}>توصيل</button>
        <button onClick={() => setOrderType("pickup")} className={`flex-1 py-3 rounded-lg font-body font-bold border ${orderType === "pickup" ? "bg-brand-orange text-white border-brand-orange" : "border-brand-orange/30 text-charcoal"}`}>استلام من الفرع</button>
      </div>

      <div className="space-y-4">
        <input type="text" placeholder="الاسم" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-brand-orange/30 rounded-lg px-4 py-3 font-body" />
        <input type="tel" placeholder="رقم التليفون" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-brand-orange/30 rounded-lg px-4 py-3 font-body" />
        {orderType === "delivery" && (
          <input type="text" placeholder="العنوان بالتفصيل" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border border-brand-orange/30 rounded-lg px-4 py-3 font-body" />
        )}
        <p className="font-body text-sm text-charcoal/60">الدفع: كاش عند الاستلام</p>
        {error && <p className="font-body text-red-600 text-sm">{error}</p>}
      </div>

      <button onClick={submitOrder} disabled={submitting} className="fixed bottom-0 left-0 right-0 bg-brand-red text-white text-center py-4 font-display font-bold text-lg disabled:opacity-60">
        {submitting ? "جاري الإرسال..." : "تأكيد الطلب"}
      </button>
    </main>
  );
        }
