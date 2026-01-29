
import React from 'react';

const partners = [
    { name: "Resonance", logo: "Resonance" },
    { name: "Vibrant Academy", logo: "Vibrant Academy" ,imageLink:"" },
    { name: "Physics Wallah", logo: "Physics Wallah",imageLink:"" },
    { name: "Career Point", logo: "Career Point", imageLink:"" },
    { name: "Aakash Institute", logo: "Aakash Institute",imageLink:"" },
    { name: "RUS Education", logo: "RUS Education" ,imageLink:"" },
    { name: "Allen", logo: "Allen" ,imageLink:"" },
];

// Duplicate the array to create the infinite scroll effect
const allPartners = [...partners, ...partners];

export function PartnersSection() {
    return (
        <section className="py-6 bg-background overflow-hidden">
            <div className="container px-4 md:px-6 mb-10 text-center">
                <div className="inline-block mb-2">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Our Major <span className="text-[#ffc905]">Partners</span>
                    </h2>
                </div>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    We don't just make second homes. We make headlines as well.
                </p>
            </div>

            <div className="relative w-full overflow-hidden">
                {/* Gradient Masks for smooth fade effect at edges */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

                <div className="flex w-max animate-scroll hover:[animation-play-state:paused]">
                    {allPartners.map((partner, index) => (
                        <div
                            key={`${partner.name}-${index}`}
                            className="flex flex-col items-center justify-center mx-8 w-[150px] md:w-[200px] group cursor-pointer"
                        >
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white shadow-sm border border-border/50 flex items-center justify-center p-4 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md">
                                {/* Placeholder for Logo - using text initials or name for now since we don't have assets */}
                                <div className="text-center font-bold text-primary text-sm md:text-base">
                                    {partner.name}
                                </div>
                            </div>
                            <p className="font-medium text-foreground/80 group-hover:text-primary transition-colors">
                                {partner.name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
