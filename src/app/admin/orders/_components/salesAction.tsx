'use client'


import db from "@/db/db"
import { revalidatePath } from "next/cache"
import {useRouter } from "next/navigation"
import { useTransition } from "react"
import { OrderdeleteFunction } from "../../_actions/orders"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

export async function DeleteCustomer({
    id,
}:{ 
     id: string,
}){
    const router = useRouter()
    const [isPending,starTransition]= useTransition()
    return <button
    className=" text-destructive w-full rounded-sm h-8 hover:bg-red-500 hover:text-white hover:duration-200 text-sm text-start pl-2" 
    disabled={isPending}
    onClick={()=>{
        starTransition(async ()=>{
        await OrderdeleteFunction(id)
        router.refresh()
    })}}
    
    >
        Delete

    </button>
}


