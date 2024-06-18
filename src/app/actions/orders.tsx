"use server"

import db from "@/db/db";
import { Product } from "@prisma/client";

export async function userOrderExists(email: string , productId: string ){
    return( 
        (await db.order.findFirst({
        where : {user : {email} , productId}
    })) != null
)
}

