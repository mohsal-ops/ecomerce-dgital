import { Product } from "@prisma/client";

export const getProducts = async ({
    page, limit
}: { page: number, limit: number }) => {


    const response = await fetch(`/api/products?page=${page}&limit=${limit}`);
    if (response.ok) {
        const data = await response.json()
        return data as {products:Product[],quantity:number}
    }

};