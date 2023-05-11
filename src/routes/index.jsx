import { lazy, Suspense } from "react"
import { Navigate, Outlet, useRoutes } from "react-router-dom"
import AuthGuard from "../guards/AuthGuard"
import GuestGuard from "../guards/GuestGuard"
import AccountLayout from "../layouts/account"
import LogoOnlyLayout from "../layouts/logoOnly"
import ProjectSettingsLayout from "../layouts/projectSettings"
import UserLayout from "../layouts/users"
import LinearProgressBar from "../pages/shared/LinearProgressBar"

const Loadable = Component => props =>
  (
    <Suspense fallback={<LinearProgressBar />}>
      <Component {...props} />
    </Suspense>
  )

export default function Router() {
  const issueRoutes = [
    { index: true, element: <></> },
    { path: "issues/:issue_id", element: <ProjectIssueDetails /> },
  ]
  return useRoutes([
    // Auth Routes
    {
      path: "users",
      element: (
        <GuestGuard>
          <UserLayout />
        </GuestGuard>
      ),
      children: [
        { index: true, element: <Navigate to="/users/sign_in" replace /> },
        { path: "sign_in", element: <Signin /> },
        { path: "forgot_password", element: <ForgetPassword /> },
        { path: "reset_password", element: <ResetPassword /> },
      ],
    },
    {
      path: "users",
      element: (
        <AuthGuard>
          <LogoOnlyLayout />
        </AuthGuard>
      ),
      children: [{ path: "me", element: <Me /> }],
    },

    // Dashboard Routes
    {
      path: "account",
      element: (
        <AuthGuard>
          <AccountLayout />
        </AuthGuard>
      ),
      children: [
        { index: true, element: <Navigate to="/account/dashboard" replace /> },
        {
          path: "dashboard",
          children: [{ index: true, element: <Dashboard /> }],
        },
        {
          path: "projects",
          children: [
            { index: true, element: <Projects /> },
            { path: "new", element: <ProjectCreation /> },
            {
              path: ":project_id",
              children: [
                { index: true, element: <Project /> },
                { path: "backlog", element: <ProjectBacklog />, children: issueRoutes },
                { path: "sprint", element: <ProjectActiveSprint />, children: issueRoutes },
                { path: "board", element: <ProjectActiveSprint />, children: issueRoutes },
                { path: "roadmap", element: <ProjectRoadmap /> },
                { path: "reports", element: <ProjectReports /> },
                {
                  path: "issues",
                  element: <ProjectIssues />,
                  children: [
                    { index: true, element: <></> },
                    { path: ":issue_id", element: <ProjectIssueDetails /> },
                  ],
                },
                {
                  path: "settings",
                  element: (
                    <AuthGuard admin>
                      <ProjectSettingsLayout />
                    </AuthGuard>
                  ),
                  children: [
                    { index: true, element: <ProjectSettings /> },
                    { index: "basic", element: <ProjectSettings /> },
                    { path: "members", element: <ProjectSettingsMembers /> },
                    { path: "statuses", element: <ProjectSettingsStatus /> },
                    { path: "issue-types", element: <ProjectSettingsIssueType /> },
                  ],
                },
              ],
            },
          ],
        },
        {
          path: "members",
          element: (
            <AuthGuard admin>
              <Outlet />
            </AuthGuard>
          ),
          children: [
            { index: true, element: <Members /> },
            { path: ":user_id", element: <MemberDetails /> },
            { path: "teams/:team_id", element: <TeamDetails /> },
          ],
        },
        // {
        //   path: "analytics",
        //   children: [{ index: true, element: <Analytics /> }],
        // },

        { path: "help", element: <Help /> },
        { path: "notifications", element: <Notifications /> },
      ],
    },

    // Main Routes
    {
      path: "*",
      element: <LogoOnlyLayout />,
      children: [
        { path: "404", element: <NotFound /> },
        // { path: "*", element: <Navigate to="/404" replace /> },
      ],
    },
    { path: "/", element: <Navigate to="/account/dashboard" replace /> },
    { path: "/help", element: <Help /> },
  ])
}

