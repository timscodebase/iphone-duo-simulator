export type DuoPosture = 'folded' | 'unfolded' | 'partially_folded' | 'split_view' | 'reset';

interface PostureConfig {
  width: number;
  height: number;
  deviceScaleFactor: number;
  mobile: boolean;
  screenOrientation: { angle: number; type: 'portraitPrimary' | 'portraitSecondary' | 'landscapePrimary' | 'landscapeSecondary' };
}

const POSTURE_CONFIGS: Record<Exclude<DuoPosture, 'reset'>, PostureConfig> = {
  folded: {
    width: 466,
    height: 678,
    deviceScaleFactor: 3,
    mobile: true,
    screenOrientation: { angle: 0, type: 'portraitPrimary' }
  },
  unfolded: {
    width: 890,
    height: 626,
    deviceScaleFactor: 3,
    mobile: true,
    screenOrientation: { angle: 90, type: 'landscapePrimary' }
  },
  partially_folded: {
    width: 890,
    height: 626,
    deviceScaleFactor: 3,
    mobile: true,
    screenOrientation: { angle: 90, type: 'landscapePrimary' }
  },
  split_view: {
    width: 445,
    height: 626,
    deviceScaleFactor: 3,
    mobile: true,
    screenOrientation: { angle: 90, type: 'landscapePrimary' }
  }
};

const DUO_USER_AGENT =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 27_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/27.0 Mobile/15E148 Safari/604.1 (iPhone Duo/Foldable)';

const activeDebuggers = new Set<number>();

async function ensureDebuggerAttached(tabId: number): Promise<void> {
  if (activeDebuggers.has(tabId)) return;
  try {
    await chrome.debugger.attach({ tabId }, '1.3');
    activeDebuggers.add(tabId);
    await chrome.debugger.sendCommand({ tabId }, 'Emulation.setTouchEmulationEnabled', {
      enabled: true,
      maxTouchPoints: 5
    });
  } catch (error) {
    console.warn(`Failed to attach debugger to tab ${tabId}:`, error);
  }
}

chrome.debugger.onDetach.addListener((source) => {
  if (source.tabId) {
    activeDebuggers.delete(source.tabId);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const tabId = message.tabId || sender.tab?.id;
  if (!tabId) {
    sendResponse({ ok: false, error: 'No active tab identifier found' });
    return false;
  }

  (async () => {
    try {
      if (message.type === 'APPLY_POSTURE') {
        const posture: DuoPosture = message.posture;

        if (posture === 'reset') {
          if (activeDebuggers.has(tabId)) {
            await chrome.debugger.sendCommand({ tabId }, 'Emulation.clearDeviceMetricsOverride');
            await chrome.debugger.sendCommand({ tabId }, 'Emulation.setUserAgentOverride', { userAgent: '' });
            await chrome.debugger.detach({ tabId });
            activeDebuggers.delete(tabId);
          }
          await chrome.tabs.sendMessage(tabId, { type: 'SET_VIEW_OVERLAY', posture: 'reset' });
          sendResponse({ ok: true, posture: 'reset' });
          return;
        }

        await ensureDebuggerAttached(tabId);
        const config = POSTURE_CONFIGS[posture];

        await chrome.debugger.sendCommand({ tabId }, 'Emulation.setDeviceMetricsOverride', {
          width: config.width,
          height: config.height,
          deviceScaleFactor: config.deviceScaleFactor,
          mobile: config.mobile,
          screenOrientation: config.screenOrientation
        });

        await chrome.debugger.sendCommand({ tabId }, 'Emulation.setUserAgentOverride', {
          userAgent: `${DUO_USER_AGENT} Posture/${posture}`
        });

        // Set experimental display hinge features when opened
        if (posture === 'unfolded' || posture === 'partially_folded') {
          try {
            await chrome.debugger.sendCommand({ tabId }, 'Emulation.setDisplayFeatures', {
              displayFeature: {
                orientation: 'vertical',
                offset: 445,
                maskLength: posture === 'partially_folded' ? 40 : 0
              }
            });
          } catch {
            // Emulation.setDisplayFeatures may be unsupported in some Chrome build channels
          }
        }

        await chrome.tabs.sendMessage(tabId, {
          type: 'SET_VIEW_OVERLAY',
          posture,
          angle: message.angle ?? 110,
          showCrease: message.showCrease ?? true,
          showReservedRegion: message.showReservedRegion ?? true
        });

        sendResponse({ ok: true, posture, dimensions: { width: config.width, height: config.height } });
      } else if (message.type === 'TOGGLE_CREASE_OVERLAY') {
        await chrome.tabs.sendMessage(tabId, message);
        sendResponse({ ok: true });
      }
    } catch (err: unknown) {
      sendResponse({ ok: false, error: (err as Error).message });
    }
  })();

  return true;
});
