import { RESET_PASSWORD_URL } from "config/constants"
import { initializePushNotification } from "utils/firebase"
import { getErrorMessage } from "utils/helper"
import { unauthUser } from "../reducerSlices/user/userAuthSlice"
import { redmineApi } from "./redmineApi"

const issueApi = redmineApi.injectEndpoints({
  endpoints: builder => ({
    forgotPass: builder.mutation({ query: ({ mail }) => ({ url: `/api/users/lost_password`, method: "GET", params: { mail, url: RESET_PASSWORD_URL } }) }),
    resetPass: builder.mutation({
      query: state => ({ url: `/api/users/update_password`, method: "PATCH", body: { token: state.token, user: { password: state.password, password_confirmation: state.confirm } } }),
      transformErrorResponse: error => getErrorMessage(error),
    }),
    getUserMemberships: builder.query({
      query: () => ({ url: `/users/current.json`, params: { include: "memberships,groups" } }),
    }),
    login: builder.mutation({
      query: auth => ({ url: "/my/account.json", headers: { Authorization: "Basic " + btoa(`${auth.username}:${unescape(encodeURIComponent(auth.password))}`) } }),
      transformResponse: (response, _, auth) => {
        if (auth.rememberMe) localStorage.setItem("token", response.user.api_key)
        return response.user
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await dispatch(unauthUser())
        const { data } = await queryFulfilled
        initializePushNotification(data.user)
      },
    }),
    createUser: builder.mutation({ query: user => ({ url: `/api/users.json`, method: "POST", body: { user } }), invalidatesTags: (_, error) => (error ? [] : ["Users"]) }),
    updateUser: builder.mutation({ query: ({ id, ...user }) => ({ url: `/users/${id}.json`, method: "PUT", body: { user } }), invalidatesTags: (_, error) => (error ? [] : ["Users"]) }),
    updateUserFCM: builder.mutation({
      query: ({ user_id, firebase_key }) => ({ url: `/api/users/${user_id}.json`, method: "PUT", body: { user: { firebase_key } } }),
      invalidatesTags: (_, error) => (error ? [] : ["Users"]),
    }),
    getUsers: builder.query({ query: params => ({ url: `/users.json`, params: params || { limit: 10000 } }), providesTags: ["Users"] }),
    getUser: builder.query({ query: user_id => ({ url: `/users/${user_id}.json`, params: { include: "memberships,groups" } }), transformResponse: result => result.user }),
    getUserIssues: builder.query({
      query: assigned_to_id => ({ url: `/api/issues.json`, params: { assigned_to_id } }),
      providesTags: ["Issue"],
    }),
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
  useForgotPassMutation,
  useResetPassMutation,
  useGetUserMembershipsQuery,
  useLoginMutation,
  useCreateUserMutation,
  useCreateGroupsMutation,
  useGetUserQuery,
  useGetUserIssuesQuery,
  useGetRolesQuery,
  useGetUsersQuery,
  useGetGroupsQuery,
  useGetGroupQuery,
  useUpdateUserMutation,
  useRemoveGroupUserMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
} = issueApi
export const { login, updateUserFCM } = issueApi.endpoints
