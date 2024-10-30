import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
import Background from "./components/Background";
import Model from "./components/Model";
import Resource from "./components/Resource";
import Appliaction from "./components/Application";
import About from "./components/About";
import EChartComponent from "./components/EChartComponent";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "News Index",
  description:
    "This news index is used to represent the relationship between news information and economic changes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div>
          <Background />
        </div>
        <div>
          <Model />
        </div>
        {/* {children} */}
        <EChartComponent />
        <div>
          <Resource />
        </div>
        <div>
          <Appliaction />
        </div>
        <div>
          <About />
        </div>
      </body>
    </html>
  );
}
