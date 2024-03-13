import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import { DarkThemeToggle, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle, Flowbite, ThemeModeScript  } from 'flowbite-react';
import Image from "next/image";

import { BsTwitterX } from "react-icons/bs";

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
    <html lang="en">
      <head>
        <ThemeModeScript />
      </head>
      <body className={inter.className}>
        <Flowbite>
          <Navbar fluid rounded>
            <NavbarBrand>
              <Image src="/WIFB.png" width={40} height={40} className="mr-3 h-6 sm:h-9" alt="dogwifbat" />
              <div className="text-3xl font-bold text-black">dogwifbat $WIFB</div>
            </NavbarBrand>
            <NavbarToggle />
            <NavbarCollapse>

              <NavbarLink as={Link} href="/">
                Home
              </NavbarLink>
              <NavbarLink as={Link} href="about">
                About
              </NavbarLink>
              <NavbarLink as={Link} href="https://mobula.io/pair/2ARBQ8p8sPu1jcUkDgpBrWZT3PXxUUdwQEacxjciCULgw" active>
                Charts
              </NavbarLink>

              <NavbarLink as={Link} href="https://twitter.com/dogwifbatt">
                <BsTwitterX />
              </NavbarLink>
              
            </NavbarCollapse>
          </Navbar>
          <main className="bg-black text-white">
            {children}
          </main>
          
        </Flowbite>
      </body>
    </html>
  );
}
