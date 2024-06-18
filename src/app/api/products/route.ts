import db from "@/db/db";
import { NextRequest, NextResponse, } from "next/server";



export async function GET(req: NextRequest) {        
        const { searchParams } = new URL(req.url as string)
        const page = searchParams.get('page')
        const limit = searchParams.get('limit')
        if (!page || !limit) {
            return new Response('page or limit not found',{status:404})
        }

        const pageNumber = parseInt(page as string)
        const limitNumber = parseInt(limit as string)

        const skip = (pageNumber - 1) * limitNumber

        try {
            const products = await db.product.findMany({
                skip: skip,
                take: 3,
                where: { isAvailableForPurchase: true }
            })
            const quantity = products.length
            return new Response(JSON.stringify({products,quantity}))

        } catch (error) {
            console.error("Error fetching products:", error);
            return new Response(JSON.stringify({error}),{status:500})
        }    

}