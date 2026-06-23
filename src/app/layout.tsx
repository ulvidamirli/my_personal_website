import "./globals.css";
import { Inter, Geist } from "next/font/google";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";
import { siteUrl } from "@/lib/env";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t.site.title,
      template: `%s | ${t.site.titleSuffix}`,
    },
    description: t.site.description,
    openGraph: {
      type: "website",
      siteName: "Ulvi Damirli",
      url: siteUrl,
      locale: locale === "fr" ? "fr_FR" : "en_US",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={cn("font-sans", geist.variable)}>
      <body className={`${inter.className} bg-black text-white`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
