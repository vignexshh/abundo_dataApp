import type { Metadata } from "next";
import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConfigProvider } from 'antd';
import CustomLayout from "@/components/CustomLayout";
import { AntdRegistry } from '@ant-design/nextjs-registry';


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
      <AntdRegistry>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#52c41a',
              colorSuccess: '#52c41a', // Success color
              colorWarning: '#faad14', // Warning color
              colorError: '#f5222d', // Error color
              colorInfo: '#1890ff', // Info color
              colorTextBase: '#000000', // Base text color
              colorBgBase: '#ffffff',
            },
          }}
        >

          
          <CustomLayout>
            {children}
          </CustomLayout>
        </ConfigProvider>
       </AntdRegistry>
      </body>
    </html>
  );
}