# 三个新增 SharePoint Embed 页面：发布与维护说明

## 页面目录

| SharePoint Page | GitHub Pages 子目录 | 页面内导航 |
| --- | --- | --- |
| Competency Framework | `competency_framework/` | 无 |
| Experts & Internal Trainers | `experts_trainers/` | 无 |
| Learning Insights | `learning_insights/` | 无 |

每个目录都是独立页面，可分别作为一个 SharePoint Embed Web Part 的网址。SharePoint 站点导航由 SharePoint 自己负责。

## 采用的简单内容架构

每页均分为两类内容：

1. 固定介绍：保存在该页 `index.html`，例如框架说明、数据原则和专家网络定位。
2. 需要更新的内容：保存在该页 `content.js`，例如岗位矩阵、专家名录、课程卡片和示例指标。

`app.js` 只负责把数据渲染成页面，`styles.css` 只负责视觉和动效。日常内容更新不应修改这两个文件。

## 内容维护者更新流程

### 使用 GitHub 网页直接更新

1. 打开仓库并进入对应页面文件夹。
2. 打开 `content.js`，点击 Edit。
3. 只修改引号中的文本、数字、数组项目或正式网址。
4. 使用 Preview changes 检查差异。
5. 提交到内容分支并发起 Pull Request；至少由一位业务 Owner 复核。
6. 合并并等待 GitHub Pages 发布，然后在 SharePoint 页面中刷新检查。

### 使用本地项目更新

```powershell
cd D:\Schneider_electric\schneider-particle-demo
node --check competency_framework\content.js
node --check competency_framework\app.js
node --check experts_trainers\content.js
node --check experts_trainers\app.js
node --check learning_insights\content.js
node --check learning_insights\app.js
```

预览任意页面：

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

地址示例：`http://127.0.0.1:4173/competency_framework/`。

## 各页面更新边界

### Competency Framework

- 固定：能力框架介绍、L1-L4 通用定义。
- 更新：岗位、目标能力等级、发展动作。
- 方法：编辑 `competency_framework/content.js`。
- 禁止：在公开页面加入员工个人评分。

### Experts & Internal Trainers

- 固定：专家网络介绍、知识贡献说明。
- 更新：Featured Course、专家名录、专业主题、金牌课程。
- 方法：编辑 `experts_trainers/content.js`。
- 注意：发布真实姓名与角色前需要获得内部授权；联系入口使用批准的业务页面，不写私人联系方式。

### Learning Insights

- 固定：页面介绍、数据阅读原则、隐私边界。
- 低频示例数据：编辑 `learning_insights/content.js`。
- 高频正式数据：不要手工频繁提交 Git，也不要为此引入 Power Automate 或 SPFx。
- 页面已经在 `SHAREPOINT PAGE SPLIT` 处划定分界。SharePoint 编辑者应让 HTML Embed 到这里结束，在下方直接添加 Power BI、SharePoint List 或其他公司批准的原生 Web Part。

配置完原生看板后，把 `learning_insights/content.js` 中的：

```js
showSharePointHandoff: true
```

改为：

```js
showSharePointHandoff: false
```

## 上线前必须替换的内容

- 所有空白 `url` / `contactUrl` / `developmentUrl`。
- 页面中的示例姓名、课程、指标和季度。
- Learning Insights 的统计口径和更新时间。
- SharePoint Embed Web Part 高度，避免内部出现双重滚动条。

不要把密码、访问令牌、员工个人明细或未经批准的内部数据放进任何 `content.js`。
