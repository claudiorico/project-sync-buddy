import { Bell, Search, Sun, Moon, User, Lock, Cloud, CloudOff, HardDrive } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PrivacyBadge } from "./PrivacyBadge";
import { useSecureStorage } from "@/contexts/SecureStorageContext";
import { BackupRestoreDialog } from "@/components/backup/BackupRestoreDialog";
import { isGoogleDriveConnected } from "@/lib/google-drive";
import { getSyncStatus } from "@/lib/backup";

export function Header() {
  const [isDark, setIsDark] = useState(false);
  const [syncConnected, setSyncConnected] = useState(false);
  const { lockVault } = useSecureStorage();

  useEffect(() => {
    setSyncConnected(isGoogleDriveConnected());
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const syncStatus = getSyncStatus();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar ativos, carteiras..."
            className="h-10 w-full border-0 bg-muted/50 pl-10 pr-4 text-sm focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
        <PrivacyBadge />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Sync Status & Backup */}
        <BackupRestoreDialog
          trigger={
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-lg"
                title={syncConnected ? "Google Drive conectado" : "Backup & Sync"}
              >
                {syncConnected ? (
                  <Cloud className="h-4 w-4 text-success" />
                ) : (
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                )}
                {syncStatus.autoSyncEnabled && syncConnected && (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-success animate-pulse" />
                )}
              </Button>
            </motion.div>
          }
        />

        {/* Lock Vault */}
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={lockVault}
            className="h-10 w-10 rounded-lg"
            title="Bloquear cofre"
          >
            <Lock className="h-4 w-4 text-muted-foreground" />
          </Button>
        </motion.div>

        {/* Theme Toggle */}
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-10 w-10 rounded-lg"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Moon className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </motion.div>

        {/* Notifications */}
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 rounded-lg"
          >
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
          </Button>
        </motion.div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="ml-2 flex h-10 items-center gap-3 rounded-lg px-2 hover:bg-muted"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                  JP
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start md:flex">
                <span className="text-sm font-medium">Usuário Local</span>
                <span className="text-xs text-muted-foreground">Zero-Knowledge</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={lockVault} className="text-warning">
              <Lock className="mr-2 h-4 w-4" />
              Bloquear Cofre
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
