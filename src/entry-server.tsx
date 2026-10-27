import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router";
import { Writable } from "node:stream";
import { AppProviders, AppShell } from "./App";

/**
 * Build-time prerender entry (used by vite-plugin-seo.ts, never shipped to the
 * browser). Waits for all lazy routes/Suspense boundaries (onAllReady) and
 * returns the page markup for #root.
 */
/** Separates page markup from Helmet JSON-LD scripts in render() output. */
export const SCHEMA_SPLIT = "<!--seo-schema-->";

export function render(url: string, timeoutMs = 15000): Promise<string> {
  const helmetContext: { helmet?: { script?: { toString(): string } } } = {};
  return new Promise((resolve, reject) => {
    let html = "";
    let failed: unknown = null;
    const sink = new Writable({
      write(chunk, _enc, cb) {
        html += chunk.toString();
        cb();
      },
      final(cb) {
        cb();
        if (failed) reject(failed);
        else resolve(html + SCHEMA_SPLIT + (helmetContext.helmet?.script?.toString() ?? ""));
      },
    });
    const stream = renderToPipeableStream(
      <AppProviders helmetContext={helmetContext}>
        <StaticRouter location={url}>
          <AppShell />
        </StaticRouter>
      </AppProviders>,
      {
        onAllReady() {
          stream.pipe(sink);
        },
        onShellError(err) {
          reject(err);
        },
        onError(err) {
          failed = err;
        },
      },
    );
    setTimeout(() => {
      stream.abort();
      reject(new Error(`prerender timeout for ${url}`));
    }, timeoutMs);
  });
}
