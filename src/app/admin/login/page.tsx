"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Diamond } from "lucide-react";
import { toast } from "sonner";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
  
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: 'include'
        });
  
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Invalid credentials");
        }
  
        toast.success("Login successful");
        router.push("/admin/dashboard");
      } catch (error: any) {
        toast.error(error.message || "Failed to login");
      } finally {
        setLoading(false);
      }
    };


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7] p-4">
      <Card className="w-full max-w-md border-none shadow-2xl bg-white/80 backdrop-blur-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-amber-50 rounded-full">
              <Diamond className="h-10 w-10 text-amber-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-serif tracking-tight text-gray-900">
            Jewellery Admin
          </CardTitle>
          <CardDescription className="text-gray-500 font-medium">
            Enter your credentials to manage certificates
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@jewellery.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-gray-200 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-gray-200 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-6 text-lg transition-all duration-300 transform hover:scale-[1.02]"
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Sign In to Dashboard"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
