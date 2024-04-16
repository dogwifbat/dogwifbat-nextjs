import React from 'react'
import { title } from "@/components/primitives";

function nfts() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-20">
        <div className="inline-block max-w-1xl text-center justify-center">
            <h1 className={title({ color: "cyan" })}>Coming Soon.&nbsp;</h1>
        </div>
    </section>
  )
}

export default nfts
