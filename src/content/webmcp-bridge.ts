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

  const postureToolDefinition: WebMCPTool = {
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
  };

  const postureHandler = async (params: Record<string, unknown>) => {
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
  };

  function broadcastTools() {
    window.postMessage(
      {
        source: 'IPHONE_DUO_WEBMCP_BRIDGE',
        type: 'WEBMCP_TOOLS_DISCOVERED',
        tools: discoveredTools
      },
      '*'
    );
  }

  // Polyfill navigator.modelContext if not present
  const nav = navigator as unknown as { modelContext?: WebMCPContext };
  if (!nav.modelContext && !(window as unknown as { modelContext?: WebMCPContext }).modelContext) {
    const toolsMap = new Map<string, WebMCPTool>();
    nav.modelContext = {
      registerTool(tool: WebMCPTool, handler?: unknown) {
        if (!discoveredTools.some((t) => t.name === tool.name)) {
          discoveredTools.push(tool);
        }
        toolsMap.set(tool.name, tool);
        broadcastTools();
        return { ...tool, execute: handler || (tool as unknown as { execute?: unknown }).execute };
      },
      getTools: async () => discoveredTools
    } as unknown as WebMCPContext;
  }

  const mcp: WebMCPContext | undefined =
    navigator.modelContext || (window as unknown as { modelContext?: WebMCPContext }).modelContext;

  // Add default iPhone Duo tool to discovered inventory
  discoveredTools.push(postureToolDefinition);

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
    try {
      mcp.registerTool(postureToolDefinition, postureHandler);
    } catch (err) {
      console.warn('[WebMCP] Native tool registration failed:', err);
    }

    // 2. Intercept registerTool to monitor other tools registered by the web application
    const originalRegisterTool = mcp.registerTool.bind(mcp);
    mcp.registerTool = function (toolDefinition, handler) {
      if (!discoveredTools.some((t) => t.name === toolDefinition.name)) {
        discoveredTools.push(toolDefinition);
      }
      broadcastTools();
      return originalRegisterTool(toolDefinition, handler);
    };
  }

  // Handle queries dispatched from DevTools
  window.addEventListener('message', (event) => {
    if (event.data?.type === 'IPHONE_DUO_DISCOVER_TOOLS') {
      broadcastTools();
    }
  });

  // Initial broadcast after DOM is ready
  broadcastTools();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', broadcastTools);
  }
})();
