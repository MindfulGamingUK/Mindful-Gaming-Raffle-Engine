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
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };
  
  export const calculateProgress = (sold: number, max: number): number => {
    if (max <= 0) return 0;
    const pct = (sold / max) * 100;
    return Math.min(100, Math.max(0, pct)); // Clamp between 0-100
  };
