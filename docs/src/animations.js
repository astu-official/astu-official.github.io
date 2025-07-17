import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const initAnimations = () => {
  // Scroll-triggered animations for existing sections
  gsap.utils
    .toArray(".timeline-item, .value-card, .project-card, .gallery-item")
    .forEach((element, index) => {
      gsap.from(element, {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: index * 0.1,
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    });

  // Hero section breathing animation enhancement
  gsap.to(".breathing-mountains", {
    scale: 1.02,
    duration: 12,
    ease: "power2.inOut",
    repeat: -1,
    yoyo: true,
  });

  // Micro-interactions for buttons and cards
  document
    .querySelectorAll(
      ".btn, .timeline-content, .value-card, .project-card, .gallery-item"
    )
    .forEach((element) => {
      element.addEventListener("mouseenter", () => {
        gsap.to(element, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
        });
      });

      element.addEventListener("mouseleave", () => {
        gsap.to(element, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });

  // Smooth scroll for navigation links
  document.querySelectorAll('nav a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        gsap.to(window, {
          duration: 1.5,
          scrollTo: {
            y: targetElement,
            offsetY: 100,
          },
          ease: "power2.inOut",
        });
      }
    });
  });

  // Loading animations for page elements
  gsap.from(".hero-content > *", {
    opacity: 0,
    y: 30,
    duration: 1,
    stagger: 0.2,
    delay: 0.5,
    ease: "power2.out",
  });

  // Timeline year hover effects
  document.querySelectorAll(".timeline-year").forEach((year) => {
    year.addEventListener("mouseenter", () => {
      gsap.to(year, {
        scale: 1.1,
        rotation: 5,
        duration: 0.3,
        ease: "back.out(1.7)",
      });
    });

    year.addEventListener("mouseleave", () => {
      gsap.to(year, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });

  // Parallax effect for hero background
  gsap.to(".hero", {
    backgroundPosition: "50% 100%",
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
};
