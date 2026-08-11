/**
 * Learning Hub configuration.
 *
 * 1. Keep dataMode as "mock" while previewing on GitHub Pages.
 * 2. Change it to "sharepoint" after the Lists below exist and the page runs
 *    inside an authenticated SharePoint context (preferably an SPFx web part).
 * 3. Fill route URLs when the destination SharePoint pages are available.
 */
window.LEARNING_HUB_CONFIG = Object.freeze({
  dataMode: "mock",
  fallbackToMock: true,
  showIntegrationPanel: true,
  // GitHub Pages runs inside a SharePoint iframe. Use "_top" so links replace
  // the parent SharePoint page instead of trying to open SharePoint in iframe.
  // Change this to "_self" after the page is migrated into an SPFx web part.
  contentLinkTarget: "_top",

  routes: {
    home: { url: "", target: "_top" },
    competencyFramework: { url: "", target: "_top" },
    expertsTrainers: { url: "", target: "_top" },
    learningInsights: { url: "", target: "_top" },
    classCalendar: { url: "", target: "_top" },
    allReplays: { url: "", target: "_top" },
    allCommunities: { url: "", target: "_top" },
    essentialLearning: { url: "", target: "_blank" },
    coursera: { url: "", target: "_blank" },
    shiXueTang: { url: "", target: "_blank" },
    myLearningLink: { url: "", target: "_blank" },
    comet: { url: "", target: "_blank" },
    careerHub: { url: "", target: "_blank" },
  },

  sharePoint: {
    // Example: "https://contoso.sharepoint.com/sites/GSC-Learning"
    siteUrl: "",
    lists: {
      essentialLearning: {
        title: "Learning Hub - Essential Learning",
        select: ["Id", "Title", "TitleZh", "Summary", "DueDate", "Status", "LinkUrl", "IsActive"],
        filter: "IsActive eq 1",
        orderBy: "DueDate asc",
        top: 1,
        fields: {
          id: "Id",
          title: "Title",
          titleZh: "TitleZh",
          summary: "Summary",
          dueDate: "DueDate",
          status: "Status",
          url: "LinkUrl",
        },
      },
      upcomingClasses: {
        title: "Learning Hub - Upcoming Classes",
        select: ["Id", "Title", "TitleZh", "StartDate", "EndDate", "Topic", "Format", "Language", "Status", "SeatsLeft", "LinkUrl", "IsActive", "SortOrder"],
        filter: "IsActive eq 1",
        orderBy: "StartDate asc,SortOrder asc",
        top: 12,
        fields: {
          id: "Id",
          title: "Title",
          titleZh: "TitleZh",
          startDate: "StartDate",
          endDate: "EndDate",
          topic: "Topic",
          format: "Format",
          language: "Language",
          status: "Status",
          seatsLeft: "SeatsLeft",
          url: "LinkUrl",
        },
      },
      replays: {
        title: "Learning Hub - Replays",
        select: ["Id", "Title", "TitleZh", "SessionDate", "Speaker", "Duration", "Topic", "LinkUrl", "IsActive", "SortOrder"],
        filter: "IsActive eq 1",
        orderBy: "SessionDate desc,SortOrder asc",
        top: 20,
        fields: {
          id: "Id",
          title: "Title",
          titleZh: "TitleZh",
          sessionDate: "SessionDate",
          speaker: "Speaker",
          duration: "Duration",
          topic: "Topic",
          url: "LinkUrl",
        },
      },
      communities: {
        title: "Learning Hub - Communities",
        select: ["Id", "Title", "TitleZh", "Summary", "MemberCount", "Cadence", "Theme", "LinkUrl", "IsActive", "SortOrder"],
        filter: "IsActive eq 1",
        orderBy: "SortOrder asc",
        top: 8,
        fields: {
          id: "Id",
          title: "Title",
          titleZh: "TitleZh",
          summary: "Summary",
          memberCount: "MemberCount",
          cadence: "Cadence",
          theme: "Theme",
          url: "LinkUrl",
        },
      },
    },
  },
});
