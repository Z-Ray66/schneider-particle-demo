# GSC China Learning Hub 开发、内容发布与运维手册

版本：1.0

更新日期：2026-08-10

适用目录：`learning_hub/`

## 1. 先看结论

Learning Hub 有两套可以运行的模式，但它们解决的问题不同。

| 模式 | 页面代码 | 课程数据 | 更新数据时是否提交 Git | 适用阶段 |
| --- | --- | --- | --- | --- |
| GitHub Pages 静态模式 | GitHub | `data-provider.js` 示例数据 | 是 | 原型、演示、视觉评审 |
| SPFx + SharePoint Lists 动态模式 | SharePoint SPFx | SharePoint Lists | 否 | 企业正式生产环境 |

如果把当前 GitHub Pages 直接嵌入 SharePoint：

- 修改布局、样式、交互、链接配置，需要修改代码并提交 GitHub。
- 修改当前示例课程、路径、回放和社群，也需要修改 `data-provider.js` 并提交 GitHub。
- SharePoint Embed 只是把外部网页放入 iframe，不会自动把 GitHub 页面变成 SharePoint 应用，也不会自动获得 SharePoint List 数据权限。

正式上线后的推荐分工是：

- 开发者维护代码和 SPFx Web Part。
- 内容维护人员只编辑 SharePoint Lists。
- 员工只读页面和列表数据。
- SharePoint Owner 管理页面、权限和发布。

## 2. 系统架构

### 2.1 当前可演示架构

```text
开发者修改 HTML / CSS / JS / 示例数据
                  │
                  ▼
             GitHub 仓库
                  │ push
                  ▼
            GitHub Pages
                  │ HTTPS iframe
                  ▼
      SharePoint Modern Page / Embed Web Part
                  │
                  ▼
                员工
```

该模式简单，但课程数据和代码绑定。每次改课程都相当于发布一次新网站版本。

### 2.2 推荐生产架构

```text
开发者 ──代码发布──▶ SPFx Web Part ──SPHttpClient──▶ SharePoint Lists
                              │                            ▲
                              │                            │ 编辑内容
                              ▼                            │
                            员工                    内容维护人员
```

SPFx 在当前登录用户的 SharePoint 页面上下文中运行，适合读取受权限保护的 SharePoint 数据，并提供自动登录上下文。Microsoft 将 SPFx 定义为 SharePoint 的推荐扩展模型：[SPFx overview](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/sharepoint-framework-overview)。

## 3. 当前文件职责

| 文件 | 职责 | 通常由谁修改 |
| --- | --- | --- |
| `index.html` | 页面结构和数据挂载位置 | 前端开发者 |
| `styles.css` | 页面视觉、响应式和动效 | 前端开发者 |
| `config.js` | 导航链接、平台链接、数据模式、List 映射 | 开发者 / SharePoint 开发者 |
| `data-provider.js` | 示例数据与 SharePoint REST 适配器 | 开发者 |
| `app.js` | 渲染、搜索、筛选、链接与状态逻辑 | 前端开发者 |
| `README.md` | 快速预览和 List 字段说明 | 项目维护者 |
| 本手册 | 开发、内容发布和运维 SOP | 项目维护者 |

## 4. 安全边界：正式上传数据前必须确认

### 4.1 GitHub Pages 不是 SharePoint 权限边界

