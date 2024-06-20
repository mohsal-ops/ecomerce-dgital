"use server"

import db from "@/db/db"
import { z } from "zod"
import { notFound, redirect } from "next/navigation"
import fs from "fs/promises"
import { revalidatePath } from "next/cache"


const fileSchema = z.instanceof(File, { message: "Required" })
const imageSchema = fileSchema.refine(file => file.size === 0 || file.type.startsWith("image/"))


const addSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    priceInCents: z.coerce.number().int().min(1),
    file: fileSchema.refine(file => file.size > 0, "Required"),
    image: imageSchema.refine(file => file.size > 0, "Required"),
  })
export async function AddProduct (prevSatate : unknown , formData : FormData){
    const result = addSchema.safeParse(Object.fromEntries(formData.entries()))

    if(result.success === false ) {
        return result.error.formErrors.fieldErrors
    } 

    const createSlug = (arg:string)=>{
      return arg.toLowerCase().replace(/ /g, '-') .replace(/[^\w-]+/g, '') as string;  
    }
    const slug = createSlug(result.data.name)
    
    const data = {...result.data,slug}

    
    //make the diractory for my product because 
    //my product is a file to give not a normal product
    await fs.mkdir("products",{recursive : true})
    //make the path for my file with an id 
    const filePath = `products/${crypto.randomUUID()}-${data.file.name}`
    //save my file diractory 
    await fs.writeFile(filePath , Buffer.from(await data.file.arrayBuffer()))
    
    //same thing for thre imagre 
    
    await fs.mkdir("public/products",{recursive : true})
  const imagePath = `public/products/${crypto.randomUUID()}-${data.image.name}`
    await fs.writeFile(`public${imagePath}` , Buffer.from(await data.image.arrayBuffer()))
    
    await db.product.create({
        data:{
        name: data.name,
        description: data.description,
        priceInCents : data.priceInCents,
        slug: data.slug,
        filePath,
        imagePath,
    }
    }).then(()=>console.log("PRODUCT HSA BEEN CREATED"))

    revalidatePath("/")
    revalidatePath("/products")
    redirect("/admin/products")
}




const editSchema = addSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
})

export async function updateProduct(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()))
  if (result.success === false) {
    return result.error.formErrors.fieldErrors
  }

  const data = result.data
  const product = await db.product.findUnique({ where: { id } })

  if (product == null) return notFound()

  let filePath = product.filePath
  if (data.file != null && data.file.size > 0) {
    await fs.unlink(product.filePath)
    filePath = `products/${crypto.randomUUID()}-${data.file.name}`
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))
  }

  let imagePath = product.imagePath
  if (data.image != null && data.image.size > 0) {
    await fs.unlink(`public${product.imagePath}`)
    imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.image.arrayBuffer())
    )
  }

  await db.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath,
      imagePath,
    },
  })

  revalidatePath("/")
  revalidatePath("/products")

  redirect("/admin/products")
}




export const toggleProductAvalability = async (id:string ,isAvailableForPurchase:boolean ) =>{
    await db.product.update({
        where:{id},
        data : {isAvailableForPurchase}
    })
    revalidatePath("/")
    revalidatePath("/products")

}
export const deleteFunction = async (id:string ) =>{
    const product = await db.product.delete({
        where:{id},
    })
    if(product == null )return notFound()
    await fs.unlink(product.filePath)
  await fs.unlink(`public${product.imagePath}`)
  
    revalidatePath("/")
    revalidatePath("/products")


}

















