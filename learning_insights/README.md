# Learning Insights 页面维护与拆分说明

本页面不含导航，适合单独嵌入 SharePoint Page。页面只允许展示聚合指标，不应出现个人学习明细。

## 两种维护方式

### 低频或原型阶段

直接修改 `content.js`：

- `metrics`：四张指标卡。
- `completionTrend`：季度趋势。
- `topicDistribution`：主题占比，合计应为 100。
- `highlights`：三条业务解读。
- `updatedAt`：必须同步更新统计周期。

修改后提交 GitHub，GitHub Pages 更新后 SharePoint Embed 会显示新数据。

### 高频正式看板

不要继续扩展静态网页，也不需要 Power Automate 或 SPFx。建议在 SharePoint Page 中这样排版：

1. 上方添加 Embed Web Part，放本页面 GitHub Pages 地址。
2. 让 Embed 高度结束在页面的 `SHAREPOINT PAGE SPLIT` 分界处。
3. 下方直接添加公司批准的 Power BI、SharePoint List 或其他原生 Web Part。
4. 配置完成后把 `content.js > showSharePointHandoff` 改成 `false`，隐藏说明卡片。

这样真实看板由报表 Owner 维护，本网页只负责固定介绍和数据阅读原则。

## 数据安全

不得在 GitHub Pages 或本页面的 `content.js` 中填写员工姓名、工号、个人完成率、个人考试结果或原始导出明细。
