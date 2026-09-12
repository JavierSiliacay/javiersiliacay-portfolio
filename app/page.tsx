"use client";

import { motion, type Variants } from "framer-motion";
import Hero from "./components/sections/Hero";
import SpotlightDeck from "./components/SpotlightDeck";
import TechStack from "./components/sections/TechStack";
import Projects from "./components/sections/Projects";
import About from "./components/sections/About";
import Contact from "./components/sections/Contact";
import Footer from "./components/sections/Footer";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function Home() {
  return (
    <div className="flex flex-col w-full relative">
      {/* 1. Hero Section with Animated Shades Portrait */}
      <Hero />

      {/* 2. Interactive 3D Spotlight Card Deck (Signature Bryl Lim aesthetic) */}
      <section className="px-4 sm:px-6 lg:px-12 max-w-6xl mx-auto w-full">
        <SpotlightDeck />
      </section>

      {/* 3. Featured Real-World Projects & Case Studies */}
      <section id="projects" className="py-16 px-4 sm:px-6 lg:px-12 max-w-6xl mx-auto w-full scroll-mt-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={sectionVariants}
        >
          <Projects />
        </motion.div>
      </section>

      {/* 4. Technical Capabilities & Pillars */}
      <section id="capabilities" className="py-16 px-4 sm:px-6 lg:px-12 max-w-6xl mx-auto w-full scroll-mt-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={sectionVariants}
        >
          <TechStack />
        </motion.div>
      </section>

      {/* 5. Engineering Profile, Credibility & Experience */}
      <section id="experience" className="py-16 px-4 sm:px-6 lg:px-12 max-w-6xl mx-auto w-full scroll-mt-16">
        <div id="about" className="scroll-mt-16" />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={sectionVariants}
        >
          <About />
        </motion.div>
      </section>

      {/* 6. Direct Contact */}
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-12 max-w-6xl mx-auto w-full scroll-mt-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={sectionVariants}
        >
          <Contact />
        </motion.div>
      </section>

      {/* 8. Minimalist Footer */}
      <Footer />
    </div>
  );
}
