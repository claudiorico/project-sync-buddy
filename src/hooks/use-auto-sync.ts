/**
 * Auto-sync hook for automatic Google Drive backup
 * Syncs encrypted data automatically on changes
 */

import { useEffect, useRef, useCallback } from 'react';
import { useSecureStorage } from '@/contexts/SecureStorageContext';
import { uploadToGoogleDrive, isGoogleDriveConnected } from '@/lib/google-drive';
import { updateSyncStatus, getSyncStatus } from '@/lib/backup';
import { toast } from '@/hooks/use-toast';

const DEBOUNCE_MS = 5000; // Wait 5 seconds after last change before syncing

export function useAutoSync() {
  const { isUnlocked, exportEncryptedBackup } = useSecureStorage();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isSyncingRef = useRef(false);
  
  const performSync = useCallback(async () => {
    if (isSyncingRef.current || !isUnlocked || !isGoogleDriveConnected()) {
      return;
    }
    
    const status = getSyncStatus();
    if (!status.autoSyncEnabled) {
      return;
    }
    
    isSyncingRef.current = true;
    
    try {
      const encryptedData = await exportEncryptedBackup();
      await uploadToGoogleDrive(encryptedData);
      
      updateSyncStatus({
        lastSyncAt: Date.now(),
        provider: 'google_drive',
      });
      
      console.log('[AutoSync] Backup completed successfully');
    } catch (error) {
      console.error('[AutoSync] Backup failed:', error);
      toast({
        title: 'Sync failed',
        description: 'Could not backup to Google Drive. Will retry later.',
        variant: 'destructive',
      });
    } finally {
      isSyncingRef.current = false;
    }
  }, [isUnlocked, exportEncryptedBackup]);
  
  const scheduleSync = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      performSync();
    }, DEBOUNCE_MS);
  }, [performSync]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);
  
  return {
    scheduleSync,
    syncNow: performSync,
    isSyncing: isSyncingRef.current,
  };
}
