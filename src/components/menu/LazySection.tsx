'use client';

import { useLazySection } from '@/hooks/useLazySection';

interface LazySectionProps {
  children: React.ReactNode;
  minHeight?: number;
  forceRender?: boolean;
}

export default function LazySection({
  children,
  minHeight = 300,
  forceRender = false,
}: LazySectionProps) {
  const { ref, visible } = useLazySection(800);

  if (forceRender || visible) {
    return <>{children}</>;
  }

  return (
    <div ref={ref} style={{ minHeight }}>
      <div className="flex items-center justify-center py-20">
        <div className="w-5 h-5 border-2 border-accent/20 border-t-accent/60 rounded-full animate-spin" />
      </div>
    </div>
  );
}
