"use client";

import { Suspense, useEffect, useState } from "react";
import  { ProductCardSkeleton } from "@/components/ProductCard";
import PageHeader from "@/components/pageHeader";
import { useSearchParams } from "next/navigation";
import { Product } from "@prisma/client";
import { v4 as uuid } from "uuid";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ProductSuspense } from "./_components/productsSuspense";



export default function Page() {
  return (
    <div
      className=" mb-4 mt-3 space-y-5 lg:space-y-2  px-5 sm:px-3 min-h-dvh"
      key={uuid()}
    >
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
        <div className=" flex justify-start gap-6 ">
          <PageHeader>All Products</PageHeader>
        </div>
        <ProductGridSectionp />
      </Suspense>
    </div>
  );
}



function ProductGridSectionp() {
   const searchParams = useSearchParams();
   let page = searchParams && Number(searchParams.get("page"));
   let limit = searchParams && Number(searchParams.get("limit"));
   const [productsData, setProductsData] = useState<{
     products: Product[];
     quantity: number;
   }>();

   if (page === 0) page = 1;
   if (limit === 0) limit = 3;

   useEffect(() => {
     const getproducts = async () => {
       const response = await fetch(
         `/api/products?page=${page}&limit=${limit}`
       );
       if (response.ok) {
         const data = await response.json();

         setProductsData(data);
       }
     };
     getproducts();
   }, [page, limit]);

   const products = productsData?.products;
   const quantity = productsData?.quantity;



  return (
    <>
      <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-2 pb-10">
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
        <div className="flex h-32 items-start">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={`${page <= 1 && "pointer-events-none opacity-25"}`}
                  href={`/products?page=${page > 1 ? page - 1 : 1}`}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href={`/products?page=${page + 1}`}
                  className={`${
                    quantity === 0 && "pointer-events-none opacity-25"
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  );
}