普通 GitHub Pages 通常面向互联网公开。GitHub Enterprise Cloud 可以为组织项目站点配置私有发布，但需要相应企业能力和仓库访问权限：[GitHub Pages private publishing](https://docs.github.com/en/enterprise-cloud@latest/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site)。

在没有公司 IT、安全和法务确认前，不要把以下内容放入 GitHub 仓库或 GitHub Pages：

- 员工姓名、邮箱、工号、部门名单。
- 单个员工的课程完成情况、考试结果或能力评估。
- 仅限内部访问的培训材料和下载链接。
- SharePoint Cookie、访问令牌、Client Secret、密码。
- 未公开的经营数据、审计信息和合规调查信息。

静态网页中的 JavaScript、配置、接口地址和数据都能被浏览器用户查看。任何 Secret 都不能写进 `config.js` 或其他前端文件。

### 4.2 建议的数据存放原则

- 公开且无敏感性的页面文案、颜色和布局：可以进入 Git。
- 内部课程目录、会议链接和课件：优先放 SharePoint Lists / Document Library。
- 员工个人学习记录：保留在 LMS、受控报表或合规批准的数据系统中。
- Learning Insights 页面只展示聚合指标，不展示个人明细。

## 5. 当前 GitHub Pages 模式：开发者如何发布内容

这一节适用于尚未接入 SPFx、仍使用 `dataMode: "mock"` 的阶段。

### 5.1 更新前准备

打开 PowerShell：

```powershell
cd D:\Schneider_electric\schneider-particle-demo
git status
git pull --ff-only origin main
```

如果 `git status` 显示其他未完成改动，不要直接执行 `git add .`。先确认这些改动属于谁，以及是否应该进入本次提交。

推荐为每次更新建立独立分支：

```powershell
git switch -c content/2026-08-learning-update
```

如果团队暂时只使用 `main`，可以省略建分支，但正式团队协作建议使用 Pull Request 审核。

### 5.2 修改本月必学

打开 `learning_hub/data-provider.js`，找到：

```js
essentialLearning: {
  id: 1,
  title: "2026 Q3 Code of Conduct Annual Refresh",
  titleZh: "2026 年第三季度行为准则年度复训",
  summary: "...",
  dueDate: "2026-08-15T23:59:00+08:00",
  status: "Action required",
  url: "",
},
```

填写规则：

- `title`：英文标题。
- `titleZh`：中文标题。
- `summary`：一至两句话，避免放个人数据。
- `dueDate`：使用带时区的 ISO 日期，例如 `2026-08-31T23:59:00+08:00`。
- `status`：例如 `Action required`、`In progress`、`Completed`。
- `url`：LMS 或 SharePoint 落地页 HTTPS 地址。

### 5.3 新增近期开课

在 `upcomingClasses` 数组中增加一个对象：

```js
{
  id: 105,
  title: "Problem Solving Essentials",
  titleZh: "结构化问题解决基础",
  startDate: "2026-09-10T09:30:00+08:00",
  endDate: "2026-09-10T16:30:00+08:00",
  topic: "Quality",
  format: "On-site · Shanghai",
  language: "中文",
  status: "报名中",
  seatsLeft: 18,
  url: "https://正式报名地址",
},
```

规则：

- `id` 必须唯一。
- `topic` 只能优先使用 `Leadership`、`Digital`、`Quality`、`Operations`，否则主题筛选不会覆盖它。
- 开始和结束时间必须带 `+08:00` 或其他正确时区。
- `seatsLeft` 使用数字，不要写成字符串。
- 暂无地址时保留 `url: ""`，页面会显示“链接待配置”的提示。

删除过期课程时，应删除整个对象及其前后的逗号，随后执行语法检查。

### 5.4 新增学习路径

在 `learningPaths` 中增加对象：

```js
{
  id: 205,
  title: "Project Leadership Foundations",
  titleZh: "项目领导力基础",
  audience: "Project Leads",
  summary: "面向项目负责人的结构化学习路径。",
  moduleCount: 6,
  duration: "7 hrs",
  theme: "blue",
  url: "https://正式路径地址",
},
```

`theme` 推荐值：`green`、`blue`、`violet`、`amber`。

### 5.5 新增课程回放

在 `replays` 中增加对象：

```js
{
  id: 305,
  title: "Project Risk Review",
  titleZh: "项目风险复盘",
  sessionDate: "2026-08-05T14:00:00+08:00",
  speaker: "Trainer name",
  duration: "58 min",
  topic: "Operations",
  url: "https://SharePoint或Stream回放地址",
},
```

如果讲师姓名属于公司内部信息，必须先确认 GitHub Pages 的可见性和公司发布政策。

### 5.6 新增学习社群

在 `communities` 中增加对象：

```js
{
  id: 404,
  title: "Project Management Circle",
  titleZh: "项目管理实践圈",
  summary: "分享项目计划、风险管理和复盘实践。",
  memberCount: 86,
  cadence: "Monthly",
  theme: "mint",
  url: "https://社群落地页地址",
},
```

`theme` 推荐值：`lime`、`mint`、`amber`。

### 5.7 配置导航和业务入口

打开 `learning_hub/config.js`，填写 `routes`：

```js
home: {
  url: "https://tenant.sharepoint.com/sites/GSC-Learning/SitePages/Home.aspx",
  target: "_top",
},
```

目标规则：

- GitHub Pages 嵌入 SharePoint 时，SharePoint 页面使用 `target: "_top"`，让整个浏览器跳转到目标页面。
- 外部 LMS、Coursera 等系统使用 `target: "_blank"`。
- 页面迁移为 SPFx 后，内部页面可以改为 `target: "_self"`。

不要把访问令牌附加在 URL 中。

### 5.8 本地预览和检查

在仓库根目录运行：

```powershell
python -m http.server 4173 --bind 127.0.0.1 --directory learning_hub
```

打开：

```text
http://127.0.0.1:4173/
```

每次发布前检查：

- 本月必学标题、截止日期和链接。
- 课程日期、报名状态、席位和筛选主题。
- 中英文文本是否对应。
- 所有卡片是否能到达正确页面。
- 桌面端和手机端是否存在横向滚动。
- 页面刷新后是否仍能加载。
- 浏览器控制台是否有红色错误。

执行 JavaScript 语法检查：

```powershell
node --check learning_hub\config.js
node --check learning_hub\data-provider.js
node --check learning_hub\app.js
```

### 5.9 提交代码

只暂存本次修改的文件：

```powershell
git status
git diff -- learning_hub
git add -- learning_hub/data-provider.js learning_hub/config.js
git diff --cached
git commit -m "content: update August Learning Hub content"
```

如果修改了布局，再增加对应文件：

```powershell
git add -- learning_hub/index.html learning_hub/styles.css learning_hub/app.js
```

推送功能分支：

```powershell
git push -u origin content/2026-08-learning-update
```

然后在 GitHub 创建 Pull Request，至少让一位业务负责人核对内容和链接。合并到 Pages 发布分支后，GitHub Pages 才会更新。

如果团队直接使用 `main`：

```powershell
git push origin main
```

### 5.10 验证 GitHub Pages

GitHub 支持从指定分支或 GitHub Actions 发布 Pages；设置入口是 Repository → Settings → Pages：[GitHub Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

本项目页面地址通常是：

```text
https://z-ray66.github.io/schneider-particle-demo/learning_hub/
```

验证顺序：

1. 查看 GitHub 提交是否出现在远程分支。
2. 查看 Repository → Actions 中 Pages 工作流是否成功。
3. 打开 Pages 地址并强制刷新 `Ctrl + F5`。
4. 检查 SharePoint 中的嵌入页面。

GitHub 官方说明推送后发布可能需要数分钟；企业私有 Pages 文档给出的最长正常等待参考是约 10 分钟。

## 6. 在 SharePoint 中嵌入 GitHub Pages

Microsoft Embed Web Part 只接受安全的 HTTPS 内容，网站还必须允许 iframe 嵌入；SharePoint 管理员也可以限制允许嵌入的外部域名：[Microsoft Embed Web Part](https://support.microsoft.com/en-US/SharePoint/sites-pages/add-content-to-your-page-using-the-embed-web-part)。

操作步骤：

1. 打开目标 SharePoint Modern Page。
2. 选择 `Edit`。
3. 添加 `Embed </>` Web Part。
4. 输入 GitHub Pages HTTPS 地址。
5. 调整页面 Section 为宽布局，避免网页被压缩。
6. 保存为 Draft，由业务负责人检查。
7. Publish 或 Republish。

如果 URL 方式无法识别，可在公司策略允许时使用 iframe：

```html
<iframe
  src="https://z-ray66.github.io/schneider-particle-demo/learning_hub/"
  width="100%"
  height="1400"
  style="border:0"
  loading="eager"
  title="GSC China Learning Hub"
></iframe>
```

注意：

- Modern SharePoint 的 Embed Web Part 不支持任意 `<script>` 嵌入，只支持 iframe 类嵌入。
- SharePoint 管理员可能需要把 `https://z-ray66.github.io` 加入允许嵌入域名。
- GitHub Pages 更新后通常不需要重新编辑 Embed Web Part，因为 iframe URL 没变。
- 浏览器缓存未更新时先使用 `Ctrl + F5`，再检查 Pages 工作流。

## 7. 为什么 GitHub iframe 不适合直接读取 SharePoint Lists

GitHub Pages 与 `tenant.sharepoint.com` 是不同源。浏览器中的 GitHub iframe 不会天然拥有可以跨域调用 SharePoint REST 的认证上下文。SharePoint API 不是匿名 API，没有正确认证时会返回 `401 Unauthorized`。

Microsoft 的 SPFx 文档说明，`SPHttpClient` 会带上 SharePoint 认证 Cookie，而普通未认证请求不会：[Connect to SharePoint APIs](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/connect-to-sharepoint)。

因此不要尝试：

- 把账号密码写进 JavaScript。
- 把永久 Access Token 写进 GitHub。
- 在前端禁用 CORS。
- 使用公开代理转发公司 SharePoint 数据。

这些做法既不可靠，也不符合企业安全要求。

## 8. SharePoint Lists 动态模式

完成 SPFx 迁移后，内容维护人员通过 List 发布内容，不再修改代码。

### 8.1 建议建立的 Lists

1. `Learning Hub - Essential Learning`
2. `Learning Hub - Upcoming Classes`
3. `Learning Hub - Learning Paths`
4. `Learning Hub - Replays`
5. `Learning Hub - Communities`

字段详细定义见 `README.md`。`config.js > sharePoint.lists` 已包含默认 List 名称、查询字段和页面字段映射。

### 8.2 建议权限

| 角色 | 建议权限 |
| --- | --- |
| 员工 / Visitors | Read |
| 内容维护人员 | Contribute，或自定义仅可编辑项目的权限 |
| Learning Hub Owner | Edit / Design |
| SharePoint Owner / Admin | Full Control |

SharePoint 的 List 默认继承站点权限，也可以在 List 层停止继承并单独授权；优先使用组而不是逐个用户授权：[SharePoint permission levels](https://learn.microsoft.com/en-us/sharepoint/understanding-permission-levels)。

### 8.3 内容维护人员发布 SOP

以近期开课为例：

1. 打开 `Learning Hub - Upcoming Classes`。
2. 选择 `New`。
3. 填写中英文标题、开始/结束时间、主题、形式、语言、状态、剩余席位和链接。
4. 首次录入时将 `IsActive` 设为 `No`。
5. 由第二位维护人员检查日期、文本和链接。
6. 确认后将 `IsActive` 改为 `Yes`。
7. 刷新 Learning Hub 验证。
8. 课程过期后将 `IsActive` 改为 `No`，不要立即删除，以保留版本记录。

其他 Lists 使用同样流程。

### 8.4 推荐补充字段

当前代码使用 `IsActive` 控制是否显示。正式版建议后续增加：

- `PublishStart`：开始展示时间。
- `PublishEnd`：停止展示时间。
- `Owner`：内容负责人。
- `LastReviewedDate`：上次复核时间。
- `ApprovalStatus`：Draft、In Review、Published、Archived。
- `SortOrder`：排序。

增加这些字段后，需要同步修改 `config.js` 的 `$select`、`$filter` 和字段映射。

### 8.5 数据治理规则

- 不直接删除已使用内容，先归档或停用。
- URL 必须使用 HTTPS，正式发布前实际点击验证。
- 每条内容必须有 Owner。
- 每月检查过期课程、失效回放和人员变动。
- 使用 List 版本历史追踪变更。
- 不在课程标题或摘要中存储个人学习完成状态。

## 9. SPFx 开发实施手册

### 9.1 前置条件

需要公司 Microsoft 365 / SharePoint 管理员提供：

- 开发或测试站点。
- App Catalog 使用或上传权限。
- 五个 Lists 的访问权限。
- 正式页面 URL 和站点主题要求。
- 安全、隐私和发布审批要求。

Microsoft 当前文档针对 SPFx 1.22+ 使用 Heft 工具链，并要求匹配版本支持的 Node LTS；不要混用旧版 gulp 教程：[SPFx development environment](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-development-environment)。

典型工具安装方式：

```powershell
npm install @rushstack/heft yo @microsoft/generator-sharepoint --global
```

具体 Node 和 SPFx 版本必须按项目创建时的 Microsoft 兼容矩阵锁定，不要随意升级依赖。

### 9.2 创建项目

建议在仓库中新建独立目录，例如：

```powershell
mkdir spfx-learning-hub
cd spfx-learning-hub
yo @microsoft/sharepoint
```

建议选择：

- Component type：WebPart。
- Web Part name：LearningHub。
- Framework：React 或 No framework。团队已有 React 能力时优先 React。
- Environment：SharePoint Online only。

### 9.3 迁移当前页面

建议结构：

```text
spfx-learning-hub/
  src/webparts/learningHub/
    LearningHubWebPart.ts
    components/
      LearningHub.tsx
      EssentialLearning.tsx
      UpcomingClasses.tsx
      LearningPaths.tsx
      ReplayLibrary.tsx
      Communities.tsx
    services/
      ILearningHubDataProvider.ts
      SharePointLearningHubDataProvider.ts
    models/
      LearningHubModels.ts
    LearningHub.module.scss
```

迁移原则：

- 保留当前页面的视觉结构和 CSS token。
- 把 `data-provider.js` 的数据对象转换为 TypeScript interfaces。
- 把 `app.js` 的渲染逻辑拆成组件。
- 通过 Web Part `context` 注入 SharePoint 数据服务。
- 不在组件中硬编码 List GUID 或站点 URL；使用 Web Part Property Pane 或环境配置。

### 9.4 使用 SPHttpClient 读取 List

示例：

```ts
import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';

const webUrl = this.context.pageContext.web.absoluteUrl;
const endpoint =
  `${webUrl}/_api/web/lists/getbytitle('Learning Hub - Upcoming Classes')/items` +
  `?$select=Id,Title,TitleZh,StartDate,Topic,Status,LinkUrl` +
  `&$filter=IsActive eq 1&$orderby=StartDate asc`;

const response: SPHttpClientResponse = await this.context.spHttpClient.get(
  endpoint,
  SPHttpClient.configurations.v1,
  { headers: { Accept: 'application/json;odata.metadata=none' } }
);

if (!response.ok) {
  throw new Error(`SharePoint request failed: ${response.status}`);
}

const payload = await response.json();
const items = payload.value;
```

正式代码还需要：

- TypeScript 类型校验。
- HTTP 错误和空数据状态。
- 超时、重试与可观察日志。
- 字段缺失保护。
- 日期和时区统一。
- 对 URL 字段做协议白名单检查。

### 9.5 本地与测试环境验证

SPFx 1.22+ 使用 Heft：

```powershell
heft start
```

在公司测试站点的 SharePoint 调试工具或受支持的调试页面中验证：

- 当前用户能否读取 Lists。
- Visitors、内容维护人员和 Owners 三种权限是否符合预期。
- 空 List、字段缺失和请求失败时页面是否可用。
- 页面在 SharePoint Header、导航和不同 Section 宽度下是否正常。
- 移动端和 Microsoft Teams / Viva 中是否需要适配。

### 9.6 构建和部署

Microsoft 当前 Heft 流程使用：

```powershell
heft build --production
heft package-solution --production
```

然后：

1. 取得 `sharepoint/solution/*.sppkg`。
2. 上传到 SharePoint App Catalog。
3. 由管理员检查并启用应用。
4. 在测试站点安装应用。
5. 把 Learning Hub Web Part 添加到测试页面。
6. 完成 UAT 和安全检查。
7. 再推广到生产站点。

Microsoft 的完整打包和 App Catalog 流程见：[Deploy an SPFx web part](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/serve-your-web-part-in-a-sharepoint-page)。

### 9.7 版本管理

建议使用：

- `main`：生产版本。
- `develop`：集成测试版本。
- `feature/*`：功能开发。
- `content/*`：静态阶段的内容更新。
- `hotfix/*`：生产紧急修复。

每次 SPFx 发布同时更新：

- `package.json` 版本。
- `config/package-solution.json` 版本。
- `CHANGELOG.md`。
- UAT 记录。
- 回退包归档。

## 10. 日常运营职责

| 工作 | 开发者 | 内容维护人员 | 业务负责人 | SharePoint Admin |
| --- | --- | --- | --- | --- |
| 修改页面结构和交互 | 负责 | 参与验证 | 审批 | 需要时支持 |
| 添加课程和回放 | 支持 | 负责 | 审批 | 不参与 |
| 修改 List 字段 | 实施 | 提需求 | 审批 | 授权 |
| 管理页面权限 | 不负责 | 不负责 | 确认范围 | 负责 |
| SPFx 部署 | 打包 | 不参与 | UAT | 上架/启用 |
| 事故回退 | 负责 | 验证内容 | 决策 | 需要时支持 |

建议节奏：

- 每周：检查新课程、席位和失效链接。
- 每月：归档过期内容，复核学习路径和社群信息。
- 每季度：检查权限、依赖、浏览器兼容和数据字段。
- 每次发布：保留测试记录和回退点。

## 11. 故障处理

### 11.1 GitHub Pages 显示旧版本

检查：

1. `git status` 是否显示本地仍领先远程。
2. GitHub 最新提交是否正确。
3. Actions → Pages 工作流是否成功。
4. Pages URL 是否指向正确文件夹。
5. 使用 `Ctrl + F5` 强制刷新。
6. 等待几分钟后重试。

### 11.2 SharePoint 嵌入失败

检查：

- URL 是否为 HTTPS。
- GitHub Pages 本身能否独立打开。
- SharePoint 是否允许 `github.io` 域名。
- Embed code 是否为 iframe，而不是 `<script>`。
- GitHub Pages 是否设置了阻止 iframe 的响应头。
- 私有 Pages 登录是否能在 iframe 中完成。

### 11.3 导航点击后在小框中打开

确认 `config.js` 中 SharePoint 页面使用：

```js
target: "_top"
```

SPFx 模式下再改成 `_self`。

### 11.4 SharePoint 动态模式显示示例数据

检查：

- `dataMode` 是否为 `sharepoint`。
- `siteUrl` 是否正确。
- List 名称和字段内部名称是否匹配。
- `fallbackToMock` 是否仍为 `true`。
- 浏览器控制台中的实际 REST 错误。

生产环境建议：

```js
fallbackToMock: false
```

这样真实数据连接失败时会明确报错，不会误把示例数据当成正式内容。

### 11.5 返回 401 或 403

- `401`：通常是没有有效认证上下文。
- `403`：用户已认证，但没有 List 或站点权限。
- GitHub iframe 直接访问 SharePoint REST 时，不要用前端 Token 绕过；迁移到 SPFx。
- SPFx 中检查用户组、List 权限继承和站点访问权限。

### 11.6 回退代码版本

推荐使用可追踪的回退提交：

```powershell
git log --oneline -10
git revert <需要撤销的提交编号>
git push origin main
```

不要在多人仓库中随意使用 `git reset --hard` 和强制推送。

### 11.7 回退内容数据

- SharePoint List：使用版本历史恢复，或把错误项目设为 `IsActive = No`。
- GitHub 静态数据：使用 `git revert` 撤销对应内容提交。
- 紧急情况下优先停用错误链接，再进行完整修复。

## 12. 正式上线检查表

### 安全与治理

- [ ] IT 确认 GitHub Pages 可见性符合公司要求。
- [ ] 仓库中不存在 Token、密码和个人数据。
- [ ] SharePoint Lists 权限已经按组配置。
- [ ] 数据 Owner 和审批人明确。

### 内容

- [ ] 五个 Lists 已建立，内部字段名已经核对。
- [ ] 正式课程、路径、回放、社群数据已导入。
- [ ] 所有链接已点击验证。
- [ ] 日期和时区正确。
- [ ] 示例数据已关闭。

### 技术

- [ ] SPFx 或静态 Pages 部署方式已正式确认。
- [ ] Desktop、Mobile、Edge 浏览器测试通过。
- [ ] 空数据和接口失败状态测试通过。
- [ ] GitHub Pages / App Catalog 发布记录成功。
- [ ] 回退版本已经保留。

### SharePoint 页面

- [ ] 导航链接使用正确 target。
- [ ] 页面宽度和 iframe 高度合适。
- [ ] Visitors 权限账号测试通过。
- [ ] 页面已完成业务 UAT 并发布。

## 13. 推荐实施路线

### 第一阶段：原型评审

- 上传 GitHub Pages。
- 在 SharePoint 测试页面嵌入。
- 使用无敏感性的示例数据进行视觉和交互评审。

### 第二阶段：数据治理

- 建立五个 Lists。
- 明确字段、权限、Owner、审核和归档流程。
- 导入少量测试数据。

### 第三阶段：SPFx 迁移

- 将当前页面迁移为 SPFx Web Part。
- 使用 `SPHttpClient` 连接 Lists。
- 完成权限、异常和移动端测试。

### 第四阶段：生产上线

- App Catalog 发布。
- SharePoint 正式页面安装 Web Part。
- 内容维护人员培训。
- 建立月度内容审查和季度技术审查。

## 14. 官方参考资料

- [Microsoft：SharePoint Embed Web Part](https://support.microsoft.com/en-US/SharePoint/sites-pages/add-content-to-your-page-using-the-embed-web-part)
- [Microsoft：SPFx overview](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/sharepoint-framework-overview)
- [Microsoft：Connect to SharePoint APIs](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/connect-to-sharepoint)
- [Microsoft：Set up SPFx development environment](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-development-environment)
- [Microsoft：Deploy an SPFx web part](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/serve-your-web-part-in-a-sharepoint-page)
- [Microsoft：SharePoint permission levels](https://learn.microsoft.com/en-us/sharepoint/understanding-permission-levels)
- [Microsoft Graph：SharePoint sites and Lists](https://learn.microsoft.com/en-us/graph/api/resources/sharepoint?view=graph-rest-1.0)
- [GitHub：Configure Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [GitHub：Private Pages visibility](https://docs.github.com/en/enterprise-cloud@latest/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site)
