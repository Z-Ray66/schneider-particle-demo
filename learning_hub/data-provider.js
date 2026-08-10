(function initializeLearningDataProvider(global) {
  "use strict";

  const mockData = Object.freeze({
    essentialLearning: {
      id: 1,
      title: "2026 Q3 Code of Conduct Annual Refresh",
      titleZh: "2026 年第三季度行为准则年度复训",
      summary: "完成必修内容并在截止日期前确认学习记录，相关 LMS 入口将在正式链接配置后开放。",
      dueDate: "2026-08-15T23:59:00+08:00",
      status: "Action required",
      url: "",
    },
    upcomingClasses: [
      {
        id: 101,
        title: "Root Cause Analysis Workshop",
        titleZh: "根因分析实战工作坊",
        startDate: "2026-08-17T09:30:00+08:00",
        endDate: "2026-08-17T16:30:00+08:00",
        topic: "Quality",
        format: "On-site · Shanghai",
        language: "中文",
        status: "报名中",
        seatsLeft: 14,
        url: "",
      },
      {
        id: 102,
        title: "Influencing Without Authority",
        titleZh: "无职权影响力",
        startDate: "2026-08-21T14:00:00+08:00",
        endDate: "2026-08-21T16:30:00+08:00",
        topic: "Leadership",
        format: "Teams Live",
        language: "English",
        status: "席位有限",
        seatsLeft: 6,
        url: "",
      },
      {
        id: 103,
        title: "Power BI Practical Lab",
        titleZh: "Power BI 数据分析实践",
        startDate: "2026-08-28T13:30:00+08:00",
        endDate: "2026-08-28T17:00:00+08:00",
        topic: "Digital",
        format: "Hybrid · Wuxi",
        language: "双语",
        status: "开放候补",
        seatsLeft: 0,
        url: "",
      },
      {
        id: 104,
        title: "Daily Management System Essentials",
        titleZh: "日常管理系统基础",
        startDate: "2026-09-03T10:00:00+08:00",
        endDate: "2026-09-03T12:00:00+08:00",
        topic: "Operations",
        format: "Teams Live",
        language: "中文",
        status: "报名中",
        seatsLeft: 22,
        url: "",
      },
    ],
    learningPaths: [
      {
        id: 201,
        title: "Start Strong at GSC",
        titleZh: "新员工快速启航",
        audience: "New Joiners",
        summary: "理解 GSC 业务、质量文化、安全要求与协作方式，建立入职前三个月的学习节奏。",
        moduleCount: 6,
        duration: "5.5 hrs",
        theme: "green",
        url: "",
      },
      {
        id: 202,
        title: "Lead People with Impact",
        titleZh: "高影响力团队管理",
        audience: "People Managers",
        summary: "覆盖目标对齐、反馈辅导、人才发展和团队绩效，支持管理者在真实场景中实践。",
        moduleCount: 8,
        duration: "8 hrs",
        theme: "blue",
        url: "",
      },
      {
        id: 203,
        title: "Data-Informed Professional",
        titleZh: "数据驱动的专业人才",
        audience: "Individual Contributors",
        summary: "从数据素养到可视化表达，提升分析业务问题、形成洞察并推动行动的能力。",
        moduleCount: 5,
        duration: "6 hrs",
        theme: "violet",
        url: "",
      },
      {
        id: 204,
        title: "Expertise to Influence",
        titleZh: "从专业专家到组织影响者",
        audience: "SMEs & Project Leads",
        summary: "把专业知识转化为标准、课程与跨团队影响力，支持专家经验在组织内规模化传递。",
        moduleCount: 7,
        duration: "7.5 hrs",
        theme: "amber",
        url: "",
      },
    ],
    replays: [
      {
        id: 301,
        title: "Quality Culture Speaker Series",
        titleZh: "质量文化系列分享",
        sessionDate: "2026-07-24T14:00:00+08:00",
        speaker: "Linda Wang",
        duration: "52 min",
        topic: "Quality",
        url: "",
      },
      {
        id: 302,
        title: "Tell Better Stories with Data",
        titleZh: "用数据讲出更有影响力的故事",
        sessionDate: "2026-07-16T10:00:00+08:00",
        speaker: "Chen Zhou",
        duration: "68 min",
        topic: "Digital",
        url: "",
      },
      {
        id: 303,
        title: "Coaching Conversations for Managers",
        titleZh: "管理者教练式对话",
        sessionDate: "2026-06-30T15:00:00+08:00",
        speaker: "May Yang",
        duration: "74 min",
        topic: "Leadership",
        url: "",
      },
      {
        id: 304,
        title: "A3 Thinking in Daily Operations",
        titleZh: "日常运营中的 A3 思维",
        sessionDate: "2026-06-18T13:30:00+08:00",
        speaker: "Eric Li",
        duration: "61 min",
        topic: "Operations",
        url: "",
      },
    ],
    communities: [
      {
        id: 401,
        title: "Digital Club",
        titleZh: "数字化学习社群",
        summary: "围绕 Power BI、自动化与数据应用开展月度案例分享和实践挑战。",
        memberCount: 286,
        cadence: "Monthly",
        theme: "lime",
        url: "",
      },
      {
        id: 402,
        title: "Quality Circle",
        titleZh: "质量实践圈",
        summary: "连接质量专业人员与一线团队，分享问题解决、审计准备和质量文化实践。",
        memberCount: 164,
        cadence: "Bi-weekly",
        theme: "mint",
        url: "",
      },
      {
        id: 403,
        title: "Lean Practice Group",
        titleZh: "精益实践社群",
        summary: "通过 Gemba、A3 和 Daily Management 案例共学，推动持续改善经验复用。",
        memberCount: 218,
        cadence: "Monthly",
        theme: "amber",
        url: "",
      },
    ],
  });

  const clone = (value) => JSON.parse(JSON.stringify(value));

  class MockLearningProvider {
    async getPageData() {
      // Keep the async contract identical to SharePoint, so the view never
      // needs to know where its data came from.
      await new Promise((resolve) => global.setTimeout(resolve, 180));
      return { ...clone(mockData), source: "mock" };
    }
  }

  class SharePointLearningProvider {
    constructor(config) {
      this.config = config;
      this.siteUrl = String(config.siteUrl || "").replace(/\/$/, "");
    }

    async getPageData() {
      if (!this.siteUrl) {
        throw new Error("SharePoint siteUrl 尚未配置。请先在 config.js 中填写站点地址。");
      }

      const lists = this.config.lists || {};
      const [essentialItems, upcomingClasses, learningPaths, replays, communities] =
        await Promise.all([
          this.getListItems(lists.essentialLearning),
          this.getListItems(lists.upcomingClasses),
          this.getListItems(lists.learningPaths),
          this.getListItems(lists.replays),
          this.getListItems(lists.communities),
        ]);

      return {
        essentialLearning: essentialItems[0] || null,
        upcomingClasses,
        learningPaths,
        replays,
        communities,
        source: "sharepoint",
      };
    }

    async getListItems(listConfig) {
      if (!listConfig?.title) return [];

      const escapedTitle = listConfig.title.replace(/'/g, "''");
      const query = new URLSearchParams();

      if (listConfig.select?.length) query.set("$select", listConfig.select.join(","));
      if (listConfig.filter) query.set("$filter", listConfig.filter);
      if (listConfig.orderBy) query.set("$orderby", listConfig.orderBy);
      if (listConfig.top) query.set("$top", String(listConfig.top));

      const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('${escapedTitle}')/items?${query}`;
      const response = await global.fetch(endpoint, {
        method: "GET",
        credentials: "same-origin",
        headers: {
          Accept: "application/json;odata=nometadata",
        },
      });

      if (!response.ok) {
        throw new Error(`读取 SharePoint List “${listConfig.title}”失败（HTTP ${response.status}）。`);
      }

      const payload = await response.json();
      const items = payload.value || payload?.d?.results || [];
      return items.map((item) => this.mapFields(item, listConfig.fields || {}));
    }

    mapFields(item, mapping) {
      return Object.fromEntries(
        Object.entries(mapping).map(([viewField, sharePointField]) => {
          const rawValue = item?.[sharePointField];
          const value = rawValue && typeof rawValue === "object" && "Url" in rawValue
            ? rawValue.Url
            : rawValue;
          return [viewField, value ?? ""];
        }),
      );
    }
  }

  class FallbackLearningProvider {
    constructor(primary, fallback) {
      this.primary = primary;
      this.fallback = fallback;
    }

    async getPageData() {
      try {
        return await this.primary.getPageData();
      } catch (error) {
        const fallbackData = await this.fallback.getPageData();
        return {
          ...fallbackData,
          source: "fallback",
          sourceError: error instanceof Error ? error.message : String(error),
        };
      }
    }
  }

  function create(config) {
    const mockProvider = new MockLearningProvider();

    if (config?.dataMode !== "sharepoint") return mockProvider;

    const sharePointProvider = new SharePointLearningProvider(config.sharePoint || {});
    return config.fallbackToMock
      ? new FallbackLearningProvider(sharePointProvider, mockProvider)
      : sharePointProvider;
  }

  global.LearningHubDataProvider = Object.freeze({
    create,
    mockData,
  });
})(window);
