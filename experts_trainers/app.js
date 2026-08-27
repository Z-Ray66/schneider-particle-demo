(function initializeExpertsPage(global, document) {
  "use strict";
  const content = global.EXPERTS_CONTENT || { experts: [], courses: [], topics: [], links: {} };
  const query = (selector, root = document) => root.querySelector(selector);
  const queryAll = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHtml = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  let activeTopic = "All";
  let activeExpertId = content.experts?.[0]?.id || "";
  let toastTimer = 0;

  function safeUrl(value) {
    const candidate = String(value || "").trim();
    if (!candidate) return "";
    try {
      const parsed = new URL(candidate, global.location.href);
      return ["http:", "https:"].includes(parsed.protocol) ? candidate : "";
    } catch {
      return "";
    }
  }

  function showToast(message) {
    const toast = query("[data-toast]");
    if (!toast) return;
    global.clearTimeout(toastTimer); toast.textContent = message; toast.classList.add("is-visible");
    toastTimer = global.setTimeout(() => toast.classList.remove("is-visible"), 3200);
  }

  function actionAttributes(url, label, target = "_top") {
    const safe = safeUrl(url);
    return safe
      ? `href="${escapeHtml(safe)}" target="${escapeHtml(target)}" aria-label="${escapeHtml(label)}"`
      : `href="#" data-pending-link aria-label="${escapeHtml(label)}（链接待配置）"`;
  }

  function profileHref(expertId) {
    return `../expert_profile/?expert=${encodeURIComponent(expertId)}`;
  }

  function renderFeaturedCourse() {
    const root = query("[data-featured-course]");
    const course = content.featuredCourse;
    if (!root || !course) return;
    root.innerHTML = `
      <div class="featured-course__art" aria-hidden="true"><span>Q</span><i></i><i></i><i></i></div>
      <div class="featured-course__copy">
        <span class="featured-course__label">${escapeHtml(course.label)}</span>
        <h2 id="featured-title">${escapeHtml(course.title)}</h2><h3>${escapeHtml(course.titleZh)}</h3>
        <p>${escapeHtml(course.description)}</p>
        <div class="featured-course__meta"><span><b>${escapeHtml(course.rating)}</b> 课程反馈</span><span>${escapeHtml(course.reach)}</span></div>
      </div>
      <a class="round-link" ${actionAttributes(course.url, `查看 ${course.title}`)}>↗</a>`;
  }

  function filteredExperts() {
    return activeTopic === "All" ? content.experts : content.experts.filter((expert) => expert.topic === activeTopic);
  }

  function renderFilters() {
    const root = query("[data-topic-filters]");
    if (!root) return;
    root.innerHTML = content.topics.map((topic) => `<button type="button" data-topic="${escapeHtml(topic)}" class="${topic === activeTopic ? "is-active" : ""}">${escapeHtml(topic)}</button>`).join("");
  }

  function renderExperts() {
    const root = query("[data-expert-grid]");
    const experts = filteredExperts();
    if (!root) return;
    if (!experts.some((expert) => expert.id === activeExpertId)) activeExpertId = experts[0]?.id || "";
    root.innerHTML = experts.map((expert, index) => {
      const courseCount = (expert.courses || []).filter((course) => course.isActive !== false).length;
      return `
      <a class="expert-card ${expert.id === activeExpertId ? "is-active" : ""}" href="${escapeHtml(profileHref(expert.id))}" target="_self" data-expert-id="${escapeHtml(expert.id)}" style="--card-index:${index}" aria-label="查看 ${escapeHtml(expert.name)} 的导师主页和 ${courseCount} 门课程">
        <span class="expert-card__portrait"><b>${escapeHtml(expert.initials)}</b><i></i></span>
        <span class="expert-card__topic">${escapeHtml(expert.topic)}</span>
        <strong>${escapeHtml(expert.name)}</strong><small>${escapeHtml(expert.role)} · ${courseCount} 门课程</small>
        <span class="expert-card__arrow">↗</span>
      </a>`;
    }).join("");
    renderSpotlight();
  }

  function renderSpotlight() {
    const root = query("[data-expert-spotlight]");
    const expert = content.experts.find((item) => item.id === activeExpertId);
    if (!root || !expert) return;
    query("[data-hero-initials]").textContent = expert.initials;
    root.innerHTML = `
      <div class="spotlight-head"><span>${escapeHtml(expert.initials)}</span><div><small>SELECTED EXPERT</small><strong>${escapeHtml(expert.name)}</strong><b>${escapeHtml(expert.role)}</b></div></div>
      <blockquote>“${escapeHtml(expert.statement)}”</blockquote>
      <div class="spotlight-tags">${expert.expertise.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
      <dl><div><dt>Languages</dt><dd>${escapeHtml(expert.languages.join(" · "))}</dd></div><div><dt>Connect</dt><dd>${escapeHtml(expert.availability)}</dd></div><div><dt>Location</dt><dd>${escapeHtml(expert.location)}</dd></div></dl>
      <div class="spotlight-actions">
        <a class="spotlight-actions__profile" href="${escapeHtml(profileHref(expert.id))}" target="_self">查看导师课程 <span>→</span></a>
        <a class="spotlight-actions__contact" ${actionAttributes(expert.contactUrl, `联系 ${expert.name}`)}>联系 / 预约 <span>↗</span></a>
      </div>`;
  }

  function renderCourses() {
    const root = query("[data-course-rail]");
    if (!root) return;
    root.innerHTML = content.courses.map((course, index) => `
      <a class="course-card reveal-item course-card--${escapeHtml(course.accent)}" style="--delay:${index * 90}ms" ${actionAttributes(course.url, `打开 ${course.title}`)}>
        <span class="course-card__index">0${index + 1}</span><small>${escapeHtml(course.label)}</small>
        <h3>${escapeHtml(course.title)}</h3><p>${escapeHtml(course.titleZh)}</p><b>${escapeHtml(course.meta)}</b><i>↗</i>
      </a>`).join("");
  }

  function initializeInteractions() {
    query("[data-topic-filters]")?.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-topic]"); if (!button) return;
      activeTopic = button.dataset.topic; renderFilters(); renderExperts();
    });
    const previewExpert = (event) => {
      const card = event.target.closest("[data-expert-id]"); if (!card) return;
      if (card.dataset.expertId === activeExpertId) return;
      activeExpertId = card.dataset.expertId;
      queryAll("[data-expert-id]").forEach((item) => item.classList.toggle("is-active", item === card));
      renderSpotlight();
    };
    query("[data-expert-grid]")?.addEventListener("pointerover", previewExpert);
    query("[data-expert-grid]")?.addEventListener("focusin", previewExpert);
    document.addEventListener("click", (event) => {
      const pending = event.target.closest("[data-pending-link]");
      if (!pending) return; event.preventDefault(); showToast("入口已预留，填写正式 SharePoint、LMS 或预约页面网址后即可使用。");
    });
    queryAll("[data-action-key]").forEach((link) => {
      const url = safeUrl(content.links?.[link.dataset.actionKey]);
      if (url) { link.href = url; link.target = "_top"; }
      else link.setAttribute("data-pending-link", "");
    });
  }

  function initializeReveal() {
    const items = queryAll(".reveal-item");
    if (global.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in global)) { items.forEach((item) => item.classList.add("is-visible")); return; }
    const observer = new IntersectionObserver((entries, current) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); current.unobserve(entry.target); } }), { threshold: .12, rootMargin: "0px 0px -6%" });
    items.forEach((item, index) => { if (!item.style.getPropertyValue("--delay")) item.style.setProperty("--delay", `${(index % 4) * 75}ms`); observer.observe(item); });
  }

  renderFeaturedCourse(); renderFilters(); renderExperts(); renderCourses(); initializeInteractions(); initializeReveal();
  const requestedId = global.location.hash.replace(/^#/, "");
  if (requestedId) global.setTimeout(() => document.getElementById(requestedId)?.scrollIntoView({ block: "start" }), 40);
})(window, document);
