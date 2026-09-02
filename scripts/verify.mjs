import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requiredFiles = [
  "README.md",
  "SKILL.md",
  "package.json",
  ".env.example",
  "CHANGELOG.md",
  "RELEASING.md",
  "references/auth.md",
  "references/divisions.md",
  "references/endpoints.md",
  "examples/legacy-rates.md",
  "examples/soap-ship-types.md",
];
const textFiles = [
  "README.md",
  "SKILL.md",
  "CHANGELOG.md",
  "RELEASING.md",
  "references/auth.md",
  "references/divisions.md",
  "references/endpoints.md",
  "examples/legacy-rates.md",
  "examples/soap-ship-types.md",
];
const read = (file) => fs.readFile(path.join(root, file), "utf8");

for (const file of requiredFiles) await fs.access(path.join(root, file));
const packageMetadata = JSON.parse(await read("package.json"));
assert.match(packageMetadata.version, /^\d+\.\d+\.\d+$/);
const changelog = await read("CHANGELOG.md");
assert.ok(changelog.includes(`## [${packageMetadata.version}]`));

const skill = await read("SKILL.md");
assert.match(skill, /^---\r?\nname: sfc-webservice\r?\ndescription: [\s\S]*?\r?\n---\r?\n/);
assert.match(skill, /https:\/\/www\.sendfromchina\.com\/api/);
assert.match(skill, /Step 1: save and verify credentials/);
assert.match(skill, /divisionId=1/);
assert.match(skill, /divisionId=17/);
assert.match(skill, /Step 4: query and explain prices/);
assert.match(skill, /Step 6: show the order preview and obtain confirmation/);
assert.match(skill, /Step 8: deliver the label and shipping instructions/);
assert.match(skill, /Step 9: track the shipment/);
assert.match(skill, /order\/print\/index/);
assert.match(skill, /addOrder/);

const env = await read(".env.example");
assert.match(env, /^SFC_APP_KEY=$/m);
assert.match(env, /^SFC_TOKEN=$/m);
assert.match(env, /^SFC_USER_ID=$/m);
for (const file of textFiles) {
  const content = await read(file);
  assert.doesNotMatch(content, /(?:sk|pk|token|secret)[_-]?[a-z0-9]{20,}/i);
  assert.doesNotMatch(content, /(?:password|passwd)\s*[:=]\s*[^\s<>{}]+/i);
}

const markdownLink = /\[[^\]]+\]\(([^)]+)\)/g;
for (const file of textFiles) {
  const content = await read(file);
  for (const match of content.matchAll(markdownLink)) {
    const target = match[1].split("#", 1)[0];
    if (!target || target.startsWith("http:") || target.startsWith("https:") || target.startsWith("mailto:")) continue;
    await fs.access(path.resolve(root, path.dirname(file), target));
  }
}
const workflows = await fs.readdir(path.join(root, ".github", "workflows"));
for (const workflow of workflows) {
  const content = await fs.readFile(path.join(root, ".github", "workflows", workflow), "utf8");
  for (const line of content.split(/\r?\n/).filter((value) => value.includes(" uses: "))) {
    assert.match(line, /@[0-9a-f]{40}(?:\s|$)/i);
  }
}
console.log("Skill repository verification passed.");
