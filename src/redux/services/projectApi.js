import { redmineApi } from "./redmineApi"

export const projectApi = redmineApi.injectEndpoints({
  endpoints: builder => ({
    getProjects: builder.query({
      query: query => ({ url: `/api/projects.json`, params: { include: "members,favourite", ...query } }),
      providesTags: ["Projects"],
      transformResponse: result => ({ ...result, projects: result.projects.sort((a, b) => +b.is_favourite - +a.is_favourite) }),
    }),
    getFavProjects: builder.query({
      query: query => ({ url: `/api/favourite_projects.json`, params: { include: "members", ...query } }),
      providesTags: ["Projects"],
      transformResponse: result => result.projects,
    }),
    getProjectById: builder.query({ query: projectId => `/api/projects/${projectId}.json`, transformResponse: response => response?.project, providesTags: ["Project"] }),
    getProjectMemberships: builder.query({
      query: projectId => `/projects/${projectId}/memberships.json`,
      transformResponse: response => response?.memberships,
      providesTags: ["ProjectMemberships"],
    }),
    getProjectTypes: builder.query({
      query: () => `/api/projects/get_types`,
      transformResponse: res => res?.project_types?.map(type => ({ ...type, desc: type.id === 1 ? "scram" : "kanban" })),
    }),
    createProject: builder.mutation({ query: project => ({ url: "/api/projects", method: "POST", body: { project } }), invalidatesTags: res => (res ? ["Projects"] : []) }),
    updateProjectDetails: builder.mutation({
      query: ({ project_id, ...project }) => ({ url: `/projects/${project_id}.json`, method: "PUT", body: { project } }),
      invalidatesTags: (_res, error) => (error ? [] : ["Projects", "Project"]),
    }),
    createProjectMembership: builder.mutation({
      query: ({ project_id, membership }) => ({ url: `/projects/${project_id}/memberships.json`, method: "POST", body: { membership } }),
      invalidatesTags: res => (res ? ["ProjectMemberships"] : []),
    }),
    deleteProjectMembership: builder.mutation({ query: ({ user_id }) => ({ url: `/memberships/${user_id}.json`, method: "DELETE" }), invalidatesTags: ["ProjectMemberships"] }),
    updateFavorite: builder.mutation({
      query: project_id => ({ url: `/api/projects/${project_id}/favourite_projects`, method: "POST" }),
      invalidatesTags: (_res, error) => (error ? [] : ["Projects"]),
    }),
  }),

  overrideExisting: false,
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetProjectsQuery,
  useGetFavProjectsQuery,
  useGetProjectByIdQuery,
  useGetProjectMembershipsQuery,
  useGetProjectTypesQuery,
  useCreateProjectMutation,
  useUpdateProjectDetailsMutation,
  useCreateProjectMembershipMutation,
  useDeleteProjectMembershipMutation,
  useUpdateFavoriteMutation,
} = projectApi
