(function initializeCoursePage(global, document) {
  "use strict";

  const content = global.LEARNING_HUB_CONTENT || { courses: [] };
  const query = (selector, root = document) => root.querySelector(selector);
  const escapeHtml = (value) => String(value ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
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

  function parseDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function formatDate(value, includeTime = false) {
    const date = parseDate(value);
    if (!date) return "待定";
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric", month: "2-digit", day: "2-digit",
      ...(includeTime ? { hour: "2-digit", minute: "2-digit", hour12: false } : {}),
    }).format(date);
  }

  function formatHeroDate(value) {
    const date = parseDate(value);
    if (!date) return { primary: "TBD", secondary: "日期待定" };
    return {
      primary: new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit" }).format(date).toUpperCase(),
      secondary: new Intl.DateTimeFormat("zh-CN", { year: "numeric", weekday: "short" }).format(date),
    };
  }

  function showToast(message) {
    const toast = query("[data-toast]");
    if (!toast) return;
    global.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = global.setTimeout(() => toast.classList.remove("is-visible"), 3400);
  }

  function renderFacts(course) {
    const isEssential = course.type === "essential";
    const facts = isEssential
      ? [["Completion", formatDate(course.dueDate)], ["Format", course.format], ["Language", course.language], ["Audience", course.audience]]
      : [["Starts", formatDate(course.startDate, true)], ["Format", course.format], ["Language", course.language], ["Location", course.location]];
    query("[data-hero-facts]").innerHTML = facts.map(([label, value]) => `<div><small>${escapeHtml(label)}</small><strong>${escapeHtml(value || "待定")}</strong></div>`).join("");
  }

  function renderDetails(course) {
    const isEssential = course.type === "essential";
    const rows = [
      ["课程类型", isEssential ? "企业必修" : "近期开课"],
      ["讲师 / 团队", course.instructor],
      ["适合人群", course.audience],
      ["授课方式", course.format],
      ["地点", course.location],
      ["语言", course.language],
    ];
    if (isEssential) {
      rows.push(["完成截止", formatDate(course.dueDate, true)]);
    } else {
      rows.push(["开始时间", formatDate(course.startDate, true)]);
      rows.push(["结束时间", formatDate(course.endDate, true)]);
      rows.push(["报名截止", formatDate(course.registrationDeadline, true)]);
      rows.push(["课程席位", `${Number(course.totalSeats) || 0} 个 · ${Number(course.seatsLeft) > 0 ? `剩余 ${Number(course.seatsLeft)} 个` : "开放候补"}`]);
    }
    query("[data-course-details]").innerHTML = rows.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value || "待定")}</dd></div>`).join("");
  }

  function renderSeatStatus(course) {
    const meter = query("[data-seat-meter]");
    const isEssential = course.type === "essential";
    if (isEssential) {
      query("[data-seat-label]").textContent = "无需选座";
      query("[data-seat-progress]").style.width = "100%";
      meter.classList.add("is-unlimited");
      return;
    }
    const total = Math.max(0, Number(course.totalSeats) || 0);
    const left = Math.max(0, Number(course.seatsLeft) || 0);
    const occupied = total > 0 ? Math.min(100, Math.max(0, ((total - left) / total) * 100)) : 0;
    query("[data-seat-label]").textContent = left > 0 ? `${left} / ${total} 剩余` : `0 / ${total} · 候补`;
    query("[data-seat-progress]").style.width = `${occupied}%`;
  }

  function initializeReveal() {
    const items = [...document.querySelectorAll(".reveal-item:not(.is-visible)")];
    if (global.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in global)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries, current) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      current.unobserve(entry.target);
    }), { threshold: 0.12, rootMargin: "0px 0px -5%" });
    items.forEach((item) => observer.observe(item));
  }

  function renderCourse(course) {
    const isEssential = course.type === "essential";
    const anchor = isEssential ? "essential-learning" : "upcoming-classes";
    const heroDate = formatHeroDate(isEssential ? course.dueDate : course.startDate);
    document.title = `${course.title} | Learning Hub`;
    query("[data-course-page]").hidden = false;
    query("[data-course-error]").hidden = true;
    query("[data-back-link]").href = `../learning_hub/#${anchor}`;
    query("[data-course-type]").textContent = isEssential ? "ESSENTIAL LEARNING" : "UPCOMING CLASS";
    query("[data-recommended-badge]").hidden = course.recommended !== true;
    query("[data-course-title]").textContent = course.title;
    query("[data-course-title-zh]").textContent = course.titleZh;
    query("[data-course-summary]").textContent = course.summary;
    query("[data-course-topic]").textContent = course.topic;
    query("[data-course-status]").textContent = course.status;
    query("[data-date-primary]").textContent = heroDate.primary;
    query("[data-date-secondary]").textContent = isEssential ? `完成截止 · ${heroDate.secondary}` : heroDate.secondary;
    query("[data-course-description]").textContent = course.description;
    query("[data-learning-outcomes]").innerHTML = (course.learningOutcomes || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    renderSeatStatus(course);
    renderFacts(course);
    renderDetails(course);

    query("[data-action-title]").textContent = isEssential ? "按时完成必修学习" : "为你的下一次实践预留席位";
    query("[data-action-description]").textContent = isEssential
      ? `请在 ${formatDate(course.dueDate)} 前完成课程并确认学习记录。`
      : `${course.status}，当前${Number(course.seatsLeft) > 0 ? `还有 ${Number(course.seatsLeft)} 个席位` : "已开放候补"}。`;
    query("[data-action-label]").textContent = isEssential ? "前往 LMS 学习" : "报名课程";
    const action = query("[data-course-action]");
    const actionUrl = safeUrl(course.actionUrl);
    if (actionUrl) {
      action.href = actionUrl;
      action.target = "_blank";
      action.rel = "noopener noreferrer";
    } else {
      action.setAttribute("data-pending-action", "");
    }

    document.addEventListener("click", (event) => {
      if (!event.target.closest("[data-pending-action]")) return;
      event.preventDefault();
      showToast(isEssential ? "LMS 入口尚未配置，请在 content.js 的 actionUrl 中填写正式网址。" : "报名入口尚未配置，请在 content.js 的 actionUrl 中填写正式网址。");
    });
    initializeReveal();
  }

  const courseId = new URLSearchParams(global.location.search).get("course") || "";
  const course = content.courses.find((item) => item.id === courseId && item.isActive !== false);
  query("[data-content-version]").textContent = `Content ${content.updatedAt || ""}`.trim();
  if (course) renderCourse(course);
  else {
    query("[data-course-page]").hidden = true;
    query("[data-course-error]").hidden = false;
  }
})(window, document);
