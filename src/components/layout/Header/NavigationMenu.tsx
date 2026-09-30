"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { ChevronDown } from "@/components/ui/Icon/ChevronDown";
import { ArrowRight } from "@/components/ui/Icon/ArrowRight";
import type { NavigationItem, MegaMenuFeaturedItem } from "@/data/navigation";
import styles from "./NavigationMenu.module.css";

export interface NavigationMenuProps {
  navigation: NavigationItem[];
}

/**
 * NavigationMenu
 *
 * Client Component for the primary navigation in the Header.
 * Owns client-side state for:
 * - Opening/closing a mega menu (any navigation item with `megaMenu` data,
 *   e.g. "What We Build" and "Resources" — one shared panel, data-driven)
 * - Switching between Services, Solutions, and Partnerships categories
 * - Solutions search filtering (controlled input, real-time matching)
 * - Click-outside and Escape key dismissal
 * - Closing on item navigation
 */
const AUTO_ROTATE_INTERVAL_MS = 5000;
const DRAG_START_THRESHOLD_PX = 15;

export function NavigationMenu({ navigation }: NavigationMenuProps) {
  const router = useRouter();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("services");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFeatured, setActiveFeatured] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const isOpen = openMenuId !== null;

  // Pointer-drag (mouse + touch) state for the featured carousel
  const dragStartXRef = useRef<number | null>(null);
  const didDragRef = useRef(false);
  const isDraggingRef = useRef(false);
  const menuLeaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerRefs = useRef<Record<string, HTMLElement | null>>({});
  const panelRef = useRef<HTMLDivElement>(null);

  // The navigation item whose mega menu is currently open
  const openMenuItem = navigation.find(
    (item) => item.id === openMenuId && item.megaMenu
  );
  const megaMenuData = openMenuItem?.megaMenu;
  const featured = megaMenuData?.featured;
  const featuredItem: MegaMenuFeaturedItem | undefined =
    featured?.items[activeFeatured] ?? featured?.items[0];

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

    const activeTrigger = openMenuId ? triggerRefs.current[openMenuId] : null;

    function handleClickOutside(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        activeTrigger &&
        // The whole nav item (link + chevron button) counts as the trigger,
        // so tapping the chevron again toggles the menu closed instead of
        // closing it here and reopening it on the click that follows.
        !(activeTrigger.closest("li") ?? activeTrigger).contains(target)
      ) {
        setOpenMenuId(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMenuId(null);
        activeTrigger?.focus();
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
  }, [isOpen, openMenuId]);

  const clearMenuLeaveTimer = () => {
    if (menuLeaveTimerRef.current) {
      clearTimeout(menuLeaveTimerRef.current);
      menuLeaveTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (menuLeaveTimerRef.current) {
        clearTimeout(menuLeaveTimerRef.current);
      }
    };
  }, []);

  const handleNavMouseEnter = (item: NavigationItem) => {
    clearMenuLeaveTimer();
    if (item.megaMenu) {
      if (openMenuId !== item.id) {
        setOpenMenuId(item.id);
        setActiveCategory(
          item.megaMenu.defaultCategoryId ??
            item.megaMenu.categories[0]?.id ??
            ""
        );
        setSearchQuery("");
      }
    }
  };

  const handleNavMouseLeave = () => {
    clearMenuLeaveTimer();
    menuLeaveTimerRef.current = setTimeout(() => {
      setOpenMenuId(null);
    }, 200);
  };

  const handlePanelMouseEnter = () => {
    clearMenuLeaveTimer();
  };

  const handlePanelMouseLeave = () => {
    clearMenuLeaveTimer();
    menuLeaveTimerRef.current = setTimeout(() => {
      setOpenMenuId(null);
    }, 200);
  };

  const handleTriggerClick = (item: NavigationItem) => {
    clearMenuLeaveTimer();
    if (openMenuId === item.id) {
      setOpenMenuId(null);
      return;
    }
    const menu = item.megaMenu;
    setActiveCategory(menu?.defaultCategoryId ?? menu?.categories[0]?.id ?? "");
    setSearchQuery("");
    setOpenMenuId(item.id);
  };

  const handleCategoryHover = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    setSearchQuery("");
  };

  const handleLinkClick = () => {
    clearMenuLeaveTimer();
    setOpenMenuId(null);
  };

  // ── Featured carousel drag / swipe ──
  // Drag the card left/right past the threshold to move to the next/previous
  // item (wraps around). A drag never triggers the card's link.
  const DRAG_THRESHOLD_PX = 50;
  const featuredCount = featured?.items.length ?? 0;

  // Auto-rotating featured carousel (continuous 5s loop, paused on card hover/drag)
  // Kept independent of activeCategory so hovering left navigation never resets it.
  useEffect(() => {
    if (!isOpen || !featured || featuredCount <= 1 || isCarouselHovered) {
      return;
    }

    const timer = setInterval(() => {
      if (!isDraggingRef.current) {
        setActiveFeatured((prev) => (prev + 1) % featuredCount);
      }
    }, AUTO_ROTATE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isOpen, featured, featuredCount, isCarouselHovered]);

  const handleFeaturedPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (featuredCount < 2 || (e.pointerType === "mouse" && e.button !== 0)) return;
    dragStartXRef.current = e.clientX;
    didDragRef.current = false;
    isDraggingRef.current = false;
    // Do NOT capture pointer on pointerdown — doing so breaks click events on child <a> elements in Chromium.
  };

  const handleFeaturedPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartXRef.current === null) return;
    const dx = e.clientX - dragStartXRef.current;
    if (!didDragRef.current && Math.abs(dx) > DRAG_START_THRESHOLD_PX) {
      didDragRef.current = true;
      isDraggingRef.current = true;
      try {
        if (!e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.setPointerCapture(e.pointerId);
        }
      } catch {
        // Fallback if not supported
      }
    }
    if (didDragRef.current) {
      setDragOffset(dx);
    }
  };

  const endFeaturedDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    if (dragStartXRef.current === null) return;
    const dx = e.clientX - dragStartXRef.current;
    const wasDragging = didDragRef.current;
    dragStartXRef.current = null;
    setDragOffset(0);

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Fallback
      }
    }

    if (wasDragging && Math.abs(dx) >= DRAG_THRESHOLD_PX && featuredCount > 1) {
      setActiveFeatured((prev) =>
        dx < 0
          ? (prev + 1) % featuredCount
          : (prev - 1 + featuredCount) % featuredCount
      );
    }

    if (wasDragging) {
      setTimeout(() => {
        didDragRef.current = false;
      }, 50);
    }
  };

  const handleFeaturedClickCapture = (e: React.MouseEvent) => {
    // Swallow the click that ends a drag so the card link doesn't fire.
    if (didDragRef.current) {
      e.preventDefault();
      e.stopPropagation();
      didDragRef.current = false;
    }
  };

  const handleCardClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (didDragRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Allow user to use middle click or ctrl/cmd click for new tab
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) {
      return;
    }

    e.preventDefault();
    clearMenuLeaveTimer();
    setOpenMenuId(null);
    router.push(href);
  };

  return (
    <nav aria-label="Primary" className={styles.nav}>
      <ul className={styles.navList}>
        {navigation.map((item) => {
          if (item.megaMenu) {
            const isItemOpen = openMenuId === item.id;
            const isDirectLink = Boolean(
              item.href && item.href !== "#" && item.href !== "/what-we-build"
            );

            return (
              <li
                key={item.id}
                className={styles.navItem}
                // Hover-open only for a real mouse/pen. On touch, the
                // emulated hover fired before the tap's click opened the
                // menu and the click then toggled it shut; touch now
                // opens/closes through the chevron's click alone.
                onPointerEnter={(event) => {
                  if (event.pointerType !== "touch") handleNavMouseEnter(item);
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType !== "touch") handleNavMouseLeave();
                }}
              >
                {isDirectLink ? (
                  <div
                    className={clsx(
                      styles.navLink,
                      styles.navTrigger,
                      isItemOpen && styles.navTriggerActive
                    )}
                  >
                    <Link
                      ref={(el) => {
                        triggerRefs.current[item.id] = el;
                      }}
                      href={item.href}
                      onClick={handleLinkClick}
                      className={styles.navTriggerLink}
                      aria-expanded={isItemOpen}
                      aria-controls={`${item.id}-mega-menu`}
                      aria-haspopup="true"
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleTriggerClick(item)}
                      className={styles.chevronButton}
                      aria-label={`Toggle ${item.label} menu`}
                    >
                      <ChevronDown
                        className={clsx(
                          styles.chevron,
                          isItemOpen && styles.chevronOpen
                        )}
                      />
                    </button>
                  </div>
                ) : (
                  <button
                    ref={(el) => {
                      triggerRefs.current[item.id] = el;
                    }}
                    type="button"
                    onClick={() => handleTriggerClick(item)}
                    className={clsx(
                      styles.navLink,
                      styles.navTrigger,
                      isItemOpen && styles.navTriggerActive
                    )}
                    aria-expanded={isItemOpen}
                    aria-controls={`${item.id}-mega-menu`}
                    aria-haspopup="true"
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={clsx(
                        styles.chevron,
                        isItemOpen && styles.chevronOpen
                      )}
                    />
                  </button>
                )}
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

      {/* ── Mega Menu Panel (shared by every item with megaMenu data) ── */}
      {isOpen && openMenuItem && megaMenuData && (
        <div
          ref={panelRef}
          id={`${openMenuItem.id}-mega-menu`}
          className={styles.megaMenuPanel}
          data-menu-id={openMenuItem.id}
          role="region"
          aria-label={megaMenuData.title}
          onMouseEnter={handlePanelMouseEnter}
          onMouseLeave={handlePanelMouseLeave}
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
                  const categoryContent = (
                    <>
                      <span
                        className={styles.categoryArrow}
                        aria-hidden="true"
                      >
                        &rarr;
                      </span>
                      <span>{category.label}</span>
                    </>
                  );
                  const buttonClasses = clsx(
                    styles.categoryButton,
                    isActive && styles.categoryButtonActive
                  );

                  return (
                    <li key={category.id}>
                      {category.href ? (
                        <Link
                          href={category.href}
                          onClick={handleLinkClick}
                          onMouseEnter={() => handleCategoryHover(category.id)}
                          className={buttonClasses}
                        >
                          {categoryContent}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleCategoryClick(category.id)}
                          onMouseEnter={() => handleCategoryHover(category.id)}
                          className={buttonClasses}
                        >
                          {categoryContent}
                        </button>
                      )}
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
              <h3
                className={clsx(
                  styles.rightHeading,
                  featured && styles.rightHeadingFeatured
                )}
              >
                {featured ? featured.heading : currentCategory?.label}
              </h3>

              {/* Featured carousel (menus with `featured` data, e.g. Resources) */}
              {featured && featuredItem && (
                <div
                  className={styles.featured}
                  onMouseEnter={() => setIsCarouselHovered(true)}
                  onMouseLeave={() => setIsCarouselHovered(false)}
                >
                  <div
                    className={clsx(
                      styles.featuredTrack,
                      featuredCount > 1 && styles.featuredTrackDraggable,
                      dragOffset !== 0 && styles.featuredTrackDragging
                    )}
                    style={
                      dragOffset !== 0
                        ? { transform: `translateX(${dragOffset}px)` }
                        : undefined
                    }
                    onPointerDown={handleFeaturedPointerDown}
                    onPointerMove={handleFeaturedPointerMove}
                    onPointerUp={endFeaturedDrag}
                    onPointerCancel={endFeaturedDrag}
                    onClickCapture={handleFeaturedClickCapture}
                    onDragStart={(e) => e.preventDefault()}
                  >
                  {(() => {
                    const cardContent = (
                      <>
                        <div className={styles.featuredImageWrapper}>
                          <Image
                            src={featuredItem.image.src}
                            alt={featuredItem.image.alt}
                            width={featuredItem.image.width}
                            height={featuredItem.image.height}
                            className={styles.featuredImage}
                            draggable={false}
                          />
                        </div>
                        <div className={styles.featuredContent}>
                          {featuredItem.logos.length > 0 && (
                            <div className={styles.featuredLogos}>
                              {featuredItem.logos.map((logo) => (
                                <Image
                                  key={logo.src}
                                  src={logo.src}
                                  alt={logo.alt}
                                  width={logo.width}
                                  height={logo.height}
                                  className={styles.featuredLogo}
                                  draggable={false}
                                />
                              ))}
                            </div>
                          )}
                          <h4 className={styles.featuredTitle}>
                            {featuredItem.title}
                          </h4>
                          {featuredItem.description && (
                            <p className={styles.featuredDesc}>
                              {featuredItem.description}
                            </p>
                          )}
                        </div>
                      </>
                    );
                    return featuredItem.href ? (
                      <Link
                        key={featuredItem.id}
                        href={featuredItem.href}
                        onClick={(e) => handleCardClick(e, featuredItem.href)}
                        className={styles.featuredCard}
                      >
                        {cardContent}
                      </Link>
                    ) : (
                      <div key={featuredItem.id} className={styles.featuredCard}>
                        {cardContent}
                      </div>
                    );
                  })()}
                  </div>

                  {featured.items.length > 1 && (
                    <div className={styles.featuredDots}>
                      {featured.items.map((item, index) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveFeatured(index)}
                          className={clsx(
                            styles.featuredDot,
                            index === activeFeatured && styles.featuredDotActive
                          )}
                          aria-label={`Show ${item.title}`}
                          aria-current={index === activeFeatured}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Search Bar (Solutions State) */}
              {!featured && activeCategory === "solutions" && (
                <form
                  className={styles.searchForm}
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={currentCategory?.searchPlaceholder ?? "Search solutions"}
                    className={styles.searchInput}
                    aria-label={currentCategory?.searchPlaceholder ?? "Search solutions"}
                  />
                  <button type="submit" className={styles.searchButton}>
                    Search
                  </button>
                </form>
              )}

              {/* Content Grid */}
              {featured ? null : activeCategory === "partnerships" &&
                displayItems.length === 0 ? (
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

              {/* Bottom Information Bar (a category can opt out via hideBottomBar) */}
              {!currentCategory?.hideBottomBar && (
                <div className={styles.bottomBar}>
                  <div className={styles.bottomLeft}>
                    {megaMenuData.bottomBar.statsHighlight && (
                      <span className={styles.bottomHighlight}>
                        {megaMenuData.bottomBar.statsHighlight}
                      </span>
                    )}{" "}
                    {megaMenuData.bottomBar.statsText && (
                      <span>{megaMenuData.bottomBar.statsText}</span>
                    )}
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
              )}
            </main>
          </div>
        </div>
      )}
    </nav>
  );
}
