import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel";
import { motion } from "framer-motion";

interface Slide {
  title: string;
  description: string;
}

export function AutoPlayCarousel({ items }: { items: Slide[] }) {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 3000, // 3 seconds per slide
        }),
      ]}
      className="w-full max-w-2xl mx-auto"
    >
      <CarouselContent>
        {items.map((slide, idx) => (
          <CarouselItem key={idx} className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
            >
              {slide.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-lg leading-relaxed text-wrap w-96 md:w-fit"
            >
              {slide.description}
            </motion.p>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Optional nav buttons */}
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
