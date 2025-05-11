import MainPage from "./mainpage";
import { getAllCategory } from "@/lib/actions/category.action";
import ShopByCategory from "./shop-by-category";
import LatestProductsCarousel from "./latest-products-carousel";
import { getLatestProducts } from "@/lib/actions/product.action";
import { getMyCart } from "@/lib/actions/cart.actions";
import { CartItem } from "@/types";
import { convertToPlainObj } from "@/lib/utils";

type CartPreview = {
  items: CartItem[];
  itemsPrice: string;
  totalPrice: string;
  shippingPrice: string;
  sessionCartId: string;
  userId?: string;
};


export default async function Homepage() {
  const page=1
  const categories = await getAllCategory({page:page})
  const latestProduct = await getLatestProducts()
  const cart = await getMyCart() as CartPreview
  const safeCart = cart
    ? {
        items: cart.items,
        itemsPrice: cart.itemsPrice,
        totalPrice: cart.totalPrice,
        shippingPrice: cart.shippingPrice,
        sessionCartId: cart.sessionCartId,
        userId: cart.userId ?? undefined,
      }
    : {
        items: [],
        itemsPrice: "0",
        totalPrice: "0",
        shippingPrice: "0",
        sessionCartId: "",
        userId: undefined,
      };

  return (
    <>
    <MainPage  />
    <ShopByCategory categories={categories.data}/>
    <LatestProductsCarousel data={convertToPlainObj( latestProduct)} cart={safeCart} />
    </>
  );
}
