import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Encrypted Home Energy Log",
  description: "Store and manage your home energy usage data with end-to-end encryption",
  icons: {
    icon: "/energy-logo.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`energy-bg text-foreground antialiased`}>
        <div className="fixed inset-0 w-full h-full energy-bg z-[-20] min-w-[850px]"></div>
        <main className="flex flex-col max-w-screen-lg mx-auto pb-20 min-w-[850px]">
          <nav className="flex w-full px-3 md:px-0 h-fit py-10 justify-between items-center">
            <div className="flex items-center gap-4">
              <Image
                src="/energy-logo.svg"
                alt="Energy Log Logo"
                width={60}
                height={60}
                className="rounded-full"
              />
              <h1 className="text-2xl font-bold text-white">Encrypted Home Energy Log</h1>
            </div>
          </nav>
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}

