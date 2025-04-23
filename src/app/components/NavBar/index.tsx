"use client"

import Image from "next/image"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

const NavBar = () => {
    
    return (
        <>
        <nav className="w-full border-b-2 border-b-gray-300 flex justify-between px-40 items-center">
            <div>
                <Link href="/">
                <Image src="/logo.png" alt="Om Kasir Logo" width={50} height={20} className="my-2"/>
                </Link>
            </div>
            <div className="space-x-4">
                <Link href="/service">
                Service
                </Link>
                <Link href="/aboutus">
                About Us
                </Link>
            </div>
            <div className="space-x-4">
                <Link className={buttonVariants({ variant: "outline"})} href="/login"  >
                Login
                </Link>
                <Link className={buttonVariants({ variant: "outline"})} href="/register">
                Register
                </Link>
            </div>


        </nav>
        </>
    )

}

export default NavBar