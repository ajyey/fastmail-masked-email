import { readFile, writeFile } from 'node:fs/promises';

import { format } from 'prettier';

const CHANGELOG_PATH = new URL('../CHANGELOG.md', import.meta.url);
const RELEASE_HEADING = /^#{1,2} (?=(?:\[)?\d+\.\d+\.\d+)/gm;

/** Return consistently formatted Markdown with one title and level-two releases. */
export async function normalizeChangelog(changelog) {
  const releases = changelog
    .replace(/^# Changelog\s*$/gm, '')
    .trimStart()
    .replace(RELEASE_HEADING, '## ');

  return format(`# Changelog\n\n${releases}`, { parser: 'markdown' });
}

/** Normalize generated release notes under one changelog title before they are committed. */
export async function prepare() {
  const changelog = await readFile(CHANGELOG_PATH, 'utf8');
  const normalized = await normalizeChangelog(changelog);

  await writeFile(CHANGELOG_PATH, normalized);
}
