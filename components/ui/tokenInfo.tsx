import React, { useEffect, useState } from 'react';
import { addressFromContractId } from "@alephium/web3";
import { formatPrice, formatSupply } from '@/app/utils/utils';
import { Link, Spinner, Tooltip } from '@nextui-org/react';

interface myProps {
    tokenID: string;
}

const TokenInfo: React.FC<myProps> = ({tokenID}) => {
    const [tokenMetadata, setTokenMetadata] = useState<any>(null);
    const [maxSupply, setMaxSupply] = useState<any>(null);
    const [tokenCreator, setTokenCreator] = useState<any>(null);
    const [tokenAlphPrice, setTokenAlphPrice] = useState<any>(null);
    const [alphPrice, setAlphPrice] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    // Convert tokenID to contract address of the token
    const contractID = addressFromContractId(tokenID);
    const short_contractID = `${contractID.slice(0, 4)}...${contractID.slice(-4)}`;

  useEffect(() => {
    const fetchData = async () => {
      try {        
        // Perform requests simultaneously using Promise.all
        const [tokenMetadataResponse, tokenSupplyResponse, tokenCreatorResponse, tokenAlphPriceResponse, alphPriceResponse] = await Promise.all([
          fetch(`https://sniffer-backend.dogwifbat.org/tokens/${tokenID}/metadata`),
          fetch(`https://sniffer-backend.dogwifbat.org/tokens/${contractID}/maxsupply`),
          fetch(`https://sniffer-backend.dogwifbat.org/tokens/${contractID}/creator`),
          fetch(`https://sniffer-backend.dogwifbat.org/tokens/${tokenID}/tokenpricealph`),
          fetch(`https://backend.mainnet.alephium.org/market/prices?currency=usd`,{method:"POST", body:JSON.stringify(['ALPH'])}),
        ]);

        // Check if both requests are successful
        if (!tokenMetadataResponse.ok || !tokenSupplyResponse.ok || !tokenCreatorResponse.ok || !tokenAlphPriceResponse.ok || !alphPriceResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        // Parse JSON responses
        const tokenMetadata = await tokenMetadataResponse.json();
        const maxSupply = await tokenSupplyResponse.json();
        const creator = await tokenCreatorResponse.json();
        const tokenAlphPrice = await tokenAlphPriceResponse.json();
        const alphPrice = await alphPriceResponse.json();

        // Once both requests are completed successfully, update state and set isLoading to false
        setTokenMetadata(tokenMetadata);
        setMaxSupply(maxSupply);
        setTokenCreator(creator);
        setTokenAlphPrice(tokenAlphPrice);
        setAlphPrice(alphPrice);
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
          <div>N/A</div>
          <div>N/A</div>
          <div>N/A</div>
          <div>N/A</div>
      </div>
  );
  }

  // While isLoading is true, you can render a loading indicator or a placeholder
  if (isLoading) {
    return (
        <div className='grid grid-row-4 text-right lg:text-justify row-span-3'>
            <div><Spinner/></div>
            <div><Spinner/></div>
            <div><Spinner/></div>
            <div><Spinner/></div>
        </div>
    );
  }

    // Once isLoading becomes false, you can render the fetched data or handle other logic

    // Get token decimals from metadata
    const decimals = tokenMetadata.decimals;

    // Format supply to be short supply format
    const short_supply = decimals > 0 ? formatSupply(maxSupply / Math.pow(10, decimals)) : formatSupply(maxSupply);

    // Format creator address to be short format
    const short_creator = `${tokenCreator.slice(0, 4)}...${tokenCreator.slice(-4)}`;

    const unformatted_mcap: string = (((tokenAlphPrice * alphPrice[0]) * maxSupply) / Math.pow(10, decimals)).toString();
    let mcap
    if (unformatted_mcap.indexOf('.') != -1) {
      mcap = new Intl.NumberFormat('en-US').format((parseInt(unformatted_mcap.slice(0, unformatted_mcap.indexOf('.')))));
    } else {
      mcap = new Intl.NumberFormat('en-US').format(parseInt(unformatted_mcap));
    }

  return (
    <div className='grid grid-row-4 text-right lg:text-justify row-span-3'>
        <div>
            <Tooltip color='default' content={tokenCreator}>
                <Link className='underline text-xl' color='foreground' isExternal href={`https://explorer.alephium.org/addresses/${tokenCreator}`}>
                    {short_creator}
                </Link>
            </Tooltip>
        </div>
        <div><span>{short_supply}</span></div>
        <div><span>${mcap}</span></div>
        <div>
            <Tooltip color='default' content={contractID}>
                <Link className='underline text-xl' color='foreground' isExternal href={`https://explorer.alephium.org/addresses/${contractID}`}>
                    {short_contractID}
                </Link>
            </Tooltip>
        </div>
    </div>
  );
}

export default TokenInfo;