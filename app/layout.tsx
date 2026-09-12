import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PortfolioShell from "./components/PortfolioShell";
import { ThemeProvider } from "./context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Javier Siliacay | Software Developer & AI Engineer",
  description: "Portfolio of Javier Siliacay — Software Developer & AI Engineer. Architecting high-performance full-stack web applications, computer vision systems, and intelligent IoT solutions.",
  keywords: [
    "Javier Siliacay",
    "Software Developer",
    "AI Engineer",
    "Full-Stack Developer",
    "Next.js Developer",
    "TypeScript",
    "Computer Vision",
    "Embedded Systems",
    "IoT",
    "Autoworx",
    "Philippines"
  ],
  authors: [{ name: "Javier Siliacay" }],
  openGraph: {
    title: "Javier Siliacay | Software Developer & AI Engineer",
    description: "Building intelligent systems that bridge full-stack web platforms, machine learning, and hardware telemetry.",
    type: "website",
    locale: "en_US",
  },
  icons: {
    icon: [
      { url: "/javier.png", type: "image/png" },
    ],
    shortcut: "/javier.png",
    apple: "/javier.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#030712",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} dark scroll-smooth`}>
      <head>
        <link rel="icon" href="/javier.png" type="image/png" />
        <link rel="apple-touch-icon" href="/javier.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme-preference');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = 'dark';
                  if (saved === 'light') {
                    theme = 'light';
                  } else if (saved === 'dark') {
                    theme = 'dark';
                  } else if (saved === 'system') {
                    theme = prefersDark ? 'dark' : 'light';
                  }
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--ink))] antialiased transition-colors duration-300">
        <ThemeProvider>
          <PortfolioShell>{children}</PortfolioShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
