"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useTransition } from "react"
import { deleteFunction, toggleProductAvalability } from "../../_actions/products"
import { useRouter } from "next/navigation"

export async function ActivateAndDeactivate({
    id,
    isAvailableForPurchase
}:{ 
     id: string,
    isAvailableForPurchase: boolean
}){
    const router = useRouter()
    const [isPending,starTransition]= useTransition()
    return <DropdownMenuItem
    disabled={isPending}
    onClick={()=>{
        starTransition(async ()=>{
        await toggleProductAvalability(id , !isAvailableForPurchase)
        router.refresh()
    })}}
    >

        {isAvailableForPurchase? "Deactivate" :"Activate"}
    </DropdownMenuItem>
}

export async function DeleteProduct({
    id,
    disabled
}:{ 
     id: string,
     disabled: boolean
}){
    const router = useRouter()
    const [isPending,starTransition]= useTransition()
    return <button
    className=" w-full text-destructive rounded-sm h-8 hover:bg-red-500 hover:text-white hover:duration-200 text-sm text-start pl-2 "
    disabled={disabled || isPending}
    onClick={()=>{
        starTransition(async ()=>{
        await deleteFunction(id)
        router.refresh()
    })}}
    
    >
        Delete

    </button>
}

