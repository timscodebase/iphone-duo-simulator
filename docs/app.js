// ==========================================================================
// iPhone Duo DevTools Simulator — Public Site Interactive Playground
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const phone = document.getElementById('phoneChassis');
  const postureBtns = document.querySelectorAll('.posture-btn');
  const angleSliderBox = document.getElementById('angleSliderBox');
  const angleSlider = document.getElementById('angleSlider');
  const angleValue = document.getElementById('angleValue');
  const toggleCrease = document.getElementById('toggleCrease');
  const toggleReserved = document.getElementById('toggleReserved');
  const hingeCrease = document.getElementById('hingeCrease');
  const reservedZone = document.getElementById('reservedZone');
  const copyBtn = document.getElementById('copyBtn');
  const codeBlock = document.getElementById('codeBlock');

  const screenLeft = document.querySelector('.screen-left');
  const screenRight = document.querySelector('.screen-right');
  const leftSubtitle = document.getElementById('leftSubtitle');
  const rightSubtitle = document.getElementById('rightSubtitle');
  const postureStatusText = document.getElementById('postureStatusText');

  let currentPosture = 'unfolded';

  // Posture Configurations
  const configs = {
    unfolded: {
      leftSub: 'Primary Canvas (445 × 626 pt)',
      rightSub: 'Secondary Canvas (445 × 626 pt)',
      status: 'Unfolded 7.6" Flat (890 × 626 pt @3x)'
    },
    folded: {
      leftSub: 'Outer Screen (466 × 678 pt)',
      rightSub: '',
      status: 'Folded 5.4" Outer Display'
    },
    'partially-folded': {
      leftSub: 'Book Left Angle (Reading Surface)',
      rightSub: 'Book Right Angle (Input Surface)',
      status: 'Partially Folded (Book / Laptop Pose)'
    },
    'split-view': {
      leftSub: 'App 1 Split (445 × 626 pt)',
      rightSub: 'App 2 Split (445 × 626 pt)',
      status: 'Split View Multitasking'
    }
  };

  // Set Posture Function
  function setPosture(posture) {
    currentPosture = posture;

    // Update button states
    postureBtns.forEach(btn => {
      if (btn.dataset.posture === posture) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Reset phone classes
    phone.className = 'phone-chassis ' + posture;

    // Reset custom inline transforms
    screenLeft.style.transform = '';
    screenRight.style.transform = '';

    // Show/hide angle slider
    if (posture === 'partially-folded') {
      angleSliderBox.style.display = 'inline-flex';
      updateAngleTransform(parseInt(angleSlider.value, 10));
    } else {
      angleSliderBox.style.display = 'none';
    }

    // Update screen text
    const config = configs[posture];
    if (config) {
      leftSubtitle.textContent = config.leftSub;
      rightSubtitle.textContent = config.rightSub;
      if (postureStatusText) postureStatusText.textContent = config.status;
    }
  }

  // Calculate 3D Fold Angle Transform
  function updateAngleTransform(angle) {
    if (currentPosture !== 'partially-folded') return;
    angleValue.textContent = `${angle}°`;
    const halfDelta = (180 - angle) / 2;
    screenLeft.style.transform = `rotateY(${halfDelta * 0.8}deg)`;
    screenRight.style.transform = `rotateY(-${halfDelta * 0.8}deg)`;
  }

  // Posture button event listeners
  postureBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setPosture(btn.dataset.posture);
    });
  });

  // Angle slider input listener
  if (angleSlider) {
    angleSlider.addEventListener('input', (e) => {
      updateAngleTransform(parseInt(e.target.value, 10));
    });
  }

  // Crease guide toggle
  if (toggleCrease && hingeCrease) {
    toggleCrease.addEventListener('change', (e) => {
      hingeCrease.style.display = e.target.checked ? 'block' : 'none';
    });
  }

  // Reserved region toggle
  if (toggleReserved && reservedZone) {
    toggleReserved.addEventListener('change', (e) => {
      reservedZone.style.display = e.target.checked ? 'block' : 'none';
    });
  }

  // Copy code snippet
  if (copyBtn && codeBlock) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(codeBlock.innerText.trim());
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.style.color = '#30D158';
        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.style.color = '';
        }, 2000);
      } catch {
        // Fallback if clipboard api is blocked
      }
    });
  }

  // Register live demo tool if navigator.modelContext is available
  function registerSiteWebMCPTools() {
    const nav = navigator;
    const mcp = nav.modelContext || (typeof window !== 'undefined' ? window.modelContext : undefined);
    if (mcp && typeof mcp.registerTool === 'function') {
      try {
        mcp.registerTool({
          name: 'iphone_duo_docs_assistant',
          description: 'Official iPhone Duo documentation companion tool for inspecting foldable postures.',
          inputSchema: {
            type: 'object',
            properties: {
              targetPosture: {
                type: 'string',
                enum: ['folded', 'unfolded', 'partially-folded', 'split-view'],
                description: 'The posture to switch the interactive documentation stage to.'
              }
            },
            required: ['targetPosture']
          }
        }, async (params) => {
          if (params?.targetPosture) {
            setPosture(params.targetPosture);
            return {
              content: [{
                type: 'text',
                text: `Switched interactive playground posture to ${params.targetPosture}.`
              }]
            };
          }
          return { content: [{ type: 'text', text: `Current posture is ${currentPosture}.` }] };
        });
      } catch (_) {
        // Native modelContext registration caught safely
      }
    }
  }

  registerSiteWebMCPTools();
  window.addEventListener('load', registerSiteWebMCPTools);

  // Initial posture
  setPosture('unfolded');
});

