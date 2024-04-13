"use client";
import React from "react";
import { button as buttonStyles } from "@nextui-org/theme";
import { Button, Input } from "@nextui-org/react";
import { subtitle, title } from "@/components/primitives";
import { useRouter, useSearchParams } from "next/navigation";

export default function Home() {

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

		const postData = [value];
		const requestOptions = {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(postData)
		};

		fetch('https://backend-v113.mainnet.alephium.org/tokens/fungible-metadata', requestOptions)
			.then(response => {
				if (response.status !== 200) {
					setMessage("Token not found, enter a valid token address");
					return;
				}

				const current = new URLSearchParams();
				current.set("tokenID", value);
		
				const search = current.toString();
				const query = search ? `?${search}` : "";
		
				router.push(`/stats/${query}`);
			})
			.catch(error => console.error('Error:', error));
	}

	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-20">
			<div className="inline-block max-w-1xl text-center justify-center">
				<h1 className={title({ color: "cyan" })}>Rug Sniffer&nbsp;</h1>
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
