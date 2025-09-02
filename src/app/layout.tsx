import "bootstrap/dist/css/bootstrap.min.css";
import type { Metadata } from "next";
import { AuthProvider } from "./context/AuthContext";
import { DateFilterProvider } from "./context/DateFilterContext";
import "./globals.css";

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
    <html lang="ko">
      <AuthProvider>
        <DateFilterProvider>
          <body>{children}</body>
        </DateFilterProvider>
      </AuthProvider>
    </html>
  );
}
