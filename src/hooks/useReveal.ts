import { useEffect, useRef, useState } from 'react';

export const useReveal = (threshold = 0.1) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            setIsVisible(true);
          }
        });
      },
      { threshold }
    );

    const elements = sectionRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));

    // Also observe the container itself if needed
    if (sectionRef.current) {
        observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { sectionRef, isVisible };
};
