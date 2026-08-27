# 通用导师详情页维护说明

这个文件夹只有一套导师详情模板，不需要为每位导师复制页面。

## 页面如何识别导师

网址中的 `expert` 参数对应 `experts_trainers/content.js` 里的导师 `id`：

```text
expert_profile/?expert=chen-zhou
expert_profile/?expert=linda-wang
```

导师目录中的人物卡片会自动生成对应网址，并在当前 SharePoint Embed 区域中打开详情页。

## 数据更新位置

所有导师资料和导师课程都只维护：

```text
experts_trainers/content.js > experts
```

每位导师的 `courses` 数组是一组课程，主要字段如下：

| 字段 | 用途 |
| --- | --- |
| `id` | 课程唯一 ID，不要重复 |
| `title` / `titleZh` | 英文和中文课程名 |
| `summary` | 课程简介 |
| `duration` | 时长，例如 `45 min` |
| `language` | 语言 |
| `level` | Foundation / Intermediate / Practice 等 |
| `videoUrl` | SharePoint 或 Microsoft Stream 视频页面网址 |
| `isActive` | `true` 展示，`false` 暂时隐藏 |
| `sortOrder` | 显示顺序，数字越小越靠前 |

视频文件不要上传到 GitHub。把视频保存在公司 SharePoint/Stream 中，再将获批准的视频页面网址填写到 `videoUrl`。

## 推荐的 Excel 交付方式

后续可以使用两个工作表：

- `Experts`：`expert_id`、姓名、岗位、主题、介绍、标签、语言、地点、预约链接。
- `Courses`：`expert_id`、`course_id`、中英文名称、简介、时长、语言、级别、视频链接、是否展示、排序。

`Courses.expert_id` 与 `Experts.expert_id` 对应。把 Excel 交给开发者后，可批量转换成 `content.js`，不需要修改 HTML、CSS 或页面架构。
