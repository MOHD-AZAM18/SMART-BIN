import React from "react";
import Hero from "./Hero";
import Awards from "./Awards";

import Pricing from "./Pricing";
import Education from "./Education";

export default function HomePage() {
  return (
    <div className="homepage-wrapper">
      <section className="hero-section" style={{ paddingTop: "var(--nav-height)" }}>
        <Hero />
      </section>

      <section className="awards-section bg-white border-top border-bottom">
        <Awards />
      </section>

     

      <section className="education-section bg-white">
        <Education />
      </section>

      <section className="pricing-section bg-light border-top">
        <Pricing />
      </section>
    </div>
  );
}