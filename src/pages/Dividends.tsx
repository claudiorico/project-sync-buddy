import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Coins, TrendingUp, Calendar } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const monthlyData = [
  { month: "Jan", dividendos: 850, jcp: 120 },
  { month: "Fev", dividendos: 920, jcp: 85 },
  { month: "Mar", dividendos: 680, jcp: 100 },
  { month: "Abr", dividendos: 950, jcp: 150 },
  { month: "Mai", dividendos: 820, jcp: 130 },
  { month: "Jun", dividendos: 1100, jcp: 150 },
  { month: "Jul", dividendos: 1050, jcp: 130 },
  { month: "Ago", dividendos: 1200, jcp: 150 },
  { month: "Set", dividendos: 780, jcp: 110 },
  { month: "Out", dividendos: 1280, jcp: 140 },
  { month: "Nov", dividendos: 1400, jcp: 180 },
  { month: "Dez", dividendos: 1650, jcp: 200 },
];

const recentDividends = [
  { ticker: "ITUB4", type: "JCP", value: 0.45, date: "2024-01-08", shares: 56, total: 25.20 },
  { ticker: "HGLG11", type: "Rendimento", value: 0.82, date: "2024-01-03", shares: 10, total: 8.20 },
  { ticker: "BBAS3", type: "Dividendo", value: 0.38, date: "2024-01-01", shares: 51, total: 19.38 },
  { ticker: "PETR4", type: "Dividendo", value: 1.12, date: "2023-12-28", shares: 59, total: 66.08 },
  { ticker: "XPLG11", type: "Rendimento", value: 0.75, date: "2023-12-20", shares: 12, total: 9.00 },
  { ticker: "VALE3", type: "Dividendo", value: 2.15, date: "2023-12-15", shares: 28, total: 60.20 },
];

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
  });
};

const totalAnnual = monthlyData.reduce((acc, m) => acc + m.dividendos + m.jcp, 0);
const avgMonthly = totalAnnual / 12;

export default function Dividends() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-foreground">Proventos</h1>
          <p className="text-muted-foreground">
            Dividendos, JCP e rendimentos recebidos
          </p>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 sm:grid-cols-3"
        >
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <Coins className="h-5 w-5 text-success" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Total Anual
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground tabular-nums">
              {formatCurrency(totalAnnual)}
            </p>
            <div className="mt-2 flex items-center gap-1 text-sm text-success">
              <TrendingUp className="h-4 w-4" />
              <span>+18.5% vs. ano anterior</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Média Mensal
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground tabular-nums">
              {formatCurrency(avgMonthly)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Últimos 12 meses
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <TrendingUp className="h-5 w-5 text-warning" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Yield on Cost
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground tabular-nums">
              6.8%
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Sobre preço médio
            </p>
          </div>
        </motion.div>

        {/* Charts and Recent */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Monthly Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-border bg-card p-6 shadow-card"
          >
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                Proventos por Mês
              </h3>
              <p className="text-sm text-muted-foreground">
                Dividendos e JCP recebidos
              </p>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(214, 20%, 91%)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(215, 15%, 45%)", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(215, 15%, 45%)", fontSize: 12 }}
                    tickFormatter={(value) =>
                      new Intl.NumberFormat("pt-BR", {
                        notation: "compact",
                      }).format(value)
                    }
                    width={50}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(214, 20%, 91%)",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value: number, name: string) => [
                      formatCurrency(value),
                      name === "dividendos" ? "Dividendos" : "JCP",
                    ]}
                    cursor={{ fill: "hsl(152, 60%, 40%, 0.1)" }}
                  />
                  <Bar
                    dataKey="dividendos"
                    fill="hsl(152, 60%, 40%)"
                    radius={[4, 4, 0, 0]}
                    stackId="stack"
                  />
                  <Bar
                    dataKey="jcp"
                    fill="hsl(200, 70%, 50%)"
                    radius={[4, 4, 0, 0]}
                    stackId="stack"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Dividendos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-chart-2" />
                <span className="text-sm text-muted-foreground">JCP</span>
              </div>
            </div>
          </motion.div>

          {/* Recent Dividends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-border bg-card p-6 shadow-card"
          >
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                Últimos Recebidos
              </h3>
              <p className="text-sm text-muted-foreground">
                Proventos mais recentes
              </p>
            </div>

            <div className="space-y-4">
              {recentDividends.map((dividend, index) => (
                <motion.div
                  key={`${dividend.ticker}-${dividend.date}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 font-mono text-sm font-bold text-success">
                      {dividend.ticker.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {dividend.ticker}
                        </span>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          {dividend.type}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {dividend.shares} cotas × {formatCurrency(dividend.value)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success tabular-nums">
                      +{formatCurrency(dividend.total)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(dividend.date)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
