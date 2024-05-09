import React, { useEffect, useState } from 'react';
import { Link, Spinner, Tooltip } from '@nextui-org/react';
import { addressFromContractId } from '@alephium/web3';

interface myProps {
    tokenID: string;
}

interface Token {
    name: string;
    id: string;
}

interface Holders {
    address: {
        balance: string;
        lockedBalance: string;
    }
}

interface LpPoolData {
    LpToken: Token;
    TokenA: Token;
    TokenB: Token;
    poolAddress: string;
    initialLP: string;
    lpHolders: Holders;
    liquidity: number;
    totalLP: number,
    lockedLP: number,
}


const Liquidity_Pools: React.FC<myProps> = ({tokenID}) => {
    const [lpPoolData, setLpPoolData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
          try {
            // Fetch lpPoolData
            const [lpPoolDataResponse, alphUsdPriceResponse] = await Promise.all([
                fetch(`https://sniffer-backend.dogwifbat.org/pools/GetLpTokens/${tokenID}`),
                fetch(`https://backend.mainnet.alephium.org/market/prices?currency=usd`,{method:"POST", body:JSON.stringify(['ALPH'])}),
            ]); 
            if (!lpPoolDataResponse.ok || !alphUsdPriceResponse.ok) {
              throw new Error('Failed to fetch data');
            }
            const lpPoolData = await lpPoolDataResponse.json();
            const alphUsdPrice = await alphUsdPriceResponse.json()
            setLpPoolData(lpPoolData);
    
            // Fetch additional data for each element in lpPoolData
            const updatedPoolData = await Promise.all(lpPoolData.map(async (element: LpPoolData) => {
                const pool_address = addressFromContractId(element.LpToken.id);

                let liquidity;

                const liquidityResponse = await fetch(`https://sniffer-backend.dogwifbat.org/pools/${pool_address}/liquidity`);
                if (!liquidityResponse.ok) {
                    throw new Error('Failed to fetch data');
                }
                const liquidity_info = await liquidityResponse.json();

                if(liquidity_info.poolType == 'token') {
                    // Pool type is Token/Token
                    const tokenPriceAlphResponse = await fetch(`https://sniffer-backend.dogwifbat.org/tokens/${liquidity_info.tokenA.tokenId}/tokenpricealph`);
                    if (!tokenPriceAlphResponse.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const tokenAlphPrice = await tokenPriceAlphResponse.json();
                    const tokenBalance = liquidity_info.tokenA.adjustedBalance;

                    liquidity = ((tokenAlphPrice * tokenBalance) * alphUsdPrice[0]).toString();
                } else {
                    // Pool type is ALPH/Token
                    liquidity = (liquidity_info.alphBalance * alphUsdPrice[0]).toString();
                };

                if (liquidity.toString().indexOf('.') != -1) {
                    liquidity = new Intl.NumberFormat('en-US').format((parseInt(liquidity.slice(0, liquidity.indexOf('.')))));
                } else {
                    liquidity = new Intl.NumberFormat('en-US').format(parseInt(liquidity));
                }

                const [initialLPResponse, LpHoldersResponse] = await Promise.all([
                  fetch(`https://sniffer-backend.dogwifbat.org/pools/GetLpProvider/${pool_address}`),
                  fetch(`https://sniffer-backend.dogwifbat.org/tokens/${element.LpToken.id}/holders`),
                ]); 
                if (!initialLPResponse.ok || !LpHoldersResponse.ok) {
                    throw new Error('Failed to fetch data');
                }
                const initialLP = await initialLPResponse.json();
                const lpHolders = await LpHoldersResponse.json();

                let totalLP = 0;
                let lockedLP = 0;

                // Iterate over each entry in the object
                for (const key in lpHolders) {
                    if (Object.prototype.hasOwnProperty.call(lpHolders, key)) {
                        if(key !== pool_address) {
                            const entry = lpHolders[key];
                            // Add the value of item1 to totalLP
                            totalLP += parseFloat(entry.item1);
                            // Add the value of item2 to lockedLP
                            lockedLP += parseFloat(entry.item2);
                        }
                    }
                }

                return {
                    ...element,
                    poolAddress: pool_address,
                    initialLP: initialLP,
                    lpHolders: lpHolders,
                    liquidity: liquidity,
                    totalLP: totalLP,
                    lockedLP: lockedLP,
                };
            }));

            // Set the updated pool data
            setLpPoolData(updatedPoolData);
            setIsLoading(false);
          } catch (error) {
            console.error('Error fetching data:', error);
            setError(error as Error);
            setIsLoading(false);
          }
        };
    
        fetchData();
      }, [tokenID]);

  // If error, render the error in component
  if (error) {
    return (
      <div className='grid grid-row-4 text-right lg:text-justify row-span-3'>
          <div className='grid row-span-4'>{error.message}</div>
      </div>
  );
  }

  // While isLoading is true, you can render a loading indicator or a placeholder
  if (isLoading) {
    return (
        <div className='grid grid-row-4 text-center lg:text-justify row-span-3'>
            <div><Spinner/></div>
        </div>
    );
  }



  return (
    lpPoolData.map((pool: LpPoolData) => (
        <>
        <div className='grid'>
            <div>
                <Tooltip color='default' content={pool.poolAddress}>
                    <Link className='underline text-xl' color='foreground' isExternal href={`https://explorer.alephium.org/addresses/${pool.poolAddress}`}>
                        {`${pool.poolAddress.slice(0, 4)}...${pool.poolAddress.slice(-4)}`}
                    </Link>
                </Tooltip>	
            </div>
        </div>
        <div className='grid'>
            <div>{pool.TokenA.name}/{pool.TokenB.name}</div>
        </div>
        <div className='grid'>
            <div>
                <Tooltip color='default' content={pool.initialLP}>
                    <Link className='underline text-xl' color='foreground' isExternal href={`https://explorer.alephium.org/addresses/${pool.initialLP}`}>
                    {`${pool.initialLP.slice(0, 4)}...${pool.initialLP.slice(-4)}`}
                    </Link>
                </Tooltip>
            </div>
        </div>
        <div className='grid'>
            <span className='w-full'>
                <span>{Object.keys(pool.lpHolders).length - 1}</span>
            </span>
        </div>
        <div className='grid'>
            <div>${pool.liquidity}</div>
        </div>
        <div className='grid'>
            <div>
                <span className={
                    ((pool.lockedLP / pool.totalLP) * 100) > 0 
                    ?
                    'text-green-500'
                    :
                    'text-red-500'}
                >
                    {
                    (Object.keys(pool.lpHolders).length - 1) != 0
                    ?
                    ((pool.lockedLP / pool.totalLP) * 100).toFixed(0)
                    :
                    0
                    }%
                </span>
            </div>
        </div>
        </>
    ))
  );
}

export default Liquidity_Pools;