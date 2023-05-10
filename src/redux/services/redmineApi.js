import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import qs from "query-string"
import { API_ENDPOINT } from "../../config/constants"
import { unauthUser } from "../reducerSlices/user/userAuthSlice"

const baseQuery = fetchBaseQuery({
  baseUrl: API_ENDPOINT,
  paramsSerializer(params) {
    return qs.stringify(params, { arrayFormat: "bracket" })
  },
  prepareHeaders: (headers, { getState }) => {
    const token = getState().currentUser.token
    if (token) {
      headers.set("X-Redmine-API-Key", token)
    }
    return headers
  },
})
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    console.debug("logout from baseQueryWithReauth", result)
    api.dispatch(unauthUser())
  } else if (result.data?.status === "Fail") {
    return { error: { status: 400, data: result.data } }
  }
  return result
}
// Define a service using a base URL and expected endpoints
export const redmineApi = createApi({
  reducerPath: "redmine",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Issue", "Backlog", "ActiveSprint", "Sprints", "Epic", "ProjectIssueStatuses", "ProjectMembers", "Projects", "Project", "Users", "Groups", "Group", ""],

  endpoints: builder => ({
    getBacklogDetails: builder.query({
      query: ({ project_id, filter }) => ({ url: `/api/projects/${project_id}/sprints/backlogs`, params: { ...filter } }),
      providesTags: ["Backlog"],
      keepUnusedDataFor: 1, // Keep the data for 1s in cache after the last component unsubscribes
      transformResponse: response => {
        const { sprints } = response
        sprints.forEach(sprint => {
          const children = new Set()
          sprint.issues.forEach(issue => {
            if (issue.parent?.id) {
              var parent = sprint.issues.find(d => d.id === issue.parent.id)
              if (parent) {
                parent.child = parent.child ? [...parent.child, issue] : [issue]
                children.add(issue.id)
              }
            }
          })
          children.forEach(id => {
            const childIndex = sprint.issues.findIndex(d => d.id === id)
            if (childIndex !== -1) sprint.issues.splice(childIndex, 1)
          })
        })
        return sprints
      },
    }),

    getActiveSprints: builder.query({
      query: () => `/api/projects/active_sprints`,
      transformResponse: result => result.sprints,
    }),
    getActiveSprint: builder.query({
      query: ({ project_id, filter }) => ({
        url: `/api/projects/${project_id}/sprints/active`,
        params: { ...filter },
      }),
      providesTags: ["ActiveSprint"],
    }),
    createSprint: builder.mutation({
      query: ({ project_id, ...body }) => ({ url: `/api/projects/${project_id}/sprints`, method: "POST", body }),
      invalidatesTags: result => (result ? ["Backlog", "Sprints"] : []),
    }),
    listSprints: builder.query({
      query: ({ project_id }) => ({ url: `/api/projects/${project_id}/sprints` }),
      transformResponse: result => result.sprints,
      providesTags: ["Sprints"],
    }),
    updateSprintState: builder.mutation({
      query: ({ project_id, sprint_id, state, ...body }) => ({ url: `/api/projects/${project_id}/sprints/${sprint_id}/update_state/${state}`, method: `PUT`, body }),
      invalidatesTags: result => (result ? ["Backlog", "ActiveSprint"] : []),
    }),
    updateSprint: builder.mutation({
      query: ({ project_id, sprint_id, state, ...body }) => ({ url: `/api/projects/${project_id}/sprints/${sprint_id}`, method: `PUT`, body }),
      invalidatesTags: result => (result ? ["Backlog", "ActiveSprint"] : []),
    }),
    deleteSprint: builder.mutation({
      query: ({ project_id, sprint_id, ...params }) => ({ url: `/api/projects/${project_id}/sprints/${sprint_id}`, method: "DELETE", params }),
      invalidatesTags: (_, error) => (error ? [] : ["Backlog"]),
    }),

    addTaskToSprintOrBacklog: builder.mutation({
      query: ({ project_id, sprint_id, issue_id }) => ({
        // /api/projects/<project_id/project_short_url>/sprints/<sprint_id/backlog>/add_task
        url: `/api/projects/${project_id}/sprints/${sprint_id}/add_task`,
        method: "POST",
        body: { issue_id },
      }),
      invalidatesTags: result => (result ? ["Backlog"] : []),
    }),
    deleteAttachment: builder.mutation({
      query: ({ id, invalidatesTags }) => ({ url: `/attachments/${id}.json`, method: "DELETE" }),
      invalidatesTags: (result, error, arg) => !error && (arg.invalidatesTags || []),
    }),
    getDashboard: builder.query({ query: () => ({ url: `/api/dashboard`, params: { duration_in_day: 30 } }), transformResponse: result => result.data }),
    search: builder.query({ query: q => ({ url: "/api/search.json", params: { q } }) }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetBacklogDetailsQuery,
  useCreateSprintMutation,
  useAddTaskToSprintOrBacklogMutation,
  useDeleteAttachmentMutation,
  useDeleteSprintMutation,
  useUpdateSprintMutation,
  useUpdateSprintStateMutation,
  useGetActiveSprintQuery,
  useGetActiveSprintsQuery,
  useGetDashboardQuery,
  useSearchQuery,
  useLazySearchQuery,
  useListSprintsQuery,
} = redmineApi
