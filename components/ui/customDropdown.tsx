import React, { useState, useEffect, useRef } from 'react';

interface Token {
  id: string;
  name: string;
  symbol: string;
  logoURI: string;
}

interface CustomDropdownProps {
  tokens: Token[];
  selectedToken: string;
  onChange: (tokenId: string) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ tokens, selectedToken, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setIsOpen(!isOpen);
  const handleSelect = (tokenId: string) => {
    onChange(tokenId);
    setIsOpen(false);
  };

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const selectedTokenDetails = tokens.find(token => token.id === selectedToken);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="border border-gray-300 bg-gray-800 text-white p-3 rounded-lg w-full shadow-md hover:bg-gray-700 flex justify-between items-center"
      >
        {selectedTokenDetails ? (
          <div className="flex items-center">
            <img src={selectedTokenDetails.logoURI} alt={selectedTokenDetails.name} className="h-6 w-6 mr-2" />
            {selectedTokenDetails.name} ({selectedTokenDetails.symbol})
          </div>
        ) : (
          <span>Select a token</span>
        )}
        <svg className="w-4 h-4 text-white ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute mt-1 w-full bg-gray-800 rounded-md shadow-lg z-10 max-h-80 overflow-y-auto">
          {tokens.map((token) => (
            <div
              key={token.id}
              onClick={() => handleSelect(token.id)}
              className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-700"
            >
              <img src={token.logoURI} alt={token.name} className="h-6 w-6 mr-2" />
              <span className="text-white">
                {token.name} ({token.symbol})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
