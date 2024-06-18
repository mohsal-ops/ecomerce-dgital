import { AdminNav, NavLink } from "./_components/nav";

export default function Adminlayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const dynamic= 'force-dynamic'
  return (
  <>
    <AdminNav>
        <NavLink href="/admin">Dashbord</NavLink>
        <NavLink href="/admin/products">Products</NavLink>
        <NavLink href="/admin/users">Customers</NavLink>
        <NavLink href="/admin/orders">Sales</NavLink>
    </AdminNav>
    <div className="container py-6 overflow-auto" >
        {children}
    </div>
    </>
  )
}

