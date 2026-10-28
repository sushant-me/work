// maplibre-gl 6 ships its worker as a separate ES module and locates it with
// `new URL("./maplibre-gl-worker.mjs", import.meta.url)`. The static export does not emit
// that asset, so MapLibre throws "Worker failed to load" and tile parsing stops.
//
// This copies the worker out of the installed package into public/ before a build, and
// components/SlopeMap.tsx points MapLibre at it. Copying at build time rather than
// committing it means the file always matches the installed maplibre version.
import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs");
const target = resolve(root, "public/maplibre-gl-worker.mjs");

await mkdir(dirname(target), { recursive: true });
await copyFile(source, target);
console.log("maplibre worker copied to public/maplibre-gl-worker.mjs");
