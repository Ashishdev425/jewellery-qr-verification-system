"use client";

import { useEffect, useState, use } from "react";
import { getProductAction, deleteProductAction } from "@/lib/actions";
import { IdentificationCard } from "@/components/identification-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Diamond, ArrowLeft, Calendar, FileText, Settings, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductAction(id);
        if (data) setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this certificate?")) return;
    setDeleting(true);

    try {
      await deleteProductAction(id);
      toast.success("Certificate deleted");
      router.push("/admin/products");
    } catch {
      toast.error("Failed to delete certificate");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Diamond className="animate-spin h-8 w-8 text-amber-600" /></div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link href="/admin/products" className="w-full sm:w-auto">
          <Button variant="ghost" className="w-full sm:w-auto gap-2 text-gray-500 hover:text-gray-900 justify-start sm:justify-center">
            <ArrowLeft className="h-5 w-5" />
            Back to Products
          </Button>
        </Link>
        <div className="flex w-full sm:w-auto gap-2">
          <Link href={`/admin/products/edit/${id}`} className="flex-1 sm:flex-none">
            <Button variant="outline" className="w-full gap-2 border-gray-200">
              <Settings className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="flex-1 sm:flex-none gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <Card className="border-none shadow-sm overflow-hidden">
            <div className="aspect-square relative bg-gray-50">
              {product.Product_Image_URL ? (
                <Image src={product.Product_Image_URL} alt="" fill unoptimized className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-200">
                  <Diamond className="h-20 w-20" />
                </div>
              )}
            </div>
            <CardContent className="p-6">
              <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">{product.Product_Name}</h1>
              <div className="flex items-center gap-2 text-amber-700 font-mono font-bold bg-amber-50 px-3 py-1 rounded-lg w-fit">
                {product.Certificate_ID}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-gray-400">Record Info</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Created</span>
                </div>
                <span className="font-bold">{product.Created_Date ? new Date(product.Created_Date).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <FileText className="h-4 w-4" />
                  <span>Status</span>
                </div>
                <span className={product.Status === 'Active' ? 'text-emerald-600 font-bold' : 'text-gray-400 font-bold'}>{product.Status}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
              <CardTitle className="text-lg font-serif">Identification Card Generation</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <IdentificationCard product={product} />
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
              <CardTitle className="text-lg font-serif">Report Fields</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Code</p>
                  <p className="font-bold text-gray-900">{product.Color || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Conclusion</p>
                  <p className="font-bold text-gray-900">{product.Setting_Type || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Magnification</p>
                  <p className="font-bold text-gray-900">{product.Clarity || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Precious Metal</p>
                  <p className="font-bold text-gray-900">{product.Metal_Purity || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Remarks</p>
                  <p className="font-bold text-gray-900">{product.Diamond_Type || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
