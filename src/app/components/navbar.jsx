'use client'

import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button} from "@nextui-org/react";
import Image from "next/image";
import { BsTwitterX, BsDiscord  } from "react-icons/bs";

export default function App() {

    return (
        <Navbar isBordered>

            <NavbarContent justify="left">

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

          </Navbar>
    );
}