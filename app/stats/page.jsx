"use client";
import useSWR from 'swr';
import { addressFromContractId } from "@alephium/web3";
import { useSearchParams } from "next/navigation";
import { Image, Tooltip, Progress, Button, Spinner } from "@nextui-org/react";
import Link from 'next/link';
import { BatIcon, HeartFilledIcon } from '@/components/icons';
import { Low_liquidity } from '@/components/low_liquidity';
import BigNumber from 'bignumber.js';
import { Popover, PopoverContent, PopoverTrigger, useEffect, useState, useMemo } from 'react';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

// Custom fetcher that gets all pages in get request
const pageFetcher = async (url) => {

}


function formatSupply(number) {
    // Define the suffixes for each magnitude of numbers
    const suffixes = ['', 'K', 'M', 'B', 'T', 'Q'];

    // Determine the magnitude of the number by finding how many groups of 3 digits it has
    let magnitudeIndex = Math.floor(Math.log10(number) / 3); // Corrected calculation

    if (magnitudeIndex > 0) { // Proceed only if the number is in millions or more
        const divisor = Math.pow(1000, magnitudeIndex); // Calculate the divisor based on the magnitude
        let shortNumber = number / divisor; // Divide the number to get a shortened version

        // Round the shortened number to the nearest tenth to avoid premature rounding up
        shortNumber = Math.floor(shortNumber * 100) / 100;

        // Combine the shortened number with the appropriate suffix
        return shortNumber + suffixes[magnitudeIndex];
    } else {
        // If the number is less than 1000, return it as a string without modification
        return number.toString();
    }
}

function formatPrice(number) {
    let strNumber = parseFloat(number).toString();
    
    // Check if number is in scientific notation
    if (strNumber.includes('e')) {
        let parts = strNumber.split('e');
        let coefficient = parseFloat(parts[0]);
        let exponent = parseInt(parts[1]);
        let precision = Math.abs(exponent); // Precision includes digits before the decimal point
        let formattedNumber = (coefficient * Math.pow(10, exponent)).toFixed(precision);
        return formattedNumber;
    }
    
    let index = strNumber.indexOf('.') + 1;
    let nonZeroIndex = -1;
    
    for (let i = index; i < strNumber.length; i++) {
        if (strNumber[i] !== '0') {
            nonZeroIndex = i;
            break;
        }
    }

    // Is there no 0s
    if (nonZeroIndex === -1) return strNumber;

    return strNumber.slice(0, nonZeroIndex + 4);
}

function calcPriceImpact(alphReserve, tokenReserve, amountIn, amountOut) {
	const reserveIn = alphReserve;
	const reserveOut = tokenReserve;
	const numerator = (reserveOut * (reserveIn + amountIn) - (reserveOut - amountOut) * reserveIn) * 100;
	const denumerator = reserveIn * (reserveOut - amountOut);
	const impact = BigNumber(numerator.toString()).div(BigNumber(denumerator.toString())).toFixed();
	return parseFloat(impact);
}

