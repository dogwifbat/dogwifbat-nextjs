import { Button, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import React from 'react'

export const Low_liquidity = () => {
    const content = (
        <PopoverContent>
          <div className="px-1 py-2">
            <div className="text-small font-bold">Low Liquidity</div>
            <div className="text-tiny">The price impact of trading 10 ALPH is greater than 1%.</div>
          </div>
        </PopoverContent>
    )
  return (
    <div className='z-1 flex flex-wrap gap-4 w-full'>
        <Popover placement='top' color='warning'>
            <PopoverTrigger>
                <Button color='warning' variant='flat' className='w-full'>
                    Low Liquidity
                </Button>
            </PopoverTrigger>
            {content}
        </Popover>
    </div>
  )
}