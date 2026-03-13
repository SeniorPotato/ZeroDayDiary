import fs from 'node:fs/promises';

export const exists = async (filePath) => !!(await fs.stat(filePath).catch(() => null));
export const ensureDir = async (dir) => fs.mkdir(dir, { recursive: true });

export async function readJson(filePath, fallback) {
  if (!(await exists(filePath))) return fallback;
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

export async function appendFile(filePath, text) {
  await fs.appendFile(filePath, text, 'utf8');
}

export function makeSlug(text = '') {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

export function escapeYaml(value = '') {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, ' ')
    .trim();
}
