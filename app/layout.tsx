import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CalmSync",
  description: "Your personal relaxation companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

