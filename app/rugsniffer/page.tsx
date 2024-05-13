"use client";
import React from "react";
import { button as buttonStyles } from "@nextui-org/theme";
import { Button, Input } from "@nextui-org/react";
import { subtitle, title } from "@/components/primitives";
import { useRouter } from "next/navigation";
import { addressFromContractId } from "@alephium/web3";

interface token {
	id: string;
	name: string;
	symbol: string;
	decimals: number;
	description: string;
	logoURI: string;
}

export default function Home() {

	const unsupported_tokens = {
		"WETH": "19246e8c2899bc258a1156e08466e3cdd3323da756d8a543c7fc911847b96f00",
		"USDT": "556d9582463fe44fbd108aedc9f409f69086dc78d994b88ea6c9e65f8bf98e00",
		"USDC": "722954d9067c5a5ad532746a024f2a9d7a18ed9b90e27d0a3a504962160b5600",
		"ALPH": "0000000000000000000000000000000000000000000000000000000000000000",
		"WBTC": "383bc735a4de6722af80546ec9eeb3cff508f2f68e97da19489ce69f3e703200",
		"WDAI": "3d0a1895108782acfa875c2829b0bf76cb586d95ffa4ea9855982667cc73b700"
	}

	const router = useRouter();

	const [value, setValue] = React.useState("");
	const [message, setMessage] = React.useState("");
	const [pass, setPass] = React.useState("");
	const [passmsg, setPassMsg] = React.useState("");

	const handleSubmit = () => {
		if(!pass) {
			setPassMsg("Password is required.");
			return;
		}
		if(pass != "wifbdevtest") {
			setPassMsg("Wrong password.");
			return;
		}
		if(!value) {
			setMessage("This field is required");
			return;
		}

		const isUnsupported = Object.values(unsupported_tokens).includes(value);
		if(isUnsupported) {
			setMessage("This token is unsupported.");
			return;
		}

		fetch(`https://raw.githubusercontent.com/alephium/token-list/master/tokens/mainnet.json`)
			.then(response => {
				if (response.status !== 200) {
					setMessage("Network error, try again.");
					return;
				}

				response.json().then(data => {
					const tokenExists = data.tokens.some((token: token) => token.id === value);
					if(!tokenExists) {
						setMessage("Token is invalid. Enter a valid token ID.")
						return;
					}

					const current = new URLSearchParams();
					current.set("tokenID", value);
			
					const search = current.toString();
					const query = search ? `?${search}` : "";
			
					router.push(`/stats/${query}`);
				});
			})
			.catch(error => console.error('Error:', error));
	}

	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-20">
			<div className="inline-block max-w-1xl text-center justify-center">
				<h1 className={title({ color: "yellow" })}>Rug Sniffer&nbsp;</h1>
				<br />
				<h1 className={title()}>
					Check Alephium token statistics.
				</h1>
				<h2 className={subtitle({ class: "mt-4" })}>
					Don't be a victim of another rugpull, DYOR.
				</h2>
			</div>
			<form className="inline-block w-4/5 justify-center">
				<div className="justify-center">
					<Input 
						type="text"
						variant="bordered"
						placeholder="Token Address"
						size="lg"
						value={value}
						onValueChange={setValue}
						isRequired
						isClearable
						labelPlacement="inside"
						label={message}
					/>
				</div>

				<div className="justify-center py-4">
					<Input 
						type="password"
						variant="bordered"
						placeholder="Password"
						size="lg"
						value={pass}
						onValueChange={setPass}
						isRequired
						isClearable
						labelPlacement="inside"
						label={passmsg}
					/>
				</div>

				<div className="flex gap-3 justify-center py-8">
					<Button
						href={"/stats"}
						className={buttonStyles({ color: "default", radius: "md", variant: "shadow"})}
						onClick={handleSubmit}
					>
						Check
					</Button>
				</div>
			</form>
		</section>
	);
}
