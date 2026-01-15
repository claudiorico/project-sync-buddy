import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface AllocationData {
  name: string;
  value: number;
  color: string;
  amount: number;
}

interface AllocationChartProps {
  data: AllocationData[];
  totalValue: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export function AllocationChart({ data, totalValue }: AllocationChartProps) {
  if (!data.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="rounded-xl border border-border bg-card p-6 shadow-card"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            Alocação por Carteira
          </h3>
          <p className="text-sm text-muted-foreground">
            Distribuição atual do portfólio
          </p>
        </div>
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          Nenhuma carteira cadastrada
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="rounded-xl border border-border bg-card p-6 shadow-card"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Alocação por Carteira
        </h3>
        <p className="text-sm text-muted-foreground">
          Distribuição atual do portfólio
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="h-[200px] w-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                formatter={(value: number, name: string, props: { payload: AllocationData }) => [
                  `${value}% - ${formatCurrency(props.payload.amount)}`,
                  props.payload.name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-3">
          {data.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-foreground">
                  {item.name}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-foreground tabular-nums">
                  {item.value}%
                </span>
                <span className="ml-2 text-xs text-muted-foreground tabular-nums">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
