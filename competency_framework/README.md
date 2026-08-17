# Competency Framework 页面维护说明

本目录是一个独立页面，不含网站导航，适合单独发布到 GitHub Pages 后嵌入对应 SharePoint Page。

## 内容分工

| 内容 | 更新频率 | 修改位置 |
| --- | --- | --- |
| 页面介绍、三项框架原则、L1-L4 说明 | 很低 | `index.html` |
| 岗位名称、岗位说明、目标等级、发展动作 | 季度或按版本 | `content.js` |
| 颜色、布局、动效 | 很低 | `styles.css` |
| 发展资源落地网址 | 有页面后一次配置 | `content.js > links.developmentUrl` |

维护者只需复制 `content.js > roles` 中已有角色对象并修改内容。`level` 只能填写 1、2、3、4。

不要在本页面记录员工个人能力评分。它只展示岗位标准；个人评估应留在公司批准的受控系统中。
