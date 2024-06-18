import { ProductForm } from "../_components/productForm";

export default function New (){
  return (
    <>
      <div className="flex flex-col gap-3 md:ml-44">
        <p className=" text-3xl "> Add Product </p>
        <ProductForm product={null} />
      </div>
    </>
  );
}

