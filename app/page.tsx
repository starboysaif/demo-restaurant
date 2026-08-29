import Link from "next/link";

const categories = [
  { name: "برجر", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400" },
  { name: "بيتزا", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400" },
  { name: "دجاج", image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400" },
  { name: "مشروبات", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400" },
];

export default function Home() {
  return (
    <main
      className="min-h-screen pb-10"
      style={{
        backgroundColor: "#FFF8EE",
        backgroundImage:
          "repeating-linear-gradient(135deg, rgba(241,103,31,0.035) 0px, rgba(241,103,31,0.035) 2px, transparent 2px, transparent 22px)",
      }}
    >
      <div className="text-center pt-10 pb-6 px-4">
        <h1 className="font-display text-4xl font-extrabold text-brand-red mb-2">
          Bite House
        </h1>
        <p className="font-body text-base text-charcoal/70 mb-5">
          اطلب طلبك المفضل اونلاين في ثواني
        </p>
        <div className="flex justify-center gap-2">
          <Link
            href="/admin"
            className="border border-brand-orange text-brand-orange rounded-full px-5 py-2 font-body text-sm font-bold"
          >
            لوحة التحكم (نموذج)
          </Link>
        </div>
      </div>

      <div className="mx-4 mb-6 border-t-2 border-dashed border-brand-orange/25" />

      <section className="px-4 grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/category/${encodeURIComponent(category.name)}`}
            className="rounded-2xl overflow-hidden bg-white flex flex-col shadow-[0_2px_10px_rgba(43,24,16,0.08)] border border-brand-orange/10"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-28 object-cover"
            />
            <div className="text-center py-2.5 font-display font-bold text-brand-red">
              {category.name}
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
