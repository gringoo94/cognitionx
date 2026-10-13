import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { Writable } from "node:stream";
import { AppProviders, AppShell } from "./App";

/**
 * Build-time prerender entry (used by vite-plugin-seo.ts, never shipped to the
 * browser). Waits for all lazy routes/Suspense boundaries (onAllReady) and
 * returns the page markup for #root.
 */
export function render(url: string, timeoutMs = 15000): Promise<string> {
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
        else resolve(html);
      },
    });
    const stream = renderToPipeableStream(
      <AppProviders helmetContext={{}}>
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
