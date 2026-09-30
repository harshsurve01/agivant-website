"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y, Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import type { TrustCardData } from "@/data/trust";
import { TrustCard } from "./TrustCard";
import styles from "./TrustMobileSlider.module.css";

/** Mobile only. Tablet and desktop keep the ScrollTrigger stack (TrustAnimation). */
export const TRUST_MOBILE_QUERY = "(max-width: 767px)";

// Same slider settings as the reference mobile Trust section.
const AUTOPLAY_DELAY = 4200;
const SLIDE_SPEED = 520;
const SLIDE_GAP = 20;

interface TrustMobileSliderProps {
  cards: TrustCardData[];
}

/**
 * TrustMobileSlider
 *
 * Mobile (≤767px) replacement for the scroll-pinned Trust stack: a
 * Swiper coverflow slider of the same TrustCards — one card at a time,
 * swipe, autoplay, loop, prev/next buttons and clickable dots below.
 *
 * Swiper is only created while the mobile query matches. Before
 * hydration (and on the first client render, so markup matches the
 * server) it shows the first card as a static fallback; on tablet and
 * desktop it renders nothing and CSS keeps the existing stack visible.
 */
export function TrustMobileSlider({ cards }: TrustMobileSliderProps) {
  const [mode, setMode] = useState<"pending" | "mobile" | "desktop">("pending");
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const paginationRef = useRef<HTMLDivElement | null>(null);
  const count = cards.length;

  useEffect(() => {
    const query = window.matchMedia(TRUST_MOBILE_QUERY);
    const update = () => setMode(query.matches ? "mobile" : "desktop");
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Wire the external controls once both Swiper and the buttons exist.
  useEffect(() => {
    if (!swiper || swiper.destroyed) return;
    const nav = swiper.params.navigation;
    const pag = swiper.params.pagination;
    if (nav && typeof nav === "object") {
      nav.prevEl = prevRef.current;
      nav.nextEl = nextRef.current;
      swiper.navigation.destroy();
      swiper.navigation.init();
      swiper.navigation.update();
    }
    if (pag && typeof pag === "object") {
      pag.el = paginationRef.current;
      swiper.pagination.destroy();
      swiper.pagination.init();
      swiper.pagination.render();
      swiper.pagination.update();
    }
  }, [swiper]);

  if (count === 0 || mode === "desktop") return null;

  if (mode === "pending") {
    const first = cards[0];
    return (
      <div className={styles.slider} data-trust-mobile-slider>
        <div className={styles.slide}>
          <TrustCard
            title={first.title}
            description={first.description}
            badge={first.badge}
            accentColor={first.accentColor}
            ribbonSrc={first.ribbonSrc}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.slider} data-trust-mobile-slider data-ready>
      <Swiper
        modules={[EffectCoverflow, Navigation, Pagination, Autoplay, A11y]}
        className={styles.swiper}
        effect="coverflow"
        slidesPerView={1}
        spaceBetween={SLIDE_GAP}
        speed={SLIDE_SPEED}
        loop={count > 1}
        autoHeight
        autoplay={
          count > 1
            ? { delay: AUTOPLAY_DELAY, disableOnInteraction: false, pauseOnMouseEnter: true }
            : false
        }
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        pagination={{ el: paginationRef.current, clickable: true }}
        onBeforeInit={(instance) => {
          const nav = instance.params.navigation;
          const pag = instance.params.pagination;
          if (nav && typeof nav === "object") {
            nav.prevEl = prevRef.current;
            nav.nextEl = nextRef.current;
          }
          if (pag && typeof pag === "object") pag.el = paginationRef.current;
        }}
        onSwiper={setSwiper}
      >
        {cards.map((card) => (
          <SwiperSlide key={card.id} className={styles.slide}>
            <TrustCard
              title={card.title}
              description={card.description}
              badge={card.badge}
              accentColor={card.accentColor}
              ribbonSrc={card.ribbonSrc}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {count > 1 && (
        <div className={styles.controls}>
          <button ref={prevRef} type="button" className={styles.arrow} aria-label="Previous slide">
            <span aria-hidden="true">&#8592;</span>
          </button>
          <div ref={paginationRef} className={styles.pagination} />
          <button ref={nextRef} type="button" className={styles.arrow} aria-label="Next slide">
            <span aria-hidden="true">&#8594;</span>
          </button>
        </div>
      )}
    </div>
  );
}
