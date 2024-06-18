"use client"

import { cn } from "@/lib/utils";
import {signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode, useState } from "react";


 
export function AdminNav({children}:{children : ReactNode}) {

  const [toggleDropDown, settoggleDropDown]=useState<boolean>(false)
  const { data: session } = useSession()


  return (
    <nav className='bg-primary text-primary-foreground flex items-center justify-center px-4'>
        {children}
    </nav>
  )
}

export function NavLink(props : Omit<ComponentProps<typeof Link> , "className"> ){
    const pathname = usePathname()
    return <Link {...props} className={cn("p-4 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground duration-200",pathname === props.href && "bg-background text-foreground" )}/>

}