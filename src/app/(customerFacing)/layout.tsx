import { NavBarOrSideBar, TopNavBar } from "@/components/navBar";

export default function Customerlayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dynamic = "force-dynamic";
  return (
    <div className="fixed w-full flex flex-col">
        <TopNavBar />
      <div className="flex sm:flex-row flex-col max-h-screen overflow-auto">
        <NavBarOrSideBar />
        <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-100 ">
          {children}
        </div>
      </div>
    </div>
  );
}