export default function StatsPage() {
	const tokenAddr = useSearchParams().get('tokenID');
    if (!tokenAddr) {
        return <div>Something went wrong...</div>;
    }

	// Convert tokenID to contract address of that token
    const contractID = addressFromContractId(tokenAddr);
	const short_contractID = `${contractID.slice(0, 4)}...${contractID.slice(-4)}`;

	// Get total number of transactions for the token contract
    const { data: contract_transaction_ammount, error: contractTransactionAmountError } = useSWR(
        `https://backend-v113.mainnet.alephium.org/addresses/${contractID}/total-transactions`,
        fetcher
    );

	// Get the first transaction for the token contract
    const { data: contract_transaction_info, error: contractTransactionInfoError } = useSWR(() => {
        return contract_transaction_ammount
            ? `https://backend-v113.mainnet.alephium.org/addresses/${contractID}/transactions?page=${contract_transaction_ammount}&limit=1`
            : null;
    }, fetcher);

	// Get pool addresses from AYIN parent contract
    const { data: ayin, error: ayinError } = useSWR(
        'https://backend-v113.mainnet.alephium.org/contract-events/contract-address/vyrkJHG49TXss6pGAz2dVxq5o7mBXNNXAV18nAeqVT1R?limit=100',
        fetcher
    );

	// Get official Alephium token list
    const { data: tokenList, error: tokenListError } = useSWR(
        'https://raw.githubusercontent.com/alephium/token-list/master/tokens/mainnet.json',
        fetcher
    );

	// Use coingecko API to get current Alephium price
    const { data: coingecko, error: coingeckoError } = useSWR(
        `https://api.coingecko.com/api/v3/simple/price?ids=alephium&vs_currencies=usd`,
        fetcher
    );

	// LP variables
	let pool_address;
	let lp_token;

	// Get ALPH/token pool address
	// Get LP token address
	const { data: pool, error: poolError } = useSWR(() => {
        for (const poolData of ayin) {
            if (poolData['fields'][1]['value'] === tokenAddr && poolData['fields'][0]['value'] === '0000000000000000000000000000000000000000000000000000000000000000') {
                lp_token = poolData['fields'][2]['value'];
                break;
            }
        }
        pool_address = addressFromContractId(lp_token);
        return lp_token ? `https://backend-v113.mainnet.alephium.org/addresses/${pool_address}/tokens/${tokenAddr}/balance` : null;
    }, fetcher);

	// Get pool ALPH balance
	const { data: alph, error: alphError } = useSWR(() =>
		pool_address ? `https://backend-v113.mainnet.alephium.org/addresses/${pool_address}/balance` : null,
		fetcher
	);

	// Get total number of transactions for the pool contract
	const { data: pool_transaction_amount, error: poolTransactionAmountError } = useSWR(() =>
		pool_address ? `https://backend-v113.mainnet.alephium.org/addresses/${pool_address}/total-transactions` : null,
		fetcher
	);

	// Get first transaction for the pool contract
	const { data: pool_transaction_info, error: poolTransactionInfoError } = useSWR(() =>
		pool_transaction_amount ? `https://backend-v113.mainnet.alephium.org/addresses/${pool_address}/transactions?page=${pool_transaction_amount}&limit=1` : null,
		fetcher
	);
	
	// Get
	const { data: lp_transactions, error: lpTransactionsError } = useSWR(() => {
		const lp_provider = pool_transaction_info?.[0]?.['inputs']?.[0]?.['address'];
		return lp_provider ? `https://backend-v113.mainnet.alephium.org/addresses/${lp_provider}/tokens/${lp_token}/transactions?limit=100` : null;
	}, fetcher);

	const [LPholders, setLpHolders] = useState(null);
	const [lpHoldersLoading, setLpLoading] = useState(true);

	useEffect(() => {
		// Function to fetch data until no pages left
		const fetchPagedEndpoint = async () => {
			if(lp_token) {
				const fetchedData = [];
				let page = 1;
				let data;

				do {
					try {
                        // Fetch data for page
                        const response = await fetch(`https://backend-v113.mainnet.alephium.org/tokens/${lp_token}/addresses?page=${page}&limit=100`);
                        data = await response.json();
                        
                        // Store fetched data
						fetchedData.push(...data);
                        
                        // Simulate delay
                        await new Promise(resolve => setTimeout(resolve, 100));

						// Incement page to fetch new page of data
						page += 1;
                    } catch (error) {
                        console.error('Error fetching data for page', page, error);
                    }
				} while (data.length > 0);

				// Set data
				setLpHolders(fetchedData);
		
				// Set loading false
				setLpLoading(false);
			}
		};

		fetchPagedEndpoint();

	}, [lp_token]);	// Execute when lp_token changes
	

	// State to store the LP data
    const [lpData, setLpData] = useState(null);
    const [lpLoading, setLoading] = useState(true);
    useEffect(() => {
		// Function to fetch data for each LP holder address
        const fetchDataForLPAddresses = async () => {
			if (LPholders) {
                // Extract addresses from LPholders data
                const addresses = LPholders;
				const fetchedData = {};
                
                // Loop through each address and fetch data with delay
                for (let i = 0; i < addresses.length; i++) {
                    const address = addresses[i];
                    try {
                        // Fetch data for the address
                        const response = await fetch(`https://backend-v113.mainnet.alephium.org/addresses/${address}/tokens/${lp_token}/balance`);
                        const data = await response.json();
                        
                        // Store fetched data
						if(data) {
							fetchedData[address] = data;
						}
                        
                        // Simulate delay
                        await new Promise(resolve => setTimeout(resolve, 150));
                    } catch (error) {
                        console.error('Error fetching data for address', address, error);
                    }
                }

				// Set the LP data state with the fetched data
				setLpData(fetchedData);

                // Once all requests are completed, set loading to false
                setLoading(false);
            }
        };

        // Call the function to fetch data for LP addresses
        fetchDataForLPAddresses();
    }, [LPholders]); // Execute when LPholders data changes

	// State to store the token holders
	const [tokenHolders, setTokenHolders] = useState(null);
	const [tokenHoldersLoading, setTokenHoldersLoading] = useState(true);

	useEffect(() => {
		// Function to fetch data until no pages left
		const fetchPagedEndpoint = async () => {
			if(tokenAddr) {
				const fetchedData = [];
				let page = 1;
				let data;

				do {
					try {
                        // Fetch data for page
                        const response = await fetch(`https://backend-v113.mainnet.alephium.org/tokens/${tokenAddr}/addresses?page=${page}&limit=100`);
                        data = await response.json();
                        
                        // Store fetched data
						fetchedData.push(...data);
                        
                        // Simulate delay
                        await new Promise(resolve => setTimeout(resolve, 100));

						// Incement page to fetch new page of data
						page += 1;
                    } catch (error) {
                        console.error('Error fetching data for page', page, error);
                    }
				} while (data.length > 0);

				// Set data
				setTokenHolders(fetchedData);
		
				// Set loading false
				setTokenHoldersLoading(false);
			}
		};

		fetchPagedEndpoint();

	}, [tokenAddr]);	// Execute when lp_token changes

	// State to store the LP data
    const [tHolderData, setHolderData] = useState(null);
    const [tHolderDataLoading, setHolderDataLoading] = useState(true);
    useEffect(() => {
		// Function to fetch data for each token holder address
        const fetchDataForTokenAddresses = async () => {
			if (tokenHolders) {
                // Extract addresses from tokenHolders data
                const addresses = tokenHolders;
				const fetchedData = {};
                
                // Loop through each address and fetch data with delay
                for (let i = 0; i < addresses.length; i++) {
                    const address = addresses[i];
                    try {
                        // Fetch data for the address
                        const response = await fetch(`https://backend-v113.mainnet.alephium.org/addresses/${address}/tokens/${tokenAddr}/balance`);
                        const data = await response.json();
                        
                        // Store fetched data
						if(data) {
							fetchedData[address] = data.balance;
						}
                        
                        // Simulate delay
                        await new Promise(resolve => setTimeout(resolve, 150));
                    } catch (error) {
                        console.error('Error fetching data for address', address, error);
                    }
                }

				// Set the token holder state with the fetched data
				setHolderData(fetchedData);

                // Once all requests are completed, set loading to false
                setHolderDataLoading(false);
            }
        };

        // Call the function to fetch data for token addresses
        fetchDataForTokenAddresses();
    }, [tokenHolders]); // Execute when tokenHolders data changes

	if (
        !ayin ||
        !pool ||
        !alph ||
        !pool_transaction_amount ||
        !pool_transaction_info ||
        !lp_transactions ||
        !contract_transaction_ammount ||
        !contract_transaction_info ||
        !tokenList ||
        !coingecko
    ) {
        return (
            <div className='font-mono text-2xl'>
                <Progress size="md" isIndeterminate aria-label="Loading..."/>Loading token data...
            </div>
        );
    }

    if (
        ayinError ||
        poolError ||
        alphError ||
        poolTransactionAmountError ||
        poolTransactionInfoError ||
        lpTransactionsError ||
        contractTransactionAmountError ||
        contractTransactionInfoError ||
        tokenListError ||
        coingeckoError
    ) {
        return <div>Failed to load</div>;
    }


	//------------------------------//
	// Data is now available to use //
	
	// Get token metadata
	// Name, Symbol, Decimals, LogoURL
	let name;
	let symbol;
	let decimals;
	let logoURI;
	tokenList['tokens'].forEach(token => {
		if (token['id'] === tokenAddr) {
			name = token['name'];
			symbol = token['symbol'];
			decimals = token['decimals'];
			logoURI = token['logoURI'];
		}
	});
	
	// Get max supply
	let maxSupply;
	contract_transaction_info.forEach(data => {
		data['outputs'].forEach(output => {
			if (output['tokens']) {
				output['tokens'].forEach(token => {
					if(token['id'] === tokenAddr) {
						maxSupply = token['amount'];
					}
				})
			}
		})
	});

	const short_supply = decimals > 0 ? formatSupply(maxSupply / Math.pow(10, decimals)) : formatSupply(maxSupply);
	
	// Get contract creator
	const creator = contract_transaction_info[0]['inputs'][0]['address'];
	const short_creator = `${creator.slice(0, 4)}...${creator.slice(-4)}`;
	
	// LP Provider
	const lp_provider = pool_transaction_info[0]['inputs'][0]['address'];
	const short_lp_provider = `${lp_provider.slice(0, 4)}...${lp_provider.slice(-4)}`;
	
	// LP information
	let  LP_holders;
	if(!lpHoldersLoading) {
		LP_holders = LPholders.length - 1;
	}
	let totalLP = 0;
	let totalLockedLP = 0;
	let lockedLpPercent = 0;
	
	// Use lpData
	if(!lpLoading) {
		Object.entries(lpData).forEach(([address, data]) => {
			if(address != pool_address) {
				totalLP += parseFloat(data.balance);
				totalLockedLP += parseFloat(data.lockedBalance);
			}
		});
		lockedLpPercent = (totalLockedLP / totalLP) * 100;
	}

	let holdersList;
	if(!tHolderDataLoading) {
		holdersList = Object.entries(tHolderData);
		holdersList = holdersList.sort((a, b) => b[1] - a[1]).slice(0, 5);
	}

	// Price info	
	const token_balance = pool['balance'];
	const token_pooled_amount = Math.round(token_balance / Math.pow(10, decimals));
	const alph_balance = alph['balance'];
	const alph_pooled_amount = Math.round(alph_balance / Math.pow(10, 18));
	const unformatted_price = (alph_pooled_amount / token_pooled_amount) * coingecko['alephium']['usd']
	const price = formatPrice((alph_pooled_amount / token_pooled_amount) * coingecko['alephium']['usd']);

	// Get market cap
	const unformatted_mcap = ((unformatted_price * maxSupply) / Math.pow(10, decimals)).toString();
	let mcap;
	if (unformatted_mcap.indexOf('.') != -1) {
		mcap = new Intl.NumberFormat('en-US').format((unformatted_mcap.slice(0, unformatted_mcap.indexOf('.'))));
	} else {
		mcap = new Intl.NumberFormat('en-US').format(unformatted_mcap);
	}

	// Get liquidity
	const liquidity = (alph_pooled_amount * coingecko['alephium']['usd']).toString();
	const formatted_liquidity = new Intl.NumberFormat('en-US').format((liquidity.slice(0, liquidity.indexOf('.'))));
	
	// Calculate the price impact of swapping 10 ALPH for tokenID
	const swapAmount = (coingecko['alephium']['usd'] * 10) / unformatted_price;
	const priceImpact = calcPriceImpact((alph_balance / Math.pow(10, 18)), (token_balance / Math.pow(10, decimals)), 10, swapAmount);
	
	// Testing sentiment
	const goodSentiment = 1;
	const badSentiment = 1;
	const sentimentValue = ((badSentiment / (goodSentiment + badSentiment)) * 100);

	// Check if rugged
	let isRugged = false;
	if(liquidity < 100) {
		isRugged = true;
	}

	return (
		<section className='relative'>
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
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8 py-4'>
				<div className='grid grid-cols-2 grid-rows-4 font-mono p-2 text-2xl border-solid border-2 border-white-500 h-80'>
					<div className='col-span-2 text-3xl'><h1>Token info</h1></div>
					<div className='ml-2 grid grid-row-4 text-justify row-span-3'>
						<div><span>Creator</span></div>
						<div><span>Supply</span></div>
						<div><span>Market Cap</span></div>
						<div><span>Contract</span></div>
					</div>
					<div className='grid grid-row-4 text-right lg:text-justify row-span-3'>
					<div>
						<Tooltip color='default' content={creator}>
							<Link className='underline' href={`https://explorer.alephium.org/addresses/${creator}`}>
								{short_creator}
							</Link>
						</Tooltip>
					</div>
					<div><span>{short_supply}</span></div>
					<div><span>${mcap}</span></div>
					<div>
						<Tooltip color='default' content={contractID}>
							<Link className='underline' href={`https://explorer.alephium.org/addresses/${contractID}`}>
								{short_contractID}
							</Link>
						</Tooltip>
					</div>

					</div>
				</div>
				<div className='grid font-mono p-2 text-2xl border-solid border-2 border-white-500 h-80'>
					<div className='text-3xl'><h1>Risk analysis</h1></div>
					{
						lockedLpPercent > 0 && liquidity > 100
						?
						<div className='text-5xl flex justify-center items-center border-solid border-2 border-green-500 h-20'>Good</div>
						:
						<div className='text-5xl flex justify-center items-center border-solid border-2 border-red-500 h-20'>Danger</div>
					}
					{
						priceImpact > 1.0
						?
						<Low_liquidity/>
						:
						<div></div>
					}
				</div>
				<div className='font-mono p-2 text-2xl border-solid border-2 border-white-500 h-80'>
					<div className='relative text-3xl'>
						{
							!tokenHoldersLoading
							?
							<h2 className='absolute w-full text-right pr-2 pt-1 text-2xl'>{tokenHolders.length - 1}</h2>
							:
							<div></div>
						}
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
					{
							holdersList
							?
							holdersList.map((holder) => (
								<div className='grid grid-cols-6'>
									<div className='col-span-2'>
										<Tooltip color='default' content={holder[0]}>
											<Link className='underline' href={`https://explorer.alephium.org/addresses/${holder[0]}`}>
												{holder[0] === pool_address ? 'POOL' : `${holder[0].slice(0, 4)}...${holder[0].slice(-4)}`}
											</Link>
										</Tooltip>
									</div>
									<div className='col-span-2'>
										{decimals > 0 ? formatSupply((holder[1]) / Math.pow(10, decimals)) : formatSupply(holder[1])}
									</div>
									<div className='col-span-2'>
										{+decimals > 0 ? ((holder[1] / maxSupply) * 100).toFixed(2) : ((holder[1] / maxSupply) * 100).toFixed(2)}%
									</div>
								</div>
							))
							:
							<div></div>
						}
					</div>
				</div>
			</div>
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8 py-4'>
				<div className='grid grid-cols-6 grid-rows-5 lg:col-span-2 font-mono p-2 text-2xl border-solid border-2 border-white-500 h-60'>
					<div className='col-span-6 text-3xl'><h1>Liquidity pools</h1></div>
					<div className='grid'>
						<div>Address</div>
						<div>
							<Tooltip color='default' content={pool_address}>
								<Link className='underline' href={`https://explorer.alephium.org/addresses/${pool_address}`}>
									{`${pool_address.slice(0, 4)}...${pool_address.slice(-4)}`}
								</Link>
							</Tooltip>	
						</div>
					</div>
					<div className='grid'>
						<div>Pair</div>
						<div>ALPH/{symbol}</div>
					</div>
					<div className='grid'>
						<div>Initial LP</div>
						<div>
							<Tooltip color='default' content={lp_provider}>
								<Link className='underline' href={`https://explorer.alephium.org/addresses/${lp_provider}`}>
									{short_lp_provider}
								</Link>
							</Tooltip>
						</div>
					</div>
					<div className='grid'>
						<div>LP Holders</div>
						<span className='w-full'>
							{
								lpHoldersLoading
								?
								<Spinner/>
								:
								<span>{LP_holders}</span>
							}
						</span>
					</div>
					<div className='grid'>
						<div>Liquidity</div>
						<div>${formatted_liquidity}</div>
					</div>
					<div className='grid'>
						<div>LP Locked</div>
						<div>
							{
								lpLoading
								?
								<Spinner/>
								:
								<span className={lockedLpPercent > 0 ? 'text-green-500' : 'text-red-500'}>{parseInt(lockedLpPercent)}%</span>
							}
						</div>
					</div>
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
						<Progress size='lg' value={isRugged ? 0 : sentimentValue} color='success' classNames={{track: "bg-red-600 drop-shadow-md"}} />
					</div>
				</div>
			</div>
			<div className='font-mono text-2xl'>
				Brought to you by $WIFB on $ALPH.
			</div>
			
			{/* <h1>Token Info</h1>
			<h2>TokenID: {tokenAddr}</h2>
			<h2>Contract: {contractID}</h2>
			<h2>Creator: {creator}</h2>
			<h2>Max Supply: {maxSupply}</h2>
			<h2>Market Cap: {mcap}</h2>
			<h2>LP Token: {lp_token}</h2>
			<h2>Ayin Pool: {pool_address}</h2>
			<h2>Token Balance: {token_balance}</h2>
			<h2>Token Pooled Balance: {token_pooled_amount}</h2>
			<h2>Liquidity: {liquidity}</h2>
			<h2>Symbol: {symbol}</h2>
			<h2>Price Impact: {priceImpact}</h2>
			<h2>Swap Amount: {swapAmount}</h2>
			<h2>LP Provider: {lp_provider}</h2>
			<h2>TotalLP: {totalLP}</h2>
			<h2>TotalLockedLP: {totalLockedLP}</h2> */}
		</section>
	);
}