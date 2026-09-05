import { cp, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
await mkdir(new URL('web/public', root), { recursive: true });
await cp(fileURLToPath(new URL('assets', root)), fileURLToPath(new URL('web/public/assets', root)), { recursive: true });
