/**
 * Vault Guard - Wrapper that ensures vault is unlocked before showing content
 * Handles the authentication flow for zero-knowledge architecture
 */

import { useState, useEffect } from 'react';
import { useSecureStorage } from '@/contexts/SecureStorageContext';
import { VaultSetup } from './VaultSetup';
import { VaultUnlock } from './VaultUnlock';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

interface VaultGuardProps {
  children: React.ReactNode;
}

export function VaultGuard({ children }: VaultGuardProps) {
  const { isInitialized, isUnlocked, isLoading } = useSecureStorage();
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    if (!isLoading && !isInitialized) {
      setShowSetup(true);
    }
  }, [isLoading, isInitialized]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
          >
            <Shield className="h-8 w-8 text-primary" />
          </motion.div>
          <p className="text-muted-foreground">Carregando cofre seguro...</p>
        </motion.div>
      </div>
    );
  }

  // Setup flow for new users
  if (showSetup || !isInitialized) {
    return (
      <VaultSetup
        onComplete={() => setShowSetup(false)}
      />
    );
  }

  // Unlock flow for returning users
  if (!isUnlocked) {
    return (
      <VaultUnlock
        onUnlock={() => {}}
        onReset={() => setShowSetup(true)}
      />
    );
  }

  // Vault is unlocked, show the app
  return <>{children}</>;
}
