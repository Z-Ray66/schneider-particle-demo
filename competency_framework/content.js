/**
 * UPDATE ZONE
 * 维护者通常只需要修改这个文件。不要在这里放员工个人评估或其他敏感数据。
 */
window.COMPETENCY_CONTENT = Object.freeze({
  updatedAt: "2026 Q3",
  links: {
    developmentUrl: "",
  },
  roles: [
    {
      id: "operations",
      name: "生产 / 运营员工",
      englishName: "Operations Associate",
      summary: "聚焦安全、质量、标准作业与持续改善，在稳定交付中建立可靠的问题识别和协作能力。",
      competencies: [
        { name: "Safety & Compliance", nameZh: "安全与合规", level: 3, note: "独立执行标准，并主动识别风险。" },
        { name: "Quality Mindset", nameZh: "质量意识", level: 2, note: "按流程处理偏差并保留证据。" },
        { name: "Problem Solving", nameZh: "问题解决", level: 2, note: "使用基础工具分析常见问题。" },
        { name: "Team Collaboration", nameZh: "团队协作", level: 2, note: "清晰交接并及时升级异常。" },
      ],
      actions: ["完成一次标准作业观察并记录改善点", "参加 Root Cause Analysis 基础课程", "与主管完成一次班组问题复盘"],
    },
    {
      id: "professional",
      name: "工程师 / 专业岗",
      englishName: "Engineer / Professional",
      summary: "在专业深度之外，强调数据判断、跨团队影响与系统性问题解决。",
      competencies: [
        { name: "Functional Expertise", nameZh: "专业能力", level: 3, note: "能处理复杂问题并指导常规实践。" },
        { name: "Data & Digital", nameZh: "数据与数字化", level: 2, note: "用可靠数据支持业务判断。" },
        { name: "Problem Solving", nameZh: "问题解决", level: 3, note: "能主导结构化分析和方案验证。" },
        { name: "Stakeholder Influence", nameZh: "利益相关方影响", level: 2, note: "推动跨职能共识和行动。" },
      ],
      actions: ["主导一个跨团队 A3 改善主题", "完成 Data Storytelling 实践任务", "邀请一位 SME 对方案进行专业评审"],
    },
    {
      id: "manager",
      name: "People Manager",
      englishName: "People Manager",
      summary: "通过清晰目标、有效辅导和组织协同，持续提升团队绩效与能力密度。",
      competencies: [
        { name: "Leading People", nameZh: "人才领导", level: 3, note: "能够设定期望、反馈并发展人才。" },
        { name: "Business Acumen", nameZh: "商业洞察", level: 3, note: "把团队重点连接到业务结果。" },
        { name: "Change Leadership", nameZh: "变革领导", level: 2, note: "帮助团队理解并采取新行为。" },
        { name: "Inclusive Collaboration", nameZh: "包容性协作", level: 3, note: "创造开放讨论与共同负责的环境。" },
      ],
      actions: ["与每位团队成员完成一次发展对话", "选择一个业务主题开展教练式复盘", "建立季度团队能力提升计划"],
    },
  ],
});
