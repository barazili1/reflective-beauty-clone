import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ChevronRight, MessageCircle, Share2, User } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import cashLogo from "@/assets/kashla-logo.asset.json";
import vodafoneCashLogo from "@/assets/cash-logo.asset.json";
import cashWatermark from "@/assets/cash-watermark.png.asset.json";
import iphoneSound from "@/assets/iphone-notification.m4a.asset.json";
import { addTransfer } from "@/lib/transfer-history";

export const Route = createFileRoute("/success")({
  validateSearch: (search: Record<string, unknown>) => ({
    amount: Number(search["amount"]) || 0,
    phone: String(search["phone"] ?? ""),
    senderName: String(search["senderName"] ?? ""),
  }),
  head: () => ({
    meta: [
      { title: "تم التحويل بنجاح | محفظتي" },
      { name: "description", content: "تمت عملية التحويل بنجاح" },
      { property: "og:title", content: "تم التحويل بنجاح | محفظتي" },
      { property: "og:description", content: "تمت عملية التحويل بنجاح" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SuccessPage,
});

const arabicMonths = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

/** Scalloped badge-style green success icon */
function ScallopBadge({ size = 80 }: { size?: number }) {
  const cx = 50;
  const cy = 50;
  const r = 42;
  const n = 14;
  const depth = 3.5;
  const rOut = r + depth;
  const parts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a1 = (i / n) * 2 * Math.PI;
    const a2 = ((i + 0.5) / n) * 2 * Math.PI;
    const a3 = ((i + 1) / n) * 2 * Math.PI;
    if (i === 0) {
      parts.push(
        `M ${(cx + r * Math.cos(a1)).toFixed(2)} ${(cy + r * Math.sin(a1)).toFixed(2)}`,
      );
    }
    parts.push(
      `Q ${(cx + rOut * Math.cos(a2)).toFixed(2)} ${(cy + rOut * Math.sin(a2)).toFixed(2)} ${(cx + r * Math.cos(a3)).toFixed(2)} ${(cy + r * Math.sin(a3)).toFixed(2)}`,
    );
  }
  parts.push("Z");
  const d = parts.join(" ");
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <path d={d} fill="#34B561" />
      <path
        d="M 36 50 L 45 59 L 64 39"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/** Simplified red Vodafone circular logo */
function VodafoneRedLogo({ size = 36 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size}>
      <circle cx="24" cy="24" r="20" fill="#e60000" />
      <path
        d="M 28 15 C 21 15 17 21 17 27 C 17 32 20 35 24 35 C 23 33 22 31 23 28 C 25 24 29 23 31 25 C 30 21 29 18 28 15 Z"
        fill="white"
      />
    </svg>
  );
}

function SuccessPage() {
  const { amount, phone, senderName } = Route.useSearch();
  const [date, setDate] = useState("");
  const txNumber = useMemo(
    () => String(Math.floor(Math.random() * 900000000000) + 100000000000),
    [],
  );

  useEffect(() => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    setDate(
      `${now.getDate()} ${arabicMonths[now.getMonth()]} ${now.getFullYear()} ${h}:${m}`,
    );
  }, []);

  const saved = useRef(false);
  useEffect(() => {
    if (saved.current || amount <= 0) return;
    saved.current = true;
    addTransfer(amount, phone, senderName);
  }, [amount, phone, senderName]);

  // iOS-style notification: slides in 2s after load, plays sound, auto-dismisses after 4s
  const [showNotif, setShowNotif] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const inTimer = setTimeout(() => {
      setShowNotif(true);
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    }, 2000);
    const outTimer = setTimeout(() => setShowNotif(false), 6000);
    return () => {
      clearTimeout(inTimer);
      clearTimeout(outTimer);
    };
  }, []);

  return (
    <main
      dir="rtl"
      className="mx-auto flex min-h-dvh max-w-[430px] flex-col bg-[#F8F9FA] text-foreground shadow-2xl"
    >
      {/* iOS-style push notification */}
      <audio ref={audioRef} src={iphoneSound.url} preload="auto" />
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-2">
        <div
          dir="rtl"
          className="flex w-full max-w-[400px] items-start gap-3 rounded-[26px] bg-[#3c3c3e] px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
          style={{
            transform: showNotif ? "translateY(0)" : "translateY(-160%)",
            fontFamily:
              '-apple-system, "SF Arabic", "SF Pro Arabic", system-ui, "Tajawal", sans-serif',
          }}
        >
          {/* Avatar + Messages badge (far right) */}
          <div className="relative shrink-0 pt-0.5">
            <div
              className="grid size-[42px] place-items-center rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, #97A5CF 0%, #7d8cc0 100%)",
              }}
            >
              <User className="size-[22px] text-white" strokeWidth={2} />
            </div>
            <div className="absolute -bottom-1 left-0 grid size-[24px] place-items-center rounded-[7px] bg-[#64D65F] shadow-sm">
              <MessageCircle className="size-[14px] text-white" strokeWidth={2.5} />
            </div>
          </div>
          {/* Text column */}
          <div className="min-w-0 flex-1 text-right">
            <div className="flex items-center justify-between">
              <span className="text-[11px] leading-none text-white/55">الآن</span>
              <span className="text-[14px] font-bold leading-none text-white">
                VF-Cash
              </span>
            </div>
            <p className="mt-1.5 text-[13px] leading-[1.35] text-white">
              تم تحويل {amount} جنيه لرقم {phone || "01151146419"} مصاريف
            </p>
            <p className="mt-0.5 text-[13px] leading-[1.35] text-white/85 truncate">
              الخدمة 0 جنيه رصيد حسابك فى فودافون كاش الح...
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="relative flex h-[52px] shrink-0 items-center justify-center bg-white">
        <h1 className="text-[20px] font-bold">تم بنجاح</h1>
        <Link
          to="/"
          aria-label="رجوع"
          className="absolute right-4 top-1/2 grid size-[46px] -translate-y-1/2 place-items-center rounded-full bg-white shadow-[0_1px_6px_rgba(0,0,0,0.12)]"
        >
          <ChevronRight size={26} strokeWidth={2.5} />
        </Link>
      </header>

      <div className="flex min-h-0 flex-1 flex-col px-4">
        {/* Success icon */}
        <div className="mt-6 flex justify-center">
          <ScallopBadge size={80} />
        </div>
        <p className="mt-3 text-center text-[16px] font-normal text-foreground/55">
          تم التحويل بنجاح
        </p>

        {/* Amount */}
        <div className="mt-4 flex items-baseline justify-center gap-2">
          <span className="text-[40px] font-bold leading-none text-[#197897]">
            {amount}
          </span>
          <span className="text-[28px] font-bold leading-none">جنيه</span>
        </div>
        <p className="mt-1 text-center text-[14px] text-foreground/45">
          مبلغ التحويل
        </p>

        {/* From card */}
        <div className="relative mt-4 overflow-hidden rounded-[18px] bg-white px-4 shadow-sm">
          <img
            src={cashWatermark.url}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[220px] w-auto -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.08]"
          />
          <div className="relative flex items-center justify-start gap-3 py-2.5">
            <img
              src={cashLogo.url}
              alt="كاشلا"
              width={68}
              height={100}
              className="h-[68px] w-auto object-contain"
            />
            <div className="text-right">
              <p className="text-[13px] text-foreground/45">من</p>
              <p
                className="mt-1 text-[16px] font-bold tracking-wide"
                dir="ltr"
              >
                01087163221
              </p>
            </div>
          </div>
        </div>

        {/* To card */}
        <div className="relative mt-3 overflow-hidden rounded-[18px] bg-white px-4 shadow-sm">
          <img
            src={cashWatermark.url}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[220px] w-auto -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.08]"
          />
          <div className="relative flex items-center justify-start gap-3 py-2.5">
            <img
              src={cashLogo.url}
              alt="كاشلا"
              width={68}
              height={100}
              className="h-[68px] w-auto object-contain"
            />
            <div className="text-right">
              <p className="text-[13px] text-foreground/45">إلى</p>
              <p
                className="mt-1 text-right text-[16px] font-bold tracking-wide"
                dir="ltr"
              >
                {phone || "01087163221"}
              </p>
              <p
                className="mt-1 text-left text-[14px] text-foreground/60"
                dir="ltr"
              >
                {senderName}
              </p>
            </div>
          </div>
        </div>

        {/* Fees card */}
        <div className="mt-3 rounded-[18px] bg-white px-4 shadow-sm">
          <div className="flex items-center justify-between py-2.5">
            <span className="text-[15px]">الرسوم</span>
            <span className="text-[15px] font-bold">0 جنيه</span>
          </div>
          <div className="flex items-center justify-between pb-2.5">
            <span className="text-[15px]">المبلغ الكلي المستحق</span>
            <span className="text-[15px] font-bold">{amount} جنيه</span>
          </div>
        </div>

        {/* Transaction info card */}
        <div className="mt-3 rounded-[18px] bg-white px-4 shadow-sm">
          <div className="flex items-center justify-between py-2.5">
            <span className="text-[15px]">تاريخ العملية</span>
            <span className="text-[15px] font-bold" dir="ltr">
              {date || "—"}
            </span>
          </div>
          <div className="flex items-center justify-between pb-2.5">
            <span className="text-[15px]">رقم العملية</span>
            <span className="text-[15px] font-bold" dir="ltr">
              {txNumber}
            </span>
          </div>
        </div>

      </div>


      {/* Footer logos + buttons */}
      <div className="shrink-0 px-5 pb-3 pt-2">
        <div className="mb-3 flex items-center justify-center gap-3">
          <img
            src={vodafoneCashLogo.url}
            alt="كاش"
            className="h-[40px] w-auto object-contain"
          />
          <div className="h-[36px] w-px bg-[#e60000]" />
          <VodafoneRedLogo size={36} />
        </div>
        <div className="flex gap-2.5">
          <button
            type="button"
            className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-[14px] bg-[#e60000] text-[16px] font-normal text-white transition-transform active:scale-[0.98]"
          >
            <Share2 size={20} className="text-white" />
            شارك
          </button>
          <Link
            to="/"
            className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-[14px] border border-foreground/80 bg-white text-[16px] font-normal text-foreground transition-transform active:scale-[0.98]"
          >
            <Check size={20} strokeWidth={2.5} />
            تم
          </Link>
        </div>
      </div>
    </main>
  );
}
