import { ShellMode } from '../types';

/**
 * Determines if the SPA is running standalone or embedded within a Wix Site.
 */
export const getShellMode = (): ShellMode => {
  if (typeof window === 'undefined') return 'EMBEDDED';

  // 1. Explicit URL Override (Dev)
  const params = new URLSearchParams(window.location.search);
  if (params.get('shell') === 'standalone') {
    return 'STANDALONE';
  }

  // 2. Global Config Injection (Production Wix Velo injection)
  if ((window as any).__MGUK_CONFIG__?.mode === 'STANDALONE') {
    return 'STANDALONE';
  }

  // 3. Attribute check on root (if passed via Custom Element props)
  const root = document.getElementById('root');
  if (root?.getAttribute('data-mode') === 'standalone') {
    return 'STANDALONE';
  }

  // Default to Embedded (Safety first - avoids double headers)
  return 'EMBEDDED';
};
