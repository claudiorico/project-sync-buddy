import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  Plus,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import type { PortfolioWithAssets, AssetWithPrice } from '@/hooks/usePortfolios';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatPercent = (value: number) => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

interface PortfolioCardProps {
  portfolio: PortfolioWithAssets;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onAddAsset: () => void;
  onEditAsset: (asset: AssetWithPrice) => void;
  onDeleteAsset: (assetId: string) => void;
}

export function PortfolioCard({
  portfolio,
  index,
  onEdit,
  onDelete,
  onAddAsset,
  onEditAsset,
  onDeleteAsset,
}: PortfolioCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<string | null>(null);

  const allocationDiff = portfolio.currentAllocation - portfolio.targetAllocation;
  const isOverAllocated = allocationDiff > 0.5;
  const isUnderAllocated = allocationDiff < -0.5;

  const handleDeleteAsset = (assetId: string) => {
    setAssetToDelete(assetId);
  };

  const confirmDeleteAsset = () => {
    if (assetToDelete) {
      onDeleteAsset(assetToDelete);
      setAssetToDelete(null);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="rounded-xl border border-border bg-card shadow-card transition-shadow hover:shadow-card-hover"
      >
        {/* Header with color indicator */}
        <div
          className="h-1.5 rounded-t-xl"
          style={{ backgroundColor: portfolio.color }}
        />

        <div className="p-6">
          {/* Header */}
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground">{portfolio.name}</h3>
              {portfolio.description && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {portfolio.description}
                </p>
              )}
              <p className="text-2xl font-bold text-foreground tabular-nums mt-1">
                {formatCurrency(portfolio.currentValue)}
              </p>
              {portfolio.totalGain !== 0 && (
                <div className={cn(
                  "flex items-center gap-1 text-sm mt-0.5",
                  portfolio.totalGain >= 0 ? "text-success" : "text-loss"
                )}>
                  {portfolio.totalGain >= 0 ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
                  )}
                  <span className="tabular-nums font-medium">
                    {formatCurrency(portfolio.totalGain)}
                  </span>
                  <span className="text-muted-foreground">
                    ({formatPercent(portfolio.totalGainPercent)})
                  </span>
                </div>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onAddAsset}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Ativo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar Carteira
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setDeleteDialogOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir Carteira
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Allocation Progress */}
          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Alocação</span>
              <div className="flex items-center gap-2">
                <span className="tabular-nums font-medium text-foreground">
                  {portfolio.currentAllocation.toFixed(1)}%
                </span>
                <span className="text-muted-foreground">/</span>
                <span className="tabular-nums text-muted-foreground">
                  {portfolio.targetAllocation}%
                </span>
              </div>
            </div>
            <Progress
              value={
                portfolio.targetAllocation > 0
                  ? Math.min(
                      (portfolio.currentAllocation / portfolio.targetAllocation) * 100,
                      100
                    )
                  : 0
              }
              className="h-2"
            />
            <div className="text-xs">
              {isOverAllocated && (
                <span className="text-warning">
                  +{allocationDiff.toFixed(1)}% acima do alvo
                </span>
              )}
              {isUnderAllocated && (
                <span className="text-loss">
                  {allocationDiff.toFixed(1)}% abaixo do alvo
                </span>
              )}
              {!isOverAllocated && !isUnderAllocated && (
                <span className="text-success">No alvo</span>
              )}
            </div>
          </div>

          {/* Assets List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Ativos ({portfolio.assets.length})
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="h-6 px-2 text-xs"
              >
                {expanded ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Menos
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    Mais
                  </>
                )}
              </Button>
            </div>

            {portfolio.assets.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Nenhum ativo cadastrado
                </p>
                <Button variant="outline" size="sm" onClick={onAddAsset}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Ativo
                </Button>
              </div>
            ) : (
              <>
                {(expanded ? portfolio.assets : portfolio.assets.slice(0, 3)).map(
                  (asset) => {
                    const isPositive = asset.priceChangePercent >= 0;
                    return (
                      <div
                        key={asset.id}
                        className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm group"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              {asset.ticker}
                            </span>
                            <span className={cn(
                              "text-xs tabular-nums px-1.5 py-0.5 rounded",
                              isPositive 
                                ? "bg-success/10 text-success" 
                                : "bg-loss/10 text-loss"
                            )}>
                              {formatPercent(asset.priceChangePercent)}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {formatCurrency(asset.currentPrice)} × {asset.shares}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <div className="tabular-nums font-medium text-foreground">
                              {formatCurrency(asset.currentValue)}
                            </div>
                            <div className={cn(
                              "text-xs tabular-nums",
                              asset.gain >= 0 ? "text-success" : "text-loss"
                            )}>
                              {asset.gain >= 0 ? '+' : ''}{formatCurrency(asset.gain)}
                            </div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => onEditAsset(asset)}
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteAsset(asset.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
                {!expanded && portfolio.assets.length > 3 && (
                  <p className="text-center text-xs text-muted-foreground">
                    +{portfolio.assets.length - 3} ativos
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Delete Portfolio Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Carteira</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a carteira "{portfolio.name}"? Esta ação
              não pode ser desfeita e todos os ativos associados também serão
              removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Asset Dialog */}
      <AlertDialog
        open={!!assetToDelete}
        onOpenChange={() => setAssetToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Ativo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este ativo? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAsset}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
