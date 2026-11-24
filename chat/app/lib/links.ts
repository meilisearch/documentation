/** Docs sections. Anything else on the site (`/pricing`, `/assets`) is not a page link. */
const DOCS_SECTION = /^(?:getting_started|capabilities|reference|resources|changelog)(?:\/|$)/;

/** Hosts that publish this documentation. A custom domain is handled as the current origin. */
const DOCS_HOST = /^(?:www\.)?meilisearch\.com$|(?:^|\.)mintlify\.site$/;

/** `"/docs/x"` -> `"/docs"`; preview, localhost, and custom domains -> `""`. */
function docsBasePath(pathname: string): string {
  return pathname === "/docs" || pathname.startsWith("/docs/") ? "/docs" : "";
}

/** Docs-relative page path with a leading slash, or null when `pathname` is not a docs page. */
function docsPagePath(pathname: string): string | null {
  let path = pathname;
  if (path === "/docs" || path.startsWith("/docs/")) path = path.slice("/docs".length) || "/";
  if (path === "/") return "/";
  const relative = path.replace(/^\/+|\/+$/g, "");
  if (!relative || relative === "assets" || relative.startsWith("assets/")) return null;
  if (!DOCS_SECTION.test(relative)) return null;
  return `/${relative}`;
}

/**
 * Moves a docs link onto `pageHref`'s origin and docs mount.
 * Root-relative paths, `/docs/...` paths, and absolute docs URLs converge.
 * Anchors, other schemes, and non-docs links are returned unchanged.
 */
export function localizeHref(href: string, pageHref: string): string {
  if (!href || href.startsWith("#") || href.startsWith("//")) return href;
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) && !/^https?:/i.test(href)) return href;
  const absolute = /^https?:\/\//i.test(href);
  if (!absolute && !href.startsWith("/")) return href;

  let page: URL;
  try {
    page = new URL(pageHref);
  } catch {
    return href;
  }
  let target: URL;
  try {
    target = new URL(href, page);
  } catch {
    return href;
  }
  if (target.protocol !== "http:" && target.protocol !== "https:") return href;

  const path = docsPagePath(target.pathname);
  if (!path) return href;
  if (target.origin !== page.origin && !DOCS_HOST.test(target.hostname)) return href;

  const suffix = path === "/" ? "" : path;
  return `${page.origin}${docsBasePath(page.pathname)}${suffix}${target.search}${target.hash}`;
}

/** Same-origin docs links navigate in place; anything else opens in a new tab. */
export function linkTarget(href: string, pageHref: string): { target: string; rel?: string } {
  try {
    const page = new URL(pageHref);
    const target = new URL(localizeHref(href, pageHref), page);
    if (target.origin === page.origin) return { target: "_self" };
  } catch {
    // Leave unparseable links off the current page.
  }
  return { target: "_blank", rel: "noopener noreferrer" };
}
