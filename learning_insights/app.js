(function initializeInsightsPage(global, document) {
  "use strict";
  const content = global.INSIGHTS_CONTENT || { metrics: [], completionTrend: [], topicDistribution: [], highlights: [] };
  const query = (selector, root = document) => root.querySelector(selector);
  const queryAll = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHtml = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

  function renderMeta() {
    const status = query("[data-data-status]"); const updated = query("[data-updated-at]");
    if (status) status.textContent = content.status || "示例数据";
    if (updated) updated.textContent = `更新于 ${content.updatedAt || "待确认"}`;
    const handoff = query("[data-sharepoint-handoff]");
    if (handoff && content.showSharePointHandoff === false) handoff.hidden = true;
  }

  function renderMetrics() {
    const root = query("[data-metric-grid]"); if (!root) return;
    root.innerHTML = content.metrics.map((metric, index) => `
      <article class="metric-card metric-card--${escapeHtml(metric.tone)} reveal-item" style="--delay:${index * 80}ms">
        <div class="metric-card__top"><span>0${index + 1}</span><b>${escapeHtml(metric.change)}</b></div>
        <strong>${escapeHtml(metric.value)}</strong><h3>${escapeHtml(metric.label)}</h3><p>${escapeHtml(metric.labelZh)}</p>
        <div class="metric-meter" aria-label="${escapeHtml(metric.progress)}%"><i style="--meter:${Number(metric.progress) || 0}%"></i></div>
      </article>`).join("");
  }

  function trendCoordinates(points, width, height, padding) {
    if (!points.length) return [];
    const values = points.map((item) => Number(item.value) || 0);
    const min = Math.max(0, Math.min(...values) - 8); const max = Math.min(100, Math.max(...values) + 5);
    return points.map((item, index) => ({
      x: padding + (points.length === 1 ? 0 : index * ((width - padding * 2) / (points.length - 1))),
      y: height - padding - (((Number(item.value) || 0) - min) / Math.max(max - min, 1)) * (height - padding * 2),
      ...item,
    }));
  }

  function renderTrend() {
    const root = query("[data-trend-chart]"); const points = trendCoordinates(content.completionTrend, 760, 280, 38); if (!root || !points.length) return;
    const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");
    const area = `${points[0].x},250 ${polyline} ${points[points.length - 1].x},250`;
    root.innerHTML = `<svg viewBox="0 0 760 280" role="img" aria-label="${escapeHtml(content.completionTrend.map((item) => `${item.period} ${item.value}%`).join("，"))}">
      <defs><linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c8f43d" stop-opacity=".34"/><stop offset="1" stop-color="#c8f43d" stop-opacity="0"/></linearGradient></defs>
      <g class="chart-grid"><line x1="38" y1="70" x2="722" y2="70"/><line x1="38" y1="150" x2="722" y2="150"/><line x1="38" y1="230" x2="722" y2="230"/></g>
      <polygon class="chart-area" points="${area}"/><polyline class="chart-line" points="${polyline}"/>
      ${points.map((point) => `<g class="chart-point"><circle cx="${point.x}" cy="${point.y}" r="6"/><text x="${point.x}" y="${point.y - 17}">${escapeHtml(point.value)}%</text><text class="chart-period" x="${point.x}" y="270">${escapeHtml(point.period)}</text></g>`).join("")}
    </svg>`;
    const change = query("[data-trend-change]"); const first = Number(points[0].value); const last = Number(points.at(-1).value);
    if (change) change.textContent = `${last >= first ? "+" : ""}${last - first} pts`;
  }

  function renderDistribution() {
    const root = query("[data-distribution]"); if (!root) return;
    let cursor = 0;
    const stops = content.topicDistribution.map((item) => { const start = cursor; cursor += Number(item.value) || 0; return `${item.color} ${start}% ${cursor}%`; }).join(",");
    root.innerHTML = `<div class="donut" style="--segments:conic-gradient(${stops})"><span><strong>100%</strong><small>LEARNING MIX</small></span></div><div class="distribution-list">${content.topicDistribution.map((item) => `<div><i style="--color:${escapeHtml(item.color)}"></i><span>${escapeHtml(item.label)}</span><b>${escapeHtml(item.value)}%</b></div>`).join("")}</div>`;
  }

  function renderHighlights() {
    const root = query("[data-insight-strip]"); if (!root) return;
    root.innerHTML = content.highlights.map((item, index) => `<article class="reveal-item" style="--delay:${index * 90}ms"><span>${escapeHtml(item.label)}</span><p>${escapeHtml(item.text)}</p></article>`).join("");
  }

  function initializeReveal() {
    const items = queryAll(".reveal-item");
    if (global.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in global)) { items.forEach((item) => item.classList.add("is-visible")); return; }
    const observer = new IntersectionObserver((entries, current) => entries.forEach((entry) => { if (!entry.isIntersecting) return; entry.target.classList.add("is-visible"); current.unobserve(entry.target); }), { threshold: .12, rootMargin: "0px 0px -6%" });
    items.forEach((item, index) => { if (!item.style.getPropertyValue("--delay")) item.style.setProperty("--delay", `${(index % 4) * 75}ms`); observer.observe(item); });
  }

  renderMeta(); renderMetrics(); renderTrend(); renderDistribution(); renderHighlights(); initializeReveal();
})(window, document);
