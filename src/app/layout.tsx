import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const inter = Be_Vietnam_Pro({ subsets: ["vietnamese"], weight: "400" });

export const metadata: Metadata = {
  title: "Fixelsphoto – The Best Real Estate Photo Editing Service",
  icons: [{ rel: "icon", url: "/favicon.png", type: "image/png" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${inter.className}`}>
        <div className="overflow-hidden">{children}</div>
      </body>
    </html>
  );
}
