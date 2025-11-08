// Currency conversion utilities for KES

export const formatKES = (amount: number): string => {
  return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const convertToKES = async (amount: number, fromCurrency: string): Promise<number> => {
  if (fromCurrency === 'KES') return amount;
  
  // Default exchange rates (can be fetched from database)
  const exchangeRates: Record<string, number> = {
    'KES': 1,
    'USD': 130,
    'EUR': 140,
    'GBP': 165,
    'ZAR': 7.5,
    'UGX': 0.035,
    'TZS': 0.055,
  };
  
  const rate = exchangeRates[fromCurrency] || 1;
  return amount * rate;
};

export const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    'KES': 'KES',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'ZAR': 'R',
    'UGX': 'UGX',
    'TZS': 'TSh',
  };
  
  return symbols[currency] || currency;
};
