/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import Link from 'next/link';


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
        <h1 className="text-center text-6xl font-bold mt-10 mb-4">What is $WIFB?</h1>
        <p className="text-center text-2xl p-4">
          Bonks Rugs, Gibs Lubs
        </p>
      <div className="flex justify-center">
        <Link href="/about" className="bg-gray-50 text-black font-bold py-2 px-4 rounded hover:bg-gray-300 transition-colors duration-300" >
          Tokenomics
        </Link>
      </div>
        <div className="m-10">
          <Image src="/WIFB.png" alt="dogwifbat" width={400} height={400} className="inline-block" />
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 pb-4 gap-4">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-6xl font-bold mt-10 mb-4">RugSniffer</h1>
          <p className="text-2xl p-4 max-w-4xl">
            RugSniffer utility was created to keep the Alephium ecosystem and its users safe from sketchy projects, rugpulls and scams. It utilises real time on-chain data to display the facts about a project
            so traders can make informed decisions when to part way with their precious $ALPH.
          </p>
          <Link href="/rugsniffer" className="bg-gray-50 text-black font-bold py-2 px-4 rounded hover:bg-gray-300 transition-colors duration-300" >
            Access tool
          </Link>
        </div>

        <div className="flex flex-col items-center justify-start">
          <h1 className="text-6xl font-bold mt-10 mb-4">NFTs</h1>
          <p className="text-2xl p-4 max-w-5xl">
            Coming soon ...
          </p>
          <Link href="/" className="bg-gray-50 text-black font-bold py-2 px-4 rounded hover:bg-gray-300 transition-colors duration-300" >
            Coming soon
          </Link>
        </div>
      </div>
    </div>
  );
}
