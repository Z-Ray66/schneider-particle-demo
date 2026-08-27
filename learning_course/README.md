# 通用课程详情页

本文件夹只有一套课程详情模板。课程 URL 通过 `course` 参数选择数据：

```text
learning_course/?course=root-cause-analysis-workshop
learning_course/?course=code-of-conduct-2026-q3
```

所有详情均来自 `../learning_hub/content.js > courses`。因此不需要为每门课程复制 HTML，也不需要在 SharePoint 为每门课程建立 Page。

近期开课会显示状态、总席位、剩余席位、开始和结束时间、报名截止日期；必修课会显示完成截止日期和 LMS 入口。
