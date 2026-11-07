import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/noto-sans-arabic/400.css";
import "@fontsource/noto-sans-arabic/600.css";
import "./globals.css";
import { ProgressProvider } from "@/components/ProgressProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { Shell } from "@/components/Shell";
export const metadata: Metadata = {
  title: {
    default: "Arabic Mission — Your Arabic Journey",
    template: "%s | Arabic Mission",
  },
  description:
    "Belajar bahasa Arab fusha untuk pemula melalui misi, latihan interaktif, XP, badge, dan progres yang tersimpan di akun.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
          <ProgressProvider>
            <Shell>{children}</Shell>
          </ProgressProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
