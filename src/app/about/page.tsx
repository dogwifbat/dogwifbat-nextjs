/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { Button, Card, Spacer, Link as NextLink } from '@nextui-org/react';
import PieChart from '@/components/piechart';
import Link from 'next/link';

export default function About() {
  return (
    <div className="flex items-center justify-center">
      <div className=" shadow-xl rounded-lg p-8 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">About $WIFB</h1>
        <p className="text-xl font-bold  mb-6">
          dogwifbat is a dog wif a bat. Pretty obvious right? Well it's also more than that...
        </p>
        <p className='mb-5'>
        dogwifbat was launched fairly, meaning it also can't be rugged. 100% of the supply was added to the LP pool, and LP tokens are locked.
        </p>
        <h2 className="text-2xl font-semibold mb-2">The Tokenomics</h2>
        <div className="flex justify-center items-center mb-5">
          <PieChart />
          
        </div>
        <p className=' mb-5'>But fr, all tokens are with the community! Have a look!</p>
        <Link href="https://explorer.alephium.org/addresses/2ARBQ8p8sPu1jcUkDgpBrWZT3PXxUUdwQEacxjciCULgw" className="mb-10 inline-block bg-gray-50 text-black font-bold py-2 px-4 rounded hover:bg-gray-400 transition-colors duration-300">
          Ayin Pool Contract
        </Link>

        <p className="text-md mt-4 mb-6">
          The idea and ethos behind dogwifbat was created due to a constant ruggers coming to the Alephium blockchain. dogwifbat is designed to combat rug pulls. With our mascot, dogwifbat, we aim to provide transparency into newly listed tokens and DEX pools on Ayin.
        </p>

        <p className="text-xl font-bold mb-2">Roadmap</p>
        <p className='mb-12'>
          Our roadmap includes an upcoming token scanner tool, NFTs, and a gamified dApp, enhancing the $ALPH ecosystem and allowing YOU to DYOR on tokens, and prevent YOU from being rugged.
        </p>

        <p className="text-md mb-4">LP Tokens are locked until 1/1/2025.</p>

        <Link href="https://explorer.alephium.org/addresses/1GzLe4iCSbW6m5sG9BDobwgK5Svq1R2odH61KzYahxQpV" className=" m-2 inline-block bg-gray-50 text-black font-bold py-2 px-4 rounded hover:bg-gray-400 transition-colors duration-300 mb-6">
          LP Token Address
        </Link>

        <Link href="https://www.ayin.app/swap" className="m-2 inline-block bg-amber-600 text-white font-bold py-2 px-4 rounded hover:bg-amber-700 transition-colors duration-300">
          Trade $WIFB on Ayin!
        </Link>
      </div>
    </div>
  );
}
