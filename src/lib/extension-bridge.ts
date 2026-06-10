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

export function setCachedExtensionId(id: string): void {
  cachedExtensionId = id;
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
      resolve(null);
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

export function isExtensionInstalled(): Promise<boolean | null> {
  if (!cachedExtensionId) return Promise.resolve(null);
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

export function connectViaBridge(
  token: string,
  userId: string,
  displayName: string
): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    const TIMEOUT_MS = 10000;
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'SOMYRA_CONNECT_RESULT') {
        window.removeEventListener('message', handler);
        resolve({
          success: event.data.success,
          error: event.data.error,
        });
      }
    };
    window.addEventListener('message', handler);
    window.postMessage({
      type: 'SOMYRA_CONNECT',
      token,
      userId,
      displayName,
    }, window.location.origin);
    setTimeout(() => {
      window.removeEventListener('message', handler);
      resolve({ success: false, error: 'Connection timeout — extension not responding' });
    }, TIMEOUT_MS);
  });
}
