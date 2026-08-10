/**
 * SharePoint page destinations for every Home-page entry point.
 *
 * Keep `url` empty until the corresponding SharePoint page is available.
 * Both server-relative URLs and full HTTPS URLs are supported. Examples:
 *   /sites/GSC-Learning/SitePages/Learning-Hub.aspx
 *   https://contoso.sharepoint.com/sites/GSC-Learning/SitePages/Learning-Hub.aspx
 *
 * Use target: "_blank" only for external systems such as an LMS. SharePoint
 * pages should normally keep target: "_self" so navigation replaces Home.
 */
export const sharePointRoutes = Object.freeze({
  essentialLearning: { url: "", target: "_self" },
  upcomingClasses: { url: "", target: "_self" },
  competencyFramework: { url: "", target: "_self" },
  expertsTrainers: { url: "", target: "_self" },
  learningInsights: { url: "", target: "_self" },
});

export function initializeSharePointNavigation(root = document) {
  const links = root.querySelectorAll("[data-sharepoint-route]");

  links.forEach((link) => {
    const routeKey = link.dataset.sharepointRoute;
    const destination = sharePointRoutes[routeKey];
    const configuredUrl = destination?.url?.trim();

    if (!configuredUrl) {
      link.dataset.routeStatus = "pending";
      link.setAttribute("aria-disabled", "true");
      link.addEventListener("click", preventPendingNavigation);
      return;
    }

    link.href = configuredUrl;
    link.target = destination.target || "_self";
    link.dataset.routeStatus = "ready";
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
