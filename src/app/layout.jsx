import localFont from "next/font/local";
import "./globals.css";

const aeonikFono = localFont({
  src: [
    { path: "../fonts/AeonikFono-Regular.otf", weight: "400", style: "normal" },
    { path: "../fonts/AeonikFono-Medium.otf",  weight: "500", style: "normal" },
  ],
  variable: "--font-aeonik-fono",
  display: "swap",
});

export const metadata = {
  title: "Techcombank Mobile — AI-First Redesign",
  description: "Design Challenge Round 3",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={aeonikFono.variable}>
      <body className="font-sans">
        {/* Desktop-only gate — shown on mobile/tablet, hidden on lg+ */}
        <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center gap-6 bg-surface-raised px-8 text-center lg:hidden">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="8" width="44" height="28" rx="4" stroke="#101828" strokeWidth="2.5" fill="none"/>
            <path d="M16 42h16M24 36v6" stroke="#101828" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <div className="flex flex-col gap-2">
            <p className="text-[22px] font-semibold text-content-primary leading-tight">Desktop only</p>
            <p className="text-[15px] text-content-secondary leading-relaxed max-w-xs">
              This case study is designed for desktop viewing. Please open it on a laptop or desktop for the best experience.
            </p>
          </div>
        </div>

        {/* Main content — visible only on lg+ */}
        <div className="hidden lg:block">{children}</div>
      </body>
    </html>
  );
}
