export interface WebMCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties?: Record<string, unknown>;
    required?: string[];
  };
}

export interface WebMCPContext {
  registerTool: (
    definition: WebMCPTool,
    handler: (params: Record<string, unknown>) => Promise<{ content: Array<{ type: string; text: string }> }>
  ) => void;
  getTools?: () => Promise<WebMCPTool[]>;
}

declare global {
  interface Navigator {
    modelContext?: WebMCPContext;
  }
}
