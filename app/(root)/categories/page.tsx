import { getAllProducts } from "@/lib/actions/product.action";
import { getMyCart } from "@/lib/actions/cart.actions";
import { convertToPlainObj } from "@/lib/utils";
import ProductCardCarousel from "@/components/productCardCarousel/product-card-carousel";

export default async function CategoryPage() {
  const products = await getAllProducts({ page: 1 });
  const cart = await getMyCart();

  return (
    <ProductCardCarousel
     products={products.data
  .filter(Boolean)
  .map(convertToPlainObj)}

      cart={cart}
    />
  );
}
