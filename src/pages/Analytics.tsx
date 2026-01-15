import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { TrendingUp, Target, BarChart3, PieChart } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const performanceData = [
  { month: "Jan", portfolio: 2.3, cdi: 0.9, ibov: 1.5 },
  { month: "Fev", portfolio: 1.8, cdi: 0.85, ibov: -0.5 },
  { month: "Mar", portfolio: 3.2, cdi: 0.95, ibov: 2.1 },
  { month: "Abr", portfolio: -0.5, cdi: 0.88, ibov: -1.2 },
  { month: "Mai", portfolio: 2.1, cdi: 0.92, ibov: 1.8 },
  { month: "Jun", portfolio: 4.5, cdi: 0.98, ibov: 3.2 },
  { month: "Jul", portfolio: 1.2, cdi: 0.95, ibov: 0.8 },
  { month: "Ago", portfolio: 2.8, cdi: 1.02, ibov: 2.5 },
  { month: "Set", portfolio: -1.2, cdi: 0.89, ibov: -2.1 },
  { month: "Out", portfolio: 3.5, cdi: 0.95, ibov: 2.8 },
  { month: "Nov", portfolio: 2.1, cdi: 0.92, ibov: 1.9 },
  { month: "Dez", portfolio: 4.2, cdi: 1.05, ibov: 3.8 },
];

const riskData = [
  { metric: "Retorno", value: 85 },
  { metric: "Volatilidade", value: 65 },
  { metric: "Sharpe", value: 78 },
  { metric: "Sortino", value: 72 },
  { metric: "Drawdown", value: 55 },
  { metric: "Consistência", value: 80 },
];

const metrics = [
  { label: "Retorno Total", value: "32.45%", change: "+8.2%", isPositive: true },
  { label: "Volatilidade", value: "12.8%", change: "-2.1%", isPositive: true },
  { label: "Sharpe Ratio", value: "1.85", change: "+0.32", isPositive: true },
  { label: "Max Drawdown", value: "-8.5%", change: "+1.2%", isPositive: true },
];

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">
            Análise de performance e métricas de risco
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="rounded-xl border border-border bg-card p-6 shadow-card"
            >
              <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold text-foreground tabular-nums">
                  {metric.value}
                </p>
                <span
                  className={`text-sm font-medium ${
                    metric.isPositive ? "text-success" : "text-loss"
                  }`}
                >
                  {metric.change}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Performance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-card"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Performance Mensal
                </h3>
                <p className="text-sm text-muted-foreground">
                  Retorno comparado com benchmarks
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span className="text-xs text-muted-foreground">Portfólio</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-chart-2" />
                  <span className="text-xs text-muted-foreground">CDI</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-chart-4" />
                  <span className="text-xs text-muted-foreground">IBOV</span>
                </div>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceData}
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
                    tickFormatter={(value) => `${value}%`}
                    width={50}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(214, 20%, 91%)",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value: number) => [`${value}%`, ""]}
                  />
                  <Line
                    type="monotone"
                    dataKey="portfolio"
                    stroke="hsl(152, 60%, 40%)"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, fill: "hsl(152, 60%, 40%)", stroke: "#fff", strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cdi"
                    stroke="hsl(200, 70%, 50%)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="ibov"
                    stroke="hsl(38, 92%, 50%)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Risk Radar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-border bg-card p-6 shadow-card"
          >
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                Perfil de Risco
              </h3>
              <p className="text-sm text-muted-foreground">
                Métricas de risco-retorno
              </p>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={riskData} cx="50%" cy="50%" outerRadius="80%">
                  <PolarGrid stroke="hsl(214, 20%, 91%)" />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fill: "hsl(215, 15%, 45%)", fontSize: 11 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  <Radar
                    dataKey="value"
                    stroke="hsl(152, 60%, 40%)"
                    fill="hsl(152, 60%, 40%)"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Benchmark Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-border bg-card p-6 shadow-card"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Comparativo com Benchmarks
            </h3>
            <p className="text-sm text-muted-foreground">
              Retorno acumulado no período
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Portfólio", value: 32.45, color: "bg-primary" },
              { name: "CDI", value: 11.25, color: "bg-chart-2" },
              { name: "IBOV", value: 22.8, color: "bg-chart-4" },
              { name: "S&P 500 (BRL)", value: 28.5, color: "bg-chart-3" },
            ].map((benchmark, index) => (
              <motion.div
                key={benchmark.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="rounded-lg border border-border/50 p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`h-3 w-3 rounded-full ${benchmark.color}`} />
                  <span className="text-sm font-medium text-foreground">
                    {benchmark.name}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground tabular-nums">
                  {benchmark.value > 0 ? "+" : ""}
                  {benchmark.value}%
                </p>
                <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(benchmark.value / 35) * 100}%` }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    className={`h-full rounded-full ${benchmark.color}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
