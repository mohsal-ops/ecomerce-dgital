import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table,TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import db from "@/db/db"
import { formatCurrency, formatNumber } from "@/lib/formatters"
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react"
import Link from "next/link"
import { ActivateAndDeactivate, DeleteProduct } from "./_components/productActions"



  
export default function AdminProducts (){

  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <p className="text-4xl">Products</p>
        <Button asChild>
          <Link href="/admin/products/new">Add product</Link>
        </Button>
      </div>
      <ProductTable/>
      </>
  )
}

async function ProductTable (){
  const products = await db.product.findMany({
    select:{
      id: true,
      name :true,
      isAvailableForPurchase:true,
      priceInCents:true ,
      _count: {select : {orders : true }},
    },
    orderBy:{name : "asc"}
  })
  if(products.length === 0 ) return <p>No products found</p>

  return <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="w-0">
          <span className="sr-only">Available For Purchase </span>
        </TableHead>
        <TableHead>Name</TableHead>
        <TableHead>price</TableHead>
        <TableHead>Orders</TableHead>
        <TableHead className="w-0">
          <span className="sr-only">Actions </span>
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      
      {products?.map(product =>(
      <TableRow key={product.id}>
        <>
        <TableCell>
          {product.isAvailableForPurchase  ? (
            <>
            <span className="sr-only">Available</span>
            <CheckCircle2 />
          </>
        ) : (
          <>
            <span className="sr-only">Unavailable</span>
            <XCircle className="stroke-destructive" />
          </>
          )
          }
        </TableCell>
        <TableCell>{product.name}</TableCell>
        <TableCell>{formatCurrency((product.priceInCents)/ 100 || 0)   }</TableCell>
        <TableCell>{formatNumber(product._count.orders)}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <span className="sr-only">Actions</span>
              <MoreVertical/>
            </DropdownMenuTrigger>
            <DropdownMenuContent > 
              <DropdownMenuItem >
                <a download href={`/admin/products/${product.id}/download`}>Download</a>
              </DropdownMenuItem>
              <DropdownMenuItem >
                <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
              </DropdownMenuItem>
              <ActivateAndDeactivate id={product.id} isAvailableForPurchase={product.isAvailableForPurchase}/>
              <DropdownMenuSeparator/>
              <DeleteProduct id = {product.id} disabled={product._count.orders > 0 }/>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
        </>
        </TableRow>
      )) 
      
      }
     
    </TableBody>
  </Table>
}

 