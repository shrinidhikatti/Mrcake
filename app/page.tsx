import { prisma } from "@/lib/prisma";
import HomeView from "@/components/home/HomeView";

export default async function Home() {
  const featuredProductsRaw = await prisma.product.findMany({
    where: { featured: true },
    take: 3,
    orderBy: { name: 'asc' },
    include: { category: true }
  });

  // Transform data to match HomeView/ProductCard expectations
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const featuredProducts = featuredProductsRaw.map((p: any) => {
    let imageSrc = '/placeholder.png'
    try {
      const images = JSON.parse(p.images as string);
      if (Array.isArray(images) && images.length > 0) {
        imageSrc = images[0];
      }
    } catch (e) { }

    return {
      id: p.id,
      name: p.name,
      price: p.price,
      image: imageSrc,
      slug: p.slug,
      description: p.description,
      categoryId: p.categoryId
    };
  });

  return <HomeView featuredProducts={featuredProducts} />;
}
