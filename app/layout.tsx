import "@/styles/globals.css";
import { Metadata } from "next";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import Navbar from "@/components/navbar";
import clsx from "clsx";

export const metadata: Metadata = {
	title: "dogwifbat",
	description: "Bonks Rugs, Gibs Lubs.",
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
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
					"min-h-screen bg-background font-sans antialiased",
					fontSans.variable
				)}
			>
				<Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
					<div className="relative flex flex-col h-screen">
						<Navbar />
						<main className="container mx-auto max-w-11/12 pt-8 px-6 flex-grow">
							{children}
						</main>
					</div>
				</Providers>
			</body>
		</html>
	);
}
