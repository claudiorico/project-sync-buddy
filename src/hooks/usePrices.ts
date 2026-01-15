/**
 * Hook for fetching real-time stock prices from Brapi
 * Uses Edge Function to avoid CORS issues
 */

import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Quote {
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

interface UsePricesReturn {
  quotes: Record<string, Quote>;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  fetchQuotes: (tickers: string[]) => Promise<void>;
  getQuote: (ticker: string) => Quote | undefined;
}

// Cache quotes for 5 minutes
const CACHE_DURATION_MS = 5 * 60 * 1000;

export function usePrices(): UsePricesReturn {
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const cacheRef = useRef<{
    quotes: Record<string, Quote>;
    timestamp: number;
  }>({ quotes: {}, timestamp: 0 });

  const fetchQuotes = useCallback(async (tickers: string[]) => {
    if (!tickers || tickers.length === 0) {
      return;
    }

    // Filter out tickers that are still cached
    const now = Date.now();
    const cachedQuotes = cacheRef.current;
    const tickersToFetch = tickers.filter(ticker => {
      const cached = cachedQuotes.quotes[ticker.toUpperCase()];
      if (!cached) return true;
      return now - cachedQuotes.timestamp > CACHE_DURATION_MS;
    });

    // If all tickers are cached, just update state from cache
    if (tickersToFetch.length === 0) {
      const cachedResult: Record<string, Quote> = {};
      tickers.forEach(ticker => {
        const upperTicker = ticker.toUpperCase();
        if (cachedQuotes.quotes[upperTicker]) {
          cachedResult[upperTicker] = cachedQuotes.quotes[upperTicker];
        }
      });
      setQuotes(prev => ({ ...prev, ...cachedResult }));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('Fetching quotes for:', tickersToFetch);

      const { data, error: fnError } = await supabase.functions.invoke('get-quotes', {
        body: { tickers: tickersToFetch },
      });

      if (fnError) {
        console.error('Edge function error:', fnError);
        throw new Error(fnError.message || 'Erro ao buscar cotações');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (!data?.quotes) {
        throw new Error('Resposta inválida da API');
      }

      // Update cache and state
      const newQuotes: Record<string, Quote> = {};
      data.quotes.forEach((quote: Quote) => {
        newQuotes[quote.ticker] = quote;
      });

      cacheRef.current = {
        quotes: { ...cachedQuotes.quotes, ...newQuotes },
        timestamp: now,
      };

      setQuotes(prev => ({ ...prev, ...newQuotes }));
      setLastUpdated(new Date());

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar cotações';
      setError(message);
      console.error('Error fetching quotes:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getQuote = useCallback((ticker: string): Quote | undefined => {
    return quotes[ticker.toUpperCase()];
  }, [quotes]);

  return {
    quotes,
    isLoading,
    error,
    lastUpdated,
    fetchQuotes,
    getQuote,
  };
}
