import React, { useEffect, useState } from 'react';
import { addressFromContractId, stringToHex } from "@alephium/web3";
import { formatPrice, formatSupply } from '@/app/utils/utils';
import { Link, Spinner, Tooltip } from '@nextui-org/react';
import TopHolders from './topHolders';

interface myProps {
    tokenID: string;
}

interface Token {
  name: string;
  id: string;
}

interface LpPoolData {
  LpToken: Token;
  TokenA: Token;
  TokenB: Token;
}

interface Holders {
  address: {
      balance: string;
      lockedBalance: string;
  }
}

const RiskAnalysis: React.FC<myProps> = ({tokenID}) => {
    const [LpLocked, setLpLocked] = useState<any>(null);
    const [LargeHolders, setLargeHolders] = useState<any>(null);
    const [creator, setCreator] = useState<any>(null);
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

        const object = lpPoolData.find((obj: LpPoolData) => obj.TokenA.name == "ALPH");
        const LpTokenID = object ? object.LpToken.id : undefined;
        console.log("lpTokenID:", LpTokenID);
        console.log("LpPoolData:", lpPoolData);

        const pool_address = addressFromContractId(LpTokenID);

        const initialLPResponse = await fetch(`https://sniffer-backend.dogwifbat.org/pools/GetLpProvider/${pool_address}`);
        if (!initialLPResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const initialLP = await initialLPResponse.json();
        const initialLpLockedResponse = await fetch(`https://sniffer-backend.dogwifbat.org/addresses/${initialLP}/tokens/${LpTokenID}/balance`)
        if (!initialLpLockedResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const initialLpLockedData = await initialLpLockedResponse.json();

        // True if 100% of LP is locked, else false
        console.log("balance:", initialLpLockedData.balance);
        console.log("lockedBalance:", initialLpLockedData.lockedBalance);
        console.log(initialLpLockedData);

        const LpLocked = (initialLpLockedData.balance > 0) && (initialLpLockedData.balance == initialLpLockedData.lockedBalance) ? true : false;

        const contractID = addressFromContractId(tokenID);

        // Check if any address holds more than 10% of supply
        const [ tokenHoldersResponse, tokenMaxSupplyResponse, tokenMetadataResponse, tokenCreatorResponse ] = await Promise.all([
          fetch(`https://sniffer-backend.dogwifbat.org/tokens/${tokenID}/holders`),
          fetch(`https://sniffer-backend.dogwifbat.org/tokens/${contractID}/maxsupply`),
          fetch(`https://sniffer-backend.dogwifbat.org/tokens/${tokenID}/metadata`),
          fetch(`https://sniffer-backend.dogwifbat.org/tokens/${contractID}/creator`),
        ]);
        if (!tokenHoldersResponse.ok || !tokenMaxSupplyResponse.ok || !tokenMetadataResponse.ok || !tokenCreatorResponse.ok) {
          throw new Error('Failed to fetch data');
        }
        const tokenHolders = await tokenHoldersResponse.json();
        const maxSupply = await tokenMaxSupplyResponse.json();
        const tokenMetadata = await tokenMetadataResponse.json();
        const creator = await tokenCreatorResponse.json();

        const decimals = tokenMetadata.decimals;

        const keysWith10Percent: Record<string, boolean> = {};

        for (const key in tokenHolders) {
          if (tokenHolders.hasOwnProperty(key)) {
            const item1Value = parseInt(tokenHolders[key].item1, 10);
            const threshold = 0.1 * (Math.pow(maxSupply, decimals));
            if (item1Value >= threshold) {
              keysWith10Percent[key] = true;
            }
          }
        }

        
        setLpLocked(LpLocked);
        setLargeHolders(keysWith10Percent);
        setCreator(creator);
        setIsLoading(false);
      }  catch (error) {
        console.error('Error fetching data:', error);
        setError(error as Error);
        setIsLoading(false);
      }
    };

    fetchData(); // Call the fetchData function when the component mounts
  }, []); // Empty dependency array means this effect will only run once, equivalent to componentDidMount in class components

  // If error, render the error in component
  if (error) {
    return (
      <div className='grid grid-row-4 text-right lg:text-justify row-span-3'>
          <div>N/A</div>
      </div>
  );
  }

  // While isLoading is true, you can render a loading indicator or a placeholder
  if (isLoading) {
    return (
        <div className='grid grid-row-4 text-right lg:text-justify row-span-3'>
            <div><Spinner/></div>
        </div>
    );
  }

    // Once isLoading becomes false, you can render the fetched data or handle other logic

    let risk: number = 0;
    console.log(LpLocked);

    risk += LpLocked ? 0 : 10;


  return (
    <>
      {
        risk < 10
        ?
        <div className='text-5xl flex justify-center items-center border-solid border-2 border-green-500 h-20'>Good</div>
        :
        <div className='text-5xl flex justify-center items-center border-solid border-2 border-red-500 h-20'>Danger</div>
      }
    </>
  );
}

export default RiskAnalysis;