import ProductCard from "@/components/ProductCard";
import { Product } from "@prisma/client";
import { useSession } from "next-auth/react";

type ProductFetcherProp = {
  products: Product[] | undefined
};

export function ProductSuspense({ products }: ProductFetcherProp) {
  
  return products?.map((product: Product) => (
    <ProductCard key={product.id} {...product}/>
  ));
}
