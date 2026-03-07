"use client";

import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Product } from "@/lib/google-sheets";

export function IdentificationCard({ product }: { product: Product }) {
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const publicBaseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  const runtimeBaseUrl = typeof window !== "undefined" ? window.location.origin : "";
  // Prefer runtime origin so QR always points to the currently opened deployment.
  const baseUrl = runtimeBaseUrl || publicBaseUrl;
  const verificationUrl = `${baseUrl}/verify?cert_id=${encodeURIComponent(String(product.Certificate_ID || ""))}`;

  const cardFront = (
    <div 
      ref={frontRef}
      className="card-surface w-[450px] h-[262px] bg-white rounded-xl shadow-2xl relative overflow-hidden shrink-0 select-none"
    >
      <img
        src="/face-a-empty.png?v=20260307"
        alt="Face A / Front Template"
        className="absolute inset-0 w-full h-full object-contain bg-white"
      />
      <div className="absolute left-[30px] top-[66px] z-10 bg-white/90 px-1">
        <p className="text-[18px] font-semibold leading-none text-[#24346d] tracking-tight">
          {String(product.Certificate_ID || "N/A").padStart(7, "0")}
        </p>
      </div>
      <div className="absolute left-[8.5%] top-[23.5%] z-10 w-[16.8%] h-[55.1%] overflow-hidden">
        {product.Product_Image_URL ? (
          <Image src={product.Product_Image_URL} alt="Product" fill className="object-contain object-center" />
        ) : null}
      </div>
      <div className="absolute left-[152px] top-[87px] z-10 w-[198px] px-2 py-1">
        <p className="text-[15px] font-semibold leading-[1.2] text-[#24346d] break-words">
          {product.Diamond_Type || "N/A"}
        </p>
        <p className="text-[15px] font-semibold leading-[1.2] text-[#24346d] break-words mt-1">
          {product.Clarity || "N/A"}
        </p>
        <p className="text-[15px] font-semibold leading-[1.2] text-[#24346d] break-words mt-1">
          {product.Setting_Type || "N/A"}
        </p>
      </div>
      <div className="absolute left-[358px] top-[116px] z-10 w-[66px] h-[66px] flex items-center justify-center bg-white p-[3px]">
        <QRCodeSVG value={verificationUrl} size={60} level="H" includeMargin={true} fgColor="#111111" bgColor="#ffffff" />
      </div>
    </div>
  );

  const cardBack = (
    <div 
      ref={backRef}
      className="card-surface w-[450px] h-[280px] bg-white rounded-xl shadow-2xl border-2 border-gray-700 relative overflow-hidden shrink-0 select-none"
    >
      <img
        src="/face-b-reference.png?v=20260307"
        alt="Face B / Reverse Template"
        className="w-full h-full object-contain bg-white"
      />
    </div>
  );

  return (
    <div className="w-full">
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
        <div className="p-6 lg:p-8 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg">
              <Printer className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h4 className="text-xl font-serif font-black text-gray-900 tracking-tight">Certificate Assets</h4>
              <p className="text-sm text-gray-500 font-medium">Ready for high-resolution print & distribution</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="lg" onClick={() => window.print()} className="rounded-2xl border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all px-8 h-14 font-bold text-sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
        
        <div className="p-4 lg:p-12 bg-[#fafafa] print:p-0">
          <div className="pb-8 custom-scrollbar">
            <div className="print-area flex flex-col gap-12 items-center justify-center w-full mx-auto px-4 py-4 print:gap-6 print:px-0 print:py-0">
              {/* Front with Label */}
              <div className="space-y-6 print-card-wrap">
                <div className="flex items-center justify-center gap-3 print:hidden">
                  <div className="h-[2px] w-8 bg-gray-200" />
                  <span className="text-xs font-black text-gray-400 uppercase tracking-[0.4em]">Face A / Obverse</span>
                  <div className="h-[2px] w-8 bg-gray-200" />
                </div>
                <div className="scale-[0.85] sm:scale-100 transition-transform origin-top print:scale-100">
                  {cardFront}
                </div>
              </div>

              {/* Back with Label */}
              <div className="space-y-6 print-card-wrap">
                <div className="flex items-center justify-center gap-3 print:hidden">
                  <div className="h-[2px] w-8 bg-gray-200" />
                  <span className="text-xs font-black text-gray-400 uppercase tracking-[0.4em]">Face B / Reverse</span>
                  <div className="h-[2px] w-8 bg-gray-200" />
                </div>
                <div className="scale-[0.85] sm:scale-100 transition-transform origin-top print:scale-100">
                  {cardBack}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }

        @media print {
          @page {
            size: A4;
            margin: 6mm;
          }

          body * {
            visibility: hidden !important;
          }

          .print-area,
          .print-area * {
            visibility: visible !important;
          }

          .print-area {
            position: fixed;
            inset: 0;
            display: flex !important;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            gap: 4mm;
            padding: 0;
            background: #fff;
          }

          .print-area > * {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .print-card-wrap {
            margin: 0 !important;
          }

          .print-card-wrap > .scale-\[0\.85\],
          .print-card-wrap > .sm\:scale-100 {
            transform: scale(0.72) !important;
            transform-origin: top center !important;
          }

          .card-surface {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
