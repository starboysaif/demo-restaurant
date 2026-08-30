"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getExtraCategories } from "@/lib/demoMenu";

const categories = [
  { name: "برجر", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" },
  { name: "بيتزا", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500" },
  { name: "دجاج", image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500" },
  { name: "مشروبات", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500" },
];

const popular = [
  { name: "برجر كلاسيك", price: 85, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300", category: "برجر" },
  { name: "بيتزا مارجريتا", price: 95, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300", category: "بيتزا" },
  { name: "ستربس دجاج", price: 85, image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=300", category: "دجاج" },
];

export default function Home() {
  const [extraCats, setExtraCats] = useState<string[]>([]);

  useEffect(() => {
    setExtraCats(getExtraCategories());
  }, []);

  return (
    <main className="min-h-screen bg-[#FFF8EE] pb-14">
      <div
        className="relative h-[65vh] min-h-[400px] flex items-end"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(20,10,5,0.15) 0%, rgba(20,10,5,0.85) 100%), url('https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-center w-full px-4 pb-10">
          <h1 className="font-display text-6xl font-extrabold text-white mb-3 tracking-tight drop-shadow-lg">
            Bite House
          </h1>
          <p className="font-body text-lg text-white/85 mb-6">
            المنيو والطلب اونلاين
          </p>
          <a href="#menu" className="inline-block bg-brand-red text-white font-body font-bold px-8 py-3 rounded-full shadow-lg">
            اطلب دلوقتي
          </a>
        </div>
      </div>

      <section className="pt-10">
        <h2 className="font-display font-bold text-xl text-charcoal px-4 mb-4">الأكثر طلبًا</h2>
        <div className="flex gap-4 overflow-x-auto px-4 pb-2">
          {popular.map((item) => (
            <Link
              key={item.name}
              href={`/category/${encodeURIComponent(item.category)}`}
              className="shrink-0 w-36 rounded-2xl overflow-hidden bg-white shadow-[0_4px_16px_rgba(43,24,16,0.10)] border border-brand-orange/10"
            >
              <img src={item.image} alt={item.name} className="w-full h-28 object-cover" />
              <div className="p-2.5">
                <p className="font-body font-bold text-sm truncate">{item.name}</p>
                <p className="font-body text-brand-red font-bold text-sm mt-0.5">{item.price} ج.م</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="menu" className="px-4 pt-8">
        <h2 className="font-display font-bold text-xl text-charcoal mb-4">الأقسام</h2>
        <div className="grid grid-cols-2 gap-5">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/category/${encodeURIComponent(category.name)}`}
              className="relative rounded-2xl overflow-hidden h-44 shadow-[0_4px_16px_rgba(43,24,16,0.14)] transition-transform active:scale-95"
            >
              <img src={category.image} alt={category.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(180deg, rgba(20,10,5,0) 40%, rgba(20,10,5,0.75) 100%)" }} />
              <div className="absolute bottom-0 right-0 left-0 p-3 flex items-center justify-between">
                <span className="font-display font-bold text-lg text-white drop-shadow">{category.name}</span>
                <span className="text-white/90 text-xl">←</span>
              </div>
            </Link>
          ))}

          {extraCats.map((cat) => (
            <Link
              key={cat}
              href={`/category/${encodeURIComponent(cat)}`}
              className="relative rounded-2xl overflow-hidden h-44 shadow-[0_4px_16px_rgba(43,24,16,0.14)] transition-transform active:scale-95 bg-brand-orange/10 flex items-center justify-center border-2 border-dashed border-brand-orange/30"
            >
              <span className="font-display font-bold text-lg text-brand-red">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="flex justify-center mt-10">
        <Link href="/admin" className="border border-brand-orange text-brand-orange rounded-full px-6 py-2.5 font-body text-sm font-bold">
          لوحة التحكم (نموذج)
        </Link>
      </div>

      <p className="text-center font-body text-xs text-charcoal/30 mt-10">نموذج توضيحي</p>
      <p className="text-center font-body text-xs text-charcoal/40 mt-2">
        Designed by{" "}
        <a
          href="https://www.instagram.com/monowebs?igsi=Nm8zZ2d5MGdqZWc="
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-red font-bold underline"
        >
          Mono Webs
        </a>
      </p>
    </main>
  );
}
