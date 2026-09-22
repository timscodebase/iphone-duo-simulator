import type { DuoPosture } from '../background/background';
import './overlay.css';

let overlayHost: HTMLDivElement | null = null;
let currentPosture: DuoPosture = 'reset';
let isCreaseVisible = true;
let isReservedRegionVisible = true;
let currentFoldAngle = 110;

function injectScript(filePath: string) {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL(filePath);
  script.type = 'module';
  (document.head || document.documentElement).appendChild(script);
  script.onload = () => script.remove();
}

// Inject WebMCP Bridge into MAIN execution world
injectScript('dist/webmcp-bridge.js');

function ensureOverlayHost(): HTMLDivElement {
  if (!overlayHost || !document.body.contains(overlayHost)) {
    overlayHost = document.createElement('div');
    overlayHost.id = 'iphone-duo-overlay-host';
    document.body.appendChild(overlayHost);
  }
  return overlayHost;
}

function updateVisualOverlays() {
  const host = ensureOverlayHost();
  host.innerHTML = '';
  document.body.classList.remove('duo-partially-folded');

  if (currentPosture === 'reset') {
    return;
  }

  // 1. Folded mode (Outer Display)
  if (currentPosture === 'folded') {
    const island = document.createElement('div');
    island.className = 'iphone-duo-outer-island';
    island.title = 'iPhone Duo Outer Corner Camera (Dynamic Island)';
    host.appendChild(island);
    return;
  }

  // 2. Unfolded (Flat) & 3. Partially Folded (Book Pose)
  if (currentPosture === 'unfolded' || currentPosture === 'partially_folded') {
    if (isReservedRegionVisible) {
      const reserved = document.createElement('div');
      reserved.className = 'iphone-duo-reserved-region';
      const badge = document.createElement('div');
      badge.className = 'iphone-duo-reserved-badge';
      badge.textContent = '40px Crease';
      reserved.appendChild(badge);
      host.appendChild(reserved);
    }

    if (isCreaseVisible) {
      const crease = document.createElement('div');
      crease.className = 'iphone-duo-crease';
      const badge = document.createElement('div');
      badge.className = 'iphone-duo-crease-badge';
      badge.textContent = 'Crease: 445pt';
      crease.appendChild(badge);
      host.appendChild(crease);
    }

    if (currentPosture === 'partially_folded') {
      document.body.classList.add('duo-partially-folded');
      const shadow = document.createElement('div');
      shadow.className = 'iphone-duo-spine-shadow';
      host.appendChild(shadow);

      // Book hinge perspective calculation
      const depthOffset = Math.sin(((180 - currentFoldAngle) * Math.PI) / 360) * 40;
      document.body.style.transform = `rotateY(${
        (180 - currentFoldAngle) * 0.08
      }deg) translateZ(-${depthOffset}px)`;
    } else {
      document.body.style.transform = '';
    }
  }
}

// Handle Messages from Background & DevTools Panel
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'SET_VIEW_OVERLAY') {
    currentPosture = message.posture;
    currentFoldAngle = message.angle ?? currentFoldAngle;
    isCreaseVisible = message.showCrease ?? isCreaseVisible;
    isReservedRegionVisible = message.showReservedRegion ?? isReservedRegionVisible;
    updateVisualOverlays();
    sendResponse({ ok: true });
  } else if (message.type === 'TOGGLE_CREASE_OVERLAY') {
    isCreaseVisible = message.showCrease;
    isReservedRegionVisible = message.showReservedRegion;
    updateVisualOverlays();
    sendResponse({ ok: true });
  } else if (message.type === 'QUERY_WEBMCP_STATE') {
    window.postMessage({ type: 'IPHONE_DUO_DISCOVER_TOOLS' }, '*');
    sendResponse({ ok: true });
  }
});

// Relay WebMCP messages from MAIN page context to DevTools Panel
window.addEventListener('message', (event) => {
  if (event.data?.source === 'IPHONE_DUO_WEBMCP_BRIDGE') {
    chrome.runtime.sendMessage(event.data);
  }
});
