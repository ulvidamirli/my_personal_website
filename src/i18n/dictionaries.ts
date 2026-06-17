import "server-only";
import type { Locale } from "./config";
import { messages } from "./messages";

// Returns the message dictionary for a locale (server-only). The same map is
// shared with client error/not-found boundaries via "./messages".
export function getDictionary(locale: Locale) {
  return messages[locale];
}
