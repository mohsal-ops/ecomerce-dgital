import { cache as reactCache } from "react"
import { unstable_cache as nextCache } from "next/cache"


type Callback  = (...arg: any[])=>Promise <any>
export function cache<T extends Callback>(cb : T , 
    keyParts : string[] ,
    options: {revaldate?: number | false , tags?: string[]} ={} )

    {
        return nextCache(reactCache(cb),keyParts,options)

    }

    //options: {revaldate?: number | false , tags?: string[]} ={} ) the the empty object means that by default gonna be an empty array 