import Image from "next/image";
import db from "@/db/db";
import { Product } from "@prisma/client";
import { Suspense } from "react";
import { ProductCardSkeleton } from "@/components/ProductCard";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";



const Profile = async ({
  searchParams,
}: {
  searchParams: {[key:string]: any };
}) => {
  const Email = typeof (searchParams.email === "string ") && searchParams.email;
  const image = typeof (searchParams.image === "string ") && searchParams.image;
  const Name = typeof (searchParams.name === "string ") && searchParams.name;

  const WishProducts = await db.wishProduct.findMany({
    where: {
      email: Email,
    },
    select: {
      products: true,
    },
  });

  return (
    <div className=" space-y-5 mb-20">
      <div className="w-full flex justify-center items-center space-x-3 md:space-x-6 px-2 md:px-10 bg-accent-foreground h-32">
        <Image
          src={image}
          className="rounded-full "
          alt="/avatars/04.png"
          height={80}
          width={80}
        />
        <p className="text-4xl font-medium text-white">{Name}</p>
      </div>
      <p className="px-2 text-accent-foreground font-bold text-4xl text-center mb-3">
        Likes
      </p>
      <div className="grid grid-col-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2  p-2">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          {WishProducts.length > 0 ? (
            WishProducts?.map((wishproduct) => (
              <ProductCard
                product={wishproduct.products}
                key={wishproduct.products.id}
              />
            ))
          ) : (
            <p>No Liked products</p>
          )}
        </Suspense>
      </div>
    </div>
  );
}

export default Profile

type ProductGridSectionpProp = {
  product : Product
}


function ProductCard({ product }: ProductGridSectionpProp) {
  return (
    <div>
      <Card className="flex overflow-hidden flex-col " key={product.id}>
        <div className="relative w-full h-auto aspect-video">
          <Image src={product.imagePath} fill alt={product.name} />
        </div>
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>{product.name}</CardTitle>
            <span>{formatCurrency(product.priceInCents / 100)}</span>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>{product.description}</CardDescription>
        </CardContent>
        <CardFooter>
          <Button asChild size="lg" className="w-full">
            <Link href={`/products/${product.id}/purchase`}>Purchase</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
