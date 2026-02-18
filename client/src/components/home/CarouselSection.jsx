import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import offer1 from "../../assets/offer1.jpg";
import offer2 from "../../assets/offer2.jpg";
import offer3 from "../../assets/offer3.jpg";

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

/**
 * A simpler swipe implementation.
 * To really support swipe with AnimatePresence, we need to track drag constraints.
 * For now we'll stick to a high-quality auto-slider with buttons.
 */
export function CarouselCustomNavigation() {
  const images = [offer1, offer2, offer3];
  const [[page, direction], setPage] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);

  // We wrap the index to ensure it stays within bounds [0, images.length-1]
  const imageIndex = Math.abs(page % images.length);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  // 🔁 Auto slide every 4 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      paginate(1);
    }, 4000);
    return () => clearInterval(interval);
  }, [page, isPaused]);

  return (
    <section className="w-full">
      <div
        className="relative overflow-hidden shadow-sm group bg-background"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative w-full h-[500px] md:h-[500px] overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={page}
              src={images[imageIndex]}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              alt={`Slide ${imageIndex + 1}`}
              className="absolute w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Overlay Gradient (Optional: ensures text/arrows are visible if we add them on top) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>

        {/* Navigation Arrows (visible on hover/group-hover)
        <div className="absolute top-1/2 left-4 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className="bg-background/80 hover:bg-background text-foreground p-3 rounded-full shadow-lg backdrop-blur-sm transition-all transform hover:scale-110"
            onClick={() => paginate(-1)}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className="bg-background/80 hover:bg-background text-foreground p-3 rounded-full shadow-lg backdrop-blur-sm transition-all transform hover:scale-110"
            onClick={() => paginate(1)}
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div> */}

        {/* Navigation dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                // Determine direction based on click
                const newDirection = index > imageIndex ? 1 : -1;
                // We need to setPage to the exact index, but our 'page' state is unbounded.
                // A simple hack is just setting page to 'index' but that might mess up the infinite sliding calculation relative to current 'page'.
                // Better approach for dots in infinite slider is complicated, but for small sets:
                // We just reset to the exact index if it's close, or just use the difference.
                // Actually, let's just use the difference directly to keep the 'page' counter consistent.
                const diff = index - imageIndex;
                if (diff !== 0) setPage([page + diff, diff > 0 ? 1 : -1]);
              }}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all shadow-sm ${index === imageIndex
                ? "bg-white w-8 scale-110"
                : "bg-white/50 hover:bg-white/80 w-2"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Helpers for swipe
const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};
