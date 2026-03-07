"use client";

import { useEffect, useState } from "react";
import { googleSheets } from "@/lib/google-sheets";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Diamond, Users, FileCheck, Search as SearchIcon, PlusCircle, Calendar, ShieldCheck, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    archived: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await googleSheets.getProducts();
        
        if (data) {
          setStats({
            total: data.length,
            active: data.filter(p => p.Status === 'Active').length,
            archived: data.filter(p => p.Status === 'Archived').length
          });
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight flex items-center gap-3">
            Dashboard
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
              <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manage and monitor your jewellery certification database.</p>
        </div>
        
        <div className="flex items-center gap-3 text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-100 shadow-sm">
          <Calendar className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[
          { label: "Total Assets", value: stats.total, icon: Diamond, color: "slate" },
          { label: "Active Records", value: stats.active, icon: FileCheck, color: "emerald" },
          { label: "Archived", value: stats.archived, icon: Users, color: "slate" }
        ].map((stat, i) => (
          <Card key={i} className={cn(
            "border border-slate-100 shadow-sm bg-white rounded-xl overflow-hidden hover:border-slate-200 transition-all",
            i === 2 && "sm:col-span-2 lg:col-span-1"
          )}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-6">
              <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">{stat.label}</CardTitle>
              <stat.icon className={cn("h-4 w-4", {
                "text-slate-400": stat.color === "slate",
                "text-emerald-500": stat.color === "emerald",
              })} />
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-0">
              <div className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pt-4">
        {/* Actions Panel */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/admin/products/add" className="group">
              <div className="p-5 md:p-6 h-full flex items-center justify-between bg-white border border-slate-100 rounded-xl hover:border-amber-200 hover:bg-amber-50/30 transition-all shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 shrink-0 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 group-hover:bg-amber-100 group-hover:border-amber-200 transition-colors">
                    <PlusCircle className="h-5 w-5 text-slate-600 group-hover:text-amber-600" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-900 truncate">Register New Asset</span>
                    <span className="text-xs text-slate-400 truncate block">Add certificate to registry</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
            
            <Link href="/admin/search" className="group">
              <div className="p-5 md:p-6 h-full flex items-center justify-between bg-white border border-slate-100 rounded-xl hover:border-slate-300 hover:bg-slate-50/50 transition-all shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 shrink-0 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 group-hover:bg-slate-200 group-hover:border-slate-300 transition-colors">
                    <SearchIcon className="h-5 w-5 text-slate-600 group-hover:text-slate-900" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-900 truncate">Search Registry</span>
                    <span className="text-xs text-slate-400 truncate block">Lookup and manage records</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </div>
        </div>

        {/* Info Panel */}
        <div className="lg:col-span-4 h-full">
          <div className="h-full bg-slate-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg flex flex-col justify-between min-h-[320px] lg:min-h-0">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-amber-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Security Core v4.2</span>
              </div>
              <h3 className="text-xl font-semibold tracking-tight leading-tight">
                Integrity Management System
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Your portal for high-value jewellery asset verification. Securely manage blockchain-anchored certificates and maintain the highest standards of data integrity.
              </p>
            </div>
            
            <div className="relative z-10 pt-8 border-t border-slate-800 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-lg font-bold">1,248+</span>
                <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest">Global Checks</span>
              </div>
              <Diamond className="h-8 w-8 text-slate-700" />
            </div>
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