// IMPORT COMPONENTS

// Authentication
const Signin = Loadable(lazy(() => import(/* webpackChunkName: "Signin" */ "../pages/signin")))
const ResetPassword = Loadable(lazy(() => import(/* webpackChunkName: "ResetPassword" */ "../pages/resetPassword")))
const ForgetPassword = Loadable(lazy(() => import(/* webpackChunkName: "ForgetPassword" */ "../pages/forgotPassword")))

// Dashboard
const Dashboard = Loadable(lazy(() => import(/* webpackChunkName: "Dashboard" */ "../pages/dashboard")))
// const MyDashboard = Loadable(lazy(() => import(/* webpackChunkName: "MyDashboard" */ "../pages/dashboardOfMine")))
const Projects = Loadable(lazy(() => import(/* webpackChunkName: "Projects" */ "../pages/projects")))
// const MyWork = Loadable(lazy(() => import(/* webpackChunkName: "MyWork" */ "../pages/myWork")))
const Members = Loadable(lazy(() => import(/* webpackChunkName: "Members" */ "../pages/members")))
const Me = Loadable(lazy(() => import(/* webpackChunkName: "Me" */ "../pages/me")))
// const Analytics = Loadable(lazy(() => import(/* webpackChunkName: "Analytics" */ "../pages/analytics")))

const TeamDetails = Loadable(lazy(() => import(/* webpackChunkName: "TeamDetails" */ "../pages/teamDetails")))
const MemberDetails = Loadable(lazy(() => import(/* webpackChunkName: "MemberDetails" */ "../pages/memberDetails")))
const Help = Loadable(lazy(() => import(/* webpackChunkName: "Help" */ "../pages/help")))
const Notifications = Loadable(lazy(() => import(/* webpackChunkName: "Notifications" */ "../pages/notifications")))

// Project
const ProjectCreation = Loadable(lazy(() => import(/* webpackChunkName: "ProjectCreation" */ "../pages/ProjectCreation")))
const Project = Loadable(lazy(() => import(/* webpackChunkName: "Project" */ "../pages/project")))
const ProjectBacklog = Loadable(lazy(() => import(/* webpackChunkName: "ProjectBacklog" */ "../pages/projectBacklog")))
const ProjectActiveSprint = Loadable(lazy(() => import(/* webpackChunkName: "ProjectActiveSprint" */ "../pages/projectActiveSprint")))
const ProjectRoadmap = Loadable(lazy(() => import(/* webpackChunkName: "ProjectRoadmap" */ "../pages/projectRoadmap")))
const ProjectIssues = Loadable(lazy(() => import(/* webpackChunkName: "ProjectIssues" */ "../pages/projectIssues")))
const ProjectIssueDetails = Loadable(lazy(() => import(/* webpackChunkName: "ProjectIssueDetails" */ "../pages/projectIssueDetails")))
const ProjectReports = Loadable(lazy(() => import(/* webpackChunkName: "ProjectReports" */ "../pages/projectReports")))

const ProjectSettings = Loadable(lazy(() => import(/* webpackChunkName: "ProjectSettings" */ "../pages/projectSettings")))
const ProjectSettingsMembers = Loadable(lazy(() => import(/* webpackChunkName: "ProjectSettingsMembers" */ "../pages/projectSettingsMembers")))
const ProjectSettingsStatus = Loadable(lazy(() => import(/* webpackChunkName: "ProjectSettingsStatus" */ "../pages/projectSettingsStatus")))
const ProjectSettingsIssueType = Loadable(lazy(() => import(/* webpackChunkName: "ProjectSettingsIssueType" */ "../pages/projectSettingsIssueType")))
// Main
const NotFound = Loadable(lazy(() => import(/* webpackChunkName: "notFound" */ "../pages/notFound")))
