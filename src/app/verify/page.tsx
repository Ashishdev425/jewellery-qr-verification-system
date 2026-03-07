"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Diamond } from "lucide-react";
import { getProductAction } from "@/lib/actions";

function ReportView({ certId, product }: { certId: string; product: any }) {
  const code = useMemo(() => {
    const storedCode = String(product?.Color || "").replace(/\D/g, "").slice(0, 5);
    return storedCode || "N/A";
  }, [product]);

  const rows = [
    { label: "Certificate\nNumber", value: product?.Certificate_ID || "N/A" },
    { label: "Code", value: code },
    { label: "Conclusion", value: product?.Setting_Type || "N/A" },
    { label: "Magnification", value: product?.Clarity || "N/A" },
    { label: "Precious Metal", value: product?.Metal_Purity || "N/A" },
    {
      label: "Remarks",
      value: product?.Diamond_Type || "N/A",
    },
  ];

  return (
    <div className="min-h-screen bg-[#e7e7e7] py-1 px-1 sm:py-4 flex justify-center">
      <div className="w-[min(595px,100vw-8px)] bg-[#efefef] border border-[#555] p-2 sm:p-3">
        <div className="flex items-center justify-center gap-2 pt-2 pb-4 border-b border-[#888]">
          <Diamond className="h-5 w-5 sm:h-7 sm:w-7 text-[#111]" />
          <h1 className="text-[clamp(16px,4.8vw,44px)] leading-none font-black tracking-[0.02em] text-[#111] text-center">GEM IDENTIFICATION REPORT</h1>
        </div>

        <div className="mt-3 bg-[#0f1418] text-white text-center font-extrabold text-[clamp(14px,3.7vw,20px)] leading-[1.35] py-3 px-3">
          The Certificate No. You Entered Is {certId}.<br />
          The Query Result Is As Follows:
        </div>

        <div className="border-x border-b border-[#666] bg-white">
          <div className="h-[170px] sm:h-[210px] relative bg-[#f7f7f7]">
            {product?.Product_Image_URL ? (
              <Image src={product.Product_Image_URL} alt="Product" fill className="object-contain p-3" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400">No Image</div>
            )}
          </div>

          <table className="w-full border-collapse table-fixed">
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-t border-[#666]">
                  <td className="w-[46%] border-r border-[#666] text-center px-2 py-2">
                    <div className="text-[clamp(16px,4vw,27px)] leading-[1.05] font-extrabold whitespace-pre-line text-[#111]">{row.label}</div>
                  </td>
                  <td className="w-[54%] text-center px-2 py-2">
                    <div className="text-[clamp(18px,4.8vw,44px)] leading-[1.05] font-semibold text-[#111] break-words">{row.value}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-3 text-[clamp(18px,5vw,48px)] leading-none font-black tracking-tight text-[#111]">
          Inspection basis Cert.No. {product?.Certificate_ID || "N/A"}
        </div>
      </div>
    </div>
  );
}

function VerificationContent() {
  const searchParams = useSearchParams();
  const certIdParam =
    searchParams.get("cert_id") ||
    searchParams.get("certificate_id") ||
    searchParams.get("id") ||
    "";
  const certId = certIdParam || "N/A";
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (!certIdParam) {
        setLoading(false);
        return;
      }

      try {
        const data = await getProductAction(certIdParam);
        setProduct(data || null);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [certIdParam]);

  if (loading) {
    return <div className="min-h-screen bg-[#e7e7e7]" />;
  }

  if (!product) {
    return (
      <ReportView
        certId={certId}
        product={{
          Certificate_ID: "N/A",
          Setting_Type: "Not Found",
          Clarity: "Not Found",
          Metal_Purity: "Not Found",
          Diamond_Carat: "",
          Diamond_Type: "",
          Product_Image_URL: "",
        }}
      />
    );
  }

  return <ReportView certId={certId} product={product} />;
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#e7e7e7]" />}>
      <VerificationContent />
    </Suspense>
  );
}
