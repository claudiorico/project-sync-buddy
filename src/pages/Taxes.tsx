import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { FileText, Download, AlertTriangle, CheckCircle, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const taxData = {
  totalGain: 8450.32,
  taxDue: 1267.55,
  exemptDividends: 14120.00,
  taxableDividends: 1850.00,
  monthlyDARFs: [
    { month: "Janeiro", gain: 850.00, tax: 127.50, status: "paid" },
    { month: "Fevereiro", gain: 0, tax: 0, status: "exempt" },
    { month: "Março", gain: 1200.00, tax: 180.00, status: "paid" },
    { month: "Abril", gain: 0, tax: 0, status: "exempt" },
    { month: "Maio", gain: 2100.00, tax: 315.00, status: "pending" },
    { month: "Junho", gain: 0, tax: 0, status: "exempt" },
  ],
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const statusConfig = {
  paid: { label: "Pago", color: "text-success", bg: "bg-success/10", icon: CheckCircle },
  pending: { label: "Pendente", color: "text-warning", bg: "bg-warning/10", icon: AlertTriangle },
  exempt: { label: "Isento", color: "text-muted-foreground", bg: "bg-muted", icon: CheckCircle },
};

export default function Taxes() {
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
            <h1 className="text-2xl font-bold text-foreground">Imposto de Renda</h1>
            <p className="text-muted-foreground">
              Controle de DARF e preparação para DIRPF
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar Excel
            </Button>
            <Button className="gap-2">
              <FileText className="h-4 w-4" />
              Gerar Relatório IRPF
            </Button>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calculator className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Ganho de Capital</p>
            <p className="text-2xl font-bold text-foreground tabular-nums">
              {formatCurrency(taxData.totalGain)}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Imposto Devido</p>
            <p className="text-2xl font-bold text-warning tabular-nums">
              {formatCurrency(taxData.taxDue)}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Dividendos Isentos</p>
            <p className="text-2xl font-bold text-foreground tabular-nums">
              {formatCurrency(taxData.exemptDividends)}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-loss/10">
                <FileText className="h-5 w-5 text-loss" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">JCP Tributável</p>
            <p className="text-2xl font-bold text-foreground tabular-nums">
              {formatCurrency(taxData.taxableDividends)}
            </p>
          </div>
        </motion.div>

        {/* DARF Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card shadow-card"
        >
          <div className="border-b border-border p-6">
            <h3 className="text-lg font-semibold text-foreground">
              DARF Mensal
            </h3>
            <p className="text-sm text-muted-foreground">
              Controle de pagamento de imposto sobre ganho de capital
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Mês
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Ganho Líquido
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Imposto (15%)
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody>
                {taxData.monthlyDARFs.map((darf, index) => {
                  const config = statusConfig[darf.status as keyof typeof statusConfig];
                  const Icon = config.icon;

                  return (
                    <motion.tr
                      key={darf.month}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="border-b border-border/50 transition-colors hover:bg-muted/20"
                    >
                      <td className="px-6 py-4 font-medium text-foreground">
                        {darf.month}
                      </td>
                      <td className="px-4 py-4 text-right font-medium text-foreground tabular-nums">
                        {darf.gain > 0 ? formatCurrency(darf.gain) : "-"}
                      </td>
                      <td className="px-4 py-4 text-right font-medium text-foreground tabular-nums">
                        {darf.tax > 0 ? formatCurrency(darf.tax) : "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                            config.bg,
                            config.color
                          )}
                        >
                          <Icon className="h-3 w-3" />
                          {config.label}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {darf.status === "pending" && (
                          <Button size="sm" variant="outline">
                            Gerar DARF
                          </Button>
                        )}
                        {darf.status === "paid" && (
                          <Button size="sm" variant="ghost" className="text-muted-foreground">
                            Ver comprovante
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

        {/* IRPF Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid gap-4 md:grid-cols-3"
        >
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h4 className="font-semibold text-foreground mb-2">Bens e Direitos</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Declaração de posições em 31/12
            </p>
            <Button variant="outline" className="w-full gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h4 className="font-semibold text-foreground mb-2">Rendimentos Isentos</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Dividendos e LCI/LCA recebidos
            </p>
            <Button variant="outline" className="w-full gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h4 className="font-semibold text-foreground mb-2">Rendimentos Tributáveis</h4>
            <p className="text-sm text-muted-foreground mb-4">
              JCP e aluguéis recebidos
            </p>
            <Button variant="outline" className="w-full gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
