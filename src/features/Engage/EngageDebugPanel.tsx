import React, { useState, useEffect, useRef } from 'react';
import { getCachedExtensionId } from '../../lib/extension-bridge';

interface DebugState {
  extensionId: string | null;
  extensionInstalled: boolean;
  authTokenPresent: boolean;
  userDisplayName: string;
  isActive: boolean;
  linkedinOpen: boolean;
  lastHeartbeat: number | null;
}

export function EngageDebugPanel() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<DebugState>({
    extensionId: null,
    extensionInstalled: false,
    authTokenPresent: false,
    userDisplayName: '',
    isActive: false,
    linkedinOpen: false,
    lastHeartbeat: null,
  });
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    const update = async () => {
      if (!mountedRef.current) return;
      const extId = getCachedExtensionId();
      let installed = false;
      let status = null;
      try {
        const { isExtensionInstalled, queryExtensionStatus } = await import('../../lib/extension-bridge');
        installed = extId ? await isExtensionInstalled() : false;
        status = installed ? await queryExtensionStatus() : null;
      } catch {}
      if (!mountedRef.current) return;
      setState({
        extensionId: extId,
        extensionInstalled: installed,
        authTokenPresent: status?.connected ?? false,
        userDisplayName: status?.displayName ?? '',
        isActive: status?.isActive ?? false,
        linkedinOpen: status?.linkedinOpen ?? false,
        lastHeartbeat: status?.lastActionAt ?? null,
      });
    };
    update();
    const iv = setInterval(update, 5000);
    return () => clearInterval(iv);
  }, []);

  if (!open) {
    return (
      <div className="flex justify-end pt-4">
        <button onClick={() => setOpen(true)} className="text-xs text-muted hover:text-white transition-colors">
          Debug
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0D0D0D] border border-[#1f1f1f] rounded-xl p-4 space-y-2 font-mono text-xs mt-6">
      <div className="flex justify-between items-center">
        <span className="text-muted font-bold">Engage Debug Panel</span>
        <button onClick={() => setOpen(false)} className="text-muted hover:text-white transition-colors">✕</button>
      </div>
      <div className="space-y-1 text-muted">
        <div>Extension ID: <span className={state.extensionId ? 'text-teal-accent' : 'text-red-400'}>{state.extensionId || 'not detected'}</span></div>
        <div>Installed &amp; responding: <span className={state.extensionInstalled ? 'text-teal-accent' : 'text-red-400'}>{state.extensionInstalled ? 'yes' : 'no'}</span></div>
        <div>Auth token in extension: <span className={state.authTokenPresent ? 'text-teal-accent' : 'text-red-400'}>{state.authTokenPresent ? 'yes' : 'no'}</span></div>
        <div>User: {state.userDisplayName || '—'}</div>
        <div>Active: <span className={state.isActive ? 'text-teal-accent' : 'text-muted'}>{state.isActive ? 'yes' : 'no'}</span></div>
        <div>LinkedIn tab open: <span className={state.linkedinOpen ? 'text-teal-accent' : 'text-muted'}>{state.linkedinOpen ? 'yes' : 'no'}</span></div>
        <div>Last heartbeat: {state.lastHeartbeat ? new Date(state.lastHeartbeat).toLocaleTimeString() : '—'}</div>
      </div>
    </div>
  );
}