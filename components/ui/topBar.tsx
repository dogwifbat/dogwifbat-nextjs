

























{
    isRugged
    ?
    <div className='absolute inset-0 z-10 flex items-center justify-center'>
        <Image
            isBlurred
            src='WIFB_logo_transparent.png'
            width={700}
        />
    </div>
    :
    <div></div>
}
<div className='grid grid-cols-8 h-full gap-4'>
    <div className='grid col-span-3 grid-cols-6 gap-1'>
        <div className='col-span-1 flex justify-start items-center'>
            <Image
                isBlurred
                width={100}
                src={logoURI}
                />
        </div>
        <div className='flex font-mono justify-start items-center uppercase text-5xl ml-5 col-span-5'>
            <span>{name}</span>
        </div>
    </div>
    <div className='col-span-2 items-center justify-center flex'>
        {
            isRugged
            ?
            <span className='w-4/5 font-mono uppercase text-5xl text-red-500 border-solid border-4 border-red-500'>
                RUGGED
            </span>
            :
            <div></div>
        }
    </div>
    <div className='col-span-3 flex font-mono justify-end items-center uppercase text-5xl ml-5'>
        <span>${price}</span>
    </div>
</div>