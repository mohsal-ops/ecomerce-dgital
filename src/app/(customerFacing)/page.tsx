import { SideBar } from "@/components/navBar";
import PageHeader from "@/components/pageHeader";
import ProductCard, { ProductCardSkeleton } from "@/components/ProductCard";
import { SearchBar } from "@/components/searchBar";
import { Button, buttonVariants } from "@/components/ui/button";
import db from "@/db/db";
import { cache } from "@/lib/cachHandling";
import { Product } from "@prisma/client";
import Link from "next/link";
import { Suspense } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";

const mostPopular = cache(
  async () => {
    const products = await db.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { orders: { _count: "desc" } },
      take: 6,
    });
    return products;
  },
  ["/", "mostPopular"],
  { revaldate: 60 * 60 * 24 }
);

const TheNewset = cache(async () => {
  const products = await db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
  return products;
}, ["/", "TheNewset"]);

export default async function  HomePage() {

  return (
    <>
      <div className="m-2 rounded-2xl flex flex-col items-center space-y-10   md:gap-0 bg-gradient-to-r from-sky-500 via-blue-500 to-purple-700 h-[470px] ">
        <span className="flex flex-col gap-4 items-center  justify-center h-full w-[80%]   ">
          <p className=" scroll-m-20 text-5xl font-black   lg:text-6xl ">
            <span className="text-4xl text-white">Welcome to Udemo:</span>{" "}
            <br />
            Online services & courses
          </p>
          <p className="text-sm font-medium">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis
            corporis, iure corrupti dolor, eos quis quod nostrum sapiente unde
            atque ratione quae optio nobis culpa.
          </p>
          <SearchBar />
        </span>
      </div>
      <div className="space-y-5 pt-4 px-5   sm:px-3 ">
        <div className="flex justify-start gap-6 mt-10 ">
          <PageHeader>Most Popular</PageHeader>
          <Link
            href="/products"
            className={buttonVariants({ variant: "outline" })}
          >
            View all <IoIosArrowRoundForward />
          </Link>
        </div>
        <ProductGridSection productFetcher={mostPopular} />
        <div className="flex justify-start gap-6  ">
          <PageHeader>The Newest</PageHeader>
          <Link
            href="/products"
            className={buttonVariants({ variant: "outline" })}
          >
            View all <IoIosArrowRoundForward />
          </Link>
        </div>
        <ProductGridSection productFetcher={TheNewset} />
      </div>
    </>
  );
}



type ProductFetcherProp = {
  productFetcher: () => Promise<Product[]>;
};

async function ProductGridSection({
  productFetcher,
}: ProductFetcherProp) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pb-10">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductSuspense productFetcher={productFetcher} />
        </Suspense>
      </div>
    </>
  );
}

async function ProductSuspense({
  productFetcher,
}: {
  productFetcher: () => Promise<Product[]>;
}) {
  return (await productFetcher()).map((product) => (
    <ProductCard key={product.id} {...product} />
  ));
}
