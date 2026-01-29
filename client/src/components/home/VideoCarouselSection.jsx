import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const videos = [
    {
        id: "U59dtDxYn0g",
        title: "What is Your Opinion For Your PG Room ?"
    },
    {
        id: "UE8uI7mawKA",
        title: "Podcast Video"
    },
    {
        id: "4cq9rrhcc2I",
        title: "PayNow Video"
    },
    {
        id: "lD8p9KQWWIM",
        title: "Student’s Honest Feedback | What They Think About Us | Must Watch!"
    },
    {
        id: "a3h_KvGe_Pk",
        title: "Happy Parents Feedback"
    },
    {
        id: "UC2G3TVMq0I",
        title: "Allen Students Feedback"
    },
    {
        id: "UE8uI7mawKA",
        title: "Why You Can Choose eRooms.in"
    },
    {
        id: "FZ8c9I4mmD4",
        title: "Get the Best Hostel/PG in Kota for Just ₹299"
    },
    {
        id: "X4lU3d16aMI",
        title: "Introducing erooms.in | Best Hostel, PG, Apartment, In Kota"
    }
];

export function VideoCarouselSection() {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        loop: true,
        skipSnaps: false,
        dragFree: true
    });

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    return (
        <section className="py-8 bg-secondary/30">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Video Gallery</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Check out what students and parents have to say about their experience with us.
                    </p>
                </div>

                <div className="relative group">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex -ml-4">
                            {videos.map((video, index) => (
                                <div key={`${video.id}-${index}`} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-4">
                                    <div className="bg-background rounded-xl overflow-hidden shadow-sm border border-border/50 h-full flex flex-col">
                                        <div className="relative aspect-video">
                                            <iframe
                                                className="absolute top-0 left-0 w-full h-full"
                                                src={`https://www.youtube.com/embed/${video.id}`}
                                                title={video.title}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                        <div className="p-4 flex-1 flex items-center justify-center text-center">
                                            <p className="font-medium text-sm md:text-base line-clamp-2 text-[#ffc905] dark:text-[#ffc905]">
                                                {video.title}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm shadow-md hover:bg-background hidden md:flex z-10"
                        onClick={scrollPrev}
                        aria-label="Previous video"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm shadow-md hover:bg-background hidden md:flex z-10"
                        onClick={scrollNext}
                        aria-label="Next video"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </section>
    );
}
