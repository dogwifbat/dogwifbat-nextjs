'use client'

import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button} from "@nextui-org/react";
import Image from "next/image";
import { BsTwitterX, BsDiscord  } from "react-icons/bs";

export default function App() {

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const menuItems = [
        { label: "Home", path: "/" },
        { label: "About", path: "/about" },
        { label: "Charts", path: "/charts" },
      ];

    return (
        <Navbar isBordered
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}>


            <NavbarContent className="sm:hidden" justify="start">
                <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="sm:hidden"/>
            </NavbarContent>

            <NavbarContent className="sm:hidden pr-3" justify="center">
                <NavbarBrand>
                    <Image src="/WIFB.png" width={50} height={50} className="m-3" alt="dogwifbat" />
                    <div className="text-2xl font-bold">dogwifbat</div>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="left">

                <NavbarBrand>
                    <Image src="/WIFB.png" width={50} height={50} className="m-3" alt="dogwifbat" />
                    <div className="text-2xl font-bold">dogwifbat</div>
                </NavbarBrand>

              <NavbarItem>
                <Link color="foreground" href="/">
                  Home
                </Link>
              </NavbarItem>
              
              <NavbarItem>
                <Link color="foreground" href="/about">
                  About
                </Link>
              </NavbarItem>

              <NavbarItem>
                <Link color="foreground" href="https://mobula.io/pair/2ARBQ8p8sPu1jcUkDgpBrWZT3PXxUUdwQEacxjciCULgw">
                  Charts
                </Link>
              </NavbarItem>
            </NavbarContent>

            <NavbarContent justify="end" >
              <Link href="https://twitter.com/dogwifbatt">
                <BsTwitterX className="text-white" />
              </Link>
              <Link href="https://discord.gg/9eSRnJ4eHV">
                <BsDiscord className="text-white" />
              </Link>
            </NavbarContent>

            <NavbarMenu>
            {menuItems.map((item, index) => (
      <NavbarMenuItem key={`${item.label}-${index}`}>
        <Link href={item.path} passHref> {/* Use Next.js Link and passHref */}
          <a
            className="w-full"
            style={{
              color: index === 2 ? 'warning' : index === menuItems.length - 1 ? 'danger' : 'foreground', // Adjust the color styling as per your requirement
            }}
            size="lg"
          >
            {item.label}
          </a>
        </Link>
      </NavbarMenuItem>
    ))}
      </NavbarMenu>

          </Navbar>
    );
}