"use client";

import { useEffect, useState } from "react";
import { getAllProductsAction, deleteProductAction } from "@/lib/actions";
import { Product } from "@/lib/google-sheets";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Diamond, Eye, Edit, Trash2, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProductsAction();
      if (data) setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this certificate?")) return;
    setDeletingId(id);

    try {
      await deleteProductAction(id);
      toast.success("Certificate deleted");
      await fetchProducts();
    } catch {
      toast.error("Failed to delete certificate");
    } finally {
      setDeletingId(null);
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    const aTime = new Date(a.Created_Date || 0).getTime();
    const bTime = new Date(b.Created_Date || 0).getTime();

    // Primary sort: latest created first
    if (aTime !== bTime) return bTime - aTime;

    // Fallback: larger numeric certificate first (newer in current 7-digit sequence)
    const aCert = Number(String(a.Certificate_ID ?? "").replace(/\D/g, "")) || 0;
    const bCert = Number(String(b.Certificate_ID ?? "").replace(/\D/g, "")) || 0;
    return bCert - aCert;
  });

  const needle = searchTerm.toLowerCase();
  const filteredProducts = sortedProducts.filter((p) => {
    const cert = String(p.Certificate_ID ?? "").toLowerCase();
    const name = String(p.Product_Name ?? "").toLowerCase();
    return cert.includes(needle) || name.includes(needle);
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
    if (currentPage > maxPage) setCurrentPage(maxPage);
  }, [filteredProducts.length, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6 md:space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-6 md:pb-10">
        <div>
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <div className="h-1.5 w-6 md:h-2 md:w-8 bg-amber-500 rounded-full" />
            <span className="text-[9px] md:text-xs font-black text-amber-600 uppercase tracking-[0.2em] md:tracking-[0.3em]">Inventory Control</span>
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif font-black text-gray-900 tracking-tight">Certificate Registry</h1>
          <p className="text-gray-500 mt-1 md:mt-4 font-medium text-sm md:text-lg">Manage the complete lifecycle of jewellery identification assets.</p>
        </div>
        <Link href="/admin/products/add" className="w-full md:w-auto">
          <Button className="w-full md:w-auto bg-gray-900 hover:bg-amber-600 text-white px-6 md:px-10 py-4 md:py-8 rounded-xl md:rounded-[2rem] shadow-xl md:shadow-2xl shadow-gray-200 transition-all duration-500 group h-auto">
            <div className="flex flex-row md:flex-col items-center justify-center gap-3 md:gap-1">
              <span className="text-base md:text-xl font-serif font-black italic tracking-tighter">New Entry</span>
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-60 hidden md:block">Authorize Record</span>
            </div>
          </Button>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 md:gap-6">
        <div className="relative flex-1 group">
          <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 h-8 w-8 md:h-12 md:w-12 bg-gray-50 rounded-lg md:rounded-2xl flex items-center justify-center group-focus-within:bg-amber-50 transition-colors">
            <Search className="h-4 w-4 md:h-6 md:w-6 text-gray-400 group-focus-within:text-amber-600 transition-colors" />
          </div>
          <Input 
            placeholder="Filter by Nomenclature or ID..." 
            className="pl-14 md:pl-24 py-6 md:py-10 rounded-xl md:rounded-[2rem] border-2 border-gray-100 focus:border-amber-500 focus:ring-0 text-sm md:text-lg font-bold tracking-tight bg-gray-50/50 focus:bg-white transition-all shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {loading ? (
          [1, 2, 3, 4, 5].map(i => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse flex gap-4">
              <div className="h-16 w-16 bg-gray-50 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 bg-gray-50 rounded w-3/4" />
                <div className="h-2 bg-gray-50 rounded w-1/2" />
              </div>
            </div>
          ))
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl py-12 text-center text-gray-400 font-serif italic border border-gray-100">
            No registry entries detected
          </div>
        ) : (
            paginatedProducts.map((product) => (
              <div key={product.Certificate_ID} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col gap-5 hover:border-amber-200 transition-colors">
                <div className="flex items-center gap-5">
                  <div className="h-20 w-20 rounded-2xl border-2 border-white bg-gray-50 relative overflow-hidden shrink-0 shadow-md">
                    {product.Product_Image_URL ? (
                      <Image src={product.Product_Image_URL} alt="" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Diamond className="h-6 w-6 text-gray-200" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className="block font-black text-gray-900 text-base tracking-tight leading-tight line-clamp-2">{product.Product_Name}</span>
                      <div className={cn(
                        "shrink-0 h-2.5 w-2.5 rounded-full mt-1",
                        product.Status === 'Active' ? "bg-emerald-500 animate-pulse" : "bg-gray-300"
                      )} />
                    </div>
                    <div className="flex flex-col gap-1 mt-2">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest truncate">{product.Jewellery_Type} • {product.Metal_Purity} {product.Metal_Type}</span>
                      <span className="font-mono text-xs font-black text-amber-700 tracking-tighter bg-amber-50 self-start px-2 py-0.5 rounded-md border border-amber-100">{product.Certificate_ID}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-50">
                  <Link href={`/admin/products/${product.Certificate_ID}`} className="contents">
                    <Button variant="outline" className="h-11 rounded-xl border-gray-100 bg-gray-50/50 flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </Link>
                  <Link href={`/admin/products/edit/${product.Certificate_ID}`} className="contents">
                    <Button variant="outline" className="h-11 rounded-xl border-gray-100 bg-gray-50/50 flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="h-11 rounded-xl border-gray-100 bg-gray-50/50 text-red-500 hover:bg-red-50 hover:text-red-600 flex items-center gap-2 text-xs font-black uppercase tracking-widest"
                    onClick={() => handleDelete(product.Certificate_ID)}
                    disabled={deletingId === product.Certificate_ID}
                  >
                    {deletingId === product.Certificate_ID ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Del
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-gray-100">
                <TableHead className="font-black text-gray-400 py-8 px-10 uppercase tracking-[0.2em] text-[10px]">Registry Asset</TableHead>
                <TableHead className="font-black text-gray-400 py-8 uppercase tracking-[0.2em] text-[10px]">Identifier</TableHead>
                <TableHead className="font-black text-gray-400 py-8 uppercase tracking-[0.2em] text-[10px]">Classification</TableHead>
                <TableHead className="font-black text-gray-400 py-8 uppercase tracking-[0.2em] text-[10px]">Operational Status</TableHead>
                <TableHead className="font-black text-gray-400 py-8 uppercase tracking-[0.2em] text-[10px] text-right px-10">Governance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [1, 2, 3, 4].map(i => (
                  <TableRow key={i} className="animate-pulse border-gray-50">
                    <TableCell colSpan={5} className="py-12 px-10"><div className="h-4 bg-gray-50 rounded-full w-full" /></TableCell>
                  </TableRow>
                ))
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-32 text-center text-gray-400 font-serif italic text-2xl">No registry entries detected</TableCell>
                </TableRow>
              ) : (
                paginatedProducts.map((product) => (
                  <TableRow key={product.Certificate_ID} className="border-gray-50 hover:bg-amber-50/20 transition-all duration-300 group">
                    <TableCell className="py-8 px-10">
                      <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-[1.5rem] border-4 border-white bg-gray-50 relative overflow-hidden shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500">
                          {product.Product_Image_URL ? (
                            <Image src={product.Product_Image_URL} alt="" fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><Diamond className="h-8 w-8 text-gray-200" /></div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-gray-900 text-lg tracking-tight leading-tight">{product.Product_Name}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Ref: {product.Metal_Purity} {product.Metal_Type}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-8">
                      <span className="font-mono text-sm font-black text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">{product.Certificate_ID}</span>
                    </TableCell>
                    <TableCell className="py-8">
                      <span className="text-sm font-black text-gray-900 uppercase tracking-tighter">{product.Jewellery_Type}</span>
                    </TableCell>
                    <TableCell className="py-8">
                      <div className={cn(
                        "inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest",
                        product.Status === 'Active' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-gray-50 text-gray-400 border border-gray-100"
                      )}>
                        <div className={cn("h-1.5 w-1.5 rounded-full", product.Status === 'Active' ? "bg-emerald-500 animate-pulse" : "bg-gray-300")} />
                        {product.Status}
                      </div>
                    </TableCell>
                    <TableCell className="py-8 px-10 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Link href={`/admin/products/${product.Certificate_ID}`}>
                          <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl bg-white hover:bg-gray-900 hover:text-white shadow-sm border border-gray-100 transition-all">
                            <Eye className="h-6 w-6" />
                          </Button>
                        </Link>
                        <Link href={`/admin/products/edit/${product.Certificate_ID}`}>
                          <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl bg-white hover:bg-gray-900 hover:text-white shadow-sm border border-gray-100 transition-all">
                            <Edit className="h-6 w-6" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-14 w-14 rounded-2xl bg-white hover:bg-red-600 hover:text-white shadow-sm border border-gray-100 transition-all"
                          onClick={() => handleDelete(product.Certificate_ID)}
                          disabled={deletingId === product.Certificate_ID}
                        >
                          {deletingId === product.Certificate_ID ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                          ) : (
                            <Trash2 className="h-6 w-6" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {!loading && filteredProducts.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Showing {startIndex + 1}-{Math.min(startIndex + pageSize, filteredProducts.length)} of {filteredProducts.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-200"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
              Math.max(0, currentPage - 3),
              Math.max(0, currentPage - 3) + 5
            ).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                className={page === currentPage ? "bg-gray-900 hover:bg-gray-900" : "border-gray-200"}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="border-gray-200"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
