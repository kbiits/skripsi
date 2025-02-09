import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import ToasterContext from "./context/ToasterContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chat app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToasterContext />
        {children}
      </body>
    </html>
  );
}
