"use client"

import Image from "next/image"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

const Hero = () => {
    
    return (
        <>
        <div className="h-[500px] bg-gradient-to-br from-white to-yellow-50 flex justify-between px-4 md:px-16 lg:px-32 xl:px-56 flex-col md:flex-row">
            <div className="flex justify-center flex-col space-y-3">
                <div className="font-bold text-2xl md:text-5xl md:space-y-3">
                    <h1 className="text-yellow-400">Lancar Terima Orderan</h1> 
                    <h1>Tanpa Keteteran</h1>
                </div>
                    <p>Proses jualan, kelola stok, dan lihat laporan laba/rugi 
                    lebih mudah dengan Om Kasir POS</p>
                <div>
                    <Link className={buttonVariants({ variant: "outline"})} href="#">
                            Konsultasi Sekarang
                    </Link>
                </div>
            </div>
            <div className="flex justify-center items-end">
                <Image src="/hero.webp" alt="hero" width={500} height={500}></Image>
            </div>
        </div>

        </>
    )

}

export default Hero