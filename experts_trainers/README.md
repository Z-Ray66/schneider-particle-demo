# Experts & Internal Trainers 页面维护说明

本页面不含导航，适合单独嵌入 SharePoint Page。

## 更新方式

| 内容 | 更新频率 | 修改位置 |
| --- | --- | --- |
| 页面定位、专家网络介绍、贡献者说明 | 很低 | `index.html` |
| Featured Gold Course | 月度/季度 | `content.js > featuredCourse` |
| 专家与讲师名录、个人简介 | 有人员变更时 | `content.js > experts` |
| 每位导师的课程和视频入口 | 有课程变更时 | `content.js > experts > courses` |
| 金牌课程卡片 | 月度/季度 | `content.js > courses` |
| 联系、预约、课程链接 | 有正式落地页后 | `content.js` 对应 `url` |

新增讲师时，复制一个 `experts` 对象并保证 `id` 唯一。`topic` 应与 `topics` 中的筛选项一致。人物卡片会自动链接到共用的导师详情模板：

```text
../expert_profile/?expert=导师ID
```

不需要为导师复制 HTML，也不需要为每位导师创建 SharePoint Page。导师的课程写在该导师对象的 `courses` 数组中；视频上传到公司 SharePoint/Stream 后，把视频页面网址写入课程的 `videoUrl`。

完整课程字段和 Excel 交付格式见 `../expert_profile/README.md`。

本页会公开展示讲师姓名、角色与专业主题。正式填入真实人员前，需要取得内部发布授权；不要加入私人电话、邮箱或个人日程信息，联系按钮应跳到公司批准的页面。
