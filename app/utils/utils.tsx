import BigNumber from 'bignumber.js';

export function formatSupply(number: number) {
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

export function formatPrice(number: string) {
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

export function calcPriceImpact(alphReserve: number, tokenReserve: number, amountIn: number, amountOut: number) {
	const reserveIn = alphReserve;
	const reserveOut = tokenReserve;
	const numerator = (reserveOut * (reserveIn + amountIn) - (reserveOut - amountOut) * reserveIn) * 100;
	const denumerator = reserveIn * (reserveOut - amountOut);
	const impact = BigNumber(numerator.toString()).div(BigNumber(denumerator.toString())).toFixed();
	return parseFloat(impact);
}
