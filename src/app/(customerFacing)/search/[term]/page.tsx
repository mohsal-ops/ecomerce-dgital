import db from "@/db/db";
import ProductCard, { ProductCardSkeleton } from "@/components/ProductCard";
import { Suspense } from "react";
import PageHeader from "@/components/pageHeader";
import { Product } from "@prisma/client";

export default async function page({ params : {term} }: { params: {term: string} }) {
  const productsName = await db.product.findMany({
    where: {
      name: {contains : term}
    },
  });
  
  const productsDescription = await db.product.findMany({
    where: {
      description: {contains:term}
    },
  });
  
  const products = [...productsName, ...productsDescription];
  
          return (
            <div className="lg:space-y-3 mt-4 space-y-5 px-5 sm:px-3">
              <Suspense
                fallback={
                  <>
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                  </>
                }
              >
                <div className="flex justify-start gap-6 ">
                  <PageHeader>results for: {term}</PageHeader>
                </div>
                {products.length > 0 ? (
                  <ProductGridSection products={products} />
                ) : (
                  <p>No items</p>
                )}
              </Suspense>
            </div>
          );
      
}
type ProductgridProp = {
  products: Product[] | null 
}
async function ProductGridSection({ products }: ProductgridProp) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pb-10">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductSuspense products={products} />
        </Suspense>
      </div>
    </>
  );
}
async function ProductSuspense({ products }: ProductgridProp) {
  return products?.map(product => (
    <ProductCard key={product.id} {...product} />
  ))
}