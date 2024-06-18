"use server"
import { Button } from "@/components/ui/button";
import db from "@/db/db";
import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Stripe from "stripe";



export default async function Success({
  searchParams,
}: {
  searchParams: { payment_intent: string };
}) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const paymentIntent = await stripe.paymentIntents.retrieve(
    searchParams.payment_intent,
    {
      expand: ["charges.data.balance_transaction"],
    }
  );
  if (paymentIntent == null) return notFound();

  const product = await db.product.findUnique({
    where: { id: paymentIntent.metadata.productId },
  });
  if (product == null) return;

  let isSuccess = (paymentIntent.status = "succeeded");

  


  return (
    <div className=" max-w-5xl w-full mt-3 mx-auto space-y-8 ">
      <div className="text-4xl font-bold text-foreground">
        {isSuccess ? "Success! " : "Error"}
      </div>
      <div className="flex gap-4   items-center">
        <div className="w-1/2 flex-shrink-0 relative aspect-video ">
          <Image
            src={product.imagePath}
            fill
            alt={product.name}
            className="object-cover"
          />
        </div>
        <div className="flec flex-col gap-2">
          <h1 className="text-md">
            {formatCurrency(product.priceInCents / 100)}
          </h1>
          <div className="text-2xl font-bold">{product.name}</div>
          <div className=" line-clamp-3 text-muted-foreground">
            {product.description}
          </div>
          <Button size="lg" className="mt-4" asChild>
            {isSuccess ? (
              <a
                href={`/products/download/${await createDownloadVerification(
                  product.id
                )}`}
              >
                Download
              </a>
            ) : (
              <Link
                href={`products/${paymentIntent.metadata.productId}/purchase`}
              >
                Try again
              </Link>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

async function createDownloadVerification(productId: string) {
  return (
    await db.downloadVerification.create({
      data: {
        productId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    })
  ).id;
}

