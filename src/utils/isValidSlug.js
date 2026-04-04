export function isValidSlug(slug) {
  if (!slug) return false;

  const s = slug.toLowerCase();

  // ❌ block known bot patterns
  const blockedKeywords = [
    "wp-",
    "wpadmin",
    "wordpress",
    "xmlrpc",
    "setup-config",
    "php",
    "admin",
    "login",
    ".env",
  ];

  if (blockedKeywords.some((k) => s.includes(k))) {
    return false;
  }

  // ❌ block special chars (.php, ., etc)
  if (!/^[a-z0-9-]+$/.test(s)) {
    return false;
  }

  return true;
}