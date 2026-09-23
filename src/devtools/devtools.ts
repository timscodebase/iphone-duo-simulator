console.log('[iPhone Duo] Initializing DevTools panel...');

chrome.devtools.panels.create(
  'iPhone Duo',
  'dist/icons/icon-16.png',
  'dist/src/devtools/panel.html',
  (panel) => {
    console.log('[iPhone Duo] DevTools panel successfully registered:', panel);
    panel.onShown.addListener(() => {
      chrome.tabs.sendMessage(
        chrome.devtools.inspectedWindow.tabId,
        {
          type: 'QUERY_WEBMCP_STATE'
        },
        () => {
          void chrome.runtime.lastError;
        }
      );
    });
  }
);
