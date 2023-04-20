function path(root, sublink) {
  return `${root}${sublink}`
}

const ROOTS_AUTH = "/users"
const ROOTS_DASHBOARD = "/account"

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  signIn: path(ROOTS_AUTH, "/sign_in"),
  resetPassword: path(ROOTS_AUTH, "/reset_password"),
  forgetPassword: path(ROOTS_AUTH, "/forget_password"),
  me: path(ROOTS_AUTH, "/me"),
}

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  dashboard: path(ROOTS_DASHBOARD, "/dashboard"),
  projects: {
    root: path(ROOTS_DASHBOARD, "/projects"),
    new: path(ROOTS_DASHBOARD, "/projects/new"),
  },
  myWork: path(ROOTS_DASHBOARD, "/my-work"),
  members: path(ROOTS_DASHBOARD, "/members"),
  analytics: path(ROOTS_DASHBOARD, "/analytics"),
  help: path(ROOTS_DASHBOARD, "/help"),
  notifications: path(ROOTS_DASHBOARD, "/notifications"),
}
