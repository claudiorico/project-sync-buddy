/**
 * Vault Setup Component - Initial encryption password setup
 * Zero-Knowledge: password never leaves the client
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, Lock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSecureStorage } from '@/contexts/SecureStorageContext';

interface VaultSetupProps {
  onComplete: () => void;
}

export function VaultSetup({ onComplete }: VaultSetupProps) {
  const { initializeVault, isLoading } = useSecureStorage();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) return 'Mínimo de 8 caracteres';
    if (!/[A-Z]/.test(pwd)) return 'Inclua pelo menos uma letra maiúscula';
    if (!/[0-9]/.test(pwd)) return 'Inclua pelo menos um número';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validatePassword(password);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      await initializeVault(password);
      onComplete();
    } catch (err) {
      setError('Erro ao criar cofre seguro');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Criar Cofre Seguro
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Seus dados financeiros serão criptografados localmente
            </p>
          </div>

          {/* Zero-Knowledge Badge */}
          <div className="mb-6 flex items-center gap-3 rounded-lg bg-success-muted p-4">
            <Lock className="h-5 w-5 text-success" />
            <div className="text-sm">
              <p className="font-medium text-success">Zero-Knowledge</p>
              <p className="text-success/80">
                Nenhum dado financeiro sai do seu dispositivo
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Senha de Criptografia
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Confirmar Senha
              </label>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-loss-muted p-3 text-sm text-loss">
                <AlertTriangle className="h-4 w-4" />
                {error}
              </div>
            )}

            {/* Warning */}
            <div className="rounded-lg bg-warning-muted p-4 text-sm">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-warning" />
                <div className="text-warning">
                  <p className="font-medium">Importante</p>
                  <p className="mt-1 opacity-90">
                    Não há recuperação de senha. Se você esquecer, seus dados serão perdidos permanentemente.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              {isLoading ? 'Criando cofre...' : 'Criar Cofre Seguro'}
            </Button>
          </form>
        </div>

        {/* Privacy Footer */}
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Criptografia AES-256-GCM • Dados armazenados apenas no seu dispositivo
        </p>
      </motion.div>
    </div>
  );
}
