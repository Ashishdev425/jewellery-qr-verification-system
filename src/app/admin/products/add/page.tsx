"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createProductAction, getAllProductsAction, uploadToDrive } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertCircle, Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type SimpleForm = {
  code: string;
  conclusion: string;
  magnification: string;
  preciousMetal: string;
  remarks: string;
};

const CERT_START = 1000000;

function getNextCertificateId(ids: string[]) {
  const maxExisting = ids
    .filter((id) => /^\d{7}$/.test(String(id).trim()))
    .map((id) => Number(id))
    .reduce((acc, value) => Math.max(acc, value), CERT_START - 1);

  return String(maxExisting + 1).padStart(7, "0");
}

export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [certId, setCertId] = useState("");
  const [existingIds, setExistingIds] = useState<Set<string>>(new Set());
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<SimpleForm>({
    code: "",
    conclusion: "",
    magnification: "",
    preciousMetal: "",
    remarks: "",
  });

  const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
  const isUrlConfigured = scriptUrl && !scriptUrl.includes("REPLACE_WITH_YOUR_DEPLOYED_URL");

  useEffect(() => {
    const init = async () => {
      try {
        const products = await getAllProductsAction();
        const ids = (products || []).map((p: any) => String(p.Certificate_ID || ""));
        setExistingIds(new Set(ids));
        setCertId(getNextCertificateId(ids));
      } catch {
        setCertId(String(CERT_START).padStart(7, "0"));
      } finally {
        setInitializing(false);
      }
    };

    init();
  }, []);

  const canSubmit = useMemo(() => {
    return (
      /^\d{7}$/.test(certId) &&
      /^\d{5}$/.test(formData.code) &&
      formData.conclusion.trim().length > 0 &&
      formData.magnification.trim().length > 0 &&
      formData.preciousMetal.trim().length > 0 &&
      formData.remarks.trim().length > 0 &&
      !!image
    );
  }, [certId, formData, image]);

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

    if (!/^\d{7}$/.test(certId)) {
      toast.error("Certificate number must be 7 digits");
      return;
    }

    if (existingIds.has(certId)) {
      toast.error("Certificate number already exists. Refresh and try again.");
      return;
    }

    if (!/^\d{5}$/.test(formData.code)) {
      toast.error("Code must be exactly 5 digits");
      return;
    }

    if (!image) {
      toast.error("Please upload an image");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("file", image);
      fd.append("certId", certId);
      const imageUrl = await uploadToDrive(fd);

      await createProductAction({
        Certificate_ID: certId,
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
        Status: "Active",
      });

      toast.success("Record added successfully");
      router.push("/admin/products");
    } catch (error: any) {
      toast.error(error?.message || "Failed to add record");
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-serif font-black text-gray-900">New Report Entry</h1>
        <p className="text-gray-500 mt-2">Only the 7 required report fields are used.</p>
      </div>

      {!isUrlConfigured && (
        <div className="p-6 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-red-700 text-sm">Google Script URL is not configured in .env</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Report Fields</CardTitle>
            <CardDescription>Certificate Number is auto-generated (7 digit, unique).</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Certificate Number</Label>
              <Input value={certId} readOnly className="font-mono" />
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
                placeholder="Gold Setting"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Magnification</Label>
              <Input
                value={formData.magnification}
                onChange={(e) => setFormData({ ...formData, magnification: e.target.value })}
                placeholder="Natural Inclusion"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Precious Metal</Label>
              <Input
                value={formData.preciousMetal}
                onChange={(e) => setFormData({ ...formData, preciousMetal: e.target.value })}
                placeholder="14kt"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Remarks</Label>
              <Input
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="0.29ct Natural Diamond"
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

          <Button type="submit" className="w-full" disabled={loading || !isUrlConfigured || !canSubmit}>
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </span>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
