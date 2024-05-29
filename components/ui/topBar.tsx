import React, { useEffect, useState } from 'react';
import { addressFromContractId } from "@alephium/web3";
import { Spinner, Image } from '@nextui-org/react';
import { formatPrice } from '@/app/utils/utils';

interface myProps {
    tokenID: string;
}

const TopBar: React.FC<myProps> = ({tokenID}) => {
    const [tokenMetadata, setTokenMetadata] = useState<any>(null);
    const [tokenLogo, setLogo] = useState<any>(null);
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
        const [tokenMetadataResponse, tokenLogoResponse, tokenAlphPriceResponse, alphPriceResponse] = await Promise.all([
          fetch(`https://sniffer-backend.dogwifbat.org/tokens/${tokenID}/metadata`),
          fetch(`https://sniffer-backend.dogwifbat.org/tokens/${tokenID}/tokenimage`),
          fetch(`https://sniffer-backend.dogwifbat.org/tokens/${tokenID}/tokenpricealph`),
          fetch(`https://backend.mainnet.alephium.org/market/prices?currency=usd`,{method:"POST", body:JSON.stringify(['ALPH'])}),
        ]);

        // Check if both requests are successful
        if (!tokenMetadataResponse.ok || !tokenLogoResponse.ok || !tokenAlphPriceResponse.ok || !alphPriceResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        // Parse JSON responses
        const tokenMetadata = await tokenMetadataResponse.json();
        const tokenLogo = await tokenLogoResponse.json();
        const tokenAlphPrice = await tokenAlphPriceResponse.json();
        const alphPrice = await alphPriceResponse.json();

        // Once both requests are completed successfully, update state and set isLoading to false
        setTokenMetadata(tokenMetadata);
        setLogo(tokenLogo);
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
      <div className='grid text-right lg:text-justify row-span-3'>
          <div>N/A</div>
      </div>
  );
  }

  // While isLoading is true, you can render a loading indicator or a placeholder
  if (isLoading) {
    return (
        <div><Spinner/></div>
    );
  }

    // Once isLoading becomes false, you can render the fetched data or handle other logic

    const price = tokenAlphPrice * alphPrice[0];

  return (
    <div className='grid grid-cols-8 h-full gap-4'>
        <div className='grid col-span-3 grid-cols-6 gap-1'>
            <div className='col-span-1 flex justify-start items-center'>
                <Image
                    isBlurred
                    width={100}
                    src={tokenLogo?.imageUrl}
                    />
            </div>
            <div className='flex font-mono justify-start items-center uppercase text-5xl ml-5 col-span-5'>
                <span>{tokenMetadata.name}</span>
            </div>
        </div>
        <div className='col-span-2 items-center justify-center flex'>
            <div></div>
        </div>
        <div className='col-span-3 flex font-mono justify-end items-center uppercase text-5xl ml-5'>
            <span>${formatPrice(price.toString())}</span>
        </div>
    </div>
  );
}

export default TopBar;