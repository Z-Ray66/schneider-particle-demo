# Learning Hub 页面

这是与 `head_section` 相互独立的 Learning Hub 页面原型。它按照 SharePoint 多页面网站的逻辑设计：顶部导航和卡片使用真实链接跳转，而不是在同一个 HTML 中切换视觉页面。

## 本地预览

在仓库根目录运行：

```powershell
python -m http.server 4173 --bind 127.0.0.1 --directory learning_hub
```

然后访问 `http://127.0.0.1:4173/`。

## 文件说明

- `index.html`：页面语义结构和动态内容挂载窗口。
- `styles.css`：桌面端、平板端和移动端响应式样式。
- `config.js`：SharePoint 页面地址、外部平台地址和 List 配置。
- `data-provider.js`：示例数据与 SharePoint REST 数据适配器。
- `app.js`：数据渲染、搜索筛选、导航占位提醒和页面动效。
- `DEVELOPMENT_AND_OPERATIONS_MANUAL.md`：完整开发、内容发布、SPFx 迁移和运维手册。

## 当前工作模式

`config.js` 中的 `dataMode` 当前是 `mock`，页面使用示例数据，但所有内容仍通过异步数据提供器加载。正式接入后把它改为：

```js
dataMode: "sharepoint"
```

并填写：

```js
sharePoint: {
  siteUrl: "https://你的租户.sharepoint.com/sites/你的站点",
  // ...
}
```

## 需要建立的 SharePoint Lists

建议建立以下五个 List。字段名称最好使用下表中的英文内部名称；如果企业已有 List，只需在 `config.js` 的 `fields` 中修改映射。

### 1. Learning Hub - Essential Learning

| 字段 | 建议类型 |
| --- | --- |
| Title | 单行文本 |
| TitleZh | 单行文本 |
| Summary | 多行文本 |
| DueDate | 日期和时间 |
| Status | 选项 |
| LinkUrl | 超链接 |
| IsActive | 是/否 |

### 2. Learning Hub - Upcoming Classes

| 字段 | 建议类型 |
| --- | --- |
| Title / TitleZh | 单行文本 |
| StartDate / EndDate | 日期和时间 |
| Topic | 选项：Leadership、Digital、Quality、Operations |
| Format / Language / Status | 单行文本或选项 |
| SeatsLeft / SortOrder | 数字 |
| LinkUrl | 超链接 |
| IsActive | 是/否 |

### 3. Learning Hub - Learning Paths

| 字段 | 建议类型 |
| --- | --- |
| Title / TitleZh / Audience | 单行文本 |
| Summary | 多行文本 |
| ModuleCount / SortOrder | 数字 |
| Duration / Theme | 单行文本或选项 |
| LinkUrl | 超链接 |
| IsActive | 是/否 |

### 4. Learning Hub - Replays

| 字段 | 建议类型 |
| --- | --- |
| Title / TitleZh / Speaker / Duration | 单行文本 |
| SessionDate | 日期和时间 |
| Topic | 选项 |
| LinkUrl | 超链接 |
| IsActive | 是/否 |
| SortOrder | 数字 |

### 5. Learning Hub - Communities

| 字段 | 建议类型 |
| --- | --- |
| Title / TitleZh / Cadence / Theme | 单行文本或选项 |
| Summary | 多行文本 |
| MemberCount / SortOrder | 数字 |
| LinkUrl | 超链接 |
| IsActive | 是/否 |

## SharePoint 部署注意事项

GitHub Pages 被嵌入 SharePoint 时处于跨域 iframe 中，通常不能直接带着员工的 SharePoint 登录身份读取 Lists。正式动态版建议把这套页面迁入 **SPFx Web Part**，再通过 `SPHttpClient` 读取 Lists；当前 HTML、CSS、字段配置和渲染逻辑可以作为 SPFx 实现的页面原型。

如果页面代码最终运行在与 Lists 相同的 SharePoint 站点域名下，现有 `data-provider.js` 的 REST 适配器也可以继续使用。切换数据源前建议把 `fallbackToMock` 改成 `false`，这样配置错误不会被示例数据掩盖。

## 正式上线前需要配置

1. 在 `config.js > routes` 填写 Home、Competency Framework、Experts、Insights 及各业务入口的正式 URL。
2. 建立或确认五个 SharePoint Lists，并核对字段内部名称。
3. 决定用 SPFx 部署，还是让代码运行在 SharePoint 同域环境中。
4. 将 List 权限设置为员工只读、内容维护人员可编辑。
5. 用真实数据完成 UAT，重点检查日期、空数据、失效链接和移动端显示。

GitHub Pages 嵌入 SharePoint 时，内部 SharePoint 页面链接应保留 `target: "_top"`；迁移为 SPFx Web Part 后再改为 `_self`。
