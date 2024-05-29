import React, { useEffect, useState } from 'react';
import { Link, Spinner, Tooltip } from '@nextui-org/react';
import { formatSupply } from '@/app/utils/utils';
import { addressFromContractId } from '@alephium/web3';

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

const TopHolders: React.FC<myProps> = ({tokenID}) => {
    const [tokenHolders, setTokenHolders] = useState<any>(null);
    const [metadata, setMetadata] = useState<any>(null);
    const [maxSupply, setMaxsupply] = useState<any>(null);
    const [poolAddresses, setPoolAddresses] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const contractID = addressFromContractId(tokenID);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Perform requests simultaneously using Promise.all
        const [tokenHoldersResponse, metadataResponse, maxsupplyResponse, lpPoolDataResponse] = await Promise.all([
          fetch(`https://sniffer-backend.dogwifbat.org/tokens/${tokenID}/holders`),
          fetch(`https://sniffer-backend.dogwifbat.org/tokens/${tokenID}/metadata`),
          fetch(`https://sniffer-backend.dogwifbat.org/tokens/${contractID}/maxsupply`),
          fetch(`https://sniffer-backend.dogwifbat.org/pools/GetLpTokens/${tokenID}`)
        ]);

        // Check if both requests are successful
        if (!tokenHoldersResponse.ok || !metadataResponse || !maxsupplyResponse || !lpPoolDataResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        // Parse JSON responses
        const tokenHolders = await tokenHoldersResponse.json();
        const metadata = await metadataResponse.json();
        const maxSupply = await maxsupplyResponse.json();
        const lpPoolData = await lpPoolDataResponse.json();

        let poolAddresses: string[] = [];

        lpPoolData.map(async (element: LpPoolData) => {
          poolAddresses.push(addressFromContractId(element.LpToken.id));
        });

        // Once requests are completed successfully, update state and set isLoading to false
        setTokenHolders(tokenHolders);
        setMetadata(metadata);
        setMaxsupply(maxSupply);
        setPoolAddresses(poolAddresses);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error as Error); // Set the error state
        setIsLoading(false); // Make sure to set isLoading to false even if there's an error
      }
    };

    fetchData(); // Call the fetchData function when the component mounts
  }, []); // Empty dependency array means this effect will only run once, equivalent to componentDidMount in class components

  // If error, render the error in component
  if (error) {
    return (
      <div className='grid grid-row-4 text-right lg:text-justify row-span-3'>
          <div>{error.message}</div>
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

    // Get token decimals from metadata
    const decimals = metadata.decimals;

    // Step 1: Convert object to array of objects
    // key: address
    // item1: balance
    // item2: lockedBalance
    const dataArray = Object.entries(tokenHolders).map(([key, value]: [string, any]) => ({
        key,
        item1: value.item1,
        item2: value.item2
      }));

    // Step 2: Sort array based on "item1" value in descending order
    dataArray.sort((a, b) => parseInt(b.item1) - parseInt(a.item1));

    // Step 3: Slice the first 5 elements
    const top5 = dataArray.slice(0, 5);

  return (
    <div>
      {top5.map((holder: any) => (
        <div className='grid grid-cols-6' key={holder.key}>
          <div className='col-span-2'>
            <Tooltip color='default' content={holder.key}>
              <Link className='underline text-xl' color='foreground' isExternal href={`https://explorer.alephium.org/addresses/${holder.key}`}>
                {poolAddresses.some((addr: any) => addr === holder.key) ? `Ayin AMM` : `${holder.key.slice(0, 4)}...${holder.key.slice(-4)}`}
              </Link>
            </Tooltip>
          </div>
          <div className='col-span-2'>
            {decimals > 0 ? formatSupply((holder.item1) / Math.pow(10, decimals)) : formatSupply(holder.item1)}
          </div>
          <div className='col-span-2'>
            {((holder.item1 / maxSupply) * 100).toFixed(2)}%
          </div>
        </div>
      ))}
    </div>
  );
}

export default TopHolders;