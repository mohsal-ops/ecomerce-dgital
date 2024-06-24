"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ComponentProps, useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { AlignJustify, ChevronDownIcon, User } from "lucide-react";
import { TiHome } from "react-icons/ti";
import { AiFillProduct } from "react-icons/ai";
import { IoMdBookmark, IoMdSearch } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { TbUserFilled } from "react-icons/tb";
import { FaRegUser } from "react-icons/fa";
import { Command, CommandGroup, CommandItem, CommandList } from "./ui/command";
import { SearchBar } from "./searchBar";
import db from "@/db/db";

export function NavBarOrSideBar() {
  const [screenSize, setscreenSize] = useState<number>()

  useEffect(() => {
    setscreenSize(window.innerWidth) 
  },[])

  return <nav>{screenSize && screenSize > 640 && <SideBar />}</nav>;
}
export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  //sodeBarItems

  const pathname = usePathname();
  return (
    <Link
      {...props}
      className={cn(
        "p-4 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground duration-200",
        pathname === props.href && "bg-background text-foreground"
      )}
    />
  );
}
export function SideBar() {
  const { data: session } = useSession();
  const path = usePathname();

  return (
    <main className="flex flex-col gap-1 h-screen overflow-auto min-w-72 p-2 pl-0 pt-0 sm:pt-2 scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-100">
      <div className=" w-full ">
        <Card className="w-full h-full flex  flex-col justify-between px-3 py-2 rounded-l-none ">
          <div className="flex items-center justify-between space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/avatars/04.png" alt="Image" />
              <AvatarFallback>user</AvatarFallback>
            </Avatar>
            {session?.user ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full text-muted-foreground h-10 px-3 bg-gray-50"
                  >
                    Member
                    <ChevronDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="flex gap-2 items-start ">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session.user.image} alt="Image" />
                    <AvatarFallback>user</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session?.user?.name as string}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {session?.user?.email as string}
                    </p>
                    <div className="flex justify-end ">
                      {session?.user && (
                        <div className="mt-3 ml-1 ">
                          <Button
                            onClick={() => signOut()}
                            className="bg-violet-600"
                          >
                            Sign out
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Button
                className=" text-sm font-medium  px-3 bg-violet-600 rounded-lg h-10"
                onClick={() => signIn("google")}
              >
                Sign In
              </Button>
            )}
          </div>
        </Card>
      </div>

      {path !== "/" && (
        <div className="sm:hidden ">
          <SearchBar />
        </div>
      )}

      <div className="h-full">
        <Command className="flex px-2 h-full flex-col justify-between border pt-2 rounded-l-none ">
          <CommandList>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <TiHome className="mr-2 h-4 w-4" />
                <Link href="/">
                  <span className="text-sm font-medium ">Home</span>
                </Link>
              </CommandItem>
              <CommandItem>
                <AiFillProduct className="mr-2 h-4 w-4" />
                <Link href="/products" className="text-sm font-medium ">
                  <span>Products</span>
                </Link>
              </CommandItem>
              <CommandItem>
                <IoMdBookmark className="mr-2 h-4 w-4" />
                <Link
                  href={{
                    pathname: "/orders",
                    query: {
                      user: session ? session.user.id : "no-Orders",
                    },
                  }}
                  className="text-sm font-medium "
                >
                  <span>Orders</span>
                </Link>
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Settings" className="flex flex-col gap-2">
              <CommandItem>
                <TbUserFilled className="mr-2 h-4 w-4" />

                <Link
                  href={{
                    pathname: "/profile/",
                    query: {
                      image: session ? session.user.image : "no-image",
                      email: session ? session.user.email : "no-user",
                      name: session ? session.user.name : "no-name",
                    },
                  }}
                  className="text-sm font-medium "
                >
                  <span>Profile</span>
                </Link>
              </CommandItem>
              <CommandItem className="text-foreground  bg-gray-200 hover:bg-gray-300 hover:cursor-pointer mt-2 h-10 ">
                <FaUserCircle className="mr-2 h-4 w-4" />
                <Link href="/admin" className="text-sm font-medium ">
                  Admin
                </Link>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </main>
  );
}
export function TopNavBar() {
  const router = useRouter();
  const [collaps, setcollaps] = useState<boolean>(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const handleRouteChange = () => {
      setcollaps(false); // Collapse the sidebar on route change
    };
    handleRouteChange();
  }, [pathname]); // Depend on `pathname` to trigger the effect on route change

  return (
    <div className="flex w-full h-16  justify-between shadow-sm px-4 ">
      <div className="sm:hidden flex items-center">
        <AlignJustify
          onClick={() => setcollaps(true)}
          className="hover:cursor-pointer "
        />
      </div>
      <div className="flex flex-row  h-full  items-center">
        <p className="gradient-text ml-4 font-black text-3xl">Udemo</p>
      </div>
      <div
        className={` flex gap-4 items-center justify-end  ${
          pathname !== "/" && "justify-end "
        }`}
      >
        {pathname !== "/" && (
          <div className="hidden sm:flex">
            <SearchBar />
          </div>
        )}
        <Link
          href={{
            pathname: "/profile/",
            query: {
              image: session ? session.user.image : "no-image",
              email: session ? session.user.email : "no-user",
              name: session ? session.user.name : "no-name",
            },
          }}
          className="flex items-center hover:cursor-pointer"
        >
          <Avatar>
            <AvatarImage src={session?.user.image as string} alt="Image" />
            <AvatarFallback>
              <FaRegUser className="text-gray-500 h-8"  />
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>

      {collaps && (
        <>
          <div className="flex absolute left-0 z-50 animate-slide-in">
            <SideBar />
            <span
              onClick={() => setcollaps(false)}
              className="h-10 mt-2 ml-[2px] hover:cursor-pointer hover:opacity-100 bg-gray-200 rounded-full opacity-75 flex justify-center z-50 w-10 items-center"
            >
              <IoMdClose className="opacity-95 w-7 h-7" />
            </span>
          </div>
          <div
            className="absolute right-0 inset-0 bg-black opacity-50 z-40"
            onClick={() => setcollaps(false)}
          />
        </>
      )}
    </div>
  );
}
