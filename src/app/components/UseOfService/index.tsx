import Image from "next/image"
import { UseOfItem } from "@/types/useof"

const UseOfService = () => {
    const useOfItem:UseOfItem[] = [
            { title: "Cocok Untuk Memulai Bisnis", description: "Om Kasir dirancang untuk membantu pemilik usaha baru memulai usahanya tanpa ribet. Semua fitur penting seperti pencatatan penjualan, stok, dan laporan sudah tersedia sejak awal." },
            { title: "Pantau Kapan Saja dan Dimana Saja", description: "Akses dashboard penjualan, stok, dan laporan keuangan langsung dari HP atau laptop Anda, kapan pun dibutuhkan. Om Kasir memudahkan kontrol bisnis Anda secara real-time." },
            { title: "Dapat Dimengerti Orang Awam", description: "Tidak perlu latar belakang akuntansi atau teknologi. Tampilan yang simpel dan panduan yang jelas membuat siapa saja bisa langsung menggunakan Om Kasir tanpa pelatihan rumit." },
    ]
    
    return (
        <>
        <div className="bg-gray-100">
        <div className="px-4 md:px-16 lg:px-32 xl:px-56 flex flex-col md:flex-row justify-between py-24">
            <div className="flex items-start justify-center w-full">
                <Image className="rounded-2xl" src="/dapatdigunakan.png" alt="Use of" width={500} height={500}></Image>
            </div>
            <div className="flex items-start flex-col w-full my-8 space-y-12">
                {useOfItem.map((item, index) => (
                <div key={index} className="border-b-1 w-full border-gray-300">
                <h1 className="text-xl font-bold">{item.title}</h1>
                <p className="text-gray-600">{item.description}</p>
                </div>
                  ))}
            </div>
        </div>
        </div>
        </>
    )

}

export default UseOfService