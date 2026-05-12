import type { Metadata } from "next";
import { DM_Sans, Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const notoSerifKR = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: "지금 Jigeum — What Korea is into right now",
  description: "지금 한국에서 인기있는 · Daily digest of trending culture in South Korea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${dmSans.variable} ${notoSerifKR.variable} antialiased`}
      style={{ fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}
    >
      <body className="min-h-screen bg-bg text-text-primary">
        {children}
      </body>
    </html>
  );
}
