"use client";
import React, { useEffect, useState } from "react";
import { button as buttonStyles } from "@nextui-org/theme";
import { Button, Input } from "@nextui-org/react";
import { subtitle, title } from "@/components/primitives";
import { useRouter } from "next/navigation";
import CustomDropdown from "@/components/ui/customDropdown";

interface Token {
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
  };

  const router = useRouter();

  const [selectedToken, setSelectedToken] = useState("");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedTokenLogo, setSelectedTokenLogo] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`https://raw.githubusercontent.com/alephium/token-list/master/tokens/mainnet.json`)
      .then(response => response.json())
      .then(data => setTokens(data.tokens))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleTokenChange = (selectedId: string) => {
    setSelectedToken(selectedId);
    const selectedToken = tokens.find((token) => token.id === selectedId);
    if (selectedToken) {
      setSelectedTokenLogo(selectedToken.logoURI);
    } else {
      setSelectedTokenLogo(null);
    }
  };

  const handleSubmit = () => {
    if (!selectedToken) {
      setMessage("Please select a token");
      return;
    }

    const isUnsupported = Object.values(unsupported_tokens).includes(selectedToken);
    if (isUnsupported) {
      setMessage("This token is unsupported.");
      return;
    }

    const tokenExists = tokens.some((token: Token) => token.id === selectedToken);
    if (!tokenExists) {
      setMessage("Token is invalid. Select a valid token.");
      return;
    }

    const current = new URLSearchParams();
    current.set("tokenID", selectedToken);

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`/stats/${query}`);
  };

  return (
    <section className="flex flex-col items-center justify-center md:py-20">
      <div className="inline-block max-w-1xl text-center justify-center">
        <h1 className={title({ color: "yellow" })}>Rug Sniffer&nbsp;</h1>
        <br />
        <h1 className={title()}>
          Check Alephium token statistics.
        </h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          Don&apos;t be a victim of another rugpull, DYOR.
        </h2>
      </div>
      <form className="inline-block w-full max-w-lg mt-8">
        <div className="justify-center">
		<CustomDropdown
            tokens={tokens}
            selectedToken={selectedToken}
            onChange={handleTokenChange}
          />
        </div>
        <div className="text-red-500 mt-2">{message}</div>

        <div className="flex gap-3 justify-center py-8">
          <Button
            className={buttonStyles({ color: "default", radius: "md", variant: "shadow" })}
            onClick={handleSubmit}
          >
            Check
          </Button>
        </div>
		{selectedTokenLogo && (
          <div className="flex justify-center mt-4">
            <img src={selectedTokenLogo} alt="Token Logo" className="h-36 w-36" />
          </div>
        )}

      </form>
    </section>
  );
}
