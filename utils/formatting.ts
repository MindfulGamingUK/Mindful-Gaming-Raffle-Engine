/**
 * Format a date string for UK display, always using Europe/London timezone.
 * Prevents off-by-one-day errors when the browser is in a non-UK timezone
 * or when a UTC midnight timestamp shifts to the previous day in GMT/BST.
 */
export const formatUKDate = (
  dateStr: string | undefined | null,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }
): string => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      ...options,
      timeZone: 'Europe/London'
    });
  } catch {
    return '';
  }
};

/**
 * Returns true if drawDate is on or before closeDate in Europe/London timezone.
 * Used to detect misconfigured CMS data.
 */
export const isDrawBeforeClose = (drawDate?: string, closeDate?: string): boolean => {
  if (!drawDate || !closeDate) return false;
  return new Date(drawDate) <= new Date(closeDate);
};

/**
 * Strict Age Calculation
 * Returns true only if the user is 18 or older based on exact date.
 */
export const isOver18 = (dobString?: string): boolean => {
    if (!dobString) return false;
    const today = new Date();
    const birthDate = new Date(dobString);
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    // Adjust if birthday hasn't occurred yet this year
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 18;
  };
  
  export const formatCurrency = (amount: number): string => {
    // Guard against NaN
    if (isNaN(amount)) return '£0.00';
    
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };
  
  export const calculateProgress = (sold: number, max: number): number => {
    if (max <= 0) return 0;
    if (sold < 0) return 0;
    
    const pct = (sold / max) * 100;
    
    // Safe clamp
    return Math.min(100, Math.max(0, pct)); 
  };
