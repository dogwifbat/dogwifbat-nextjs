/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import Link from 'next/link';


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Hero Section */}

        <h1 className="text-6xl font-bold mt-10 mb-4">What is $WIFB?</h1>
        <p className="text-2xl p-4">
          Bonks Rugs, Gibs Lubs
        </p>
        <Link href="/about" className="bg-gray-50 text-black font-bold py-2 px-4 rounded hover:bg-gray-300 transition-colors duration-300" >
          But fr, what is $WIFB?
        </Link>
        <div className="m-10">
          <Image src="/WIFB.png" alt="dogwifbat" width={400} height={400} className="inline-block" />
        </div>

    </div>
  );
}
