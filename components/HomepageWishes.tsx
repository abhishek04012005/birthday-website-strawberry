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

  // Auto-scroll carousel
  useEffect(() => {
    if (wishes.length <= 3) return; // Don't auto-scroll if 3 or fewer wishes

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % wishes.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [wishes.length]);

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
          <div className={styles.wishesGrid}>
            {wishes.map((wish, index) => (
              <div key={wish.id} className={styles.wishCard}>
                <div className={styles.wishQuote}>
                  <p className={styles.wishText}>"{wish.wish_text}"</p>
                </div>
                <div className={styles.wishFooter}>
                  <p className={styles.wishFrom}>
                    — <strong>{wish.guest_name}</strong>
                  </p>
                  <p className={styles.wishDate}>
                    {new Date(wish.submitted_at).toLocaleDateString()}
                  </p>
                </div>
                <div className={styles.wishDecor}>
                  {index % 3 === 0 && '💖'}
                  {index % 3 === 1 && '🌹'}
                  {index % 3 === 2 && '🎀'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
