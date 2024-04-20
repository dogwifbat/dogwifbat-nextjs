import "@/styles/globals.css";
import { Metadata } from "next";
import { Providers } from "./providers";
import Navbar from "@/components/ui/navbar";
import clsx from "clsx";
import DonatorScrollbar from "@/components/donator_scroller";

export const metadata: Metadata = {
	title: "dogwifbat",
	description: "Bonks Rugs, Gibs Lubs.",
	icons: {
		icon: "/WIFB.ico",
		shortcut: "/WIFB.png",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body
				className={clsx(
					"min-h-screen bg-background antialiased"
				)}
			>
				<Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
					<div className="relative flex flex-col h-screen">
						<Navbar />
						<DonatorScrollbar text="Top Donors: 1. $NGU   2. $DRAGON   3. $D3lta19" />
						<main className="container mx-auto max-w-11/12 px-6 flex-grow">
							{children}
						</main>
					</div>
				</Providers>
			</body>
		</html>
	);
}
