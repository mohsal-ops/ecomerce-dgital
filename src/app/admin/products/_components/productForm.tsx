"use client"

import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/formatters"
import { useState } from "react"
import { AddProduct, updateProduct } from "../../_actions/products"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useFormState, useFormStatus } from "react-dom"
import { Product } from "@prisma/client"
import Image from "next/image"




export function ProductForm({product }:{product: Product | null} ){
    const [error , action ] = useFormState(
        product == null ? AddProduct : updateProduct.bind(null , product.id ),
        {})

    const [PriceInCents, setPriceInCents] = useState<number | undefined>(0)
    return <form action ={action} className="space-y-8">
        <div className="space-y-2">
            <Label htmlFor="name" className=" text-sm ">Name</Label>
            <Input 
            required
            id="name" 
            defaultValue={product?.name}
            name="name" 
            type="text" 
            />
            {error.name && <div className=" text-destructive">{error.name}</div>}
            
        </div>
        <div className="space-y-2">
            <Label htmlFor="priceInCents" className=" text-sm">price in cents</Label>
            <Input 
            required
            id="priceInCents" 
            name="priceInCents" 
            type="number" 
            value={PriceInCents}
            defaultValue={product?.priceInCents}
            className="w-full h-8 border focus:outline-none focus:border-neutral-300 pl-2 border-neutral-200"
            onChange={e =>setPriceInCents(Number(e.target.value) || undefined)}/>
            <div className="text-muted-foreground">
                {formatCurrency((PriceInCents || 0) / 100)}
           </div>
           {error.priceInCents && <div className=" text-destructive">{error.priceInCents}</div>}

        </div>
        <div className="space-y-2">
            <Label htmlFor="description" className=" text-sm">Description</Label>
            <Textarea
            required
            id="description" 
            name="description" 
            defaultValue={product?.description}
            className="w-full h-22 border focus:outline-none focus:border-neutral-300 pl-2 border-neutral-200"/>
            {error.description && <div className=" text-destructive">{error.description}</div>}

        </div>
        <div className="space-y-2">
            <Label htmlFor="file" className=" text-sm ">File</Label>
            <Input 
            required={product == null}
            id="file" 
            name="file" 
            type="file" 
            className="w-full border focus:outline-none focus:border-neutral-300 p-2 border-neutral-200"/>
            {product != null && (
                <div className="text-muted-foreground">{product.filePath}</div>
            )}

            {error.file && <div className=" text-destructive">{error.file}</div>}

        </div>
        <div className="space-y-2">
            <Label htmlFor="file" className=" text-sm">Image</Label>
            <Input 
            required={product != null}
            id="image" 
            name="image" 
            type="file" 
            className="w-full border focus:outline-none focus:border-neutral-300 p-2 border-neutral-200"/>
            {product != null && (
                <Image src={product.imagePath} height="400" width="400" alt="product image"/>
            ) }
            {error.image && <div className=" text-destructive">{error.image}</div>}

        </div>
        <SubmitButton />
        

  </form>

}

const SubmitButton = () =>{
    const { pending} = useFormStatus()
    return <Button disabled={pending} className="mt-5" type="submit">
        {pending ? "saving..." : "save" }
        
    </Button>
}