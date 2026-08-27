/**
 * SharePoint page destinations for every Home-page entry point.
 *
 * `previewUrl` makes every card work immediately on GitHub Pages and inside
 * the current Embed frame. When the real SharePoint Page exists, fill `url`;
 * it will take priority and navigate the top SharePoint window.
 * Both server-relative URLs and full HTTPS URLs are supported. Examples:
 *   /sites/GSC-Learning/SitePages/Learning-Hub.aspx
 *   https://contoso.sharepoint.com/sites/GSC-Learning/SitePages/Learning-Hub.aspx
 *
 * Use target: "_blank" only for external systems such as an LMS. SharePoint
 * pages should normally keep target: "_self" so navigation replaces Home.
 */
export const sharePointRoutes = Object.freeze({
  essentialLearning: { url: "", previewUrl: "../learning_hub/#essential-learning", target: "_top" },
  upcomingClasses: { url: "", previewUrl: "../learning_hub/#upcoming-classes", target: "_top" },
  competencyFramework: { url: "", previewUrl: "../competency_framework/#role-explorer", target: "_top" },
  expertsTrainers: { url: "", previewUrl: "../experts_trainers/#expert-directory", target: "_top" },
  learningInsights: { url: "", target: "_self" },
});

export function initializeSharePointNavigation(root = document) {
  const links = root.querySelectorAll("[data-sharepoint-route]");

  links.forEach((link) => {
    const routeKey = link.dataset.sharepointRoute;
    const destination = sharePointRoutes[routeKey];
    const configuredUrl = destination?.url?.trim();
    const previewUrl = destination?.previewUrl?.trim();
    const resolvedUrl = configuredUrl || previewUrl;

    if (!resolvedUrl) {
      link.dataset.routeStatus = "pending";
      link.setAttribute("aria-disabled", "true");
      link.addEventListener("click", preventPendingNavigation);
      return;
    }

    link.href = resolvedUrl;
    link.target = configuredUrl ? (destination.target || "_top") : "_self";
    link.dataset.routeStatus = configuredUrl ? "ready" : "preview";
    link.removeAttribute("aria-disabled");

    if (link.target === "_blank") {
      link.rel = "noopener noreferrer";
    }
  });
}

function preventPendingNavigation(event) {
  event.preventDefault();
}

initializeSharePointNavigation();
