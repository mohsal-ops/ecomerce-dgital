import db from "@/db/db"
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { Resend } from "resend"
import { randomUUID } from "crypto"
import { z } from "zod"

const AddShema = z.object({
  priceInCents: z.coerce.number().int().min(1),
  userId: z.string(),
  productId: z.string().min(1),
  // user: UserSchema,
  // product: ProductSchema,
});
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(req: NextRequest) {
  try{
  const event = stripe.webhooks.constructEvent(
    await req.text(),req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  )
console.log("webhook enterred")

  if (event.type === "charge.succeeded" ) {
    console.log("charge succeeded")

    const charge =  event.data.object as Stripe.Charge
    const productId =  charge.metadata.productId
    const email = charge.billing_details.email as string
    const pricePaidInCents = charge.amount

    let user = await db.user.findUnique({ where: { email }, select: { id: true } })

    if(!user){
      await db.user.create({
        data :{
          email:email
        }
      })
      user = await db.user.findUnique({ where: { email }, select: { id: true } })

    }


    const formData = {
      priceInCents:pricePaidInCents,
      userId:user?.id,
      productId:productId,
    };
    const result = AddShema.safeParse(formData);
  if (!result.success) {
    console.error("Validation failed:", result.error.formErrors.fieldErrors);
    return 
  }

  const data = result.data;
  

  await db.order.create({
    data:{
      pricePaidInCents : data.priceInCents,
      userId: data.userId,
      productId: data.productId,
    }
  }).then(()=>console.log("order have been created"))

  return new Response("Order created", { status: 201 });

  }

  return new Response("Event type not handled", { status: 400 });
}catch(error){

  console.error("Error processing webhook:", error);
    return new Response("Internal Server Error", { status: 500 });

}
}


