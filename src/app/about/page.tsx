import React from 'react'
import PieChart from '@/components/piechart';
import Link from 'next/link';

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center">

      <h2 className=" flex justify-center text-3xl font-bold m-14">The Tokenomics:</h2>
      <div className="flex justify-center">
        <PieChart />
      </div>


      <p className="text-2xl m-6">But fr, all tokens are wif the community! Have a look!</p>

      <Link href="https://explorer.alephium.org/addresses/2ARBQ8p8sPu1jcUkDgpBrWZT3PXxUUdwQEacxjciCULgw" className="bg-gray-50 text-black font-bold py-2 px-4 rounded hover:bg-gray-300 transition-colors duration-300">
          Ayin Pool Contract
      </Link>

      <p className="text-2xl m-6">LP Tokens are locked till 1/1/2025. See for yourself!</p>

      <Link href="https://explorer.alephium.org/addresses/1GzLe4iCSbW6m5sG9BDobwgK5Svq1R2odH61KzYahxQpV" className="bg-gray-50 text-black font-bold py-2 px-4 rounded hover:bg-gray-300 transition-colors duration-300 mb-8">
          LP Token address
      </Link>

    </div>
  )
}

