import Box from "@mui/material/Box"
import { useGetProjectByIdQuery } from "@redux/services/projectApi"
import Loading from "pages/shared/Loading"
import { Navigate } from "react-router-dom"
import { getErrorMessage } from "utils/helper"
import ProjectSidebarHeader from "./ProjectSidebarHeader"
import ProjectSidebarLinks from "./ProjectSidebarLinks"

const ProjectSidebar = ({ project_id }) => {
  const { data: project, isLoading, error } = useGetProjectByIdQuery(project_id)

  if (error) return <Navigate to="/404" replace state={{ status: error.status, message: getErrorMessage(error.data) }} />

  return (
    <Box position="relative">
      {isLoading ? (
        <Loading sidenav />
      ) : (
        project && (
          <>
            <ProjectSidebarHeader project={project} />
            <ProjectSidebarLinks project={project} />
          </>
        )
      )}
    </Box>
  )
}

export default ProjectSidebar
