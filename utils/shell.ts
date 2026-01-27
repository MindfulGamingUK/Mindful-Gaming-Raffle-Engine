import { ShellMode } from '../types';

/**
 * Determines if the SPA is running standalone or embedded within a Wix Site.
 * 
 * Priority:
 * 1. URL Param `?shell=standalone` (for dev/testing)
 * 2. Default: `EMBEDDED` (Safety first - avoids double headers in prod)
 */
export const getShellMode = (): ShellMode => {
  if (typeof window === 'undefined') return 'EMBEDDED';

  const params = new URLSearchParams(window.location.search);
  if (params.get('shell') === 'standalone') {
    return 'STANDALONE';
  }

  // Future: Check for specific Custom Element attributes if passed
  // const element = document.getElementById('mindful-raffle-root');
  // if (element?.getAttribute('mode') === 'standalone') return 'STANDALONE';

  return 'EMBEDDED';
};
