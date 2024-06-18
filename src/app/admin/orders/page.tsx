import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import db from "@/db/db"
  import { formatCurrency, formatNumber } from "@/lib/formatters"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { MoreVertical, User } from "lucide-react"
  import PageHeader from "@/components/pageHeader"
  import { DeleteProduct } from "../products/_components/productActions"
  import { DeleteCustomer } from "./_components/salesAction"
  
  async function getSales() {
    return await db.order.findMany({
      select: {
        pricePaidInCents : true ,
        id: true,
        user : {select : {email: true}},
        product: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    })
  }
  
  export default function UsersPage() {
    return (
      <>
        <PageHeader>Sales</PageHeader>
        <UsersTable />
      </>
    )
  }
  
  async function UsersTable() {
    const orders = await getSales()
    
  
    if (orders.length === 0) return <p>No sales found</p>
  
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Price Paid</TableHead>
            <TableHead className="w-0">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map(order => (
            <TableRow key={order.id}>
              <TableCell>{order.product.name}</TableCell>
              <TableCell>{order.user.email}</TableCell>
              <TableCell>{formatCurrency((order.pricePaidInCents)/100)}</TableCell>
              <TableCell >
                <DropdownMenu >
                  <DropdownMenuTrigger >
                    <MoreVertical />
                    <span className="sr-only">Actions</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DeleteCustomer id={order.id} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }