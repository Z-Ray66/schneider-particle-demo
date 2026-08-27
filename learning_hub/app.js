(function initializeLearningHub(global, document) {
  "use strict";

  const content = global.LEARNING_HUB_CONTENT || { courses: [], replays: [] };
  const config = global.LEARNING_HUB_CONFIG || { routes: {} };
  const state = { courseTopic: "all", replayTopic: "all" };
  const topicColors = { Quality: "#3dcd58", Leadership: "#3f9fe8", Digital: "#8e72df", Operations: "#efad39", Compliance: "#c8f43d" };
  const query = (selector, root = document) => root.querySelector(selector);
  const queryAll = (selector, root = document) => [...root.querySelectorAll(selector)];
  let toastTimer = 0;

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

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

  function linkAttributes(url, label, target = "_self") {
    const safe = safeUrl(url);
    if (!safe) return `href="#" data-pending-link aria-label="${escapeHtml(label)}（链接待配置）"`;
    const external = target === "_blank" ? ' target="_blank" rel="noopener noreferrer"' : ` target="${escapeHtml(target)}"`;
    return `href="${escapeHtml(safe)}"${external} aria-label="${escapeHtml(label)}"`;
  }

  function courseHref(courseId) {
    return `../learning_course/?course=${encodeURIComponent(courseId)}`;
  }

  function parseDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function dateParts(value) {
    const date = parseDate(value);
    if (!date) return { day: "--", month: "TBD" };
    return {
      day: new Intl.DateTimeFormat("en-US", { day: "2-digit" }).format(date),
      month: new Intl.DateTimeFormat("en-US", { month: "short" }).format(date).toUpperCase(),
    };
  }

  function formatDate(value, includeTime = false) {
    const date = parseDate(value);
    if (!date) return "日期待定";
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric", month: "2-digit", day: "2-digit",
      ...(includeTime ? { hour: "2-digit", minute: "2-digit", hour12: false } : {}),
    }).format(date);
  }

  function activeCourses(type) {
    return content.courses
      .filter((course) => course.isActive !== false && course.type === type)
      .sort((left, right) => Number(left.sortOrder || 0) - Number(right.sortOrder || 0));
  }

  function seatsLabel(course) {
    const seats = Number(course.seatsLeft);
    if (!Number.isFinite(seats)) return "无需选座";
    return seats > 0 ? `剩余 ${seats} 席` : "开放候补";
  }

  function showToast(message) {
    const toast = query("[data-toast]");
    if (!toast) return;
    global.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = global.setTimeout(() => toast.classList.remove("is-visible"), 3200);
  }

  function initializeRoutes() {
    queryAll("[data-route]").forEach((link) => {
      const route = config.routes?.[link.dataset.route];
      const destination = safeUrl(route?.url);
      if (!destination) {
        link.dataset.routeStatus = "pending";
        link.setAttribute("aria-disabled", "true");
        return;
      }
      link.href = destination;
      link.target = route.target || "_self";
      link.dataset.routeStatus = "ready";
      link.removeAttribute("aria-disabled");
      if (link.target === "_blank") link.rel = "noopener noreferrer";
    });
  }

  function initializeRevealMotion() {
    const items = queryAll(".reveal-item:not([data-reveal-bound])");
    if (global.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in global)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries, current) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        current.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7%" });
    items.forEach((item) => {
      item.dataset.revealBound = "true";
      observer.observe(item);
    });
  }

  function renderEssential() {
    const root = query("[data-essential-list]");
    if (!root) return;
    const courses = activeCourses("essential");
    if (!courses.length) {
      root.innerHTML = '<div class="empty-state"><strong>当前没有启用的必修课程</strong><span>在 content.js 中启用课程后会自动显示。</span></div>';
      return;
    }
    root.innerHTML = courses.map((course, index) => `
      <a class="essential-course-card reveal-item" href="${escapeHtml(courseHref(course.id))}" target="_self" style="--delay:${index * 80}ms" aria-label="查看必修课程 ${escapeHtml(course.titleZh || course.title)}">
        <span class="essential-course-card__index">${String(index + 1).padStart(2, "0")}</span>
        <span class="essential-course-card__status">${escapeHtml(course.status)}</span>
        <span class="essential-course-card__topic">${escapeHtml(course.topic)}</span>
        <strong>${escapeHtml(course.title)}</strong>
        <b>${escapeHtml(course.titleZh)}</b>
        <span class="essential-course-card__summary">${escapeHtml(course.summary)}</span>
        <span class="essential-course-card__due"><small>DUE DATE</small>${escapeHtml(formatDate(course.dueDate))}</span>
        <span class="essential-course-card__arrow" aria-hidden="true">→</span>
      </a>`).join("");
  }

  function renderClasses() {
    const root = query("[data-upcoming-list]");
    if (!root) return;
    const courses = activeCourses("upcoming").filter((course) => state.courseTopic === "all" || course.topic === state.courseTopic);
    if (!courses.length) {
      root.innerHTML = '<div class="empty-state"><strong>没有符合条件的课程</strong><span>请选择其他课程主题。</span></div>';
      return;
    }
    root.innerHTML = courses.map((course, index) => {
      const date = dateParts(course.startDate);
      const limited = Number(course.seatsLeft) <= 6 ? "is-limited" : "";
      const accent = topicColors[course.topic] || topicColors.Quality;
      return `
        <a class="course-card reveal-item" href="${escapeHtml(courseHref(course.id))}" target="_self" style="--card-accent:${accent};--delay:${index * 75}ms" aria-label="查看课程 ${escapeHtml(course.titleZh || course.title)}">
          <div class="course-card__top"><div class="date-badge"><strong>${escapeHtml(date.day)}</strong><span>${escapeHtml(date.month)}</span></div><span class="course-card__status ${limited}">${escapeHtml(course.status)}</span></div>
          <span class="course-card__topic">${escapeHtml(course.topic)}</span>
          <h3>${escapeHtml(course.title)}</h3><p class="course-card__zh">${escapeHtml(course.titleZh)}</p>
          <ul class="course-card__facts" aria-label="课程信息"><li>${escapeHtml(course.format)}</li><li>${escapeHtml(course.language)}</li><li>${escapeHtml(seatsLabel(course))}</li></ul>
          <span class="course-card__arrow" aria-hidden="true">→</span>
        </a>`;
    }).join("");
    initializeRevealMotion();
  }

  function renderRecommended() {
    const root = query("[data-recommended-list]");
    if (!root) return;
    const courses = activeCourses("upcoming").filter((course) => course.recommended === true);
    if (!courses.length) {
      root.innerHTML = '<div class="recommended-empty">当前暂无推荐课程</div>';
      return;
    }
    root.innerHTML = courses.map((course, index) => `
      <a class="recommended-course" href="${escapeHtml(courseHref(course.id))}" target="_self">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <div><small>${escapeHtml(course.topic)} · ${escapeHtml(formatDate(course.startDate))}</small><strong>${escapeHtml(course.title)}</strong><b>${escapeHtml(course.titleZh)}</b></div>
        <em>${escapeHtml(seatsLabel(course))}</em><i aria-hidden="true">↗</i>
      </a>`).join("");
  }

  function renderReplays() {
    const root = query("[data-replay-list]");
    if (!root) return;
    const replays = content.replays
      .filter((replay) => replay.isActive !== false && (state.replayTopic === "all" || replay.topic === state.replayTopic))
      .sort((left, right) => Number(left.sortOrder || 0) - Number(right.sortOrder || 0));
    query("[data-replay-count]").textContent = String(replays.length);
    root.innerHTML = replays.map((item) => `
      <a class="replay-item reveal-item" ${linkAttributes(item.url, `播放 ${item.title}`, "_blank")}>
        <span class="replay-item__date">${escapeHtml(formatDate(item.sessionDate))}</span>
        <div><span class="replay-item__topic">${escapeHtml(item.topic)}</span><h3>${escapeHtml(item.title)}</h3><p class="replay-item__zh">${escapeHtml(item.titleZh)}</p></div>
        <span class="replay-item__speaker"><small>Speaker</small><strong>${escapeHtml(item.speaker)}</strong><em>${escapeHtml(item.duration)}</em></span>
        <span class="replay-item__play" aria-hidden="true">▶</span>
      </a>`).join("");
    initializeRevealMotion();
  }

  function initializeInteractions() {
    query("[data-topic-filters]")?.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-topic]");
      if (!button) return;
      state.courseTopic = button.dataset.topic || "all";
      queryAll("button[data-topic]", event.currentTarget).forEach((item) => item.classList.toggle("is-active", item === button));
      renderClasses();
    });
    query("[data-replay-topic]")?.addEventListener("change", (event) => {
      state.replayTopic = event.target.value;
      renderReplays();
    });
    document.addEventListener("click", (event) => {
      const pending = event.target.closest('[data-route-status="pending"], [data-pending-link]');
      if (!pending) return;
      event.preventDefault();
      showToast("这个业务入口已经预留，填写正式的 SharePoint、LMS 或视频网址后即可使用。");
    });
  }

  function initializePage() {
    const essential = activeCourses("essential");
    const upcoming = activeCourses("upcoming");
    query("[data-hero-essential-count]").textContent = String(essential.length).padStart(2, "0");
    query("[data-hero-class-count]").textContent = String(upcoming.length).padStart(2, "0");
    initializeRoutes();
    renderEssential();
    renderClasses();
    renderRecommended();
    renderReplays();
    initializeInteractions();
    initializeRevealMotion();
    const requestedId = global.location.hash.replace(/^#/, "");
    if (requestedId) global.setTimeout(() => document.getElementById(requestedId)?.scrollIntoView({ block: "start" }), 40);
  }

  initializePage();
})(window, document);
