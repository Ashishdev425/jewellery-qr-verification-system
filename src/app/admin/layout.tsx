"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  PlusCircle, 
  LayoutDashboard, 
  Search, 
  LogOut, 
  Diamond,
  Settings,
  Menu,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Add Product", href: "/admin/products/add", icon: PlusCircle },
  { name: "All Products", href: "/admin/products", icon: Diamond },
  { name: "Search Product", href: "/admin/search", icon: Search },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

    useEffect(() => {
        const checkAuth = async () => {
          try {
            const response = await fetch(`/api/auth/check?t=${Date.now()}`, {
              credentials: 'include'
            });
            const authenticated = response.ok;
          
          if (!authenticated && pathname !== "/admin/login") {
            router.push("/admin/login");
          } else if (authenticated && pathname === "/admin/login") {
            router.push("/admin/dashboard");
          }
        } catch {
          if (pathname !== "/admin/login") {
            router.push("/admin/login");
          }
        } finally {
          setLoading(false);
        }
      };
      checkAuth();
    }, [pathname, router]);


  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    toast.success("Logged out successfully");
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-slate-900"></div>
      </div>
    );
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-50 transition-all duration-300 ease-in-out lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <div className="h-full flex flex-col">
            <div className="p-6 flex items-center gap-3">
              <div className="p-1.5 bg-slate-900 rounded-lg">
                <Diamond className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-slate-900 uppercase">
                  Jewellery
                </span>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-tight">
                  Admin Panel
                </span>
              </div>
            </div>

            <nav className="flex-1 px-3 space-y-1 overflow-y-auto mt-4">
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Registry</p>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between p-2.5 rounded-lg transition-colors group",
                      isActive 
                        ? "bg-slate-900 text-white" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={cn("h-4 w-4", isActive ? "text-amber-400" : "text-slate-400 group-hover:text-slate-600")} />
                      <span className="text-sm font-medium tracking-tight">{item.name}</span>
                    </div>
                    {isActive && <ChevronRight className="h-3 w-3 text-slate-500" />}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-100">
              <Button
                variant="ghost"
                className="w-full flex items-center justify-start gap-3 p-2.5 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-red-600 transition-all"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium tracking-tight">Logout</span>
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <button
                className="p-2 -ml-2 text-slate-600 lg:hidden hover:bg-slate-50 rounded-lg transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="hidden lg:block">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Operational</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <p className="text-xs font-bold text-slate-900">Administrator</p>
                <p className="text-[10px] text-slate-400 font-medium">super_admin</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                AD
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 lg:p-10 bg-white/50">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
    </div>
  );
}
