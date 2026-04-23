(() => {
  if (window.__mgukMuseumBridgeLoaded) {
    return;
  }

  window.__mgukMuseumBridgeLoaded = true;

  const host =
    'https://mindfulgaminguk.github.io/Mindful-Gaming-Raffle-Engine/museum/?v=2026-04-22-museum-cleanup-3';
  const origin = 'https://mindfulgaminguk.github.io';
  const canonical = '/gaming-encyclopedia';
  const museumHref = 'https://www.mindfulgaminguk.org/gaming-encyclopedia';
  const homeCtaId = 'mguk-museum-home-cta';

  function injectStyles() {
    if (document.getElementById('mguk-museum-bridge-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'mguk-museum-bridge-styles';
    style.textContent = `
      #${homeCtaId} {
        position: absolute;
        left: 50%;
        top: 76%;
        transform: translateX(-50%);
        z-index: 8;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        border: 1px solid rgba(186, 218, 85, 0.36);
        border-radius: 999px;
        background: rgba(6, 19, 27, 0.72);
        box-shadow: 0 16px 44px rgba(0, 0, 0, 0.28);
        backdrop-filter: blur(10px);
      }

      #${homeCtaId} span {
        color: #f2f6da;
        font: 600 11px/1.2 avenir-lt-w01_85-heavy1475544, sans-serif;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        white-space: nowrap;
      }

      #${homeCtaId} a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 10px 16px;
        border-radius: 999px;
        background: #d9f06d;
        color: #0c1821;
        font: 700 13px/1 avenir-lt-w01_85-heavy1475544, sans-serif;
        letter-spacing: 0.04em;
        text-decoration: none;
        white-space: nowrap;
      }

      @media (max-width: 640px) {
        #${homeCtaId} {
          top: auto;
          bottom: 18px;
          width: calc(100% - 36px);
          padding: 12px;
          flex-direction: column;
          gap: 10px;
          text-align: center;
        }

        #${homeCtaId} span {
          white-space: normal;
        }

        #${homeCtaId} a {
          width: 100%;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function cleanPath() {
    return (window.location.pathname || '').replace(/\/+$/, '') || '/';
  }

  function params() {
    try {
      return new URLSearchParams(window.location.search);
    } catch (error) {
      return new URLSearchParams('');
    }
  }

  function isLegacyMuseumRoute() {
    return cleanPath() === '/win-to-support' && params().get('view') === 'museum';
  }

  function isMuseumPage() {
    return cleanPath() === '/gaming-encyclopedia' || isLegacyMuseumRoute();
  }

  function isHomePage() {
    return cleanPath() === '/';
  }

  function redirectLegacyMuseumRoute() {
    if (!isLegacyMuseumRoute()) {
      return false;
    }

    const query = params();
    const cacheBuster = query.get('cb');
    const suffix = cacheBuster ? `?cb=${encodeURIComponent(cacheBuster)}` : '';
    window.location.replace(`${canonical}${suffix}`);
    return true;
  }

  function isMuseumFrame(frame) {
    const src = frame.getAttribute('src') || '';
    return (
      src.includes('Mindful-Gaming-Raffle-Engine/museum') ||
      src.includes('Mindful-Gaming-Raffle-Engine%2Fmuseum') ||
      src.includes('museum-standalone.js') ||
      src.includes('Mindful%20Gaming%20Museum') ||
      src.includes('Mindful Gaming Museum')
    );
  }

  function findMuseumFrame() {
    const frames = Array.from(document.querySelectorAll('iframe'));
    return frames.find(isMuseumFrame) || (cleanPath() === '/gaming-encyclopedia' && frames.length === 1 ? frames[0] : null);
  }

  function widenMobile(node) {
    if (window.innerWidth > 640 || !node || !node.style) {
      return;
    }

    node.style.left = '0px';
    node.style.marginLeft = '0px';
    node.style.marginRight = '0px';
    node.style.width = '100vw';
    node.style.maxWidth = '100vw';
  }

  function expandAncestors(frame, height) {
    let node = frame;
    let level = 0;

    while (node && node !== document.body && level < 16) {
      if (node.style) {
        node.style.height = `${height}px`;
        node.style.minHeight = `${height}px`;
        if (level > 0) {
          node.style.overflow = 'visible';
        }
        widenMobile(node);
      }
      node = node.parentElement;
      level += 1;
    }
  }

  function setFrameHeight(frame, height) {
    const resolved = Math.max(900, Math.min(60000, Math.ceil(Number(height) || 11450)));
    frame.style.height = `${resolved}px`;
    frame.style.minHeight = `${resolved}px`;
    frame.setAttribute('height', String(resolved));
    expandAncestors(frame, resolved);
  }

  function replaceTextInRoot(root, replacements) {
    if (!root || !window.NodeFilter) {
      return false;
    }

    let changed = false;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const nodes = [];

    while (walker.nextNode()) {
      nodes.push(walker.currentNode);
    }

    nodes.forEach((node) => {
      const current = node.nodeValue;
      let next = current;

      replacements.forEach(([pattern, replacement]) => {
        next = next.replace(pattern, replacement);
      });

      if (next !== current) {
        node.nodeValue = next;
        changed = true;
      }
    });

    return changed;
  }

  function fixHomeCopy() {
    if (!isHomePage()) {
      return false;
    }

    return replaceTextInRoot(document.body, [
      [/afftected/g, 'affected'],
      [/Know How to Play Videogames in a Healthy way/g, 'How to Play Video Games in a Healthy Way'],
      [/Who Is Affected by Gaming Dosorders\?/g, 'Who Is Affected by Gaming Disorders?'],
      [/dive deeper into drives us/g, 'dive deeper into what drives us'],
      [/making donation,/g, 'making a donation,'],
      [
        /Would you like to know more about who we are and how to support persons affected by gaming disorders/g,
        'Would you like to know more about who we are and how to support people affected by gaming disorders?',
      ],
    ]);
  }

  function fixHomeLinks() {
    if (!isHomePage()) {
      return false;
    }

    let changed = false;

    Array.from(document.querySelectorAll('a[href]')).forEach((link) => {
      const href = link.getAttribute('href') || '';
      const text = (link.textContent || '').trim();

      if (/mindfulclinicalcourses\.co\.uk\/?$/i.test(href) && text === '(Now Live!)') {
        link.setAttribute('href', 'https://www.mindfultheorydriving.org/');
        link.href = 'https://www.mindfultheorydriving.org/';
        link.target = '_blank';
        link.rel = 'noreferrer noopener';
        changed = true;
      }
    });

    return changed;
  }

  function ensureHomeMuseumCta() {
    if (!isHomePage()) {
      return false;
    }

    const existing = document.getElementById(homeCtaId);
    if (existing) {
      return true;
    }

    const hero =
      document.querySelector('#comp-m7orgtxq1inlineContent-gridContainer') ||
      document.querySelector('#comp-m7orgtxq1');

    if (!hero) {
      return false;
    }

    if (window.getComputedStyle(hero).position === 'static') {
      hero.style.position = 'relative';
    }

    const wrapper = document.createElement('div');
    wrapper.id = homeCtaId;

    const eyebrow = document.createElement('span');
    eyebrow.textContent = 'New on Mindful Gaming UK';

    const link = document.createElement('a');
    link.href = museumHref;
    link.target = '_self';
    link.textContent = 'Explore the Museum';
    link.setAttribute('aria-label', 'Explore the Mindful Gaming Museum');

    wrapper.appendChild(eyebrow);
    wrapper.appendChild(link);
    hero.appendChild(wrapper);
    return true;
  }

  function patchHomePage() {
    fixHomeCopy();
    fixHomeLinks();
    ensureHomeMuseumCta();
  }

  function patchMuseumPage() {
    if (!isMuseumPage()) {
      return false;
    }

    if (redirectLegacyMuseumRoute()) {
      return true;
    }

    const frame = findMuseumFrame();
    if (!frame) {
      return false;
    }

    if (frame.src !== host) {
      frame.src = host;
    }

    frame.title = 'The Mindful Gaming Museum';
    frame.loading = 'eager';
    frame.style.width = '100%';
    frame.style.maxWidth = '100%';
    frame.style.border = '0';
    frame.style.display = 'block';
    frame.style.background = '#06131b';
    if (window.innerWidth <= 640) {
      frame.style.left = '0px';
    }
    setFrameHeight(frame, 11450);
    return true;
  }

  function patch() {
    patchHomePage();
    patchMuseumPage();
  }

  window.addEventListener('message', (event) => {
    if (event.origin !== origin) {
      return;
    }

    const data = event.data || {};
    if (data.type !== 'mguk-museum-height') {
      return;
    }

    const frame = findMuseumFrame();
    if (frame) {
      setFrameHeight(frame, data.height);
    }
  });

  function start() {
    injectStyles();
    patch();

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      patch();
      if (attempts >= 60) {
        window.clearInterval(timer);
      }
    }, 500);

    if ('MutationObserver' in window) {
      new MutationObserver(() => {
        patch();
      }).observe(document.documentElement, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
