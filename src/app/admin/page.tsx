import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle } from "@/components/ui/card";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";


  async function getSalesData(){
    const data = await db.order.aggregate({
      _sum: {pricePaidInCents : true},
      _count : true 

    })
 
    return {
      amount: (data._sum.pricePaidInCents || 0  )/ 100,
      NumberOfSales : data._count
    }
    
    

  }
  async function getUsersData (){
    const [userCount , orderData] = await Promise.all([
      db.user.count(),
      db.order.aggregate({
      _sum: { pricePaidInCents : true }
    })
    ])
    return {
      userCount,
      averageValurPerUser : userCount === 0 ? 0 : (orderData._sum.pricePaidInCents || 0 ) / userCount/100
      //  || 0 means set to 0 by default 
    }
        
  }
  async function getProductData(){
    const [active, inactive ] = await Promise.all([
      db.product.count({ where : {isAvailableForPurchase : true }}),
      db.product.count({ where : {isAvailableForPurchase : false }})

    ])
    return {
      active, inactive 
    }
  }
  

export default async function AdminDashbord() {
  const [salesData, userData, productData] = await Promise.all([
    getSalesData(),
    getUsersData(),
    getProductData()
  ])

  const data = [
    {
      name: "Jan",
      total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
      name: "Feb",
      total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
      name: "Mar",
      total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
      name: "Apr",
      total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
      name: "May",
      total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
      name: "Jun",
      total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
      name: "Jul",
      total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
      name: "Aug",
      total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
      name: "Sep",
      total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
      name: "Oct",
      total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
      name: "Nov",
      total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
      name: "Dec",
      total: Math.floor(Math.random() * 5000) + 1000,
    },
  ]
   
    return (
     <div className="grid grid-flow-dense grid-rows-2 grid-cols-1 md:grd-cols-2 lg:grid-cols-3 gap-4">
        <DashbordCard title="Sales" 
        subtitle ={formatCurrency(salesData.NumberOfSales)}
        body = {formatNumber(salesData.amount)}/>

        <DashbordCard title="Customers" 
        subtitle ={`${formatCurrency(userData.averageValurPerUser)} Average Value`}
        body = {formatNumber(userData.userCount)}/>

        <DashbordCard title="Products" 
        subtitle ={`${formatNumber(productData.inactive)} Inactive`}
        body = {formatNumber(productData.active)}/>

        
        
     
     </div>
    );
  }


  type  DashbordCardProps = {
    title : String
    subtitle : String
    body : String

  }
  function DashbordCard ({title , subtitle , body } : DashbordCardProps ){
    return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
     </Card>
  )


  }

