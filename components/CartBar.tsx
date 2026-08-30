"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function CartBar() {
  const pathname = usePathname();
  const [count, setCount] = useState(0);

  useEffect(() => {
    function updateCount() {
      const saved = localStorage.getItem("bitehouse-cart");
      if (saved) {
        const cart = JSON.parse(saved);
        const total = cart.reduce((sum: number, item: any) => sum + item.qty, 0);
        setCount(total);
      } else {
        setCount(0);
      }
    }
    updateCount();
    window.addEventListener("storage", updateCount);
    window.addEventListener("cart-updated", updateCount);
    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("cart-updated", updateCount);
    };
  }, []);

  if (count === 0 || pathname === "/checkout") return null;

  return (
    <a
      href="/checkout"
      className="fixed bottom-4 left-4 right-4 bg-brand-red text-white text-center py-4 font-display font-bold text-lg z-50 rounded-2xl shadow-[0_8px_24px_rgba(214,40,40,0.35)]"
    >
      عرض السلة ({count}) - إتمام الطلب
    </a>
  );
}
