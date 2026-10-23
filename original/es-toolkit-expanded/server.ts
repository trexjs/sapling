/**
 * Server-oriented helpers using standard Node.js-compatible APIs where possible.
 * Node-specific imports are avoided so consumers choose their own runtime adapters.
 */
import { randomBytes, createHash, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile, rename, unlink, stat } from "node:fs/promises";
import { dirname, resolve, relative, isAbsolute } from "node:path";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { createGzip, createGunzip } from "node:zlib";
import { pipeline } from "node:stream/promises";
import { Readable, Writable } from "node:stream";

export const randomId = (bytes = 16): string => randomBytes(bytes).toString("hex");
export const sha256 = (value: string | Uint8Array): string => createHash("sha256").update(value).digest("hex");
export const sha256Base64 = (value: string | Uint8Array): string => createHash("sha256").update(value).digest("base64");
export function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a), right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
export const resolveWithin = (root: string, candidate: string): string => {
  const base = resolve(root), target = resolve(base, candidate), rel = relative(base, target);
  if (rel.startsWith("..") || isAbsolute(rel)) throw new Error("Path escapes configured root");
  return target;
};
export async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, "utf8")) as T;
}
export async function writeJson(path: string, value: unknown, pretty = true): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(value, null, pretty ? 2 : 0), "utf8");
}
export async function writeFileAtomic(path: string, content: string | Uint8Array): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  const temp = `${path}.${randomId(6)}.tmp`;
  try { await writeFile(temp, content); await rename(temp, path); }
  catch (error) { await unlink(temp).catch(() => undefined); throw error; }
}
export async function fileExists(path: string): Promise<boolean> {
  try { await stat(path); return true; } catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return false; throw error; }
}
export async function gzip(input: Readable, output: Writable): Promise<void> {
  await pipeline(input, createGzip(), output);
}
export async function gunzip(input: Readable, output: Writable): Promise<void> {
  await pipeline(input, createGunzip(), output);
}
export async function collectStream(stream: Readable, maxBytes = 10 * 1024 * 1024): Promise<Buffer> {
  const chunks: Buffer[] = [];
  let length = 0;
  for await (const chunk of stream) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    length += buffer.length;
    if (length > maxBytes) throw new Error(`Stream exceeds ${maxBytes} bytes`);
    chunks.push(buffer);
  }
  return Buffer.concat(chunks, length);
}
export function parseCookies(header = ""): Record<string, string> {
  const result: Record<string, string> = Object.create(null);
  for (const item of header.split(";")) {
    const index = item.indexOf("=");
    if (index < 0) continue;
    const key = item.slice(0, index).trim(), value = item.slice(index + 1).trim();
    if (key) { try { result[key] = decodeURIComponent(value); } catch { result[key] = value; } }
  }
  return result;
}
export function serializeCookie(name: string, value: string, options: {
  maxAge?: number; expires?: Date; path?: string; domain?: string; secure?: boolean;
  httpOnly?: boolean; sameSite?: "Strict" | "Lax" | "None";
} = {}): string {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (options.maxAge !== undefined) parts.push(`Max-Age=${Math.floor(options.maxAge)}`);
  if (options.expires) parts.push(`Expires=${options.expires.toUTCString()}`);
  if (options.path) parts.push(`Path=${options.path}`);
  if (options.domain) parts.push(`Domain=${options.domain}`);
  if (options.secure) parts.push("Secure");
  if (options.httpOnly) parts.push("HttpOnly");
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  return parts.join("; ");
}
export function setHeaderIfAbsent(res: ServerResponse, name: string, value: string): void {
  if (!res.hasHeader(name)) res.setHeader(name, value);
}
export function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  setHeaderIfAbsent(res, "content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}
export async function readRequestBody(req: IncomingMessage, maxBytes = 1_048_576): Promise<Buffer> {
  return collectStream(req, maxBytes);
}
export async function readRequestJson<T>(req: IncomingMessage, maxBytes?: number): Promise<T> {
  const raw = await readRequestBody(req, maxBytes);
  return JSON.parse(raw.toString("utf8")) as T;
}
export function createHealthServer(options: { port?: number; host?: string; serviceName?: string } = {}) {
  const server = createServer((req, res) => {
    if (req.url === "/health" || req.url === "/healthz") {
      sendJson(res, 200, { status: "ok", service: options.serviceName ?? "service", timestamp: new Date().toISOString() });
      return;
    }
    sendJson(res, 404, { error: "not_found" });
  });
  return {
    server,
    listen: () => new Promise<void>((resolveListen, reject) => {
      server.once("error", reject);
      server.listen(options.port ?? 3000, options.host ?? "127.0.0.1", () => { server.off("error", reject); resolveListen(); });
    }),
    close: () => new Promise<void>((resolveClose, reject) => server.close(error => error ? reject(error) : resolveClose()))
  };
}
export function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message = "Operation timed out"): Promise<T> {
  return new Promise((resolvePromise, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), timeoutMs);
    promise.then(value => { clearTimeout(timer); resolvePromise(value); }, error => { clearTimeout(timer); reject(error); });
  });
}
export async function mapConcurrent<T, R>(items: readonly T[], concurrency: number, mapper: (item: T, index: number) => Promise<R>): Promise<R[]> {
  if (!Number.isInteger(concurrency) || concurrency < 1) throw new RangeError("concurrency must be positive");
  const result = new Array<R>(items.length);
  let cursor = 0;
  const worker = async () => { while (true) { const index = cursor++; if (index >= items.length) return; result[index] = await mapper(items[index]!, index); } };
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return result;
}
