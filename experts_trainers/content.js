/**
 * UPDATE ZONE
 * 更新专家、讲师或课程时，只修改本文件。正式上线前请用获授权的真实信息替换示例。
 */
window.EXPERTS_CONTENT = Object.freeze({
  updatedAt: "2026 Q3",
  links: { contributeUrl: "" },
  topics: ["All", "Quality", "Digital", "Lean", "Leadership"],
  featuredCourse: {
    label: "GOLD COURSE · 2026 Q2",
    title: "Quality Culture Speaker Series",
    titleZh: "质量文化系列分享",
    description: "从真实业务案例出发，连接质量文化、偏差复盘与审计准备，让质量成为团队每天都能看见的行为。",
    rating: "4.8/5",
    reach: "QA · Operation · Engineering · Supply Chain",
    url: "",
  },
  experts: [
    {
      id: "linda-wang", name: "Linda Wang", initials: "LW", role: "Quality System SME", topic: "Quality",
      statement: "把复杂的质量要求翻译成团队每天都能执行的工作习惯。",
      bio: "专注质量体系、偏差复盘与审计准备，善于把制度语言转化成适合业务团队使用的检查清单和实践方法。",
      expertise: ["Deviation Review", "Audit Readiness", "Quality Culture"], languages: ["中文", "English"],
      availability: "Monthly office hour", location: "Shanghai", contactUrl: "",
      courses: [
        { id: "quality-culture-foundations", title: "Quality Culture Foundations", titleZh: "质量文化基础", summary: "通过真实场景理解质量文化如何体现在日常决策与团队行为中。", duration: "42 min", language: "中文", level: "Foundation", videoUrl: "", isActive: true, sortOrder: 1 },
        { id: "audit-ready-every-day", title: "Audit Ready, Every Day", titleZh: "让审计准备成为日常习惯", summary: "从记录、证据和现场沟通三个角度建立可持续的审计准备节奏。", duration: "58 min", language: "中文 / English", level: "Intermediate", videoUrl: "", isActive: true, sortOrder: 2 },
      ],
    },
    {
      id: "chen-zhou", name: "Chen Zhou", initials: "CZ", role: "Digital Analytics Champion", topic: "Digital",
      statement: "让数据不只是报表，而是推动更快、更可靠决策的共同语言。",
      bio: "聚焦 Power BI、数据故事表达和业务看板设计，帮助团队把分散数据转化成可理解、可讨论、可行动的信息。",
      expertise: ["Power BI", "Data Storytelling", "Dashboard Design"], languages: ["中文", "English"],
      availability: "Project clinic", location: "Wuxi", contactUrl: "",
      courses: [
        { id: "power-bi-fundamentals", title: "Power BI Fundamentals", titleZh: "Power BI 基础入门", summary: "从数据导入到第一个交互式看板，建立完整的 Power BI 基础操作路径。", duration: "64 min", language: "中文", level: "Foundation", videoUrl: "", isActive: true, sortOrder: 1 },
        { id: "data-storytelling", title: "Tell Better Stories with Data", titleZh: "用数据讲出更有影响力的故事", summary: "学习如何选择重点、组织图表并围绕业务决策呈现数据结论。", duration: "68 min", language: "中文 / English", level: "Intermediate", videoUrl: "", isActive: true, sortOrder: 2 },
        { id: "dashboard-design-clinic", title: "Dashboard Design Clinic", titleZh: "业务看板设计诊所", summary: "以常见企业看板为例，识别视觉噪音并改善信息层级和可读性。", duration: "51 min", language: "中文", level: "Practice", videoUrl: "", isActive: true, sortOrder: 3 },
      ],
    },
    {
      id: "may-yang", name: "May Yang", initials: "MY", role: "Lean Facilitator", topic: "Lean",
      statement: "从现场问题出发，用简单而持续的改善方法建立团队节奏。",
      bio: "围绕 A3 思考、现场管理和持续改善开展辅导，帮助团队从问题定义走到可验证的行动方案。",
      expertise: ["A3 Thinking", "Daily Management", "Gemba"], languages: ["中文"],
      availability: "Bi-weekly clinic", location: "Suzhou", contactUrl: "",
      courses: [
        { id: "a3-thinking-practice", title: "A3 Thinking in Practice", titleZh: "A3 思考实战", summary: "用一页纸厘清问题、原因、对策和验证方式，提升团队解决问题的质量。", duration: "55 min", language: "中文", level: "Foundation", videoUrl: "", isActive: true, sortOrder: 1 },
        { id: "gemba-conversation", title: "Better Gemba Conversations", titleZh: "高质量现场对话", summary: "掌握观察、提问和跟进的方法，让现场走访真正产生改善线索。", duration: "37 min", language: "中文", level: "Practice", videoUrl: "", isActive: true, sortOrder: 2 },
      ],
    },
    {
      id: "alex-liu", name: "Alex Liu", initials: "AL", role: "Leadership Facilitator", topic: "Leadership",
      statement: "帮助管理者通过清晰期望和高质量对话发展团队能力。",
      bio: "关注管理者教练、反馈对话和团队效能，通过可复用的对话框架帮助管理者支持员工成长。",
      expertise: ["Coaching", "Feedback", "Team Effectiveness"], languages: ["中文", "English"],
      availability: "By request", location: "Beijing", contactUrl: "",
      courses: [
        { id: "coaching-conversations", title: "Coaching Conversations for Managers", titleZh: "管理者教练式对话", summary: "通过结构化提问和倾听，把日常沟通转化成支持员工成长的机会。", duration: "74 min", language: "中文 / English", level: "Intermediate", videoUrl: "", isActive: true, sortOrder: 1 },
        { id: "feedback-that-lands", title: "Feedback That Lands", titleZh: "让反馈真正被听见", summary: "练习基于事实、影响和下一步行动的反馈表达方式。", duration: "46 min", language: "中文", level: "Foundation", videoUrl: "", isActive: true, sortOrder: 2 },
      ],
    },
    {
      id: "ivy-xu", name: "Ivy Xu", initials: "IX", role: "Operational Excellence Coach", topic: "Lean",
      statement: "连接业务目标与一线改善，推动实践真正形成可持续的标准。",
      bio: "擅长精益改善、标准作业和问题解决，帮助跨职能团队把一次性改善沉淀为可持续的工作机制。",
      expertise: ["Kaizen", "Standard Work", "Problem Solving"], languages: ["中文"],
      availability: "Quarterly workshop", location: "Shanghai", contactUrl: "",
      courses: [
        { id: "standard-work-design", title: "Designing Standard Work", titleZh: "标准作业设计", summary: "从关键步骤、异常响应和版本维护三个方面建立真正可执行的标准作业。", duration: "49 min", language: "中文", level: "Intermediate", videoUrl: "", isActive: true, sortOrder: 1 },
        { id: "kaizen-facilitation", title: "Facilitating a Kaizen Session", titleZh: "如何引导一次改善工作坊", summary: "了解改善工作坊的准备、引导、行动跟踪和成果固化方法。", duration: "61 min", language: "中文", level: "Practice", videoUrl: "", isActive: true, sortOrder: 2 },
      ],
    },
    {
      id: "eric-sun", name: "Eric Sun", initials: "ES", role: "Cybersecurity Advocate", topic: "Digital",
      statement: "把数字风险意识融入产品、数据和日常协作的每一个决定。",
      bio: "围绕网络安全意识、数据保护和 Secure by Design 开展内部分享，用业务场景帮助团队识别和降低数字风险。",
      expertise: ["Cyber Awareness", "Data Protection", "Secure by Design"], languages: ["中文", "English"],
      availability: "Monthly Q&A", location: "Remote", contactUrl: "",
      courses: [
        { id: "secure-daily-work", title: "Security in Daily Work", titleZh: "日常工作中的信息安全", summary: "通过常见协作场景识别账号、文件共享和敏感信息处理中的风险。", duration: "35 min", language: "中文 / English", level: "Foundation", videoUrl: "", isActive: true, sortOrder: 1 },
        { id: "secure-by-design", title: "Secure by Design Essentials", titleZh: "Secure by Design 核心方法", summary: "在需求和方案阶段提前识别风险，把安全要求嵌入产品与流程设计。", duration: "57 min", language: "English", level: "Intermediate", videoUrl: "", isActive: true, sortOrder: 2 },
      ],
    },
  ],
  courses: [
    { label: "QUALITY", title: "Quality Culture Speaker Series", titleZh: "质量文化系列分享", meta: "4 sessions · Replay available", accent: "lime", url: "" },
    { label: "DIGITAL", title: "Tell Better Stories with Data", titleZh: "用数据讲出更有影响力的故事", meta: "68 min · Toolkit included", accent: "blue", url: "" },
    { label: "LEADERSHIP", title: "Coaching Conversations for Managers", titleZh: "管理者教练式对话", meta: "74 min · Practice guide", accent: "violet", url: "" },
  ],
});
