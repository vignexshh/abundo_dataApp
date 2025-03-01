import type { Metadata } from "next";
import React from "react";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import '@ant-design/v5-patch-for-react-19';



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "MedicalHunt NextGen",
  description: "A application to analyse and tabulate NEET scores across india for better preperations",
};


export default function RootLayout({ children }: React.PropsWithChildren) {

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        
        {/* theme provider issue arises here  */}

          <AntdRegistry>
            {children}
          </AntdRegistry>

      
      </body>
    </html>
  );
}