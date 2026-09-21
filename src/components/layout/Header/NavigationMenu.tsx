"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { ChevronDown } from "@/components/ui/Icon/ChevronDown";
import { ArrowRight } from "@/components/ui/Icon/ArrowRight";
import type { NavigationItem } from "@/data/navigation";
import styles from "./NavigationMenu.module.css";

export interface NavigationMenuProps {
  navigation: NavigationItem[];
}

/**
 * NavigationMenu
 *
 * Client Component for the primary navigation in the Header.
 * Owns client-side state for:
 * - Opening/closing the "What We Build" mega menu
 * - Switching between Services, Solutions, and Partnerships categories
 * - Solutions search filtering (controlled input, real-time matching)
 * - Click-outside and Escape key dismissal
 * - Closing on item navigation
 */
export function NavigationMenu({ navigation }: NavigationMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("services");
  const [searchQuery, setSearchQuery] = useState("");

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Find the item with megaMenu data (What We Build)
  const whatWeBuildItem = navigation.find((item) => item.megaMenu);
  const megaMenuData = whatWeBuildItem?.megaMenu;

  // Currently selected category
  const currentCategory = useMemo(() => {
    if (!megaMenuData) return null;
    return (
      megaMenuData.categories.find((c) => c.id === activeCategory) ??
      megaMenuData.categories[0]
    );
  }, [megaMenuData, activeCategory]);

  // Filtered items when activeCategory is "solutions" or "services"
  const displayItems = useMemo(() => {
    if (!currentCategory?.items) return [];
    if (activeCategory !== "solutions" || !searchQuery.trim()) {
      return currentCategory.items;
    }
    const q = searchQuery.toLowerCase().trim();
    return currentCategory.items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }, [currentCategory, activeCategory, searchQuery]);

  // Handle click outside and Escape key to close the menu
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleTriggerClick = () => {
    setIsOpen((prev) => {
      const nextState = !prev;
      if (nextState) {
        setActiveCategory("services");
        setSearchQuery("");
      }
      return nextState;
    });
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    setSearchQuery("");
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav aria-label="Primary" className={styles.nav}>
      <ul className={styles.navList}>
        {navigation.map((item) => {
          if (item.megaMenu) {
            return (
              <li key={item.id} className={styles.navItem}>
                <button
                  ref={triggerRef}
                  type="button"
                  onClick={handleTriggerClick}
                  className={clsx(
                    styles.navLink,
                    styles.navTrigger,
                    isOpen && styles.navTriggerActive
                  )}
                  aria-expanded={isOpen}
                  aria-controls="what-we-build-mega-menu"
                  aria-haspopup="true"
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    className={clsx(
                      styles.chevron,
                      isOpen && styles.chevronOpen
                    )}
                  />
                </button>
              </li>
            );
          }

          return (
            <li key={item.id} className={styles.navItem}>
              <Link
                href={item.href}
                className={styles.navLink}
                onClick={handleLinkClick}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* ── "What We Build" Mega Menu Panel ── */}
      {isOpen && megaMenuData && (
        <div
          ref={panelRef}
          id="what-we-build-mega-menu"
          className={styles.megaMenuPanel}
          role="region"
          aria-label="What We Build"
        >
          <div className={styles.megaMenuInner}>
            {/* Left Sidebar */}
            <aside className={styles.leftPanel}>
              <div className={styles.leftHeader}>
                <h3 className={styles.leftTitle}>{megaMenuData.title}</h3>
                <div className={styles.leftDivider} />
              </div>

              <ul className={styles.categoryList}>
                {megaMenuData.categories.map((category) => {
                  const isActive = activeCategory === category.id;
                  return (
                    <li key={category.id}>
                      <button
                        type="button"
                        onClick={() => handleCategoryClick(category.id)}
                        className={clsx(
                          styles.categoryButton,
                          isActive && styles.categoryButtonActive
                        )}
                      >
                        <span
                          className={styles.categoryArrow}
                          aria-hidden="true"
                        >
                          &rarr;
                        </span>
                        <span>{category.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Feature Card */}
              {currentCategory && (
                <div className={styles.featureCard}>
                  <h4 className={styles.featureCardTitle}>
                    {currentCategory.featureCard.title}
                  </h4>
                  <p className={styles.featureCardDesc}>
                    {currentCategory.featureCard.description}
                  </p>
                </div>
              )}

              {/* Clipped Ribbon Artwork */}
              <div className={styles.ribbonContainer} aria-hidden="true">
                <Image
                  src="/images/trust/card-ribbon.png"
                  alt=""
                  width={432}
                  height={136}
                  className={styles.ribbonImage}
                />
              </div>
            </aside>

            {/* Right Content Area */}
            <main className={styles.rightPanel}>
              <h3 className={styles.rightHeading}>
                {currentCategory?.label}
              </h3>

              {/* Search Bar (Solutions State) */}
              {activeCategory === "solutions" && (
                <form
                  className={styles.searchForm}
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search all 45 solutions"
                    className={styles.searchInput}
                    aria-label="Search all 45 solutions"
                  />
                  <button type="submit" className={styles.searchButton}>
                    Search
                  </button>
                </form>
              )}

              {/* Content Grid */}
              {activeCategory === "partnerships" ? (
                <div className={styles.placeholderState}>
                  <p className={styles.placeholderText}>
                    Explore our technology ecosystem partners and alliances.
                  </p>
                  <Link
                    href="/partners"
                    onClick={handleLinkClick}
                    className={styles.placeholderLink}
                  >
                    View Partnerships &rarr;
                  </Link>
                </div>
              ) : displayItems.length === 0 ? (
                <p className={styles.noResults}>No solutions found.</p>
              ) : (
                <div className={styles.grid}>
                  {displayItems.map((item) => {
                    if (item.isViewAll) {
                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={handleLinkClick}
                          className={styles.viewAllCard}
                        >
                          <div className={styles.viewAllHeader}>
                            <span className={styles.viewAllTitle}>
                              {item.title}
                            </span>
                            <span
                              className={styles.viewAllArrow}
                              aria-hidden="true"
                            >
                              &rsaquo;
                            </span>
                          </div>
                          <p className={styles.viewAllDesc}>
                            {item.description}
                          </p>
                        </Link>
                      );
                    }

                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={handleLinkClick}
                        className={styles.itemCard}
                      >
                        <div className={styles.itemHeader}>
                          <span className={styles.itemTitle}>{item.title}</span>
                          <span
                            className={styles.itemArrow}
                            aria-hidden="true"
                          >
                            &rsaquo;
                          </span>
                        </div>
                        <p className={styles.itemDesc}>{item.description}</p>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Bottom Information Bar */}
              <div className={styles.bottomBar}>
                <div className={styles.bottomLeft}>
                  <span className={styles.bottomHighlight}>
                    {megaMenuData.bottomBar.statsHighlight}
                  </span>{" "}
                  <span>{megaMenuData.bottomBar.statsText}</span>
                </div>
                <div className={styles.bottomRight}>
                  <span>{megaMenuData.bottomBar.ctaPrefix} </span>
                  <Link
                    href={megaMenuData.bottomBar.ctaHref}
                    onClick={handleLinkClick}
                    className={styles.bottomCta}
                  >
                    <span>{megaMenuData.bottomBar.ctaHighlight}</span>
                    <ArrowRight className={styles.bottomArrowIcon} />
                  </Link>
                </div>
              </div>
            </main>
          </div>
        </div>
      )}
    </nav>
  );
}
