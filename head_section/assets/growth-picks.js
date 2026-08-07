const growthSection = document.querySelector(".growth-section");

if (growthSection) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    growthSection.classList.add("is-visible");
  } else {
    growthSection.classList.add("growth-motion-ready");

    const revealObserver = new IntersectionObserver(
      ([entry], observer) => {
        if (!entry?.isIntersecting) return;

        growthSection.classList.add("is-visible");
        observer.unobserve(growthSection);
      },
      {
        rootMargin: "0px 0px -12%",
        threshold: 0.08,
      },
    );

    revealObserver.observe(growthSection);
  }
}
