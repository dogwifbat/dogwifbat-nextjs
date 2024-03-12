/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import Link from 'next/link';


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Hero Section */}

        <h1 className="text-6xl font-bold mt-10 mb-4">What is $WIFB?</h1>
        <p className="text-2xl p-4">
          Literally just a dog wif a bat that's ready to bonk bark up crypto, swing for moonshots, and bonk FUD.
        </p>
        <p className="text-xl mb-5 p-2">Join the bonk! For the community by the community.</p>
        <div className="m-10">
          {/* Image of the dog with a hat */}
          <Image src="/WIFB.png" alt="dogwifbat" width={400} height={400} className="inline-block" />
        </div>
        
        <Link href="https://www.ayin.app/swap" className="bg-gray-50 text-black font-bold py-2 px-4 rounded hover:bg-gray-300 transition-colors duration-300">
          Trade $WIFB on Ayin!
        </Link>

    </div>
  );
}
