'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect if the store has been hydrated from localStorage
 * Use this to prevent hydration mismatch errors in Next.js
 *
 * @example
 * ```tsx
 * const hydrated = useHydration();
 * if (!hydrated) return <LoadingSkeleton />;
 * return <DataTable data={data} />;
 * ```
 */
export function useHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}

/**
 * Hook to detect hydration with a specific Zustand store
 * More precise control over hydration state
 *
 * @param store - Zustand store with persist middleware
 */
export function useStoreHydration<T>(
  store: { persist: { hasHydrated: () => boolean; onFinishHydration: (fn: () => void) => () => void } }
) {
  const [hydrated, setHydrated] = useState(store.persist.hasHydrated());

  useEffect(() => {
    const unsubscribe = store.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    return () => {
      unsubscribe();
    };
  }, [store]);

  return hydrated;
}
