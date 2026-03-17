const BASE = ((import.meta as any).env?.BASE_URL || '/').replace(/\/$/, '');

const KNOWN_IMAGE_OVERRIDES: Array<{ pattern: RegExp; replacement: string }> = [
    {
        pattern: /(resident-evil-9\.png|re9_requiem\.svg|re-requiem-ps5-pack-01-en)/i,
        replacement: `${BASE}/assets/prizes/vault/resident-evil-9.png`
    },
    {
        pattern: /(nintendo-switch-2\.jpg|nintendo_switch2\.svg)/i,
        replacement: `${BASE}/assets/prizes/vault/nintendo-switch-2.jpg`
    },
    {
        pattern: /(ps5-pro-official\.jpg|ps5_pro\.svg|ps5-pro-product-thumbnail-01-en|ps5-pro-dualsense-image-block-01-en)/i,
        replacement: `${BASE}/assets/prizes/official/ps5-pro-official.jpg`
    },
    {
        // MacBook Air M4 — covers both old "Neo" naming and new M4 naming in CMS
        pattern: /(macbook-neo-official\.png|macbook_neo\.svg|macbook-neo-hero-202603|macbook-air-m4-official|macbook-air-13-m4|macbook-air-13-m5|macbook-air-m5-official|macbook-air-march-2025)/i,
        replacement: `${BASE}/assets/prizes/official/macbook-neo-official.png`
    },
    {
        pattern: /(ps-plus-official\.png|ps_plus_premium\.svg|TO8qsdJ4fIdCCYd2hgG4IBw9\.png)/i,
        replacement: `${BASE}/assets/prizes/official/ps-plus-official.png`
    },
    {
        pattern: /(xbox-game-pass-official\.jpg|gamepass_ultimate\.svg|3f5e4d1a-0fb2-4118-858c-80a4b91d53bc\.jpg|5dfc9e21-5f25-4a7b-aea0-0fbcc3787934\.jpg)/i,
        replacement: `${BASE}/assets/prizes/official/xbox-game-pass-official.jpg`
    }
];

const normalizePrizeImageUrl = (url: string): string => {
    if (!url) return url;

    let normalizedUrl = url;

    // Fix old/wrong GitHub Pages base path stored in CMS records.
    if (normalizedUrl.includes('mindfulgaminguk.github.io/raffle-engine/')) {
        normalizedUrl = normalizedUrl.replace(
            'mindfulgaminguk.github.io/raffle-engine/',
            'mindfulgaminguk.github.io/Mindful-Gaming-Raffle-Engine/'
        );
    }

    for (const override of KNOWN_IMAGE_OVERRIDES) {
        if (override.pattern.test(normalizedUrl)) {
            return override.replacement;
        }
    }

    return normalizedUrl;
};

/**
 * Formats a Wix Media URL into a static HTTPS URL.
 * Handles Wix internal media identifiers and normalizes broken CMS prize artwork.
 */
export const formatWixMediaUrl = (wixUrl: string, width = 800, height = 600, quality = 85): string => {
    if (!wixUrl) return wixUrl;

    const normalizedUrl = normalizePrizeImageUrl(wixUrl);
    if (!normalizedUrl.startsWith('wix:image://v1/')) {
        return normalizedUrl;
    }

    // Format: wix:image://v1/<image-id>/<filename>#originWidth=<w>&originHeight=<h>
    const parts = normalizedUrl.replace('wix:image://v1/', '').split('/');
    const imageId = parts[0];
    const filenameParts = parts[1].split('#');
    const filename = filenameParts[0];

    // Construct static URL
    // https://static.wixstatic.com/media/<image-id>/v1/fill/w_<w>,h_<h>,al_c,q_<q>,usm_0.66_1.00_0.01/<filename>
    return `https://static.wixstatic.com/media/${imageId}/v1/fill/w_${width},h_${height},al_c,q_${quality},usm_0.66_1.00_0.01/${filename}`;
};
