const illustrationAssets = [
  {
    className: "hero-illustration hero-illustration-left",
    src: new URL("./illustrations/reader-line.png", import.meta.url).href,
    width: 1371,
    height: 1148,
  },
  {
    className: "hero-illustration hero-illustration-right",
    src: new URL("./illustrations/learner-line.png", import.meta.url).href,
    width: 1086,
    height: 1448,
  },
];

const prepareIllustration = ({ className, src, width, height }) => {
  const image = new Image(width, height);
  image.className = className;
  image.alt = "";
  image.decoding = "sync";
  image.fetchPriority = "high";
  image.loading = "eager";

  const ready = new Promise((resolve) => {
    const finish = async () => {
      try {
        await image.decode();
      } catch {
        // Completed images can still paint when explicit decoding is unavailable.
      }
      resolve(image);
    };

    image.addEventListener("load", finish, { once: true });
    image.addEventListener("error", () => resolve(null), { once: true });
  });

  image.src = src;

  if (image.complete && image.naturalWidth > 0) {
    return image.decode().catch(() => undefined).then(() => image);
  }

  return ready;
};

const waitForLandingPage = () =>
  new Promise((resolve) => {
    const findLandingPage = () => {
      const landingPage = document.querySelector(".landing-page");

      if (landingPage) {
        resolve(landingPage);
        return;
      }

      window.requestAnimationFrame(findLandingPage);
    };

    findLandingPage();
  });

const mountHeroIllustrations = async () => {
  const [landingPage, illustrations] = await Promise.all([
    waitForLandingPage(),
    Promise.all(illustrationAssets.map(prepareIllustration)),
  ]);

  // These five link/label modules are independent from the particle canvas.
  landingPage.querySelector(".action-layer")?.remove();

  if (landingPage.querySelector(".hero-illustrations")) return;

  const illustrationLayer = document.createElement("div");
  illustrationLayer.className = "hero-illustrations";
  illustrationLayer.setAttribute("aria-hidden", "true");
  illustrationLayer.append(...illustrations.filter(Boolean));
  landingPage.append(illustrationLayer);
};

mountHeroIllustrations();
