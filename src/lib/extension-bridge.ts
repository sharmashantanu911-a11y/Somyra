let cachedExtensionId: string | null = null;

export function listenForExtensionId(
  callback: (id: string) => void
): () => void {
  const handler = (event: MessageEvent) => {
    if (
      event.data?.type === 'SOMYRA_EXTENSION_INSTALLED' &&
      event.data?.extensionId
    ) {
      const extId = event.data.extensionId;
      if (extId !== cachedExtensionId) {
        cachedExtensionId = extId;
        callback(extId);
      }
    }
  };
  window.addEventListener('message', handler);
  return () => window.removeEventListener('message', handler);
}

export function getCachedExtensionId(): string | null {
  return cachedExtensionId;
}

export async function fetchExtensionIdFromConfig(
  supabaseUrl: string,
  anonKey: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `${supabaseUrl}/functions/v1/engage-config?key=chrome_extension_id`,
      { headers: { apikey: anonKey } }
    );
    const data = await res.json();
    if (data?.value) {
      cachedExtensionId = data.value;
      return data.value;
    }
  } catch {}
  return null;
}

export function sendToExtension(
  message: any
): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!cachedExtensionId) {
      reject(new Error('Extension ID not known'));
      return;
    }
    chrome.runtime.sendMessage(cachedExtensionId, message, (response: any) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(response);
      }
    });
  });
}

export function isExtensionInstalled(): Promise<boolean> {
  if (!cachedExtensionId) return Promise.resolve(false);
  return new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage(
        cachedExtensionId,
        { type: 'SOMYRA_PING' },
        (response: any) => {
          if (chrome.runtime.lastError) {
            resolve(false);
          } else {
            resolve(!!response?.installed);
          }
        }
      );
    } catch {
      resolve(false);
    }
  });
}

export function listenForSyncComplete(
  callback: (data: any) => void
): () => void {
  const handler = (event: MessageEvent) => {
    if (
      event.data?.type === 'SYNC_COMPLETE' &&
      event.data?.source === 'somyra-extension'
    ) {
      callback(event.data);
    }
  };
  window.addEventListener('message', handler);
  return () => window.removeEventListener('message', handler);
}

export function listenForConnectionStatus(
  callback: (status: string) => void
): () => void {
  const handler = (event: MessageEvent) => {
    if (
      event.data?.type === 'CONNECTION_STATUS' &&
      event.data?.source === 'somyra-extension'
    ) {
      callback(event.data.status);
    }
  };
  window.addEventListener('message', handler);
  return () => window.removeEventListener('message', handler);
}

export async function connectToExtension(
  token: string,
  userId: string,
  displayName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await sendToExtension({
      type: 'SOMYRA_AUTH',
      token,
      userId,
      displayName,
    });
    return response || { success: false, error: 'No response' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
