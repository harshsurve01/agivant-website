"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { ChevronDown } from "@/components/ui/Icon/ChevronDown";
import type { NavigationItem } from "@/data/navigation";
import styles from "./MobileNav.module.css";

export interface MobileNavProps {
  navigation: NavigationItem[];
  /** Call to action shown at the bottom of the panel. */
  cta: { label: string; href: string };
}

/**
 * MobileNav (≤1024px)
 *
 * Menu button + slide-down panel for tablets and phones, where the
 * desktop NavigationMenu no longer fits. Uses the same `navigation` data:
 * plain items are links; mega-menu items become accordions listing each
 * category (linked) and its items.
 *
 * The panel is portaled to <body> so the sticky header's backdrop-filter
 * (which turns the header into the containing block for fixed children)
 * can't clip or offset it. It starts right under the header, locks page
 * scroll while open, and closes on Escape, on link click and on route
 * change.
 */
export function MobileNav({ navigation, cta }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [top, setTop] = useState(0);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const panelId = useId();
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  // Close whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    // Panel starts at the header's current bottom edge.
    const measure = () => {
      const header = buttonRef.current?.closest("header");
      setTop(Math.max(0, Math.round(header?.getBoundingClientRect().bottom ?? 0)));
    };
    measure();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    // Back on a desktop width: the panel no longer applies.
    const desktop = window.matchMedia("(min-width: 1025px)");
    const onDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", measure);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", measure);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open]);

  const close = () => setOpen(false);

  const panel = (
    <div
      id={panelId}
      className={styles.panel}
      style={{ top }}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
    >
      <nav aria-label="Primary">
        <ul className={styles.list}>
          {navigation.map((item) => {
            if (!item.megaMenu) {
              return (
                <li key={item.id} className={styles.item}>
                  <Link href={item.href} className={styles.link} onClick={close}>
                    {item.label}
                  </Link>
                </li>
              );
            }

            const isExpanded = expandedId === item.id;
            const groupId = `${panelId}-${item.id}`;
            return (
              <li key={item.id} className={styles.item}>
                <button
                  type="button"
                  className={styles.link}
                  aria-expanded={isExpanded}
                  aria-controls={groupId}
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  {item.label}
                  <ChevronDown
                    className={clsx(styles.chevron, isExpanded && styles.chevronOpen)}
                  />
                </button>

                <div id={groupId} className={styles.group} hidden={!isExpanded}>
                  {item.megaMenu.categories.map((category) => (
                    <div key={category.id} className={styles.category}>
                      <Link
                        href={category.href}
                        className={styles.categoryLink}
                        onClick={close}
                      >
                        {category.label}
                      </Link>
                      {category.items.length > 0 && (
                        <ul className={styles.subList}>
                          {category.items.map((sub) => (
                            <li key={sub.id}>
                              <Link
                                href={sub.href}
                                className={styles.subLink}
                                onClick={close}
                              >
                                {sub.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      <Link href={cta.href} className={styles.cta} onClick={close}>
        {cta.label}
      </Link>
    </div>
  );

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={clsx(styles.toggle, open && styles.toggleOpen)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.bar} aria-hidden="true" />
        <span className={styles.bar} aria-hidden="true" />
        <span className={styles.bar} aria-hidden="true" />
      </button>
      {mounted && open && createPortal(panel, document.body)}
    </>
  );
}
