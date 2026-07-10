import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cataract Surgery: Outcomes and Expectations",
  description:
    "Woodlands Hospital cataract surgery outcomes — visual acuity, refractive accuracy, complications, and quality of life expectations.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
