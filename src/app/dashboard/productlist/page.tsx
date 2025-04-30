import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import Link from "next/link"
  import { buttonVariants } from "@/components/ui/button"
  
  const products = [
    {
      id: "P001",
      name: "Ban Cacing",
      image: "https://placehold.co/400",
    },
    {
      id: "P002",
      name: "Ban Beat Mber",
      image: "https://placehold.co/400",
    },
    {
      id: "P003",
      name: "Ban Motor Sport",
      image: "https://placehold.co/400",
    },
    {
      id: "P004",
      name: "Bridgeston Type 0",
      image: "https://placehold.co/400",
    },
    {
      id: "P005",
      name: "Ban Sepede",
      image: "https://placehold.co/400",
    },
  ];
  
  export default function ProductTable() {
    return (
      <Table>
        <TableCaption>A list of your products.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Product ID</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Image</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-12 w-12 object-cover rounded"
                />
              </TableCell>
              <TableCell><Link className={buttonVariants({ variant: "outline"})} href="#"  >
                Edit
                </Link></TableCell>
                <TableCell><Link className={buttonVariants({ variant: "outline"})} href="#"  >
                Delete
                </Link></TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total Products</TableCell>
            <TableCell className="text-left">{products.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );
  }
  