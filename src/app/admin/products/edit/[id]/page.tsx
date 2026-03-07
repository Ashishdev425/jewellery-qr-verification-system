"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { getProductAction, updateProductAction, uploadToDrive } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type SimpleForm = {
  code: string;
  conclusion: string;
  magnification: string;
  preciousMetal: string;
  remarks: string;
};

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"Active" | "Archived">("Active");

  const [formData, setFormData] = useState<SimpleForm>({
    code: "",
    conclusion: "",
    magnification: "",
    preciousMetal: "",
    remarks: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProductAction(id);
        if (!product) {
          toast.error("Record not found");
          router.push("/admin/products");
          return;
        }

        setFormData({
          code: String(product.Color || "").replace(/\D/g, "").slice(0, 5),
          conclusion: product.Setting_Type || "",
          magnification: product.Clarity || "",
          preciousMetal: product.Metal_Purity || "",
          remarks: product.Diamond_Type || "",
        });

        setStatus((product.Status === "Archived" ? "Archived" : "Active") as "Active" | "Archived");
        if (product.Product_Image_URL) setImagePreview(product.Product_Image_URL);
      } catch {
        toast.error("Failed to load record");
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{5}$/.test(formData.code)) {
      toast.error("Code must be exactly 5 digits");
      return;
    }

    if (!imagePreview) {
      toast.error("Please upload an image");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = imagePreview;

      if (image) {
        const fd = new FormData();
        fd.append("file", image);
        fd.append("certId", id);
        imageUrl = await uploadToDrive(fd);
      }

      await updateProductAction(id, {
        Product_Name: formData.conclusion,
        Jewellery_Type: "N/A",
        Metal_Type: "",
        Metal_Purity: formData.preciousMetal,
        Gross_Weight: 0,
        Net_Weight: 0,
        Diamond_Type: formData.remarks,
        Diamond_Cut: "",
        Diamond_Carat: 0,
        Color: formData.code,
        Clarity: formData.magnification,
        Setting_Type: formData.conclusion,
        Product_Image_URL: imageUrl,
        Status: status,
      });

      toast.success("Record updated");
      router.push(`/admin/products/${id}`);
    } catch (error: any) {
      toast.error(error?.message || "Failed to update record");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="space-y-3">
        <Link href={`/admin/products/${id}`}>
          <Button variant="ghost" className="gap-2 -ml-3">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
        <h1 className="text-3xl font-serif font-black text-gray-900">Edit Report Entry</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Report Fields</CardTitle>
            <CardDescription>Certificate Number remains fixed.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Certificate Number</Label>
              <Input value={id} readOnly className="font-mono" />
            </div>
            <div className="space-y-2">
              <Label>Code (5 digits)</Label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.replace(/\D/g, "").slice(0, 5) })}
                placeholder="35874"
                inputMode="numeric"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Conclusion</Label>
              <Input
                value={formData.conclusion}
                onChange={(e) => setFormData({ ...formData, conclusion: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Magnification</Label>
              <Input
                value={formData.magnification}
                onChange={(e) => setFormData({ ...formData, magnification: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Precious Metal</Label>
              <Input
                value={formData.preciousMetal}
                onChange={(e) => setFormData({ ...formData, preciousMetal: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Remarks</Label>
              <Input
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                required
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Image Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  "relative aspect-square rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden",
                  imagePreview ? "border-amber-300" : "border-gray-200"
                )}
              >
                {imagePreview ? (
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                ) : (
                  <div className="text-center text-gray-500 text-sm px-4">
                    <Upload className="h-6 w-6 mx-auto mb-2" />
                    Upload image
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Updating...
              </span>
            ) : (
              "Update"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
