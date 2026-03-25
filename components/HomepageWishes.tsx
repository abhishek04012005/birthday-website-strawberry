'use client';

import React, { useEffect, useState } from 'react';
import { getVisibleWishes } from '@/lib/supabase';
import styles from '@/styles/HomepageWishes.module.css';

interface Wish {
  id: string;
  guest_name: string;
  wish_text: string;
  submitted_at: string;
  is_visible: boolean;
}

interface HomepageWishesProps {
  childName: string;
}

export const HomepageWishes: React.FC<HomepageWishesProps> = ({ childName }) => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchWishes = async () => {
      const result = await getVisibleWishes(childName);
      setWishes(result?.data || []);
      setLoading(false);
    };
    fetchWishes();
  }, [childName]);

  // Auto-scroll carousel with infinite loop
  useEffect(() => {
    if (wishes.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % wishes.length);
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [wishes.length]);

  // Handle smooth wrapping by duplicating wishes
  const displayWishes = wishes.length > 0 ? [...wishes, ...wishes] : [];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % wishes.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + wishes.length) % wishes.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <section className={styles.wishesSection}>
        <div className={styles.loadingSpinner}></div>
      </section>
    );
  }

  return (
    <section className={styles.wishesSection} id="wishes">
      <div className={styles.wishesFloaters}>
        <div className={styles.floater}>💌</div>
        <div className={styles.floater}>✨</div>
        <div className={styles.floater}>💕</div>
        <div className={styles.floater}>🌸</div>
      </div>

      <div className={styles.wishesInner}>
        <div className={styles.wishesHeader}>
          <div className={styles.secPill}>💌 Love & Wishes</div>
          <h2 className={styles.wishesTitle}>
            Birthday Wishes &<br />
            Love Messages
          </h2>
          <p className={styles.wishesSubtitle}>
            Heartfelt messages from everyone who celebrates with Emma 🎉💕
          </p>
        </div>

        {wishes.length === 0 ? (
          <div className={styles.emptyWishes}>
            <p className={styles.emptyIcon}>💌</p>
            <p className={styles.emptyText}>Wishes will appear here soon! ✨</p>
          </div>
        ) : (
          <div className={styles.carouselContainer}>
            <button 
              className={`${styles.navBtn} ${styles.prevBtn}`}
              onClick={prevSlide}
              aria-label="Previous wishes"
            >
              ←
            </button>

            <div className={styles.carousel}>
              <div 
                className={styles.carouselTrack} 
                style={{ 
                  transform: `translateX(calc(-${currentSlide} * (calc(100% / 3) + 24px)))`,
                  transition: 'transform 0.8s linear'
                }}
              >
                {displayWishes.map((wish, index) => (
                  <div key={`${wish.id}-${index}`} className={styles.carouselSlide}>
                    <div className={styles.wishCard}>
                      <div className={styles.wishQuoteDecor}>💌</div>
                      <div className={styles.wishQuote}>
                        <p className={styles.wishText}>"{wish.wish_text}"</p>
                      </div>
                      <div className={styles.wishFooter}>
                        <p className={styles.wishFrom}>
                          <strong>{wish.guest_name}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              className={`${styles.navBtn} ${styles.nextBtn}`}
              onClick={nextSlide}
              aria-label="Next wishes"
            >
              →
            </button>

            {/* Slide Counter */}
            <div className={styles.slideCounter}>
              Slide {(currentSlide % wishes.length) + 1} of {wishes.length}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
