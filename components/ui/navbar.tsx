'use client'

import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, NavbarMenuToggle, NavbarMenu, NavbarMenuItem} from "@nextui-org/react";
import Image from "next/image";
import { BsTwitterX, BsDiscord  } from "react-icons/bs";

export default function App() {

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = {
    "Home": "/",
    "Tokenomics": "/tokenomics",
    "Charts": "https://mobula.io/pair/2ARBQ8p8sPu1jcUkDgpBrWZT3PXxUUdwQEacxjciCULgw",
    "Buy": "https://ayin.app/swap",
    "RugSniffer": "/rugsniffer",
    "NFT": "/nfts",
    "Social": "/socials"
  };

    return (
        <Navbar isBordered maxWidth="2xl" onMenuOpenChange={setIsMenuOpen}>
          
          <NavbarContent>
            <NavbarBrand>
              <Image src="/WIFB.png" width={50} height={50} alt="dogwifbat" />
              <div className="m-2 text-3xl font-bold">dogwifbat</div>
            </NavbarBrand>
          </NavbarContent>
  
          <NavbarContent justify="center" className="text-white font-semibold hidden lg:flex">

            <NavbarItem>
              <Link color="foreground" href="/" className="text-lg">
                Home
              </Link>
            </NavbarItem>
            
            <NavbarItem>
              <Link color="foreground" href="/tokenomics" className="text-lg">
                Tokenomics
              </Link>
            </NavbarItem>

            <NavbarItem>
              <Link color="foreground" href="https://mobula.io/pair/2ARBQ8p8sPu1jcUkDgpBrWZT3PXxUUdwQEacxjciCULgw" isExternal className="text-lg">
                Charts
              </Link>
            </NavbarItem>

            <NavbarItem>
              <Link color="foreground" href="https://ayin.app/swap" isExternal className="text-lg">
                Buy
              </Link>
            </NavbarItem>

            <NavbarItem>
              <Link color="foreground" href="/rugsniffer" className="text-lg">
                RugSniffer
              </Link>
            </NavbarItem>

            <NavbarItem>
              <Link color="foreground" href="/nfts" className="text-lg">
                NFT
              </Link>
            </NavbarItem>

            <NavbarItem>
              <Link color="foreground" href="/socials" className="text-lg">
                Socials
              </Link>
            </NavbarItem>
          </NavbarContent>

          <NavbarMenu>
            {Object.entries(menuItems).map(([link,url]) => (
              <NavbarMenuItem key={`${link}-${url}`}>
                <Link
                  color={
                    "foreground"
                  }
                  className="text-3xl"
                  href={url}
                  size="lg"
                >
                  {link}
                </Link>
              </NavbarMenuItem>
            ))}
            <NavbarMenuItem>
              <Link href="https://twitter.com/dogwifbatt">
                <BsTwitterX className="text-white" size={50} />
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link href="https://discord.gg/9eSRnJ4eHV">
                <BsDiscord className="text-white" size={50}/>
              </Link>
            </NavbarMenuItem>
          </NavbarMenu>
          

          <NavbarContent justify="end" className="hidden lg:flex">
            <Link href="https://twitter.com/dogwifbatt">
              <BsTwitterX className="text-white" />
            </Link>
            <Link href="https://discord.gg/9eSRnJ4eHV">
              <BsDiscord className="text-white" />
            </Link>
          </NavbarContent>

          <NavbarContent className="lg:hidden" justify="end">
            <NavbarMenuToggle
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            />
          </NavbarContent>

          </Navbar>
    );
}