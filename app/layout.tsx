import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CardioViz — AI-Powered EKG Analysis",
  description: "Upload your EKG report and watch your heart beat in 3D. AI-powered cardiac visualization.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Bebas Neue — tall, bold condensed display for hero headings */}
        {/* Outfit — clean, modern geometric for body + subheadings */}
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
