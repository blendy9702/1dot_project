import "bootstrap/dist/css/bootstrap.min.css";
import type { Metadata } from "next";
import Header from "./components/header";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

export const metadata: Metadata = {
  title: "1DOT PLACE MANAGEMENT",
  description: "1DOT PLACE MANAGEMENT",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AuthProvider>
        <body>{children}</body>
      </AuthProvider>
    </html>
  );
}
