import { Geist, Geist_Mono } from "next/font/google";
import "docker-manager-web/styles/globals.css"
import {ReduxProvider} from "docker-manager-web/container/ReduxProvider/ReduxProvider";
import ClientLayoutWrapper from "docker-manager-web/container/Header/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <ReduxProvider>
            <ClientLayoutWrapper>
              {children}
            </ClientLayoutWrapper>
          </ReduxProvider>
      </body>
    </html>
  );
}
