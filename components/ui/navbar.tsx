'use client'

import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link} from "@nextui-org/react";
import Image from "next/image";
import { BsTwitterX, BsDiscord  } from "react-icons/bs";

export default function App() {

    return (
        <Navbar isBordered>
          
          <NavbarContent>
            <NavbarBrand>
              <Image src="/WIFB.png" width={50} height={50} alt="dogwifbat" />
              <div className="m-2 text-3xl font-bold">dogwifbat</div>
            </NavbarBrand>
          </NavbarContent>

            <NavbarContent justify="end" className="text-white font-semibold">

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

            <NavbarContent justify="end" >
              <Link href="https://twitter.com/dogwifbatt">
                <BsTwitterX className="text-white" />
              </Link>
              <Link href="https://discord.gg/9eSRnJ4eHV">
                <BsDiscord className="text-white" />
              </Link>
            </NavbarContent>

          </Navbar>
    );
}