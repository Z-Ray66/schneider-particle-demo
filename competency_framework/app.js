(function initializeCompetencyPage(global, document) {
  "use strict";

  const content = global.COMPETENCY_CONTENT || { roles: [], links: {} };
  const query = (selector, root = document) => root.querySelector(selector);
  const queryAll = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHtml = (value) => String(value ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#039;");

  let activeRoleId = content.roles?.[0]?.id || "";
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
    toastTimer = global.setTimeout(() => toast.classList.remove("is-visible"), 3200);
  }

  function renderRoleTabs() {
    const root = query("[data-role-tabs]");
    if (!root) return;
    root.innerHTML = content.roles.map((role) => `
      <button type="button" role="tab" data-role-id="${escapeHtml(role.id)}"
        aria-selected="${role.id === activeRoleId}" class="${role.id === activeRoleId ? "is-active" : ""}">
        <span>${escapeHtml(role.name)}</span><small>${escapeHtml(role.englishName)}</small>
      </button>`).join("");
  }

  function renderRolePanel() {
    const root = query("[data-role-panel]");
    const role = content.roles.find((item) => item.id === activeRoleId);
    if (!root || !role) return;

    root.innerHTML = `
      <div class="role-panel__intro">
        <span class="role-panel__version">FRAMEWORK · ${escapeHtml(content.updatedAt || "")}</span>
        <h3>${escapeHtml(role.englishName)}</h3>
        <p>${escapeHtml(role.summary)}</p>
      </div>
      <div class="competency-list">
        ${role.competencies.map((item) => `
          <div class="competency-row">
            <div><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.nameZh)}</span></div>
            <div class="level-meter" aria-label="目标等级 L${escapeHtml(item.level)}">
              ${[1, 2, 3, 4].map((level) => `<i class="${level <= item.level ? "is-filled" : ""}"></i>`).join("")}
            </div>
            <b>L${escapeHtml(item.level)}</b>
            <small>${escapeHtml(item.note)}</small>
          </div>`).join("")}
      </div>
      <div class="role-panel__actions">
        <span>NEXT DEVELOPMENT MOVES</span>
        <ol>${role.actions.map((action) => `<li>${escapeHtml(action)}</li>`).join("")}</ol>
      </div>`;
  }

  function initializeRoleExplorer() {
    renderRoleTabs();
    renderRolePanel();
    query("[data-role-tabs]")?.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-role-id]");
      if (!button || button.dataset.roleId === activeRoleId) return;
      activeRoleId = button.dataset.roleId;
      renderRoleTabs();
      renderRolePanel();
    });
  }

  function initializeActions() {
    queryAll("[data-action-link]").forEach((link) => {
      const url = safeUrl(content.links?.[link.dataset.actionKey]);
      if (url) {
        link.href = url;
        link.target = "_top";
      } else {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          showToast("这个业务入口已预留，填写正式 SharePoint 或学习平台网址后即可跳转。");
        });
      }
    });
  }

  function initializeReveal() {
    const items = queryAll(".reveal-item");
    if (global.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in global)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -6%" });
    items.forEach((item, index) => {
      item.style.setProperty("--delay", `${Math.min(index % 4, 3) * 80}ms`);
      observer.observe(item);
    });
  }

  function initializeTilt() {
    if (global.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) return;
    queryAll(".tilt-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        card.style.setProperty("--rx", `${-y * 4}deg`);
        card.style.setProperty("--ry", `${x * 5}deg`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.removeProperty("--rx"); card.style.removeProperty("--ry");
      });
    });
  }

  initializeRoleExplorer();
  initializeActions();
  initializeReveal();
  initializeTilt();
  const requestedId = global.location.hash.replace(/^#/, "");
  if (requestedId) global.setTimeout(() => document.getElementById(requestedId)?.scrollIntoView({ block: "start" }), 40);
})(window, document);
