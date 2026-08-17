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
      expertise: ["Deviation Review", "Audit Readiness", "Quality Culture"], languages: ["中文", "English"],
      availability: "Monthly office hour", location: "Shanghai", contactUrl: "",
    },
    {
      id: "chen-zhou", name: "Chen Zhou", initials: "CZ", role: "Digital Analytics Champion", topic: "Digital",
      statement: "让数据不只是报表，而是推动更快、更可靠决策的共同语言。",
      expertise: ["Power BI", "Data Storytelling", "Dashboard Design"], languages: ["中文", "English"],
      availability: "Project clinic", location: "Wuxi", contactUrl: "",
    },
    {
      id: "may-yang", name: "May Yang", initials: "MY", role: "Lean Facilitator", topic: "Lean",
      statement: "从现场问题出发，用简单而持续的改善方法建立团队节奏。",
      expertise: ["A3 Thinking", "Daily Management", "Gemba"], languages: ["中文"],
      availability: "Bi-weekly clinic", location: "Suzhou", contactUrl: "",
    },
    {
      id: "alex-liu", name: "Alex Liu", initials: "AL", role: "Leadership Facilitator", topic: "Leadership",
      statement: "帮助管理者通过清晰期望和高质量对话发展团队能力。",
      expertise: ["Coaching", "Feedback", "Team Effectiveness"], languages: ["中文", "English"],
      availability: "By request", location: "Beijing", contactUrl: "",
    },
    {
      id: "ivy-xu", name: "Ivy Xu", initials: "IX", role: "Operational Excellence Coach", topic: "Lean",
      statement: "连接业务目标与一线改善，推动实践真正形成可持续的标准。",
      expertise: ["Kaizen", "Standard Work", "Problem Solving"], languages: ["中文"],
      availability: "Quarterly workshop", location: "Shanghai", contactUrl: "",
    },
    {
      id: "eric-sun", name: "Eric Sun", initials: "ES", role: "Cybersecurity Advocate", topic: "Digital",
      statement: "把数字风险意识融入产品、数据和日常协作的每一个决定。",
      expertise: ["Cyber Awareness", "Data Protection", "Secure by Design"], languages: ["中文", "English"],
      availability: "Monthly Q&A", location: "Remote", contactUrl: "",
    },
  ],
  courses: [
    { label: "QUALITY", title: "Quality Culture Speaker Series", titleZh: "质量文化系列分享", meta: "4 sessions · Replay available", accent: "lime", url: "" },
    { label: "DIGITAL", title: "Tell Better Stories with Data", titleZh: "用数据讲出更有影响力的故事", meta: "68 min · Toolkit included", accent: "blue", url: "" },
    { label: "LEADERSHIP", title: "Coaching Conversations for Managers", titleZh: "管理者教练式对话", meta: "74 min · Practice guide", accent: "violet", url: "" },
  ],
});
