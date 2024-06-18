"use server"

import db from "@/db/db"
import { notFound } from "next/navigation"

export async function OrderdeleteFunction(id:string){
    const order = await db.order.delete({
        where : { id }
    })
    if(!order) return notFound()
        return order

}