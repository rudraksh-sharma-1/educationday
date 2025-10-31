"use client";

import Hero from "@/components/hero-section";
import EventCard from "@/components/event-card";
import FAQ from "@/components/faq";
import EventSchedule from "@/components/eventSchedule";

export default function HomePage() {
  return (
    <>
      <Hero />
      <EventSchedule />
      <EventCard />
      <FAQ/>
      <main className="pt-20">
        {/* Other homepage sections or routed children can go here */}
      </main>
    </>
  );
}
