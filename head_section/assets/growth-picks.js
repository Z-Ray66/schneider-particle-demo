const growthSection = document.querySelector(".growth-section");
const updatesSection = document.querySelector(".updates-section");

function initializeRevealSection(section, readyClass) {
  if (!section) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    section.classList.add("is-visible");
  } else {
    section.classList.add(readyClass);

    const revealObserver = new IntersectionObserver(
      ([entry], observer) => {
        if (!entry?.isIntersecting) return;

        section.classList.add("is-visible");
        observer.unobserve(section);
      },
      {
        rootMargin: "0px 0px -12%",
        threshold: 0.08,
      },
    );

    revealObserver.observe(section);
  }
}

initializeRevealSection(growthSection, "growth-motion-ready");
initializeRevealSection(updatesSection, "updates-motion-ready");
