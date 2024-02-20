import "./globals.css";
import type { Metadata } from "next";
import { Inter, Noto_Serif } from "next/font/google";
import Footer from "./components/Footer";
import Header from "./components/Header";

const noto = Noto_Serif({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Aetra",
  description: "Premium teas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${noto.className} bg-neutral-content`}>
        <Header />
        <main>{children}</main>
        {/* <main className="p-4 max-w-7xl m-auto min-w-[300px]">{children}</main> */}
        <Footer />
      </body>
    </html>
  );
}
