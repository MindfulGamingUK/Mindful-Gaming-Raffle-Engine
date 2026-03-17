import { authentication } from 'wix-members-frontend';

const RAFFLE_APP_COMPONENT_ID = '#raffleAppContainer';
const RAFFLE_APP_URL = 'https://mindfulgaminguk.github.io/Mindful-Gaming-Raffle-Engine/';
const LOGIN_BRIDGE_REQUEST = 'MGUK_MEMBERS_PROMPT_LOGIN';
const LOGIN_BRIDGE_ACK = 'MGUK_MEMBERS_PROMPT_LOGIN_ACK';
const LOGIN_BRIDGE_RESULT = 'MGUK_MEMBERS_LOGIN_RESULT';

$w.onReady(function () {
    let raffleApp;

    try {
        raffleApp = $w(RAFFLE_APP_COMPONENT_ID);
    } catch (error) {
        console.error(
            `Missing Wix HtmlComponent ${RAFFLE_APP_COMPONENT_ID}. ` +
            `Update the ID in win-to-support-page-code.js to match the live page element.`,
            error
        );
        return;
    }

    raffleApp.src = RAFFLE_APP_URL;

    raffleApp.onMessage((event) => {
        const message = event.data || {};
        if (message.type !== LOGIN_BRIDGE_REQUEST) return;

        // Step 1 — ACK immediately so the iframe stops retrying
        raffleApp.postMessage({ type: LOGIN_BRIDGE_ACK });

        // Step 2 — Open Wix member login modal
        authentication.promptLogin({ modal: true })
            .then(() => {
                // Login succeeded — tell the iframe
                raffleApp.postMessage({
                    type: LOGIN_BRIDGE_RESULT,
                    ok: true
                });
            })
            .catch((error) => {
                // User cancelled or error — tell the iframe so it can unblock
                raffleApp.postMessage({
                    type: LOGIN_BRIDGE_RESULT,
                    ok: false,
                    error: error instanceof Error ? error.message : 'Login cancelled'
                });
            });
    });
});
