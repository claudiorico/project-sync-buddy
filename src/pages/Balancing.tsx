import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Calculator, ShoppingCart, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const assets = [
  { ticker: "PETR4", name: "Petrobras PN", price: 38.52, target: 10, current: 8.5, shares: 59 },
  { ticker: "VALE3", name: "Vale ON", price: 67.89, target: 8, current: 7.2, shares: 28 },
  { ticker: "ITUB4", name: "Itaú Unibanco PN", price: 32.15, target: 8, current: 6.8, shares: 56 },
  { ticker: "BBAS3", name: "Banco do Brasil ON", price: 28.45, target: 5, current: 5.5, shares: 51 },
  { ticker: "WEGE3", name: "WEG ON", price: 42.33, target: 4, current: 4.5, shares: 28 },
  { ticker: "HGLG11", name: "CSHG Logística", price: 165.80, target: 6, current: 6.2, shares: 10 },
  { ticker: "XPLG11", name: "XP Log", price: 102.45, target: 5, current: 4.8, shares: 12 },
  { ticker: "IVVB11", name: "iShares S&P 500", price: 285.60, target: 6, current: 7, shares: 6 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export default function Balancing() {
  const [investmentAmount, setInvestmentAmount] = useState("5000");
  const [isCalculating, setIsCalculating] = useState(false);

  const portfolioValue = 267500;

  const calculateRebalancing = () => {
    const amount = parseFloat(investmentAmount) || 0;
    
    return assets
      .map((asset) => {
        const diff = asset.target - asset.current;
        const currentValue = (asset.current / 100) * portfolioValue;
        const targetValue = (asset.target / 100) * (portfolioValue + amount);
        const neededValue = targetValue - currentValue;
        const suggestedShares = Math.max(0, Math.floor(neededValue / asset.price));
        const suggestedValue = suggestedShares * asset.price;

        return {
          ...asset,
          diff,
          neededValue: Math.max(0, neededValue),
          suggestedShares,
          suggestedValue,
          priority: diff > 0 ? diff : 0,
        };
      })
      .sort((a, b) => b.priority - a.priority);
  };

  const rebalancedAssets = calculateRebalancing();
  const totalSuggested = rebalancedAssets.reduce((acc, a) => acc + a.suggestedValue, 0);

  const handleRecalculate = () => {
    setIsCalculating(true);
    setTimeout(() => setIsCalculating(false), 500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">Balanceamento</h1>
            <p className="text-muted-foreground">
              Otimize suas alocações com compras inteligentes
            </p>
          </div>
        </motion.div>

        {/* Investment Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-6 shadow-card"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-foreground">
                Valor disponível para investir
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  R$
                </span>
                <Input
                  type="text"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value.replace(/\D/g, ""))}
                  className="h-12 pl-10 text-lg font-semibold tabular-nums"
                  placeholder="5000"
                />
              </div>
            </div>
            <Button
              onClick={handleRecalculate}
              className="h-12 gap-2 px-6"
              disabled={isCalculating}
            >
              <RefreshCw className={cn("h-4 w-4", isCalculating && "animate-spin")} />
              Recalcular
            </Button>
          </div>

          <div className="mt-4 flex items-center gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">Patrimônio atual: </span>
              <span className="font-semibold text-foreground tabular-nums">
                {formatCurrency(portfolioValue)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Sugestão de compra: </span>
              <span className="font-semibold text-primary tabular-nums">
                {formatCurrency(totalSuggested)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Rebalancing Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card shadow-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Ativo
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Preço
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    % Alvo
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    % Atual
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Diferença
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Qtd Sugerida
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Valor
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody>
                {rebalancedAssets.map((asset, index) => {
                  const isUnderAllocated = asset.diff > 0;
                  const isOverAllocated = asset.diff < 0;

                  return (
                    <motion.tr
                      key={asset.ticker}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="border-b border-border/50 transition-colors hover:bg-muted/20"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 font-mono text-sm font-bold text-primary">
                            {asset.ticker.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {asset.ticker}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {asset.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right font-medium text-foreground tabular-nums">
                        {formatCurrency(asset.price)}
                      </td>
                      <td className="px-4 py-4 text-right font-medium text-foreground tabular-nums">
                        {asset.target}%
                      </td>
                      <td className="px-4 py-4 text-right font-medium text-foreground tabular-nums">
                        {asset.current}%
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                            isUnderAllocated && "bg-loss-muted text-loss",
                            isOverAllocated && "bg-success-muted text-success",
                            !isUnderAllocated && !isOverAllocated && "bg-muted text-muted-foreground"
                          )}
                        >
                          {isUnderAllocated && <TrendingDown className="h-3 w-3" />}
                          {isOverAllocated && <TrendingUp className="h-3 w-3" />}
                          {asset.diff > 0 ? "-" : "+"}
                          {Math.abs(asset.diff).toFixed(1)}%
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-foreground tabular-nums">
                        {asset.suggestedShares > 0 ? asset.suggestedShares : "-"}
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-primary tabular-nums">
                        {asset.suggestedValue > 0
                          ? formatCurrency(asset.suggestedValue)
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {asset.suggestedShares > 0 && (
                          <Button size="sm" variant="outline" className="gap-1">
                            <ShoppingCart className="h-3 w-3" />
                            Comprar
                          </Button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
