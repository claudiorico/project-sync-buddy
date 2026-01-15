import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Plus, Filter, ArrowUpRight, ArrowDownLeft, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const transactions = [
  { id: 1, type: "buy", ticker: "PETR4", shares: 10, price: 38.12, date: "2024-01-10", total: 381.20 },
  { id: 2, type: "sell", ticker: "VALE3", shares: 5, price: 68.45, date: "2024-01-09", total: 342.25 },
  { id: 3, type: "dividend", ticker: "ITUB4", shares: 56, price: 0.45, date: "2024-01-08", total: 25.20 },
  { id: 4, type: "buy", ticker: "HGLG11", shares: 2, price: 164.50, date: "2024-01-05", total: 329.00 },
  { id: 5, type: "dividend", ticker: "HGLG11", shares: 10, price: 0.82, date: "2024-01-03", total: 8.20 },
  { id: 6, type: "buy", ticker: "WEGE3", shares: 8, price: 41.80, date: "2024-01-02", total: 334.40 },
  { id: 7, type: "buy", ticker: "IVVB11", shares: 1, price: 283.20, date: "2024-01-02", total: 283.20 },
  { id: 8, type: "dividend", ticker: "BBAS3", shares: 51, price: 0.38, date: "2024-01-01", total: 19.38 },
];

const typeConfig = {
  buy: {
    label: "Compra",
    icon: ArrowDownLeft,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  sell: {
    label: "Venda",
    icon: ArrowUpRight,
    color: "text-loss",
    bg: "bg-loss/10",
  },
  dividend: {
    label: "Provento",
    icon: Coins,
    color: "text-success",
    bg: "bg-success/10",
  },
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function Transactions() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">Movimentações</h1>
            <p className="text-muted-foreground">
              Histórico de compras, vendas e proventos
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtrar
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Movimentação
            </Button>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 sm:grid-cols-3"
        >
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ArrowDownLeft className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Compras (Jan)</p>
                <p className="text-xl font-bold text-foreground tabular-nums">
                  {formatCurrency(1327.80)}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-loss/10">
                <ArrowUpRight className="h-5 w-5 text-loss" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vendas (Jan)</p>
                <p className="text-xl font-bold text-foreground tabular-nums">
                  {formatCurrency(342.25)}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <Coins className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Proventos (Jan)</p>
                <p className="text-xl font-bold text-foreground tabular-nums">
                  {formatCurrency(52.78)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Transactions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card shadow-card"
        >
          <div className="divide-y divide-border">
            {transactions.map((tx, index) => {
              const config = typeConfig[tx.type as keyof typeof typeConfig];
              const Icon = config.icon;

              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-muted/20"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        config.bg
                      )}
                    >
                      <Icon className={cn("h-5 w-5", config.color)} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {tx.ticker}
                        </span>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-medium",
                            config.bg,
                            config.color
                          )}
                        >
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {tx.shares} {tx.type === "dividend" ? "cotas" : "ações"} a{" "}
                        {formatCurrency(tx.price)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground tabular-nums">
                      {tx.type === "sell" ? "-" : "+"}
                      {formatCurrency(tx.total)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(tx.date)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
