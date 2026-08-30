import Link from "next/link";

const categories = [
  { name: "برجر", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" },
  { name: "بيتزا", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500" },
  { name: "دجاج", image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500" },
  { name: "مشروبات", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500" },
];

const popular = [
  { name: "برجر كلاسيك", price: 85, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300", category: "برجر" },
  { name: "بيتزا مارجريتا", price: 95, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300", category: "بيتزا" },
  { name: "ستربس دجاج", price: 85, image: "https://images.unsplash.com/photo-1626082927389-6cd097cee6a6?w=300", category: "دجاج" },
];

export default function Home() {
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
          <a
            href="#menu"
            className="inline-block bg-brand-red text-white font-body font-bold px-8 py-3 rounded-full shadow-lg"
          >
            اطلب دلوقتي
          </a>
        </div>
      </div>

      <section className="pt-10">
        <h2 className="font-display font-bold text-xl text-charcoal px-4 mb-4">
          الأكثر طلبًا
        </h2>
        <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide">
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
              <img
                src={category.image}
                alt={ca
