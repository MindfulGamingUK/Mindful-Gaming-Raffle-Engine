/**
 * Formats a Wix Media URL into a static HTTPS URL.
 * Handles wix:image:// and wix:vector:// formats.
 */
export const formatWixMediaUrl = (wixUrl: string, width = 800, height = 600, quality = 85): string => {
    if (!wixUrl) return wixUrl;
    // Fix old/wrong GitHub Pages base path stored in CMS records
    if (wixUrl.includes('mindfulgaminguk.github.io/raffle-engine/')) {
        wixUrl = wixUrl.replace('mindfulgaminguk.github.io/raffle-engine/', 'mindfulgaminguk.github.io/Mindful-Gaming-Raffle-Engine/');
    }
    if (!wixUrl.startsWith('wix:image://v1/')) {
        return wixUrl; // Return as-is if not a wix internal URL
    }

    // Format: wix:image://v1/<image-id>/<filename>#originWidth=<w>&originHeight=<h>
    const parts = wixUrl.replace('wix:image://v1/', '').split('/');
    const imageId = parts[0];
    const filenameParts = parts[1].split('#');
    const filename = filenameParts[0];

    // Construct static URL
    // https://static.wixstatic.com/media/<image-id>/v1/fill/w_<w>,h_<h>,al_c,q_<q>,usm_0.66_1.00_0.01/<filename>
    return `https://static.wixstatic.com/media/${imageId}/v1/fill/w_${width},h_${height},al_c,q_${quality},usm_0.66_1.00_0.01/${filename}`;
};
