import type { Metadata } from "next";
import "./globals.css";
import CartBar from "@/components/CartBar";

export const metadata: Metadata = {
  title: "Bite House",
  description: "اطلب اونلاين من Bite House",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Tajawal:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body">
        {children}
        <CartBar />
      </body>
    </html>
  );
}
