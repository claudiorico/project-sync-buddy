/**
 * Hook for managing portfolios with encrypted local storage
 * Integrates real-time prices from Brapi
 */

import { useState, useEffect, useCallback } from 'react';
import { useSecureStorage } from '@/contexts/SecureStorageContext';
import { usePrices, type Quote } from '@/hooks/usePrices';
import type { Portfolio, Asset } from '@/types/financial';

export interface AssetWithPrice extends Asset {
  currentPrice: number;
  currentValue: number;
  gain: number;
  gainPercent: number;
  priceChange: number;
  priceChangePercent: number;
}

export interface PortfolioWithAssets extends Portfolio {
  assets: AssetWithPrice[];
  currentValue: number;
  currentAllocation: number;
  totalGain: number;
  totalGainPercent: number;
}

export function usePortfolios() {
  const {
    isUnlocked,
    getPortfolios,
    savePortfolio,
    deletePortfolio,
    getAssets,
    notifyDataChange,
  } = useSecureStorage();

  const { quotes, fetchQuotes, isLoading: isPricesLoading } = usePrices();

  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [portfoliosWithAssets, setPortfoliosWithAssets] = useState<PortfolioWithAssets[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allAssets, setAllAssets] = useState<Asset[]>([]);

  // Load portfolios and assets
  const loadPortfolios = useCallback(async () => {
    if (!isUnlocked) {
      setPortfolios([]);
      setPortfoliosWithAssets([]);
      setAllAssets([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [loadedPortfolios, loadedAssets] = await Promise.all([
        getPortfolios(),
        getAssets(),
      ]);

      setPortfolios(loadedPortfolios);
      setAllAssets(loadedAssets);

      // Fetch quotes for all tickers
      const tickers = loadedAssets
        .filter(a => ['stock', 'reit', 'etf'].includes(a.type))
        .map(a => a.ticker);
      
      if (tickers.length > 0) {
        await fetchQuotes(tickers);
      }
    } catch (err) {
      setError('Erro ao carregar portfólios');
      console.error('Error loading portfolios:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isUnlocked, getPortfolios, getAssets, fetchQuotes]);

  // Recalculate portfolios when quotes or assets change
  useEffect(() => {
    if (portfolios.length === 0 && allAssets.length === 0) {
      setPortfoliosWithAssets([]);
      return;
    }

    // Enrich assets with current prices
    const enrichedAssets: AssetWithPrice[] = allAssets.map((asset) => {
      const quote = quotes[asset.ticker.toUpperCase()];
      const currentPrice = quote?.price || asset.averagePrice;
      const currentValue = asset.shares * currentPrice;
      const costBasis = asset.shares * asset.averagePrice;
      const gain = currentValue - costBasis;
      const gainPercent = costBasis > 0 ? (gain / costBasis) * 100 : 0;

      return {
        ...asset,
        currentPrice,
        currentValue,
        gain,
        gainPercent,
        priceChange: quote?.change || 0,
        priceChangePercent: quote?.changePercent || 0,
      };
    });

    // Calculate total portfolio value
    const totalValue = enrichedAssets.reduce((sum, a) => sum + a.currentValue, 0);
    const totalCost = allAssets.reduce((sum, a) => sum + a.shares * a.averagePrice, 0);

    // Map portfolios with their enriched assets
    const enrichedPortfolios: PortfolioWithAssets[] = portfolios.map((portfolio) => {
      const assets = enrichedAssets.filter((a) => a.portfolioId === portfolio.id);
      const currentValue = assets.reduce((sum, a) => sum + a.currentValue, 0);
      const costBasis = assets.reduce((sum, a) => sum + a.shares * a.averagePrice, 0);
      const currentAllocation = totalValue > 0 ? (currentValue / totalValue) * 100 : 0;
      const totalGain = currentValue - costBasis;
      const totalGainPercent = costBasis > 0 ? (totalGain / costBasis) * 100 : 0;

      return {
        ...portfolio,
        assets,
        currentValue,
        currentAllocation,
        totalGain,
        totalGainPercent,
      };
    });

    setPortfoliosWithAssets(enrichedPortfolios);
  }, [portfolios, allAssets, quotes]);

  // Create new portfolio
  const createPortfolio = useCallback(
    async (data: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = Date.now();
      const newPortfolio: Portfolio = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };

      await savePortfolio(newPortfolio);
      notifyDataChange();
      await loadPortfolios();
      return newPortfolio;
    },
    [savePortfolio, notifyDataChange, loadPortfolios]
  );

  // Update existing portfolio
  const updatePortfolio = useCallback(
    async (id: string, data: Partial<Omit<Portfolio, 'id' | 'createdAt'>>) => {
      const existing = portfolios.find((p) => p.id === id);
      if (!existing) throw new Error('Portfolio não encontrado');

      const updated: Portfolio = {
        ...existing,
        ...data,
        updatedAt: Date.now(),
      };

      await savePortfolio(updated);
      notifyDataChange();
      await loadPortfolios();
      return updated;
    },
    [portfolios, savePortfolio, notifyDataChange, loadPortfolios]
  );

  // Remove portfolio
  const removePortfolio = useCallback(
    async (id: string) => {
      await deletePortfolio(id);
      notifyDataChange();
      await loadPortfolios();
    },
    [deletePortfolio, notifyDataChange, loadPortfolios]
  );

  // Load on mount and when vault unlocks
  useEffect(() => {
    loadPortfolios();
  }, [loadPortfolios]);

  // Refresh quotes periodically (every 5 minutes)
  useEffect(() => {
    if (!isUnlocked || allAssets.length === 0) return;

    const interval = setInterval(() => {
      const tickers = allAssets
        .filter(a => ['stock', 'reit', 'etf'].includes(a.type))
        .map(a => a.ticker);
      
      if (tickers.length > 0) {
        fetchQuotes(tickers);
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isUnlocked, allAssets, fetchQuotes]);

  return {
    portfolios,
    portfoliosWithAssets,
    isLoading: isLoading || isPricesLoading,
    error,
    createPortfolio,
    updatePortfolio,
    removePortfolio,
    refresh: loadPortfolios,
  };
}
