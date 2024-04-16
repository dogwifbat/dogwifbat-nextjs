/* eslint-disable react/no-unescaped-entities */
import { Image, Link } from "@nextui-org/react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-center text-6xl font-bold mt-4 mb-4">$WIFB</h1>
      <p className="text-center text-2xl mb-6">Bonks Rugs, Gibs Lubs</p>
      <Link href="https://ayin.app/swap" isExternal className="bg-gray-50 text-black font-bold py-2 px-4 rounded hover:bg-gray-300 transition-colors duration-300" >
        Buy $WIFB
      </Link>

      <div className="grid lg:grid-cols-2 py-8 gap-4 content-stretch">
        <Image src="/dogwifbat-banner.png" alt="dogwifbat rugsniffer utility" className="p-3 rounded-3xl" />
        <div className="my-auto">
          <p className="text-2xl mb-2">
            $WIFB is a fair launch project, meaning it belongs 100% to the community!
          </p>
          <p className="text-2xl mb-4">
            The idea and ethos behind dogwifbat was created due to an influx of rug pulls coming to the Alephium blockchain.
            dogwifbat is designed to combat rug pulls and provide transparency into new projects and DEX pools on Ayin.
          </p>
          <Link href="/about" className="bg-gray-50 text-black font-bold py-2 px-4 rounded hover:bg-gray-300 transition-colors duration-300" >
            Tokenomics
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 py-8 gap-4">
        <div>
          <h1 className="text-6xl font-bold mt-10 mb-6">RugSniffer</h1>
          <p className="text-2xl mb-6">
            RugSniffer utility was created to keep the Alephium ecosystem and its users safe from sketchy projects, rugpulls and scams. It utilises real time on-chain data to display the facts about a project
            so traders can make informed decisions when to part way with their precious $ALPH.
          </p>
          <Link href="/rugsniffer" className="bg-gray-50 text-black font-bold py-2 px-4 rounded hover:bg-gray-300 transition-colors duration-300" >
            Access tool
          </Link>
        </div>
        <div>
          <Link href="/rugsniffer">
            <Image src="/rugsniffer_promo.png" alt="dogwifbat rugsniffer utility" width={800} height={800} className="inline-block" isBlurred/>
          </Link>
        </div>
      </div>
    </div>
  );
}
