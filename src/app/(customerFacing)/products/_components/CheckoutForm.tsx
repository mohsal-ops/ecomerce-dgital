"use client"


import { userOrderExists } from "@/app/actions/orders"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { formatCurrency } from "@/lib/formatters"
import { Elements, LinkAuthenticationElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import Image from "next/image"
import { FormEvent, useState } from "react"
import { undefined, z } from "zod"
import { useFormState } from "react-dom"

type CheckoutFormProps = { 
    product : {
        id:string
        name : string
        imagePath : string 
        description: string
        priceInCents : number
    }
    clientSecret : string
}
export function StripeCheckoutForm(
    {product , clientSecret

    }:CheckoutFormProps){
        const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string)


        return (
        <div className=" max-w-5xl mt-3 w-full mx-auto space-y-8 ">
            <div className="flex gap-4  items-center">
                <div className="w-1/3 flex-shrink-0 relative h-auto aspect-video ">
                    <Image 
                    src={product.imagePath} 
                    fill 
                    alt={product.name}
                    className="object-cover"
                    />
                </div>
                <div className="flec flex-col gap-2">
                    <h1 className="text-md">{formatCurrency(product.priceInCents /100)}</h1>
                    <div className="text-2xl font-bold">{product.name}</div>
                    <div className=" line-clamp-3 text-muted-foreground">{product.description}</div>
                </div>
            </div>
        <Elements options={{clientSecret}} stripe={stripePromise}>
            <Form productId={product.id} priceInCents={product.priceInCents}  />
        </Elements>
        </div>
        )

}



function Form({ priceInCents, productId }:{priceInCents : number, productId:string}){
    const [isLoading, setIsLoading] = useState(false);
    const [ErrorMessage, setErrorMessage] = useState<string>()
    const [email, setEmail] = useState<string>()

        

    const stripe = useStripe()
    const elements = useElements()
    
    async function OnsubmitHandler(e:FormEvent){
        e.preventDefault()
        if(stripe == null || elements == null || email == null) return 
    
    //Check for existing the order 
    
        const orderExists = await userOrderExists( email , productId)
    
        if(orderExists){
            setErrorMessage("you already purchased this item. try downloading it from My Orders ")
            setIsLoading(false)
            return 
        }
        setIsLoading(true)
    
        
        stripe.confirmPayment({elements , confirmParams:
            {
            return_url:`${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
    
            }
        }).then(({error}) =>{
            if(error.type === "card_error" || error.type === "validation_error"){
                setErrorMessage(error.message)
            }else {
                setErrorMessage("unkown error occured")
            }
    
    
        }).finally(()=>{
            setIsLoading(false)    } )
    
    }
    return <form onSubmit={OnsubmitHandler}>
        <Card className="mt-3 flex flex-col gap-3">
            <CardHeader className="h-auto">
                <div className="text-2xl font-bold ">Checkout</div>
            </CardHeader>
            {ErrorMessage && 
            <CardDescription className="pl-6"> 
                {ErrorMessage}
            </CardDescription>
            }
            <CardContent>
                <PaymentElement/>
                <div className="mt-4">
                <LinkAuthenticationElement onChange={e=> setEmail(e.value.email)}/>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" disabled={isLoading || !stripe || !elements}>
                    {isLoading ? "Purchasing..." : `Purchase - ${formatCurrency(priceInCents/100)}`}
                </Button>
            </CardFooter>
        </Card>

    </form>

}

