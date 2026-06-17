import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import type { Locale } from "./config";

// The raw message dictionaries, usable from both server and client. en.json is
// the source of truth for the shape; fr.json must mirror its keys.
export const messages: Record<Locale, typeof en> = { en, fr };

export type Messages = typeof en;
