"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";
import { CiHeart } from "react-icons/ci";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {Triangle} from 'react-loader-spinner'

type productObjectPath = {
  id: string;
  name: string;
  priceInCents: number;
  description: string;
  imagePath: string;
};

export default function ProductCard({
  id,
  name,
  priceInCents,
  description,
  imagePath,
}: productObjectPath) {
  const [isLoading, setisLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const email = session?.user.email as string;
  const hndler = async () => {
    setisLoading(true);
    const response = await fetch("/api/addtowishlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, id }),
    });
    if (response.status === 500) {
      setisLoading(false);
    }

    if (response.ok) {
      setisLoading(false);
    } else {
      setisLoading(false);
    }
  };
  return (
    <div>
      <Card className="flex overflow-hidden flex-col min-h- " key={id}>
        <div className="relative w-full h-auto aspect-video">
          <Image src={imagePath} fill alt={name} />
        </div>
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>{name}</CardTitle>
            <span>{formatCurrency(priceInCents / 100)}</span>
          </div>
          <div className="flex items-center w-8 border rounded-full h-8 p-1 hover:bg-neutral-200 hover:cursor-pointer">
            {isLoading ? (
              <Triangle
                visible={true}
                height="full"
                width="full"
                color="#000"
                ariaLabel="triangle-loading"
              />
            ) : (
              <CiHeart onClick={hndler} className="h-full w-full" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>{description}</CardDescription>
        </CardContent>
        <CardFooter>
          <Button asChild size="lg" className="w-full">
            <Link href={`/products/${id}/purchase`}>Purchase</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col animate-pulse">
      <div className="w-full aspect-video bg-gray-300" />
      <CardHeader>
        <CardTitle>
          <div className="w-3/4 h-6 rounded-full bg-gray-300" />
        </CardTitle>
        <CardDescription>
          <div className="w-1/2 h-4 rounded-full bg-gray-300" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="w-full h-4 rounded-full bg-gray-300" />
        <div className="w-full h-4 rounded-full bg-gray-300" />
        <div className="w-3/4 h-4 rounded-full bg-gray-300" />
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled size="lg"></Button>
      </CardFooter>
    </Card>
  );
}
