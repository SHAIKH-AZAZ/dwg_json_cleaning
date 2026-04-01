import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Structural Extractor | BBSteel AI Agent",
  description: "Upload AutoCAD DWG files and extract structural properties — beams, columns, footings, rebar spacing, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
