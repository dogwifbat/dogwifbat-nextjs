/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { BsTwitterX, BsDiscord  } from "react-icons/bs";
import Link from 'next/link';

export default function About() {
  return (
    <div>
        <div className="flex items-center justify-center shadow-xl rounded-lg p-8 max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">$WIFB Socials</h1>
        </div>
        <div className="grid grid-cols-2 items-center shadow-xl rounded-lg py-8 max-w-4xl mx-auto">
            <div className='flex justify-end'>
                <Link href="https://twitter.com/dogwifbatt">
                    <BsTwitterX className="text-white" size={200} />
                </Link>
            </div>
            <div>
                <Link href="https://discord.gg/9eSRnJ4eHV">
                    <BsDiscord className="text-white" size={200} />
                </Link>
            </div>
        </div>
        <div className='flex items-center justify-center shadow-xl rounded-lg p-8 max-w-4xl mx-auto text-center'>
            <p className="text-xl font-bold  mb-6">
            Be a part of the community, Join us!
            </p>
        </div>
    </div>
  );
}
