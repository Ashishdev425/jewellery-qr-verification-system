"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Diamond, Search, ShieldCheck, Award, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [certId, setCertId] = useState("");
  const year = new Date().getFullYear();
  const router = useRouter();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (certId.trim()) {
      router.push(`/verify?cert_id=${certId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] font-sans selection:bg-amber-200 selection:text-amber-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-amber-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-600 rounded-lg shadow-lg shadow-amber-200">
              <Diamond className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-serif font-bold tracking-tighter text-gray-900 uppercase">Jewellery Bureau</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/admin/login" className="text-xs font-bold text-gray-400 hover:text-amber-600 uppercase tracking-widest transition-colors">
              Portal Access
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full border border-amber-100 animate-fade-in">
              <ShieldCheck className="h-4 w-4 text-amber-600" />
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Global Identification Standard</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 leading-[1.1] tracking-tight">
              Verify Your Masterpiece. <br />
              <span className="text-amber-600 italic">Secure. Trusted. Digital.</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Every piece of fine jewellery tells a story. Ensure yours is authentic with our secure, blockchain-ready identification and verification system.
            </p>

            {/* Search Box */}
            <div className="max-w-2xl mx-auto pt-8">
              <form onSubmit={handleVerify} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex flex-col md:flex-row gap-4 p-2 bg-white rounded-[2rem] shadow-2xl border border-amber-50">
                  <div className="relative flex-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-300" />
                    <Input 
                      placeholder="Enter Certificate Number (e.g. JWL-2024-XXXX)" 
                      className="pl-16 py-8 text-lg border-none focus-visible:ring-0 placeholder:text-gray-300 font-mono"
                      value={certId}
                      onChange={(e) => setCertId(e.target.value)}
                      suppressHydrationWarning
                    />
                  </div>
                  <Button type="submit" className="bg-gray-900 hover:bg-black text-white px-10 py-8 rounded-[1.5rem] text-lg font-bold transition-all shadow-xl group/btn" suppressHydrationWarning>
                    Verify Now
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-0 pointer-events-none overflow-hidden">
          <Diamond className="absolute top-20 left-10 h-64 w-64 text-amber-100/30 -rotate-12 blur-sm" />
          <Diamond className="absolute bottom-10 right-10 h-96 w-96 text-amber-100/20 rotate-45 blur-md" />
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100">
                <Award className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-900">Digital Authenticity</h3>
              <p className="text-gray-500 leading-relaxed text-sm">Every certificate is uniquely tied to a physical piece of jewellery, ensuring zero duplication risk.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100">
                <Globe className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-900">Global Accessibility</h3>
              <p className="text-gray-500 leading-relaxed text-sm">Verify your diamond or metal specifications from anywhere in the world, instantly via QR or ID.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100">
                <ShieldCheck className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-900">Secure Database</h3>
              <p className="text-gray-500 leading-relaxed text-sm">Encrypted storage ensures that your identification records are safe and tamper-proof for eternity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-amber-100 bg-[#fdfbf7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 grayscale opacity-50">
            <Diamond className="h-5 w-5 text-gray-900" />
            <span className="text-sm font-serif font-bold tracking-tighter text-gray-900 uppercase">Jewellery Bureau</span>
          </div>
          <div className="flex gap-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Verification Bureau</span>
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            (c) {year} JB System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

