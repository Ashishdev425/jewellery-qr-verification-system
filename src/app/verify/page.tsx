"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Diamond } from "lucide-react";
import { getProductAction } from "@/lib/actions";
import { Spinner } from "@/components/ui/spinner";

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
    <div className="h-[100dvh] bg-[#e7e7e7] p-2 md:p-4 flex justify-center overflow-hidden">
      <div className="w-full max-w-4xl h-full bg-[#efefef] border border-[#555] p-2 md:p-3 flex flex-col overflow-hidden">
        <div className="flex items-center justify-center gap-2 pt-1 pb-2 border-b border-[#888]">
          <Diamond className="h-5 w-5 sm:h-7 sm:w-7 text-[#111]" />
          <h1 className="text-[clamp(16px,2.2vw,32px)] leading-none font-black tracking-[0.02em] text-[#111] text-center">GEM IDENTIFICATION REPORT</h1>
        </div>

        <div className="mt-2 bg-[#0f1418] text-white text-center font-extrabold text-[clamp(13px,1.6vw,18px)] leading-[1.3] py-2 px-2">
          The Certificate No. You Entered Is {certId}.<br />
          The Query Result Is As Follows:
        </div>

        <div className="border-x border-b border-[#666] bg-white mt-2 flex-1 min-h-0 flex flex-col overflow-hidden">
          <div className="h-[130px] sm:h-[180px] md:h-[220px] relative bg-[#f7f7f7] shrink-0">
            {product?.Product_Image_URL ? (
              <Image src={product.Product_Image_URL} alt="Product" fill className="object-contain p-3" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400">No Image</div>
            )}
          </div>

          <table className="w-full h-full border-collapse table-fixed">
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.label} className={`border-t border-[#666] ${idx === rows.length - 1 ? "h-[16%]" : "h-[14%]"}`}>
                  <td className="w-[46%] border-r border-[#666] text-center px-2 py-2">
                    <div className="text-[clamp(12px,1.2vw,20px)] leading-[1.05] font-extrabold whitespace-pre-line text-[#111]">{row.label}</div>
                  </td>
                  <td className="w-[54%] text-center px-2 py-2">
                    <div className="text-[clamp(13px,1.4vw,24px)] leading-[1.05] font-semibold text-[#111] break-words">{row.value}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-1 text-[clamp(14px,1.8vw,28px)] leading-none font-black tracking-tight text-[#111]">
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
    return (
      <div className="min-h-screen bg-[#e7e7e7] flex items-center justify-center px-4">
        <div className="bg-white border border-[#bdbdbd] rounded-lg px-6 py-5 flex items-center gap-3 shadow-sm">
          <Spinner className="size-5 text-[#111]" />
          <div className="text-[#111] font-semibold">Verifying certificate, please wait...</div>
        </div>
      </div>
    );
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#e7e7e7] flex items-center justify-center px-4">
          <div className="bg-white border border-[#bdbdbd] rounded-lg px-6 py-5 flex items-center gap-3 shadow-sm">
            <Spinner className="size-5 text-[#111]" />
            <div className="text-[#111] font-semibold">Loading verification page...</div>
          </div>
        </div>
      }
    >
      <VerificationContent />
    </Suspense>
  );
}
