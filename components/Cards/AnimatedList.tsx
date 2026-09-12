// components/AnimatedList.tsx
"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import gsap from "gsap";

interface AnimatedListProps<T> {
  items: T[];
  onItemSelect?: (item: T, index: number) => void;
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  displayScrollbar?: boolean;
  className?: string;
  itemClassName?: string;
  renderItem?: (item: T, index: number, isSelected: boolean) => ReactNode;
}

function AnimatedList<T>({
  items,
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  displayScrollbar = true,
  className = "",
  itemClassName = "",
  renderItem,
}: AnimatedListProps<T>) {
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [topGradientOpacity, setTopGradientOpacity] = useState(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);

  // Entrance animation — stagger items in on mount / when items change
  useEffect(() => {
    const els = itemRefs.current.filter(Boolean) as HTMLDivElement[];
    gsap.fromTo(
      els,
      { opacity: 0, y: 30, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: "power3.out",
      }
    );
  }, [items]);

  // Gradient fade based on scroll position
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(
      scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1)
    );
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!enableArrowNavigation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        onItemSelect?.(items[selectedIndex], selectedIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items, selectedIndex, enableArrowNavigation, onItemSelect]);

  // Auto-scroll selected item into view
  useEffect(() => {
    if (selectedIndex < 0 || !listRef.current) return;
    const el = itemRefs.current[selectedIndex];
    if (!el) return;

    const container = listRef.current;
    const elTop = el.offsetTop;
    const elBottom = elTop + el.offsetHeight;

    if (elTop < container.scrollTop) {
      container.scrollTo({ top: elTop - 10, behavior: "smooth" });
    } else if (elBottom > container.scrollTop + container.clientHeight) {
      container.scrollTo({
        top: elBottom - container.clientHeight + 10,
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  return (
    <div className={`relative w-full ${className}`}>
      <div
        ref={listRef}
        onScroll={handleScroll}
        className={`max-h-[600px] overflow-y-auto overflow-x-hidden ${
          displayScrollbar
            ? "pr-2 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.3)_transparent]"
            : "scrollbar-hide"
        }`}
      >
        {items.map((item, index) => (
          <div
            key={index}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            onClick={() => {
              setSelectedIndex(index);
              onItemSelect?.(item, index);
            }}
            onMouseEnter={() => setSelectedIndex(index)}
            className={`cursor-pointer transition-colors duration-200 ${
              selectedIndex === index ? "bg-white/5" : ""
            } ${itemClassName}`}
          >
            {renderItem
              ? renderItem(item, index, selectedIndex === index)
              : (item as unknown as string)}
          </div>
        ))}
      </div>

      {showGradients && (
        <>
          <div
            className="pointer-events-none absolute left-0 right-0 top-0 h-16 bg-gradient-to-b from-black to-transparent transition-opacity duration-200"
            style={{ opacity: topGradientOpacity }}
          />
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent transition-opacity duration-200"
            style={{ opacity: bottomGradientOpacity }}
          />
        </>
      )}
    </div>
  );
}

export default AnimatedList;