import db from "@/db/db"
import { ProductForm } from "../../_components/productForm"

export default async function Edit ({
  params:{id}
}:{
  params:{id : string}
}){
  const product = await db.product.findUnique({where:{id}})
  return (
    <>
    <div className="flex flex-col gap-3 md:ml-44">
      <p className=" text-3xl "> Edit Product </p>
      <ProductForm product={product}/>
    </div>
    </>
  )
}
