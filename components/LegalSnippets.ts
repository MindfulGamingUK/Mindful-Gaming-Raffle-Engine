/**
 * LegalSnippets.ts — Single source of truth for all in-app legal text.
 * Update here, flows everywhere (ComplianceBlock, footer, receipts, emails).
 */

export const LEGAL = {
  CHARITY_ID:       'Mindful Gaming UK (Charity No. 1212285)',
  LOTTERY_REG:      'Registered with Birmingham City Council (Ref: 213653)',
  PROMOTER_NAME:    'Mindful Gaming UK',
  PROMOTER_ADDRESS: '5 Longmoor Road, Sutton Coldfield, B73 6UB',
  PROMOTER_EMAIL:   'info@mindfulgaminguk.org',

  NOT_A_DONATION:
    'Entry is a purchase of a chance, not a donation. Not Gift Aid eligible.',
  AGE_RESIDENCY:
    '18+ only. GB residents only.',
  ENTRY_NOTE:
    'Entries support the charity\'s gaming disorder awareness and support work.',
  SAFER_PLAY:
    'Please play responsibly. If gambling causes you concern, visit BeGambleAware.org or GamCare.org.uk.',

  // Short versions for tight UI spaces
  NOT_A_DONATION_SHORT: 'Not a donation. Not Gift Aid eligible.',
  AGE_RESIDENCY_SHORT:  '18+ · GB only',
} as const;

export type LegalKey = keyof typeof LEGAL;
