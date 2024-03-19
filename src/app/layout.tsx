import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";

import {Providers} from "./providers";
import Navbar from "./components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "dogwifbat",
  description: "Barking up crypto, swinging for moonshots, bonking FUD. Join the bonk! For the community by the community."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="en" className='dark'>

      <head>
        <link rel="icon" href="/WIFB.ico" sizes="any" />
      </head>

      <body className={inter.className}>

        <Providers>

          <Navbar>
          </Navbar>

          <main>
            {children}
          </main>

        </Providers>

      </body>

    </html>
  );
}
