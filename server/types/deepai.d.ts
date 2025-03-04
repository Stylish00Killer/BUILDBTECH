declare module 'deepai' {
  export function setApiKey(key: string): void;
  export function callStandardApi(endpoint: string, options: { text: string }): Promise<{ output_url: string }>;
}
