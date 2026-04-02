import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface DeferredSectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  minHeight?: number;
  rootMargin?: string;
  idleDelayMs?: number;
}

const DeferredSection = ({
  children,
  fallback = null,
  minHeight = 320,
  rootMargin = '300px 0px',
  idleDelayMs = 1200,
}: DeferredSectionProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible || !containerRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  useEffect(() => {
    if (isVisible) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsVisible(true);
    }, idleDelayMs);

    return () => window.clearTimeout(timeoutId);
  }, [idleDelayMs, isVisible]);

  return (
    <div
      ref={containerRef}
      style={{ minHeight }}
      className="w-full"
    >
      {isVisible ? children : fallback}
    </div>
  );
};

export default DeferredSection;
