"use client";
import React from "react";
import { Image } from "@nextui-org/react";
import { subtitle, title } from "@/app/components/primitives"

export default function Home() {
	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-20">
			<div className="inline-block max-w-1xl text-center justify-center">
				<h1 className={title({ color: "cyan" })}>Rug Sniffer&nbsp;</h1>
				<br />
				<h1 className={title()}>
					Check Alephium token statistics.
				</h1>
				<h2 className={subtitle({ class: "mt-4" })}>
					Don&apos;t be a victim of another rugpull, DYOR.
				</h2>
			</div>
            <div>
                <h1 className={title({ color: "cyan" })}>Coming Soon!</h1>
            </div>
            <div className="flex items-center justify-center">
                <Image
                    isBlurred
                    src='rugsniffer_promo.png'
                    width={1000}
                />
            </div>
		</section>
	);
}
