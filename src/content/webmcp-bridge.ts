import type { WebMCPContext, WebMCPTool } from '../types/webmcp';

declare global {
  interface Window {
    __iPhoneDuoWebMCP?: {
      invokePostureTool: (posture: string, angle?: number) => Promise<unknown>;
      registeredTools: WebMCPTool[];
    };
  }
}

(function initWebMCPBridge() {
  const discoveredTools: WebMCPTool[] = [];

  const mcp: WebMCPContext | undefined =
    navigator.modelContext || (window as unknown as { modelContext?: WebMCPContext }).modelContext;

  // Expose test helper on window for DevTools and agent invocation
  window.__iPhoneDuoWebMCP = {
    registeredTools: discoveredTools,
    invokePostureTool: async (posture: string, angle = 110) => {
      window.postMessage(
        {
          type: 'APPLY_POSTURE',
          posture,
          angle
        },
        '*'
      );
      return { status: 'success', posture, angle };
    }
  };

  if (mcp && typeof mcp.registerTool === 'function') {
    // 1. Register iPhone Duo Posture Control as a tool for AI agents
    mcp.registerTool(
      {
        name: 'iphone_duo_set_posture',
        description:
          'Controls the simulated physical posture of the Apple iPhone Duo foldable device (folded, unfolded, partially_folded, split_view).',
        inputSchema: {
          type: 'object',
          properties: {
            posture: {
              type: 'string',
              enum: ['folded', 'unfolded', 'partially_folded', 'split_view'],
              description: 'The physical hardware configuration of the iPhone Duo.'
            },
            angle: {
              type: 'number',
              description: 'The opening angle in degrees when partially folded (between 60 and 160 degrees).'
            }
          },
          required: ['posture']
        }
      },
      async (params: Record<string, unknown>) => {
        const posture = String(params.posture);
        const angle = typeof params.angle === 'number' ? params.angle : 110;

        window.postMessage(
          {
            type: 'APPLY_POSTURE',
            posture,
            angle
          },
          '*'
        );

        return {
          content: [
            {
              type: 'text',
              text: `Successfully configured iPhone Duo posture to ${posture} (angle: ${angle}°).`
            }
          ]
        };
      }
    );

    // 2. Intercept registerTool to monitor other tools registered by the web application
    const originalRegisterTool = mcp.registerTool.bind(mcp);
    mcp.registerTool = function (toolDefinition, handler) {
      discoveredTools.push(toolDefinition);
      window.postMessage(
        {
          source: 'IPHONE_DUO_WEBMCP_BRIDGE',
          type: 'WEBMCP_TOOLS_DISCOVERED',
          tools: discoveredTools
        },
        '*'
      );
      return originalRegisterTool(toolDefinition, handler);
    };
  }

  // Handle queries dispatched from DevTools
  window.addEventListener('message', (event) => {
    if (event.data?.type === 'IPHONE_DUO_DISCOVER_TOOLS') {
      window.postMessage(
        {
          source: 'IPHONE_DUO_WEBMCP_BRIDGE',
          type: 'WEBMCP_TOOLS_DISCOVERED',
          tools: discoveredTools
        },
        '*'
      );
    }
  });
})();
