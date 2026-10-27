import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

const RELEASE_ASSETS_DIR = path.join(REPO_ROOT, "assets", "engine-release-assets");
const CLOUD_ASSETS_DIR = path.join(REPO_ROOT, "assets", "cloud-assets");
const SOURCE_ERROR_CODES = path.join(RELEASE_ASSETS_DIR, "meilisearch-error-codes.json");
const SOURCE_CLOUD_ERROR_CODES = path.join(CLOUD_ASSETS_DIR, "meilisearch-cloud-error-codes.json");
// The two error pages are hand-written: the generated code lists are injected
// between the markers below, so the prose around them stays editable and the
// `#<code>` anchors the APIs link to live in the page itself.
const TARGET_MEILISEARCH_ERRORS = path.join(REPO_ROOT, "reference", "errors.mdx");
const TARGET_MANAGEMENT_ERRORS = path.join(
  REPO_ROOT,
  "reference",
  "management-api-errors.mdx"
);

const GENERATED_START = "{/* generated:error-codes:start */}";
const GENERATED_END = "{/* generated:error-codes:end */}";

// The Cloud locale file documents every error the Meilisearch Cloud backend can
// return, including the ones raised by dashboard-only flows: sign-up, sign-in,
// SSO, MFA, password reset, and account deletion. None of those are reachable
// through the Management API routes documented in the Reference tab, so they
// are left out of the public reference.
//
// Codes are kept when they start with one of these prefixes, or when they are
// listed in CLOUD_GENERIC_CODES below. Any new code matching neither list is
// reported at the end of the run so it can be triaged.
const CLOUD_CODE_PREFIXES = [
  "change_plan_",
  "organization_",
  "project_",
  "team_",
  "usage_",
];

// Errors the API can return on any route, plus the billing error shared by the
// plan and project routes.
const CLOUD_GENERIC_CODES = [
  "bad_request",
  "billing_internal_error",
  "forbidden",
  "internal_server_error",
  "missing_parameter",
  "not_found",
  "transition_error",
  "unauthorized",
  "unprocessable_content",
  "validation_error",
];

// Raised when creating a project, so it belongs to the Management API surface
// despite its `user_` prefix. Promo code and search rule limit errors are
// deliberately absent: no documented route returns them.
const CLOUD_EXTRA_CODES = ["user_not_entitled_to_free_trial"];

// Success responses share the locale file with the errors.
const CLOUD_SUCCESS_CODES = ["ok", "created"];

function isManagementApiCode(code) {
  if (CLOUD_SUCCESS_CODES.includes(code)) return false;
  if (CLOUD_GENERIC_CODES.includes(code)) return true;
  if (CLOUD_EXTRA_CODES.includes(code)) return true;
  return CLOUD_CODE_PREFIXES.some((prefix) => code.startsWith(prefix));
}

// `%{details}` is an i18n placeholder the API replaces with request-specific
// information at runtime, so it carries no meaning in the documentation. A
// description that is only a placeholder, or that still holds one once the
// trailing "details: %{details}" is removed, is dropped: the title alone reads
// better than a sentence with a hole in it.
function cleanDescription(description) {
  if (typeof description !== "string") return "";
  const cleaned = description.trim().replace(/,?\s*details:\s*%\{\w+\}/g, "").trim();
  if (/%\{\w+\}/.test(cleaned)) return "";
  return cleaned;
}

function formatMeilisearchCodes(errorCodes) {
  return Object.entries(errorCodes)
    .map(([name, description]) => `### \`${name}\`\n\n${description}\n`)
    .join("\n");
}

function formatManagementCodes(errorCodes) {
  const skipped = [];
  const sections = [];

  for (const [name, entry] of Object.entries(errorCodes)) {
    if (!isManagementApiCode(name)) {
      if (!CLOUD_SUCCESS_CODES.includes(name)) skipped.push(name);
      continue;
    }

    const title = (entry.title ?? "").trim();
    const description = cleanDescription(entry.description);
    const body = [`\`${entry.statusCode}\` **${title}**`];
    if (description && description !== title) body.push(description);

    sections.push(`### \`${name}\`\n\n${body.join("\n\n")}\n`);
  }

  return { text: sections.join("\n"), skipped };
}

// Replaces the generated block of a hand-written page, leaving its prose alone.
function injectGeneratedCodes(targetPath, codesText) {
  if (!fs.existsSync(targetPath)) {
    throw new Error(`Target page not found: ${targetPath}`);
  }

  const page = fs.readFileSync(targetPath, "utf8");
  const start = page.indexOf(GENERATED_START);
  const end = page.indexOf(GENERATED_END);
  if (start === -1 || end === -1 || end < start) {
    throw new Error(
      `Target page ${targetPath} is missing the "${GENERATED_START}" / "${GENERATED_END}" markers.`
    );
  }

  const before = page.slice(0, start + GENERATED_START.length);
  const after = page.slice(end);
  fs.writeFileSync(targetPath, `${before}\n\n${codesText}\n${after}`, "utf8");
  console.log(`Written: ${targetPath}`);
}

async function main() {
  if (!fs.existsSync(SOURCE_ERROR_CODES)) {
    throw new Error(`Source error codes file not found: ${SOURCE_ERROR_CODES}`);
  }
  if (!fs.existsSync(SOURCE_CLOUD_ERROR_CODES)) {
    throw new Error(
      `Source Cloud error codes file not found: ${SOURCE_CLOUD_ERROR_CODES}. Run "npm run fetch-assets" with a GitHub token first.`
    );
  }

  console.log("Reading error codes...");
  const meilisearchCodes = JSON.parse(fs.readFileSync(SOURCE_ERROR_CODES, "utf8"));
  const cloudCodes = JSON.parse(fs.readFileSync(SOURCE_CLOUD_ERROR_CODES, "utf8"));

  const meilisearchText = formatMeilisearchCodes(meilisearchCodes);
  const { text: managementText, skipped } = formatManagementCodes(cloudCodes);

  injectGeneratedCodes(TARGET_MEILISEARCH_ERRORS, meilisearchText);
  injectGeneratedCodes(TARGET_MANAGEMENT_ERRORS, managementText);

  if (skipped.length > 0) {
    console.log(
      `\nSkipped ${skipped.length} Cloud error code(s) that are not part of the Management API surface.`
    );
    console.log(
      "If any of these are now reachable through a documented route, add them to generate-error-codes.mjs:"
    );
    console.log(`  ${skipped.join(", ")}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
