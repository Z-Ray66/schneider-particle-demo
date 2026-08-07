const mountHeroIllustrations = () => {
  const landingPage = document.querySelector(".landing-page");

  if (!landingPage) {
    window.requestAnimationFrame(mountHeroIllustrations);
    return;
  }

  // These five link/label modules are independent from the particle canvas.
  landingPage.querySelector(".action-layer")?.remove();

  if (landingPage.querySelector(".hero-illustrations")) return;

  const illustrationLayer = document.createElement("div");
  illustrationLayer.className = "hero-illustrations";
  illustrationLayer.setAttribute("aria-hidden", "true");
  illustrationLayer.innerHTML = `
    <img
      class="hero-illustration hero-illustration-left"
      src="./assets/illustrations/reader-line.png"
      alt=""
    />
    <img
      class="hero-illustration hero-illustration-right"
      src="./assets/illustrations/learner-line.png"
      alt=""
    />
  `;

  landingPage.append(illustrationLayer);
};

mountHeroIllustrations();
