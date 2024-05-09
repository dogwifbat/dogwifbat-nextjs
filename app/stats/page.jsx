"use client";
import { useSearchParams } from "next/navigation";
import { Image, Progress, Button } from "@nextui-org/react";
import { BatIcon, HeartFilledIcon } from '@/components/icons';
import TokenInfo from "@/components/ui/tokenInfo";
import TopHolders from "@/components/ui/topHolders";
import Liquidity_Pools from "@/components/ui/liquidityPools";
import TopBar from "@/components/ui/topBar";
import RiskAnalysis from "@/components/ui/risk";

export default function StatsPage() {
	const tokenID = useSearchParams().get('tokenID');
    if (!tokenID) {
        return <div>Something went wrong...</div>;
    }

	return (
		<section className='relative'>

			<TopBar tokenID={tokenID}/>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8 py-4'>
				<div className='grid grid-cols-2 grid-rows-4 font-mono p-2 text-2xl border-solid border-2 border-white-500 h-80'>
					<div className='col-span-2 text-3xl'><h1>Token info</h1></div>
					<div className='ml-2 grid grid-row-4 text-justify row-span-3'>
						<div><span>Creator</span></div>
						<div><span>Supply</span></div>
						<div><span>Market Cap</span></div>
						<div><span>Contract</span></div>
					</div>
					<TokenInfo tokenID={tokenID}/>
				</div>

				<div className='grid font-mono p-2 text-2xl border-solid border-2 border-white-500 h-80'>
					<div className='text-3xl'><h1>Risk analysis</h1></div>
					<RiskAnalysis tokenID={tokenID} />
				</div>

				<div className='font-mono p-2 text-2xl border-solid border-2 border-white-500 h-80'>
					<div className='relative text-3xl'>
						<h1>Top holders</h1>
					</div>
					<div className='grid grid-cols-3 text-lg'>
						<div>
							<span>Address</span>
						</div>
						<div>
							<span>Amount</span>
						</div>
						<div>
							<span>Percentage</span>
						</div>
					</div>
					<div className='grid grid-rows-5 h-[80%] text-lg'>
						<TopHolders tokenID={tokenID} />
					</div>
				</div>

			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8 py-4'>

				<div className='grid grid-cols-6 lg:col-span-2 font-mono p-2 text-2xl border-solid border-2 border-white-500 h-60'>
					<div className='col-span-6 text-3xl'><h1>Liquidity pools</h1></div>
					<div className="col-span-1 text-2xl">Address</div>
					<div className="col-span-1 text-2xl">Pair</div>
					<div className="col-span-1 text-2xl">Initial LP</div>
					<div className="col-span-1 text-2xl">LP Holders</div>
					<div className="col-span-1 text-2xl">Liquidity</div>
					<div className="col-span-1 text-2xl">LP Locked</div>

					<Liquidity_Pools tokenID={tokenID} />
				</div>

				<div className='grid grid-col-2 col-span-1 gap-4 p-4 font-mono text-2xl border-solid border-2 border-white-500 h-60'>
					<div className='col-span-2 text-3xl row-span-1'><h1>Community vibes</h1></div>

					<div>
						<Button isIconOnly color='success' aria-label='Safe sentiment button' className='w-full'>
							<HeartFilledIcon/>
						</Button>
					</div>

					<div>
						<Button isIconOnly aria-label='Danger sentiment button' className='w-full bg-red-600'>
							<BatIcon/>
						</Button>
					</div>

					<div className='col-span-2'>
						<Progress size='lg' value={50} color='success' classNames={{track: "bg-red-600 drop-shadow-md"}} />
					</div>
				</div>

			</div>

			<div className='font-mono text-2xl'>
				Brought to you by $WIFB on $ALPH.
			</div>

			<div className='font-mono text-xl'>
				Sponsored by @Blockflow_DAO.
			</div>

		</section>
	);
}