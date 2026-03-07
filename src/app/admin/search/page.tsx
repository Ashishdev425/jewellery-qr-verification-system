"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search as SearchIcon, AlertCircle, ShieldCheck, ArrowRight, Diamond } from "lucide-react";
import { googleSheets } from "@/lib/google-sheets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SearchProduct() {
  const [certId, setCertId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = certId.trim();
    if (!id) return;

    setLoading(true);
    setError(false);
    setResult(null);

    try {
      const data = await googleSheets.getProduct(id);
      if (data) setResult(data);
      else setError(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-serif font-black tracking-tight text-gray-900">Search Certificate</h1>
        <p className="text-gray-500">Find a record instantly by Certificate Number.</p>
      </div>

      <Card className="border border-gray-100">
        <CardHeader>
          <CardTitle className="text-xl">Certificate Lookup</CardTitle>
          <CardDescription>Enter 7-digit certificate number.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <SearchIcon className="h-4 w-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <Input
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                placeholder="e.g. 7419638"
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={loading} className="sm:min-w-40">
              {loading ? "Searching..." : "Search"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 flex items-center gap-3 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">Certificate not found. Please check the number and try again.</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="border border-gray-100 overflow-hidden">
          <CardHeader className="bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-2 text-emerald-700 text-sm font-semibold">
              <ShieldCheck className="h-4 w-4" />
              Verified Record
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="h-40 w-40 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 relative shrink-0">
                {result.Product_Image_URL ? (
                  <Image src={result.Product_Image_URL} alt="Product" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Diamond className="h-10 w-10" />
                  </div>
                )}
              </div>

              <div className="flex-1 w-full space-y-4">
                <h3 className="text-2xl font-black tracking-tight text-gray-900">{result.Product_Name || result.Setting_Type || "N/A"}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-gray-100 p-3">
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Certificate Number</p>
                    <p className="font-semibold">{result.Certificate_ID || "N/A"}</p>
                  </div>
                  <div className="rounded-lg border border-gray-100 p-3">
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Code</p>
                    <p className="font-semibold">{result.Color || "N/A"}</p>
                  </div>
                  <div className="rounded-lg border border-gray-100 p-3">
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Conclusion</p>
                    <p className="font-semibold">{result.Setting_Type || "N/A"}</p>
                  </div>
                  <div className="rounded-lg border border-gray-100 p-3">
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Magnification</p>
                    <p className="font-semibold">{result.Clarity || "N/A"}</p>
                  </div>
                  <div className="rounded-lg border border-gray-100 p-3">
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Precious Metal</p>
                    <p className="font-semibold">{result.Metal_Purity || "N/A"}</p>
                  </div>
                  <div className="rounded-lg border border-gray-100 p-3">
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Remarks</p>
                    <p className="font-semibold">{result.Diamond_Type || "N/A"}</p>
                  </div>
                </div>

                <Link href={`/admin/products/${result.Certificate_ID}`}>
                  <Button className="gap-2">
                    Open Full Report
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
