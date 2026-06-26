"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import type { Locale } from "@/i18n/config";

type NavLink = { href: string; label: string };

type SiteNavProps = {
  home: NavLink;
  links: NavLink[];
  locale: Locale;
  labels: { openMenu: string; closeMenu: string };
};

export default function SiteNav({ home, links, locale, labels }: SiteNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  // Close the menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // While open: lock body scroll, close on Escape, and move focus into the panel.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Collapse the menu when the viewport grows to the desktop layout.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const linkClass = (href: string) =>
    `duration-200 ${
      isActive(href) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <>
      <nav className="relative z-50 max-w-screen-md mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={home.href}
            className="font-semibold text-foreground hover:text-muted-foreground duration-200"
            aria-current={isActive(home.href) ? "page" : undefined}
          >
            {home.label}
          </Link>

          {/* Desktop / tablet inline navigation */}
          <div className="hidden items-center gap-8 sm:flex">
            <ul className="flex items-center space-x-6">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={linkClass(link.href)}
                    aria-current={isActive(link.href) ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <LanguageSwitcher current={locale} />
          </div>

          {/* Mobile menu toggle */}
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? labels.closeMenu : labels.openMenu}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:text-foreground sm:hidden"
          >
            <span className="relative block h-4 w-5" aria-hidden="true">
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-200 motion-reduce:transition-none ${
                  open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0.5"
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 block h-0.5 w-5 -translate-y-1/2 bg-current transition-opacity duration-200 motion-reduce:transition-none ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-200 motion-reduce:transition-none ${
                  open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0.5"
                }`}
              />
            </span>
          </button>
        </div>

        {/* Mobile dropdown panel */}
        <div
          id="mobile-menu"
          ref={panelRef}
          inert={!open}
          className={`absolute inset-x-0 top-full z-50 px-4 transition duration-200 motion-reduce:transition-none sm:hidden ${
            open
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-2 opacity-0"
          }`}
        >
          <ul className="mt-2 overflow-hidden rounded-xl border border-border bg-background shadow-xl shadow-black/10">
            {links.map((link) => (
              <li
                key={link.href}
                className="border-b border-border last:border-b-0"
              >
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`block px-4 py-3 text-base duration-200 ${
                    isActive(link.href)
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="px-4 py-4">
              <LanguageSwitcher current={locale} />
            </li>
          </ul>
        </div>
      </nav>

      {/* Backdrop: dims the page and closes the menu on tap */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-200 motion-reduce:transition-none sm:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
    </>
  );
}
