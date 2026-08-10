(function initializeLearningHub(global, document) {
  "use strict";

  const config = global.LEARNING_HUB_CONFIG || {};
  const providerFactory = global.LearningHubDataProvider;
  const provider = providerFactory?.create(config);
  const state = {
    data: null,
    searchTerm: "",
    courseTopic: "all",
    replayTopic: "all",
  };

  const topicColors = {
    Quality: "#3dcd58",
    Leadership: "#3f9fe8",
    Digital: "#8e72df",
    Operations: "#efad39",
  };

  const pathColors = {
    green: "#148f58",
    blue: "#2f77d0",
    violet: "#7555bd",
    amber: "#bd7d16",
  };

  const communityColors = {
    lime: "#c8f43d",
    mint: "#75e0a0",
    amber: "#f4c34f",
  };

  const query = (selector, root = document) => root.querySelector(selector);
  const queryAll = (selector, root = document) => [...root.querySelectorAll(selector)];

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function safeUrl(value) {
    const url = String(value || "").trim();
    if (!url) return "";

    try {
      const parsed = new URL(url, global.location.href);
      if (!['http:', 'https:'].includes(parsed.protocol)) return "";
      return url;
    } catch {
      return "";
    }
  }

  function linkAttributes(url, label, target = "_self") {
    const safe = safeUrl(url);
    const targetAttributes = target === "_blank"
      ? ' target="_blank" rel="noopener noreferrer"'
      : "";
    return safe
      ? `href="${escapeHtml(safe)}"${targetAttributes} aria-label="${escapeHtml(label)}"`
      : `href="#" data-pending-link aria-label="${escapeHtml(label)}（链接待配置）"`;
  }

  function normalize(value) {
    return String(value || "").toLocaleLowerCase("zh-CN").replace(/\s+/g, " ").trim();
  }

  function matchesSearch(item) {
    const term = normalize(state.searchTerm);
    if (!term) return true;
    return normalize(Object.values(item || {}).join(" ")).includes(term);
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

  function formatDate(value, options = {}) {
    const date = parseDate(value);
    if (!date) return "日期待定";
    return new Intl.DateTimeFormat(options.locale || "zh-CN", {
      year: options.year || "numeric",
      month: options.month || "2-digit",
      day: options.day || "2-digit",
    }).format(date);
  }

  let toastTimer = 0;
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
      const routeKey = link.dataset.route;
      const route = config.routes?.[routeKey];
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

  function initializeChrome() {
    const header = query("[data-header]");
    const menuButton = query("[data-menu-toggle]");
    const navigation = query("[data-navigation]");

    const updateHeader = () => header?.classList.toggle("is-scrolled", global.scrollY > 22);
    updateHeader();
    global.addEventListener("scroll", updateHeader, { passive: true });

    menuButton?.addEventListener("click", () => {
      const willOpen = !navigation?.classList.contains("is-open");
      navigation?.classList.toggle("is-open", willOpen);
      menuButton.setAttribute("aria-expanded", String(willOpen));
      document.body.classList.toggle("menu-open", willOpen);
    });

    navigation?.addEventListener("click", (event) => {
      if (!event.target.closest("a")) return;
      navigation.classList.remove("is-open");
      menuButton?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });

    document.addEventListener("click", (event) => {
      const pendingLink = event.target.closest('[data-route-status="pending"], [data-pending-link]');
      if (!pendingLink) return;
      event.preventDefault();
      showToast("这个业务入口已经预留。填写 SharePoint 或 LMS 的正式网址后即可跳转。");
    });
  }

  function initializeRevealMotion() {
    const items = queryAll(".reveal-item:not([data-reveal-bound])");
    const reducedMotion = global.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion || !("IntersectionObserver" in global)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7%" },
    );

    items.forEach((item) => {
      item.dataset.revealBound = "true";
      observer.observe(item);
    });
  }

  function renderEssential(item) {
    const root = query("[data-essential-card]");
    if (!root) return;

    if (!item) {
      root.innerHTML = `
        <div class="essential-card__content">
          <span class="essential-card__label">ESSENTIAL LEARNING</span>
          <h2 id="essential-title">本月暂无新增必学任务</h2>
          <p class="essential-card__summary">SharePoint List 中新增启用项目后，此处会自动显示。</p>
        </div>`;
      return;
    }

    const label = item.title || "Essential Learning";
    root.innerHTML = `
      <div class="essential-card__content">
        <div class="essential-card__topline">
          <span class="essential-card__label">ESSENTIAL LEARNING · THIS MONTH</span>
          <span class="essential-card__status">${escapeHtml(item.status || "Action required")}</span>
        </div>
        <h2 id="essential-title">${escapeHtml(label)}</h2>
        <p class="essential-card__title-zh">${escapeHtml(item.titleZh)}</p>
        <p class="essential-card__summary">${escapeHtml(item.summary)}</p>
      </div>
      <div class="essential-card__action">
        <div class="essential-card__due">
          <span>Due date</span>
          <strong>${escapeHtml(formatDate(item.dueDate, { year: undefined }))}</strong>
        </div>
        <a class="round-action" ${linkAttributes(item.url || config.routes?.essentialLearning?.url, `打开 ${label}`, config.routes?.essentialLearning?.target)}>
          <span aria-hidden="true">↗</span>
        </a>
      </div>`;
  }

  function renderClasses() {
    const root = query("[data-upcoming-list]");
    if (!root || !state.data) return;

    const items = state.data.upcomingClasses.filter((item) => {
      const matchesTopic = state.courseTopic === "all" || item.topic === state.courseTopic;
      return matchesTopic && matchesSearch(item);
    });

    if (!items.length) {
      root.innerHTML = emptyState("没有找到符合条件的课程", "尝试更换主题或搜索关键词。");
      return;
    }

    root.innerHTML = items.map((item) => {
      const date = dateParts(item.startDate);
      const statusClass = Number(item.seatsLeft) <= 6 ? "is-limited" : "";
      const accent = topicColors[item.topic] || topicColors.Quality;
      const label = `${item.title} ${item.titleZh}`;
      return `
        <a class="course-card reveal-item" style="--card-accent:${accent}" ${linkAttributes(item.url, label, config.contentLinkTarget)}>
          <div class="course-card__top">
            <div class="date-badge"><strong>${escapeHtml(date.day)}</strong><span>${escapeHtml(date.month)}</span></div>
            <span class="course-card__status ${statusClass}">${escapeHtml(item.status)}</span>
          </div>
          <span class="course-card__topic">${escapeHtml(item.topic)}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p class="course-card__zh">${escapeHtml(item.titleZh)}</p>
          <ul class="course-card__facts" aria-label="课程信息">
            <li>${escapeHtml(item.format)}</li>
            <li>${escapeHtml(item.language)}</li>
            <li>${Number(item.seatsLeft) > 0 ? `${escapeHtml(item.seatsLeft)} seats` : "Waitlist"}</li>
          </ul>
          <span class="course-card__arrow" aria-hidden="true">→</span>
        </a>`;
    }).join("");

    initializeRevealMotion();
  }

  function renderPaths() {
    const root = query("[data-path-list]");
    if (!root || !state.data) return;
    const items = state.data.learningPaths.filter(matchesSearch);

    if (!items.length) {
      root.innerHTML = emptyState("没有找到匹配的学习路径", "请尝试搜索其他岗位、能力或主题。");
      return;
    }

    root.innerHTML = items.map((item, index) => {
      const color = pathColors[item.theme] || pathColors.green;
      const label = `${item.title} ${item.titleZh}`;
      return `
        <a class="path-card reveal-item" style="--path-color:${color}" ${linkAttributes(item.url, label, config.contentLinkTarget)}>
          <div class="path-card__content">
            <span class="path-card__audience">FOR ${escapeHtml(item.audience)}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p class="path-card__zh">${escapeHtml(item.titleZh)}</p>
            <p class="path-card__summary">${escapeHtml(item.summary)}</p>
            <div class="path-card__stats">
              <span>${escapeHtml(item.moduleCount)} modules</span>
              <span>${escapeHtml(item.duration)}</span>
            </div>
          </div>
          <div class="path-card__visual" aria-hidden="true"><span class="path-card__number">${String(index + 1).padStart(2, "0")}</span></div>
        </a>`;
    }).join("");

    initializeRevealMotion();
  }

  function renderReplays() {
    const root = query("[data-replay-list]");
    if (!root || !state.data) return;
    const items = state.data.replays.filter((item) => {
      const matchesTopic = state.replayTopic === "all" || item.topic === state.replayTopic;
      return matchesTopic && matchesSearch(item);
    });

    const count = query("[data-replay-count]");
    if (count) count.textContent = String(items.length);

    if (!items.length) {
      root.innerHTML = emptyState("没有找到匹配的回放", "调整主题筛选或换一个关键词试试。");
      return;
    }

    root.innerHTML = items.map((item) => {
      const label = `播放 ${item.title}`;
      return `
        <a class="replay-item reveal-item" ${linkAttributes(item.url, label, config.contentLinkTarget)}>
          <span class="replay-item__date">${escapeHtml(formatDate(item.sessionDate, { locale: "en-GB", year: "numeric", month: "short", day: "2-digit" }))}</span>
          <div>
            <span class="replay-item__topic">${escapeHtml(item.topic)}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <span class="replay-item__zh">${escapeHtml(item.titleZh)}</span>
          </div>
          <span class="replay-item__speaker"><strong>${escapeHtml(item.speaker)}</strong>${escapeHtml(item.duration)}</span>
          <span class="replay-item__play" aria-hidden="true">▶</span>
        </a>`;
    }).join("");

    initializeRevealMotion();
  }

  function renderCommunities() {
    const root = query("[data-community-list]");
    if (!root || !state.data) return;
    const items = state.data.communities.filter(matchesSearch);

    if (!items.length) {
      root.innerHTML = emptyState("没有找到匹配的学习社群", "可以搜索 Digital、Quality 或 Lean 等主题。");
      return;
    }

    root.innerHTML = items.map((item) => {
      const initials = String(item.title || "LH")
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();
      const color = communityColors[item.theme] || communityColors.lime;
      const label = `进入 ${item.title}`;
      return `
        <a class="community-card reveal-item" style="--community-accent:${color}" ${linkAttributes(item.url, label, config.contentLinkTarget)}>
          <span class="community-card__initials">${escapeHtml(initials)}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p class="community-card__zh">${escapeHtml(item.titleZh)}</p>
          <p class="community-card__summary">${escapeHtml(item.summary)}</p>
          <div class="community-card__meta">
            <span>${escapeHtml(item.memberCount)} members · ${escapeHtml(item.cadence)}</span>
            <span>Join ↗</span>
          </div>
        </a>`;
    }).join("");

    initializeRevealMotion();
  }

  function emptyState(title, detail) {
    return `<div class="empty-state"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(detail)}</span></div>`;
  }

  function renderAll() {
    renderClasses();
    renderPaths();
    renderReplays();
    renderCommunities();
  }

  function initializeFilters() {
    query("[data-topic-filters]")?.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-topic]");
      if (!button) return;
      state.courseTopic = button.dataset.topic || "all";
      queryAll("button[data-topic]", event.currentTarget).forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });
      renderClasses();
    });

    query("[data-replay-topic]")?.addEventListener("change", (event) => {
      state.replayTopic = event.target.value;
      renderReplays();
    });

    const form = query("[data-global-search]");
    const input = query("#learning-search");
    let inputTimer = 0;

    const applySearch = () => {
      state.searchTerm = input?.value || "";
      renderAll();
    };

    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      applySearch();
      query("#upcoming-classes")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    input?.addEventListener("input", () => {
      global.clearTimeout(inputTimer);
      inputTimer = global.setTimeout(applySearch, 180);
    });
  }

  function updateSourceStatus(data) {
    const banner = query("[data-connection-banner]");
    const label = query("[data-source-label]");
    const panel = query("[data-integration-panel]");

    if (panel) panel.hidden = config.showIntegrationPanel === false;

    if (data.source === "sharepoint") {
      if (label) label.textContent = "Live · SharePoint Lists";
      banner?.classList.add("is-live");
      return;
    }

    if (data.source === "fallback") {
      if (label) label.textContent = "Preview fallback";
      showToast(`SharePoint 暂未连接，当前显示示例数据：${data.sourceError}`);
      return;
    }

    if (label) label.textContent = "Preview data";
  }

  async function loadData() {
    if (!provider) throw new Error("数据提供器未加载。请检查 data-provider.js。");
    const data = await provider.getPageData();
    state.data = {
      ...data,
      upcomingClasses: Array.isArray(data.upcomingClasses) ? data.upcomingClasses : [],
      learningPaths: Array.isArray(data.learningPaths) ? data.learningPaths : [],
      replays: Array.isArray(data.replays) ? data.replays : [],
      communities: Array.isArray(data.communities) ? data.communities : [],
    };

    const classCount = query("[data-hero-class-count]");
    const pathCount = query("[data-hero-path-count]");
    if (classCount) classCount.textContent = String(state.data.upcomingClasses.length).padStart(2, "0");
    if (pathCount) pathCount.textContent = String(state.data.learningPaths.length).padStart(2, "0");

    renderEssential(state.data.essentialLearning);
    renderAll();
    updateSourceStatus(state.data);
  }

  function renderLoadError(error) {
    const message = error instanceof Error ? error.message : String(error);
    const errorMarkup = `<div class="error-state"><strong>内容暂时无法加载</strong><span>${escapeHtml(message)}</span></div>`;
    ["[data-upcoming-list]", "[data-path-list]", "[data-replay-list]", "[data-community-list]"]
      .forEach((selector) => {
        const root = query(selector);
        if (root) root.innerHTML = errorMarkup;
      });
    showToast("Learning Hub 数据加载失败，请检查配置或稍后重试。");
  }

  function init() {
    initializeRoutes();
    initializeChrome();
    initializeFilters();
    initializeRevealMotion();
    loadData().catch(renderLoadError);
  }

  init();
})(window, document);
