import PageHeader from "@/components/pageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/db/db";
import { Product } from "@prisma/client";
import Image from "next/image";


const Page = async ({
  searchParams,
}: {
    searchParams: { user?: string |undefined };  
  }) => {
  
  const id = typeof( searchParams.user === "string" ) && searchParams.user;

  const orders = await db.order.findMany({
    where: { userId: id },
    select: {
      userId: true,
      product: true
    },
    orderBy: { createdAt: "asc" },
  });

  if (orders.length === 0) {
    return (
      <div className="px-5 mt-4 sm:px-3">
        <PageHeader>My Orders</PageHeader>
        <p>No Orders yet </p>
      </div>
    );
  }


  return (
    <div className="px-5 sm:px-3 pt-3 space-y-3">
      <PageHeader>My Orders</PageHeader>
      <div className="grid  sm:grid-cols-2 md:grid-cols-3  gap-2">
        {orders.map( (order) => (
          <OrderedProductCard key={order?.product.id} product={order.product} />
        ))}
      </div>
    </div>
  );
}
export default Page;

type ProductInterface = {
  product : Product
};

async function OrderedProductCard({ product }: ProductInterface) {
  return (
    <Card className="space-y-2" key={product.id}>
      <CardHeader
        className="relative w-full h-auto aspect-video"
        key={product.id}
      >
        <Image src={product.imagePath} fill alt={product.name} />
      </CardHeader>
      <CardContent className="flex justify-between w-full">
        <div className="flex flex-col gap-3">
          <CardTitle>{product.name}</CardTitle>
          <CardDescription>{product.description}</CardDescription>
        </div>
        <div>
          <Button>
            <a
              href={`/products/download/${await createDowenloadVerficationId(
                product.id
              )}`}
            >
              Download
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
async function  createDowenloadVerficationId(id:string){
  return( await db.downloadVerification.create({
    data:{
      productId:id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),

    }
  })).id
}
