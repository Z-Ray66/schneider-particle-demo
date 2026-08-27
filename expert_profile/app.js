(function initializeExpertProfile(global, document) {
  "use strict";

  const content = global.EXPERTS_CONTENT || { experts: [] };
  const query = (selector, root = document) => root.querySelector(selector);
  const escapeHtml = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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
    global.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = global.setTimeout(() => toast.classList.remove("is-visible"), 3400);
  }

  function renderFacts(expert, courseCount) {
    const root = query("[data-profile-facts]");
    if (!root) return;
    const facts = [
      ["Languages", (expert.languages || []).join(" · ")],
      ["Location", expert.location],
      ["Connect", expert.availability],
      ["Courses", `${courseCount} available`],
    ];
    root.innerHTML = facts.map(([label, value]) => `
      <div><small>${escapeHtml(label)}</small><strong>${escapeHtml(value || "待更新")}</strong></div>
    `).join("");
  }

  function renderCourses(expert) {
    const root = query("[data-expert-courses]");
    if (!root) return 0;
    const courses = (expert.courses || [])
      .filter((course) => course.isActive !== false)
      .sort((left, right) => Number(left.sortOrder || 0) - Number(right.sortOrder || 0));

    if (!courses.length) {
      root.innerHTML = `
        <div class="empty-state reveal-item">
          <span aria-hidden="true">＋</span><h3>课程正在整理中</h3>
          <p>该导师的课程入口已经预留，添加课程数据后会自动显示在这里。</p>
        </div>`;
      return 0;
    }

    root.innerHTML = courses.map((course, index) => {
      const videoUrl = safeUrl(course.videoUrl);
      const number = String(index + 1).padStart(2, "0");
      const linkAttributes = videoUrl
        ? `href="${escapeHtml(videoUrl)}" target="_blank" rel="noopener noreferrer"`
        : `href="#" data-pending-video`;
      return `
        <a class="profile-course reveal-item" style="--delay:${index * 80}ms" ${linkAttributes} aria-label="观看课程 ${escapeHtml(course.titleZh || course.title)}">
          <span class="profile-course__visual" aria-hidden="true">
            <small>${escapeHtml(expert.topic)}</small>
            <b>${escapeHtml(expert.initials)}</b>
            <i>▶</i>
            <em>${number}</em>
          </span>
          <span class="profile-course__copy">
            <span class="profile-course__status">${videoUrl ? "VIDEO READY" : "VIDEO LINK PENDING"}</span>
            <strong>${escapeHtml(course.title)}</strong>
            <b>${escapeHtml(course.titleZh)}</b>
            <span>${escapeHtml(course.summary)}</span>
            <span class="profile-course__meta"><i>${escapeHtml(course.duration)}</i><i>${escapeHtml(course.language)}</i><i>${escapeHtml(course.level)}</i></span>
          </span>
          <span class="profile-course__arrow" aria-hidden="true">↗</span>
        </a>`;
    }).join("");
    return courses.length;
  }

  function initializeReveal() {
    const items = [...document.querySelectorAll(".reveal-item:not(.is-visible)")];
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
    }, { threshold: 0.12, rootMargin: "0px 0px -5%" });
    items.forEach((item) => observer.observe(item));
  }

  function initializeLinks(expert) {
    const contact = query("[data-contact-link]");
    const contactUrl = safeUrl(expert.contactUrl);
    if (contactUrl) {
      contact.href = contactUrl;
      contact.target = "_top";
    } else {
      contact.setAttribute("data-pending-contact", "");
    }

    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-pending-video]")) {
        event.preventDefault();
        showToast("该课程的视频入口尚未配置。上传到 SharePoint 或 Stream 后，把视频网址填写到 content.js 即可。");
      }
      if (event.target.closest("[data-pending-contact]")) {
        event.preventDefault();
        showToast("导师联系入口尚未配置，请填写公司批准的预约或联系页面网址。");
      }
    });
  }

  function renderProfile(expert) {
    const page = query("[data-profile-page]");
    const error = query("[data-profile-error]");
    error.hidden = true;
    page.hidden = false;
    document.title = `${expert.name} | Expert Courses | GSC China`;
    query("[data-profile-initials]").textContent = expert.initials;
    query("[data-profile-topic]").textContent = `${expert.topic} · INTERNAL EXPERT`;
    query("[data-profile-name]").textContent = expert.name;
    query("[data-profile-role]").textContent = expert.role;
    query("[data-profile-statement]").textContent = `“${expert.statement}”`;
    query("[data-profile-bio]").textContent = expert.bio || expert.statement;
    query("[data-profile-expertise]").innerHTML = (expert.expertise || [])
      .map((item) => `<span>${escapeHtml(item)}</span>`).join("");
    const courseCount = renderCourses(expert);
    query("[data-course-count]").textContent = courseCount;
    renderFacts(expert, courseCount);
    initializeLinks(expert);
    initializeReveal();
  }

  const expertId = new URLSearchParams(global.location.search).get("expert") || "";
  const expert = content.experts.find((item) => item.id === expertId);
  query("[data-data-version]").textContent = `Content ${content.updatedAt || ""}`.trim();

  if (expert) {
    renderProfile(expert);
  } else {
    query("[data-profile-page]").hidden = true;
    query("[data-profile-error]").hidden = false;
  }
})(window, document);
