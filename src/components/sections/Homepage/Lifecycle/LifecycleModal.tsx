"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./LifecycleModal.module.css";

interface LifecycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  details: string[];
}

export function LifecycleModal({
  isOpen,
  onClose,
  title,
  details,
}: LifecycleModalProps) {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // Save previous overflow style and lock body scrolling
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus close button on open
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className={styles.container}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lifecycle-modal-title"
    >
      <div
        className={styles.backdrop}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={modalRef}
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.closeIcon}
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h3 id="lifecycle-modal-title" className={styles.title}>
          {title}
        </h3>

        <div className={styles.content}>
          {details.map((paragraph, index) => (
            <p key={index} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
