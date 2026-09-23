import type { DuoPosture } from '../background/background';
import type { WebMCPTool } from '../types/webmcp';

const tabId = chrome.devtools.inspectedWindow.tabId;

// DOM Elements
const postureStatus = document.getElementById('postureStatus') as HTMLDivElement;
const btnFolded = document.getElementById('btnFolded') as HTMLButtonElement;
const btnUnfolded = document.getElementById('btnUnfolded') as HTMLButtonElement;
const btnPartiallyFolded = document.getElementById('btnPartiallyFolded') as HTMLButtonElement;
const btnSplitView = document.getElementById('btnSplitView') as HTMLButtonElement;
const btnReset = document.getElementById('btnReset') as HTMLButtonElement;

const chkCrease = document.getElementById('chkCrease') as HTMLInputElement;
const chkReservedRegion = document.getElementById('chkReservedRegion') as HTMLInputElement;
const sliderAngle = document.getElementById('sliderAngle') as HTMLInputElement;
const angleValue = document.getElementById('angleValue') as HTMLElement;
const webmcpPill = document.getElementById('webmcpPill') as HTMLSpanElement;
const toolList = document.getElementById('toolList') as HTMLDivElement;
const btnRunAgentPostureTest = document.getElementById('btnRunAgentPostureTest') as HTMLButtonElement;

let currentPosture: DuoPosture = 'reset';

function updateActiveButton(activeBtn: HTMLButtonElement | null) {
  [btnFolded, btnUnfolded, btnPartiallyFolded, btnSplitView].forEach((btn) =>
    btn.classList.remove('active')
  );
  if (activeBtn) activeBtn.classList.add('active');
}

async function sendPosture(posture: DuoPosture, angle?: number) {
  currentPosture = posture;
  postureStatus.textContent = `Applying ${posture}...`;

  const payload = {
    type: 'APPLY_POSTURE',
    tabId,
    posture,
    angle: angle ?? parseInt(sliderAngle.value, 10),
    showCrease: chkCrease.checked,
    showReservedRegion: chkReservedRegion.checked
  };

  // Persist state
  chrome.storage.local.set({ 
    lastPosture: posture, 
    lastAngle: payload.angle,
    showCrease: chkCrease.checked,
    showReservedRegion: chkReservedRegion.checked 
  });

  chrome.runtime.sendMessage(payload, (res) => {
    if (res?.ok) {
      postureStatus.textContent = `Active: ${posture.toUpperCase()}`;
    } else {
      postureStatus.textContent = `Error: ${res?.error || 'Unknown'}`;
    }
  });
}

btnFolded.addEventListener('click', () => {
  updateActiveButton(btnFolded);
  sendPosture('folded');
});

btnUnfolded.addEventListener('click', () => {
  updateActiveButton(btnUnfolded);
  sendPosture('unfolded');
});

btnPartiallyFolded.addEventListener('click', () => {
  updateActiveButton(btnPartiallyFolded);
  sendPosture('partially_folded', parseInt(sliderAngle.value, 10));
});

btnSplitView.addEventListener('click', () => {
  updateActiveButton(btnSplitView);
  sendPosture('split_view');
});

btnReset.addEventListener('click', () => {
  updateActiveButton(null);
  sendPosture('reset');
});

sliderAngle.addEventListener('input', () => {
  const deg = sliderAngle.value;
  angleValue.textContent = `${deg}°`;
  
  // Prime the value in storage even if not active
  chrome.storage.local.set({ lastAngle: parseInt(deg, 10) });

  if (currentPosture === 'partially_folded') {
    sendPosture('partially_folded', parseInt(deg, 10));
  }
});

function syncGuides() {
  chrome.tabs.sendMessage(
    tabId,
    {
      type: 'TOGGLE_CREASE_OVERLAY',
      showCrease: chkCrease.checked,
      showReservedRegion: chkReservedRegion.checked
    },
    () => {
      void chrome.runtime.lastError;
    }
  );
  
  chrome.storage.local.set({ 
    showCrease: chkCrease.checked, 
    showReservedRegion: chkReservedRegion.checked 
  });
}

chkCrease.addEventListener('change', syncGuides);
chkReservedRegion.addEventListener('change', syncGuides);

// WebMCP Discovery Listeners
window.addEventListener('message', (event) => {
  if (event.data?.type === 'WEBMCP_TOOLS_DISCOVERED' && Array.isArray(event.data.tools)) {
    renderWebMCPTools(event.data.tools);
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === 'WEBMCP_TOOLS_DISCOVERED' && Array.isArray(message.tools)) {
    renderWebMCPTools(message.tools);
  }
});

function renderWebMCPTools(tools: WebMCPTool[]) {
  if (!tools || tools.length === 0) {
    webmcpPill.textContent = 'None';
    webmcpPill.classList.remove('active');
    toolList.innerHTML = '<div class="empty-state">No client-side WebMCP tools detected on this page.</div>';
    return;
  }

  webmcpPill.textContent = `${tools.length} Registered`;
  webmcpPill.classList.add('active');

  toolList.innerHTML = tools
    .map(
      (tool) => `
    <div class="tool-item">
      <div class="tool-name">${tool.name}</div>
      <div class="tool-desc">${tool.description || 'No description provided'}</div>
    </div>`
    )
    .join('');
}

function syncWebMCPFromPage() {
  chrome.devtools.inspectedWindow.eval(
    `(() => {
      const duo = (window).__iPhoneDuoWebMCP?.registeredTools;
      if (Array.isArray(duo) && duo.length > 0) return duo;
      return null;
    })()`,
    (tools, isException) => {
      if (!isException && Array.isArray(tools) && tools.length > 0) {
        renderWebMCPTools(tools as WebMCPTool[]);
      }
    }
  );
}

btnRunAgentPostureTest.addEventListener('click', () => {
  chrome.devtools.inspectedWindow.eval(`
    if (window.__iPhoneDuoWebMCP) {
      window.__iPhoneDuoWebMCP.invokePostureTool('partially_folded', 105);
    } else {
      console.warn('WebMCP Duo bridge is not active on this page.');
    }
  `);
});

// Initialization: Restore state & Sync
async function init() {
  const state = await chrome.storage.local.get(['lastPosture', 'lastAngle', 'showCrease', 'showReservedRegion']);
  
  if (state.lastAngle) {
    sliderAngle.value = state.lastAngle.toString();
    angleValue.textContent = `${state.lastAngle}°`;
  }
  
  if (state.showCrease !== undefined) chkCrease.checked = state.showCrease;
  if (state.showReservedRegion !== undefined) chkReservedRegion.checked = state.showReservedRegion;

  if (state.lastPosture && state.lastPosture !== 'reset') {
    const posture = state.lastPosture as DuoPosture;
    
    // Update UI buttons
    const btnMap: Record<DuoPosture, HTMLButtonElement | null> = {
      folded: btnFolded,
      unfolded: btnUnfolded,
      partially_folded: btnPartiallyFolded,
      split_view: btnSplitView,
      reset: null
    };
    updateActiveButton(btnMap[posture]);
    
    // Apply the posture
    sendPosture(posture, state.lastAngle);
  }

  chrome.tabs.sendMessage(tabId, { type: 'QUERY_WEBMCP_STATE' }, (response) => {
    if (chrome.runtime.lastError) return;
    if (response?.tools && Array.isArray(response.tools)) {
      renderWebMCPTools(response.tools);
    }
  });

  syncWebMCPFromPage();
  const syncInterval = setInterval(syncWebMCPFromPage, 2000);
  setTimeout(() => clearInterval(syncInterval), 15000);
}

init();
