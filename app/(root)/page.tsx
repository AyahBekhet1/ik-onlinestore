import Hero from "@/components/hero/hero";
import ProductList from "@/components/shared/product/productList";
import { getLatestProducts } from "@/lib/actions/product.action";

export default async function Homepage() {
  const latestProducts = await getLatestProducts();
  return (
    <>
      <Hero />
      <ProductList data={latestProducts} title='Newest Arrivals' limit={4} />
    </>
  );
}
