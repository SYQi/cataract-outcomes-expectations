import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cataract Surgery: Outcomes and Expectations",
  description:
    "Woodlands Hospital cataract surgery outcomes — visual acuity, refractive accuracy, complications, and quality of life expectations.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-x-hidden font-sans antialiased">{children}</body>
    </html>
  );
}
