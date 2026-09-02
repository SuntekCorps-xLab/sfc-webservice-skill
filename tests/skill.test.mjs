import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("Skill documents the legacy customer WebService scope", async () => {
  const skill = await fs.readFile(path.join(root, "SKILL.md"), "utf8");
  assert.match(skill, /^name: sfc-webservice$/m);
  assert.ok(skill.includes("legacy customer WebService"));
});

test("examples use placeholders instead of credentials", async () => {
  const example = await fs.readFile(path.join(root, "examples/legacy-rates.md"), "utf8");
  assert.ok(example.includes("YOUR_APP_KEY"));
  assert.ok(example.includes("YOUR_TOKEN"));
  assert.ok(example.includes("YOUR_USER_ID"));
});
