import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "현장 도구",
  description: "현장 기록 입력·집계 도구",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="shell">{children}</div>
      </body>
    </html>
  );
}
