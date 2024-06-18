import db from "@/db/db"
import { notFound } from "next/navigation"
import Stripe from "stripe"
import { StripeCheckoutForm } from "../../_components/CheckoutForm"


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string )

export default async function page(
  {
    params : {id}
  } : 
  { 
    params : { id : string}
  }
) {

  const product = await db.product.findUnique({
    where :{ id }
  })
  if(product == null ) return notFound()


  const paymentIntents = await stripe.paymentIntents.create({
    amount: product.priceInCents,
    currency : "USD",
    metadata:{productId : product.id  }
  })

  if(paymentIntents.client_secret == null) {
    throw Error("Stripe failed to create payment intents ")
}
  

    return <StripeCheckoutForm product={product} clientSecret={paymentIntents.client_secret} />
      
    
  }