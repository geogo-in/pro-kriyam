import { unauthUser } from "../reducerSlices/user/userAuthSlice"
import { redmineApi } from "./redmineApi"

const issueApi = redmineApi.injectEndpoints({
  endpoints: builder => ({
    getUserMemberships: builder.query({
      query: () => ({ url: `/users/current.json`, params: { include: "memberships,groups" } }),
    }),
    login: builder.mutation({
      query: auth => ({ url: "/my/account.json", headers: { Authorization: "Basic " + btoa(`${auth.username}:${unescape(encodeURIComponent(auth.password))}`) } }),
      transformResponse: (response, _, auth) => {
        if (auth.rememberMe) localStorage.setItem("token", response.user.api_key)
        return response.user
      },
      onQueryStarted: async (_, { dispatch }) => {
        await dispatch(unauthUser())
      },
    }),
    createUser: builder.mutation({ query: user => ({ url: `/api/users.json`, method: "POST", body: { user } }), invalidatesTags: (_, error) => (error ? [] : ["Users"]) }),
    updateUser: builder.mutation({ query: ({ id, ...user }) => ({ url: `/users/${id}.json`, method: "PUT", body: { user } }), invalidatesTags: (_, error) => (error ? [] : ["Users"]) }),
    getUsers: builder.query({ query: params => ({ url: `/users.json`, params }), providesTags: ["Users"] }),
    getUser: builder.query({ query: user_id => ({ url: `/users/${user_id}.json` }), transformResponse: result => result.user }),

    getRoles: builder.query({ query: () => ({ url: `/roles.json` }) }),
    createGroups: builder.mutation({ query: ({ id, ...group }) => ({ url: `/groups.json`, method: "POST", body: { group } }), invalidatesTags: (_, error) => (error ? [] : ["Groups"]) }),
    getGroups: builder.query({ query: params => ({ url: `/groups.json`, params }), transformResponse: result => result.groups, providesTags: ["Groups"] }),
    getGroup: builder.query({ query: id => ({ url: `/groups/${id}.json`, params: { include: "users,memberships" } }), transformResponse: result => result.group, providesTags: ["Group"] }),
    removeGroupUser: builder.mutation({
      query: ({ id, uid }) => ({ url: `/groups/${id}/users/${uid}.json`, method: "DELETE" }),
      invalidatesTags: (_, error) => (error ? [] : ["Group"]),
    }),
    updateGroup: builder.mutation({
      query: ({ id, ...group }) => ({ url: `/groups/${id}.json`, method: "PUT", body: { group } }),
      invalidatesTags: (_, error, arg) => (error ? [] : arg.name ? ["Group", "Groups"] : ["Group"]),
    }),
    deleteGroup: builder.mutation({
      query: id => ({ url: `/groups/${id}.json`, method: "DELETE" }),
      invalidatesTags: (_, error, arg) => (error ? [] : ["Groups"]),
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetUserMembershipsQuery,
  useLoginMutation,
  useCreateUserMutation,
  useCreateGroupsMutation,
  useGetUserQuery,
  useGetRolesQuery,
  useGetUsersQuery,
  useGetGroupsQuery,
  useGetGroupQuery,
  useUpdateUserMutation,
  useRemoveGroupUserMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
} = issueApi
export const { login } = issueApi.endpoints
