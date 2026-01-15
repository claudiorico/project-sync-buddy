/**
 * Google Drive Integration - Zero-Knowledge
 * 
 * Encrypted data is synced to user's personal Google Drive
 * Google only sees encrypted blobs, never plaintext financial data
 */

const GOOGLE_DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/userinfo.email';
const BACKUP_FILENAME = 'investpro-vault.encrypted';

export interface GoogleDriveConfig {
  clientId: string;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  userEmail: string | null;
}

// Store config in localStorage (tokens only, no financial data)
const CONFIG_KEY = 'investpro_gdrive_config';
const PENDING_TOKEN_KEY = 'investpro_gdrive_pending';

export function getGoogleDriveConfig(): GoogleDriveConfig | null {
  const stored = localStorage.getItem(CONFIG_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function setGoogleDriveConfig(config: GoogleDriveConfig): void {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function clearGoogleDriveConfig(): void {
  localStorage.removeItem(CONFIG_KEY);
}

export function isGoogleDriveConnected(): boolean {
  const config = getGoogleDriveConfig();
  return !!(config?.accessToken && config.expiresAt && config.expiresAt > Date.now());
}

/**
 * Fetch user's email from Google API
 */
async function fetchUserEmail(accessToken: string): Promise<string | null> {
  try {
    const response = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.email || null;
  } catch {
    return null;
  }
}

/**
 * Check for pending OAuth token from redirect flow
 */
export async function checkPendingOAuthToken(clientId: string): Promise<boolean> {
  const pending = localStorage.getItem(PENDING_TOKEN_KEY);
  if (!pending) return false;
  
  try {
    const { access_token, expires_in, timestamp } = JSON.parse(pending);
    
    // Check if token is still valid (not expired and not too old)
    const tokenAge = Date.now() - timestamp;
    if (tokenAge > 5 * 60 * 1000) { // 5 minutes max
      localStorage.removeItem(PENDING_TOKEN_KEY);
      return false;
    }
    
    // Get user email to identify the backup
    const userEmail = await fetchUserEmail(access_token);
    
    // Save the config
    const config: GoogleDriveConfig = {
      clientId,
      accessToken: access_token,
      refreshToken: null,
      expiresAt: Date.now() + (expires_in * 1000),
      userEmail,
    };
    setGoogleDriveConfig(config);
    localStorage.removeItem(PENDING_TOKEN_KEY);
    
    return true;
  } catch {
    localStorage.removeItem(PENDING_TOKEN_KEY);
    return false;
  }
}

/**
 * Get pending OAuth client ID if stored
 */
export function getPendingClientId(): string | null {
  return localStorage.getItem('investpro_gdrive_pending_clientid');
}

export function setPendingClientId(clientId: string): void {
  localStorage.setItem('investpro_gdrive_pending_clientid', clientId);
}

export function clearPendingClientId(): void {
  localStorage.removeItem('investpro_gdrive_pending_clientid');
}

/**
 * Initialize Google OAuth2 flow
 * Uses popup to avoid leaving the app, with fallback for blocked popups
 */
export async function initiateGoogleAuth(clientId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const redirectUri = `${window.location.origin}/auth/google/callback.html`;
    const scope = encodeURIComponent(GOOGLE_DRIVE_SCOPE);
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=token&` +
      `scope=${scope}&` +
      `include_granted_scopes=true`;

    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    // Store client ID for fallback flow
    setPendingClientId(clientId);
    
    const popup = window.open(
      authUrl,
      'google-auth',
      `width=${width},height=${height},left=${left},top=${top},popup=1`
    );
    
    // Check if popup was blocked
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      // Popup blocked - open in same window as fallback
      clearPendingClientId();
      reject(new Error('Popup bloqueado. Habilite popups para este site ou tente novamente.'));
      return;
    }
    
    // Listen for message from popup
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data?.type === 'google-auth-success') {
        window.removeEventListener('message', handleMessage);
        clearInterval(checkClosed);
        clearPendingClientId();
        
        try { popup.close(); } catch {}
        
        const { access_token, expires_in } = event.data;
        
        // Get user email for identification
        fetchUserEmail(access_token).then(userEmail => {
          const config: GoogleDriveConfig = {
            clientId,
            accessToken: access_token,
            refreshToken: null,
            expiresAt: Date.now() + (expires_in * 1000),
            userEmail,
          };
          setGoogleDriveConfig(config);
          resolve(access_token);
        }).catch(() => {
          const config: GoogleDriveConfig = {
            clientId,
            accessToken: access_token,
            refreshToken: null,
            expiresAt: Date.now() + (expires_in * 1000),
            userEmail: null,
          };
          setGoogleDriveConfig(config);
          resolve(access_token);
        });
      } else if (event.data?.type === 'google-auth-error') {
        window.removeEventListener('message', handleMessage);
        clearInterval(checkClosed);
        clearPendingClientId();
        
        try { popup.close(); } catch {}
        reject(new Error(event.data.error || 'Falha na autenticação'));
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    // Check if popup was closed without auth
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', handleMessage);
        
        // Check if we have a pending token from redirect flow
        const pending = localStorage.getItem(PENDING_TOKEN_KEY);
        if (pending) {
          // Token was saved via redirect, will be processed on page load
          resolve('pending');
        } else {
          clearPendingClientId();
          reject(new Error('Autenticação cancelada'));
        }
      }
    }, 500);
    
    // Timeout after 5 minutes
    setTimeout(() => {
      clearInterval(checkClosed);
      window.removeEventListener('message', handleMessage);
      clearPendingClientId();
      if (!popup.closed) {
        try { popup.close(); } catch {}
      }
      reject(new Error('Tempo limite de autenticação excedido'));
    }, 5 * 60 * 1000);
  });
}

/**
 * Upload encrypted backup to Google Drive AppData folder
 * AppData is hidden from user's Drive UI - only this app can access
 * Each user has their own backup file identified by their email
 */
export async function uploadToGoogleDrive(encryptedData: string): Promise<void> {
  const config = getGoogleDriveConfig();
  if (!config?.accessToken) {
    throw new Error('Not authenticated with Google Drive');
  }
  
  // First, check if file exists
  const existingFileId = await findBackupFile(config.accessToken);
  const fileName = getBackupFileName();
  
  const metadata = {
    name: fileName,
    mimeType: 'application/json',
    parents: existingFileId ? undefined : ['appDataFolder'],
  };
  
  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append(
    'file',
    new Blob([encryptedData], { type: 'application/json' })
  );
  
  const url = existingFileId
    ? `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=multipart`
    : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
  
  const response = await fetch(url, {
    method: existingFileId ? 'PATCH' : 'POST',
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
    },
    body: form,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to upload to Google Drive');
  }
}

/**
 * Download encrypted backup from Google Drive
 */
export async function downloadFromGoogleDrive(): Promise<string | null> {
  const config = getGoogleDriveConfig();
  if (!config?.accessToken) {
    throw new Error('Not authenticated with Google Drive');
  }
  
  const fileId = await findBackupFile(config.accessToken);
  if (!fileId) {
    return null;
  }
  
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    {
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to download from Google Drive');
  }
  
  return response.text();
}

/**
 * Find existing backup file in AppData folder
 * Each user (identified by email) has their own backup file
 */
async function findBackupFile(accessToken: string): Promise<string | null> {
  const config = getGoogleDriveConfig();
  const userEmail = config?.userEmail || 'default';
  const fileName = `${BACKUP_FILENAME}-${btoa(userEmail).replace(/[^a-zA-Z0-9]/g, '')}`;
  
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${fileName}'&fields=files(id,name,modifiedTime)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  
  if (!response.ok) {
    return null;
  }
  
  const data = await response.json();
  return data.files?.[0]?.id || null;
}

/**
 * Get the backup filename for the current user
 */
function getBackupFileName(): string {
  const config = getGoogleDriveConfig();
  const userEmail = config?.userEmail || 'default';
  return `${BACKUP_FILENAME}-${btoa(userEmail).replace(/[^a-zA-Z0-9]/g, '')}`;
}

/**
 * Get last sync time from Google Drive
 */
export async function getLastSyncTime(): Promise<number | null> {
  const config = getGoogleDriveConfig();
  if (!config?.accessToken) {
    return null;
  }
  
  const fileName = getBackupFileName();
  
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${fileName}'&fields=files(id,modifiedTime)`,
    {
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
      },
    }
  );
  
  if (!response.ok) {
    return null;
  }
  
  const data = await response.json();
  const file = data.files?.[0];
  
  return file ? new Date(file.modifiedTime).getTime() : null;
}

/**
 * Get the connected user's email
 */
export function getConnectedUserEmail(): string | null {
  const config = getGoogleDriveConfig();
  return config?.userEmail || null;
}
