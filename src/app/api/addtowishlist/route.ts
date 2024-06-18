import db from "@/db/db";
import { NextRequest } from "next/server";
import { z } from "zod";



const Fileschema = z.object({
    email: z.string().min(1),
    productId: z.string().min(1)
})
export async function POST(req:NextRequest ) {
    const { email, id } = await req.json()
    

    
    const formData = {
        email: email,
        productId : id
    }
    
    const result = Fileschema.safeParse(formData)
    
    if (!result.success) {
        return new Response("data doesn't parsed properly",{status:400})
    }
    const data = result.data

    const product = await db.wishProduct.findFirst({
        where: {
            productId:id
        }
    })
    if (!product) {
        try {
            
            await db.wishProduct.create({
            data: {
                email: data.email,
                productId: data.productId
            }
        })
           return new Response('success',{status:200})
       } catch (error) {
            return new Response("failed",{status:500})
        
    } 
    } else {
        return new Response("product alredy added",{ status: 500})
    }
       
}