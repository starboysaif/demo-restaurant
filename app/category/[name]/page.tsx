import CategoryClient from "@/components/CategoryClient";

export default function CategoryPage({ params }: { params: { name: string } }) {
  const category = decodeURIComponent(params.name);
  return <CategoryClient category={category} />;
}
