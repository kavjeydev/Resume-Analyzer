
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./navbar/navbar";
import Footer from "./footer/footer";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quixotic | Resume Optimizer",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
            <Navbar/>

        {children}

      </body>

    </html>
  );
}
