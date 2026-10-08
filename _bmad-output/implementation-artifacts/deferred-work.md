- source_spec: `D:\master page\_bmad-output\implementation-artifacts\spec-homepage-job-title-detail-navigation.md`
  summary: Reconcile the homepage recommendation and featured-job catalogs with the canonical job-detail dataset so every homepage job has complete matching detail data.
  evidence: The pre-existing homepage pools contain many records and IDs that are absent from `js/jobs-data.js`; this fix safely navigates unmatched jobs by title, but the detail page must use its generic fallback until a dedicated data migration adds canonical records.
