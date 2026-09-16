import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
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
const credentialScanFiles = [
  ...textFiles,
  "CONTRIBUTING.md",
  "SECURITY.md",
  "references/legacy-webservice.md",
];
// Scan every tracked Markdown file so new docs cannot slip out of the link and
// credential checks. When git is unavailable (e.g. a source tarball), fall back
// to the static list above.
const trackedMarkdown = spawnSync("git", ["ls-files", "-z", "*.md"], {
  cwd: root,
  encoding: "utf8",
});
const markdownFiles =
  trackedMarkdown.status === 0 && trackedMarkdown.stdout.trim() !== ""
    ? trackedMarkdown.stdout.split("\0").filter(Boolean)
    : credentialScanFiles;
// Enumerate JavaScript files from the filesystem so brand-new, not-yet-tracked
// files are syntax-checked too.
const moduleFiles = [];
for (const dir of ["scripts", "tests"]) {
  for (const entry of await fs.readdir(path.join(root, dir))) {
    if (entry.endsWith(".mjs")) moduleFiles.push(path.join(dir, entry));
  }
}
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
assert.match(skill, /does not charge the customer at this stage/);
assert.match(skill, /Do not ask for a sandbox account/);
assert.match(skill, /Stop as soon/);
assert.match(skill, /addOrder/);
assert.match(await read("examples/legacy-rates.md"), /method=\"GET\"/);
assert.match(await read("examples/legacy-rates.md"), /http-api\?\" \+ query/);
assert.match(await read("examples/legacy-rates.md"), /POST behavior is account-dependent/);

const env = await read(".env.example");
assert.match(env, /^SFC_APP_KEY=$/m);
assert.match(env, /^SFC_TOKEN=$/m);
assert.match(env, /^SFC_USER_ID=$/m);
// Credential assignments in the formats this repository actually uses
// (export SFC_TOKEN='...', "token": "...", SFC_APP_KEY=...). Placeholder
// values (YOUR_*, <...>) and empty values must stay allowed; the value must
// start on the same line as the key ([ \t], not \s, so an empty assignment
// followed by a newline never swallows the next line).
const credentialAssignment =
  /(?:appKey|token|userId|SFC_(?:APP_KEY|TOKEN|USER_ID|DIVISION_ID))[ \t]*['"]?[ \t]*[:=][ \t]*['"]?(?!YOUR_)(?!<)[A-Za-z0-9+/_-]{8,}/i;
// Self-test: the scanner must catch realistic leaks in every documented format.
for (const probe of [
  "export SFC_TOKEN='c4d1e7b2a9f04c3e8b6d5a2f1e0c9b8a7d6e5f4c'",
  '"token": "c4d1e7b2a9f04c3e8b6d5a2f1e0c9b8a7d6e5f4c"',
  "SFC_APP_KEY=8f3a9c2b1d4e5f6a7b8c9d0e1f2a3b4c",
  '"appKey":"Ab3dEf6hIj0lMn4pQr8tUv2wXy6z"',
  "userId = W0911abc12345",
]) {
  assert.match(probe, credentialAssignment, `scanner missed probe: ${probe}`);
}
for (const file of markdownFiles) {
  const content = await read(file);
  assert.doesNotMatch(content, /(?:sk|pk|token|secret)[_-]?[a-z0-9]{20,}/i);
  assert.doesNotMatch(content, /(?:password|passwd)\s*[:=]\s*[^\s<>{}]+/i);
  assert.doesNotMatch(
    content,
    credentialAssignment,
    `${file} contains a credential-like assignment; use YOUR_* placeholders`,
  );
}

const markdownLink = /\[[^\]]+\]\(([^)]+)\)/g;
for (const file of markdownFiles) {
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
for (const file of moduleFiles) {
  const result = spawnSync(process.execPath, ["--check", path.join(root, file)], {
    encoding: "utf8",
  });
  assert.equal(
    result.status,
    0,
    `node --check failed for ${file}: ${result.stderr.trim()}`,
  );
}
console.log("Skill repository verification passed.");
