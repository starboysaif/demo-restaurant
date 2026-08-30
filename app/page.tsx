import Link from "next/link";

const categories = [
  { name: "برجر", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" },
  { name: "بيتزا", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500" },
  { name: "دجاج", image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500" },
  { name: "مشروبات", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFF8EE] pb-14">
      <div
        className="relative h-[70vh] min-h-[420px] flex items-end"
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
          <a
            href="#menu"
            className="inline-block bg-brand-red text-white font-body font-bold px-8 py-3 rounded-full shadow-lg"
          >
            اطلب دلوقتي
          </a>
        </div>
      </div>

      <section id="menu" className="px-4 pt-10 grid grid-cols-2 gap-5">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/category/${encodeURIComponent(category.name)}`}
            className="rounded-2xl overflow-hidden bg-white flex flex-col shadow-[0_4px_16px_rgba(43,24,16,0.10)] border border-brand-orange/10 transition-transform active:scale-95"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-36 object-cover"
            />
            <div className="text-center py-3 font-display font-bold text-lg text-brand-red">
              {category.name}
            </div>
          </Link>
        ))}
      </section>

      <div className="flex justify-center mt-10">
        <Link
          href="/admin"
          className="border border-brand-orange text-brand-orange rounded-full px-6 py-2.5 font-body text-sm font-bold"
        >
          لوحة التحكم (نموذج)
        </Link>
      </div>

      <p className="text-center font-body text-xs text-charcoal/30 mt-10">
        نموذج توضيحي
      </p>
    </main>
  );
}
