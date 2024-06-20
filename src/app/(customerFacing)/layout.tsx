import { NavBarOrSideBar, TopNavBar } from "@/components/navBar";

export default function Customerlayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dynamic = "force-dynamic";
  return (
    <div className="w-full flex flex-col overflow-hidden min-h-screen">
      <TopNavBar />
      <div className="flex sm:flex-row flex-col overflow-hidden ">
        <NavBarOrSideBar />
        <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-100 ">
          {children}
        </div>
      </div>
    </div>
  );
}
