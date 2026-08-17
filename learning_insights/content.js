/**
 * UPDATE ZONE — sample aggregated data only.
 * 高频正式数据请放在 SharePoint Page 下方的 Power BI / 原生 Web Part，不要上传个人明细。
 */
window.INSIGHTS_CONTENT = Object.freeze({
  status: "示例数据",
  updatedAt: "2026 Q3",
  showSharePointHandoff: true,
  metrics: [
    { id: "completion", value: "91%", progress: 91, label: "Essential Learning Completion", labelZh: "必修学习完成率", change: "+4 pts", tone: "lime" },
    { id: "feedback", value: "4.6/5", progress: 92, label: "Average Course Feedback", labelZh: "课程平均反馈", change: "+0.2", tone: "mint" },
    { id: "trainers", value: "38", progress: 68, label: "Active Internal Trainers", labelZh: "活跃内部讲师", change: "+6", tone: "blue" },
    { id: "coverage", value: "72%", progress: 72, label: "Role Capability Profile Coverage", labelZh: "岗位能力画像覆盖率", change: "+9 pts", tone: "violet" },
  ],
  completionTrend: [
    { period: "2025 Q4", value: 78 },
    { period: "2026 Q1", value: 83 },
    { period: "2026 Q2", value: 87 },
    { period: "2026 Q3", value: 91 },
  ],
  topicDistribution: [
    { label: "Quality", value: 31, color: "#c8f43d" },
    { label: "Digital", value: 27, color: "#52b6e8" },
    { label: "Leadership", value: 23, color: "#a183f1" },
    { label: "Operations", value: 19, color: "#f4b84a" },
  ],
  highlights: [
    { label: "STRONGEST SIGNAL", text: "必修学习完成率连续三个季度提升。" },
    { label: "WATCH NEXT", text: "岗位能力画像覆盖率仍有进一步完善空间。" },
    { label: "CONTENT MIX", text: "Quality 与 Digital 是当前参与度最高的两个主题。" },
  ],
});
