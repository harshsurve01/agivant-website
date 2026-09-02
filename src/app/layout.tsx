import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Preloader } from "@/components/ui/Preloader";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Agivant",
  description: "Enterprise AI Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <Preloader />
        {children}
      </body>
    </html>
  );
}