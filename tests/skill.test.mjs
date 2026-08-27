import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("README points to the maintained storefront repository", async () => {
  const readme = await fs.readFile(path.join(root, "README.md"), "utf8");
  assert.ok(readme.includes("https://github.com/SuntekCorps-xLab/sfc-shipping-tools"));
  assert.ok(!readme.includes("github.com/SendFromChina/shopify-sfc-shipping-tools"));
});

test("Skill metadata keeps the direct WebService scope", async () => {
  const skill = await fs.readFile(path.join(root, "SKILL.md"), "utf8");
  assert.match(skill, /^name: sfc-webservice$/m);
  assert.ok(skill.includes("direct** ERP / WMS / custom backend"));
  assert.ok(skill.includes("not** the Shopify open-source storefront"));
});

test("examples use placeholders instead of credentials", async () => {
  const example = await fs.readFile(path.join(root, "examples/https-rates.md"), "utf8");
  assert.ok(example.includes("YOUR_APP_KEY"));
  assert.ok(example.includes("YOUR_TOKEN"));
  assert.ok(example.includes("YOUR_USER_ID"));
});
