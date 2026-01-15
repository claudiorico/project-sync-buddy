import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QuoteResponse {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  name: string;
  currency: string;
  updatedAt: string;
  error?: string;
}

// Fetch from Yahoo Finance (works for Brazilian stocks with .SA suffix)
async function fetchYahooQuote(ticker: string): Promise<QuoteResponse | null> {
  try {
    // Add .SA suffix for Brazilian stocks if not present
    const yahooTicker = ticker.includes('.') ? ticker : `${ticker}.SA`;
    
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooTicker}?interval=1d&range=1d`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.log(`Yahoo Finance error for ${ticker}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const result = data?.chart?.result?.[0];
    
    if (!result) {
      console.log(`No Yahoo data for ${ticker}`);
      return null;
    }

    const meta = result.meta;
    const regularMarketPrice = meta.regularMarketPrice || 0;
    const previousClose = meta.previousClose || meta.chartPreviousClose || regularMarketPrice;
    const change = regularMarketPrice - previousClose;
    const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;

    return {
      ticker: ticker.toUpperCase(),
      price: regularMarketPrice,
      change: change,
      changePercent: changePercent,
      previousClose: previousClose,
      name: meta.shortName || meta.longName || ticker,
      currency: meta.currency || 'BRL',
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error fetching Yahoo quote for ${ticker}:`, error);
    return null;
  }
}

// Fetch from CoinGecko for crypto
async function fetchCoinGeckoQuote(ticker: string): Promise<QuoteResponse | null> {
  try {
    // Map common crypto tickers to CoinGecko IDs
    const cryptoMap: Record<string, string> = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'SOL': 'solana',
      'ADA': 'cardano',
      'DOT': 'polkadot',
      'AVAX': 'avalanche-2',
      'MATIC': 'matic-network',
      'LINK': 'chainlink',
      'UNI': 'uniswap',
      'ATOM': 'cosmos',
      'XRP': 'ripple',
      'DOGE': 'dogecoin',
      'SHIB': 'shiba-inu',
      'LTC': 'litecoin',
      'BCH': 'bitcoin-cash',
      'XLM': 'stellar',
      'ALGO': 'algorand',
      'VET': 'vechain',
      'FIL': 'filecoin',
      'AAVE': 'aave',
    };

    const coinId = cryptoMap[ticker.toUpperCase()];
    if (!coinId) {
      return null;
    }

    const url = `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.log(`CoinGecko error for ${ticker}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    const price = data.market_data?.current_price?.brl || data.market_data?.current_price?.usd || 0;
    const change24h = data.market_data?.price_change_24h_in_currency?.brl || data.market_data?.price_change_24h || 0;
    const changePercent = data.market_data?.price_change_percentage_24h || 0;

    return {
      ticker: ticker.toUpperCase(),
      price: price,
      change: change24h,
      changePercent: changePercent,
      previousClose: price - change24h,
      name: data.name || ticker,
      currency: 'BRL',
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error fetching CoinGecko quote for ${ticker}:`, error);
    return null;
  }
}

// Detect if ticker is crypto
function isCrypto(ticker: string): boolean {
  const cryptoTickers = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'AVAX', 'MATIC', 'LINK', 'UNI', 'ATOM', 'XRP', 'DOGE', 'SHIB', 'LTC', 'BCH', 'XLM', 'ALGO', 'VET', 'FIL', 'AAVE'];
  return cryptoTickers.includes(ticker.toUpperCase());
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tickers } = await req.json();

    if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Tickers array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Limit to 20 tickers per request
    const limitedTickers = tickers.slice(0, 20);
    
    // Normalize tickers
    const normalizedTickers = limitedTickers.map((t: string) => 
      t.toUpperCase().replace('.SA', '')
    );

    console.log(`Fetching quotes for: ${normalizedTickers.join(', ')}`);

    // Fetch quotes in parallel
    const quotePromises = normalizedTickers.map(async (ticker: string) => {
      // Try crypto first if it looks like crypto
      if (isCrypto(ticker)) {
        const cryptoQuote = await fetchCoinGeckoQuote(ticker);
        if (cryptoQuote) return cryptoQuote;
      }
      
      // Try Yahoo Finance for stocks
      const yahooQuote = await fetchYahooQuote(ticker);
      if (yahooQuote) return yahooQuote;

      // Return error quote if not found
      return {
        ticker,
        price: 0,
        change: 0,
        changePercent: 0,
        previousClose: 0,
        name: ticker,
        currency: 'BRL',
        updatedAt: new Date().toISOString(),
        error: 'Ticker not found',
      };
    });

    const quotes = await Promise.all(quotePromises);

    console.log(`Successfully fetched ${quotes.filter(q => !q.error).length} quotes`);

    return new Response(
      JSON.stringify({ quotes }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in get-quotes function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
