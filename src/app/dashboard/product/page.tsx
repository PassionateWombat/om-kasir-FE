"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const FormSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  price: z.string().regex(/^\d+$/, { message: "Price must be a number" }),
  image: z
    .any()
    .refine((file) => file instanceof File || file === null, {
      message: "Image file is required",
    }),
});

export default function ProductPage() {
  const { data: session } = useSession();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      price: "",
      image: null,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("product_image", data.image);

    try {
      const res = await fetch(`${API_URL}/api/1.0.0/products`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      if (!res.ok) throw new Error("Failed to create product");
      toast.success("Product successfully added!");
      form.reset();
      setPreviewUrl(null);
    } catch (err) {
      toast.error("Failed to add product.");
      console.error(err);
    }
  }

  return (
    <div className="max-w-2xl p-6 space-y-6">
      <h1 className="text-2xl font-bold">Add Product</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 50000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel>Product Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        form.setValue("image", file);
                        setPreviewUrl(URL.createObjectURL(file));
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>Upload an image (jpg, png).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {previewUrl && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Image Preview:</p>
              <img src={previewUrl} alt="Preview" className="w-40 rounded border" />
            </div>
          )}
          <Button type="submit">Submit Product</Button>
        </form>
      </Form>
    </div>
  );
}
