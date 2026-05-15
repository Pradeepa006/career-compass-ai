import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CareerCompass AI – AI-Powered Career Path Prediction",
    template: "%s | CareerCompass AI",
  },
  description:
    "Predict your ideal career path, analyze skill gaps, get personalized learning roadmaps, and accelerate your tech career with AI-powered insights.",
  keywords: [
    "career prediction", "skill gap analysis", "AI career guidance",
    "learning roadmap", "resume analysis", "job recommendations",
    "career planning", "tech career", "AI mentor",
  ],
  authors: [{ name: "CareerCompass AI Team" }],
  creator: "CareerCompass AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://careercompassai.com",
    title: "CareerCompass AI – AI-Powered Career Guidance",
    description: "Your AI-powered career compass for the tech industry",
    siteName: "CareerCompass AI",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CareerCompass AI",
    description: "AI-Powered Career Path Prediction & Skill Gap Analysis",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0a1e" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={`${inter.className} min-h-screen antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <QueryProvider>
            <ToastProvider>
              {children}
              <Toaster />
            </ToastProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
