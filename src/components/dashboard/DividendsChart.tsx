import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", proventos: 850 },
  { month: "Fev", proventos: 920 },
  { month: "Mar", proventos: 780 },
  { month: "Abr", proventos: 1100 },
  { month: "Mai", proventos: 950 },
  { month: "Jun", proventos: 1250 },
  { month: "Jul", proventos: 1180 },
  { month: "Ago", proventos: 1350 },
  { month: "Set", proventos: 890 },
  { month: "Out", proventos: 1420 },
  { month: "Nov", proventos: 1580 },
  { month: "Dez", proventos: 1850 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const totalProventos = data.reduce((acc, curr) => acc + curr.proventos, 0);

export function DividendsChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="rounded-xl border border-border bg-card p-6 shadow-card"
    >
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Proventos Recebidos
          </h3>
          <p className="text-sm text-muted-foreground">
            Histórico mensal de dividendos e JCP
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {formatCurrency(totalProventos)}
          </p>
          <p className="text-xs text-muted-foreground">Total no ano</p>
        </div>
      </div>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
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
                  maximumFractionDigits: 0,
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
              formatter={(value: number) => [formatCurrency(value), "Proventos"]}
              labelStyle={{ color: "hsl(220, 25%, 10%)", fontWeight: 600 }}
              cursor={{ fill: "hsl(152, 60%, 40%, 0.1)" }}
            />
            <Bar
              dataKey="proventos"
              fill="hsl(152, 60%, 40%)"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
