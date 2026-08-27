# Learning Hub 页面与数据维护

本页面不包含站点导航，适合放在 SharePoint Page 的 Embed Web Part 中。

## 当前页面结构

1. Hero 固定介绍
2. `#essential-learning`：企业必修学习
3. `#upcoming-classes`：近期开课
4. `#recommended-learning-paths`：从近期开课中自动提取推荐课程
5. `#replay-library`：往期课程回放

旧的单条 Essential 横幅、Hero 搜索框、Learning Communities 和 SharePoint List/SPFx 数据适配层已经移除。

## 唯一课程数据文件

课程卡片、推荐列表和通用课程详情页都读取：

```text
learning_hub/content.js > courses
```

课程详情页不是一门课程一个 HTML，而是共用：

```text
learning_course/?course=课程ID
```

## Excel 建议格式

以后可提供一个 Excel，其中 `Courses` 工作表每行代表一门课程：

| Excel 列 | 对应字段 | 说明 |
| --- | --- | --- |
| `course_id` | `id` | 唯一且稳定，例如 `root-cause-analysis-workshop` |
| `course_type` | `type` | `essential` 或 `upcoming` |
| `title_en` / `title_zh` | `title` / `titleZh` | 中英文课程名 |
| `topic` | `topic` | Quality、Leadership、Digital、Operations、Compliance |
| `summary` | `summary` | 卡片短介绍 |
| `description` | `description` | 详情页完整介绍 |
| `learning_outcomes` | `learningOutcomes` | 多项内容用换行或分号分隔 |
| `audience` / `instructor` | 同名字段 | 适合人群、讲师或团队 |
| `due_date` | `dueDate` | 必修课完成截止日期 |
| `start_date` / `end_date` | 同名字段 | 近期开课时间 |
| `registration_deadline` | `registrationDeadline` | 报名截止日期 |
| `format` / `location` / `language` | 同名字段 | 授课信息 |
| `status` | `status` | 报名中、席位有限、开放候补、Required 等 |
| `total_seats` / `seats_left` | 同名字段 | 近期开课的总席位和剩余席位 |
| `action_url` | `actionUrl` | LMS 或课程报名页面网址 |
| `recommended` | `recommended` | `TRUE` 时出现在 Recommended Learning Paths |
| `is_active` | `isActive` | `TRUE` 展示；`FALSE` 隐藏 |
| `sort_order` | `sortOrder` | 页面排序 |

`Replays` 工作表可以继续维护回放名称、讲师、日期、主题、时长和视频网址。

## 日常更新方法

- 必修课：`course_type=essential`，填写 `due_date`。
- 近期开课：`course_type=upcoming`，填写日期、状态、总席位和剩余席位。
- 推荐课程：在对应近期开课行把 `recommended` 设置为 `TRUE`，不用重复创建课程。
- 暂时下线：把 `is_active` 设置为 `FALSE`。
- 把 Excel 交给开发者后，只需转换并更新 `content.js`，不用修改 HTML/CSS。

课程文件、报名表和 LMS 内容仍保存在公司 SharePoint、Stream 或 LMS，GitHub 只维护展示数据和获批准的入口网址。
