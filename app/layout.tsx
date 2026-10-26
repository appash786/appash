import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import LenisProvider from "@/components/Lenis/LenisProvider";
import LoadingScreen from "@/components/Loading/LoadingScreen";
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Appash A S",
  description: "Portfolio of Appash A S",
  verification: {
    google: 'xvVF8q4Q_byc9INHKDA-yIbVPDFTBe3rhAr2WMKhPZU',
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} antialiased`}>
      {/* 
        1. Removed style={{ margin: 0, padding: 0 }} in favor of Tailwind's m-0 p-0 (or global CSS)
        2. Added suppressHydrationWarning to ignore extension/script style injections
        3. Removed stray whitespace {" "} inside <body>
      */}
      <body className="m-0 p-0" suppressHydrationWarning>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JWTFK7YWQJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JWTFK7YWQJ');
          `}
        </Script>
        <LoadingScreen />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}