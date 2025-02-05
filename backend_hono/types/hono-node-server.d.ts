// Minimal custom type definitions for '@hono/node-server'
declare module '@hono/node-server' {
  export function serve(options: { fetch: (request: Request) => Promise<Response>; port?: number }): void;
  export function serveStatic(options: { root: string }): any;
}