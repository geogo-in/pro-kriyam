import { redmineApi } from "./redmineApi"

const issueApi = redmineApi.injectEndpoints({
  endpoints: builder => ({
    //global
    getIssuesStatus: builder.query({
      query: () => ({ url: `/issue_statuses.json` }),
      transformResponse: response => response.issue_statuses,
    }),
    getIssuePriority: builder.query({
      query: () => ({ url: `/enumerations/issue_priorities.json` }),
      transformResponse: response => response.issue_priorities,
    }),
    getIssueType: builder.query({
      query: () => ({ url: "/trackers.json" }),
      transformResponse: response => response.trackers,
    }),

    // Issue
    getIssues: builder.query({
      query: params => ({ url: `/api/issues.json`, params }),
      providesTags: ["Issues"],
    }),
    getIssue: builder.query({
      query: issue_id => ({ url: `/api/issues/${issue_id}.json`, params: { include: "children,attachments,relations,changesets,watchers,reporter" } }),
      providesTags: ["Issue"],
      transformResponse: response => response.issue,
    }),
    createIssues: builder.mutation({
      query: issue => ({ url: `/api/issues.json`, method: "POST", body: { issue } }),
      invalidatesTags: result => (result ? ["Issues", "Backlog", "ActiveSprint"] : []),
    }),
    deleteIssue: builder.mutation({
      query: id => ({ url: `api/issues/${id}.json`, method: "DELETE" }),
      invalidatesTags: result => (result ? ["Issues", "ActiveSprint", "Backlog"] : []),
    }),
    updateIssues: builder.mutation({
      query: ({ id, invalidatesTags, ...data }) => {
        if (data.file) {
          var form = new FormData()
          form.append("issue[attach_files][]", data.file)
        }
        return { url: `/api/issues/${id}.json`, method: "PUT", body: form ?? { issue: data } }
      },
      invalidatesTags: (result, error, arg) => ["Issues", "Issue", "Backlog", "ActiveSprint"],
    }),
    updateIssueComments: builder.mutation({
      query: ({ id, comment_id, comment }) => ({ url: `api/issues/${id}/edit_comment/${comment_id}`, method: "PATCH", body: { notes: comment } }),
      invalidatesTags: result => ["Issue"],
    }),
    createIssueRelation: builder.mutation({
      query: ({ id, invalidatesTags, ...relation }) => {
        return { url: `/issues/${id}/relations.json`, method: "POST", body: relation }
      },
      invalidatesTags: result => (result ? ["Issues"] : []),
    }),
    deleteIssueRelation: builder.mutation({
      query: id => ({ url: `/relations/${id}.json`, method: "DELETE" }),
      invalidatesTags: result => (result ? ["Issues"] : []),
    }),
    // Issues Statuses
    getProjectIssuesStatuses: builder.query({
      query: project_id => ({ url: `/api/projects/${project_id}/project_issue_statuses.json` }),
      transformResponse: response => response.issue_statuses,
      providesTags: ["ProjectIssueStatuses"],
    }),
    createProjectIssueStatus: builder.mutation({
      query: ({ project_id, ...body }) => ({ url: `/api/projects/${project_id}/project_issue_statuses.json`, method: "POST", body }),
      invalidatesTags: result => (result ? ["ProjectIssueStatuses"] : []),
    }),
    deleteProjectIssueStatus: builder.mutation({
      query: ({ project_id, status_id, transfer_to_status }) => ({
        url: `/api/projects/${project_id}/project_issue_statuses/${status_id}/delete_issue`,
        method: "DELETE",
        params: { transfer_to_status },
      }),
      invalidatesTags: result => (result ? ["ProjectIssueStatuses"] : []),
    }),
    updateProjectIssueStatus: builder.mutation({
      query: ({ project_id, status_id, position, color_code }) => ({
        url: `/api/projects/${project_id}/project_issue_statuses/${status_id}/update`,
        body: { position, color_code },
        method: "PUT",
      }),
      invalidatesTags: result => (result ? ["ProjectIssueStatuses"] : []),
    }),

    // Epic API
    getEpic: builder.query({
      query: project_id => ({ url: `/projects/${project_id}/issue_categories.json` }),
      transformResponse: response => response.issue_categories,
      providesTags: ["Epic"],
    }),
    createEpic: builder.mutation({
      query: ({ project_id, ...issue_category }) => ({ url: `/projects/${project_id}/issue_categories.json`, method: "POST", body: { issue_category } }),
      invalidatesTags: result => (result ? ["Epic"] : []),
    }),
    updateEpic: builder.mutation({
      query: ({ epic_id, ...issue_category }) => ({ url: `/issue_categories/${epic_id}.json`, method: "PUT", body: { issue_category } }),
      invalidatesTags: result => (result ? ["Epic"] : []),
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetIssuesStatusQuery,
  useGetIssuePriorityQuery,
  useGetIssueTypeQuery,

  useGetIssuesQuery,
  useGetIssueQuery,
  useCreateIssuesMutation,
  useUpdateIssuesMutation,
  useUpdateIssueCommentsMutation,
  useDeleteIssueMutation,
  useCreateIssueRelationMutation,
  useDeleteIssueRelationMutation,

  useGetProjectIssuesStatusesQuery,
  useCreateProjectIssueStatusMutation,
  useDeleteProjectIssueStatusMutation,
  useUpdateProjectIssueStatusMutation,

  useGetEpicQuery,
  useCreateEpicMutation,
  useUpdateEpicMutation,
} = issueApi