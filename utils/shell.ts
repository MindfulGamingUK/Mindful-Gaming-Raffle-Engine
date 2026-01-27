import { ShellMode } from '../types';
import { getConfig } from './config';

/**
 * Determines if the SPA is running standalone or embedded within a Wix Site.
 * Priority:
 * 1. URL Param (Dev override: ?shell=standalone)
 * 2. Window Config (Wix Velo Injection)
 * 3. DOM Attribute (Custom Element Prop data-mode="standalone")
 * 4. Default to EMBEDDED
 */
export const getShellMode = (): ShellMode => {
  if (typeof window === 'undefined') return 'EMBEDDED';

  // 1. Explicit URL Override
  const params = new URLSearchParams(window.location.search);
  if (params.get('shell') === 'standalone') {
    return 'STANDALONE';
  }

  // 2. Global Config Injection
  const config = getConfig();
  if (config.mode === 'STANDALONE') {
    return 'STANDALONE';
  }

  // 3. Attribute check on root (if passed via Custom Element props)
  const root = document.getElementById('root');
  if (root?.getAttribute('data-mode') === 'standalone') {
    return 'STANDALONE';
  }

  return 'EMBEDDED';
};