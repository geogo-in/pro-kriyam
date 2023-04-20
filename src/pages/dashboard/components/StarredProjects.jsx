import { Box } from "@mui/material"
import Loading from "pages/shared/Loading"
import { SectionTitle } from "pages/shared/SectionTitle"
import { useGetFavProjectsQuery, useGetProjectsQuery } from "@redux/services/projectApi"
import ProjectsTable from "./ProjectsTable"

const StarredProjects = () => {
  const { data: projects, isLoading, error } = useGetFavProjectsQuery()
  const { data: activeProjects, isLoading: isLoadingActiveProjects } = useGetProjectsQuery({ limit: 5 })

  if (isLoading) return <Loading listing2 />

  if (error) return "error"
  if (projects.length === 0) {
    // If there are no starred projects, show active projects instead
    if (isLoadingActiveProjects) return <Loading listing2 />
    if (activeProjects && activeProjects.projects.length > 0) {
      return (
        <Box sx={{ mb: 2 }}>
          <SectionTitle variant="h6">Active projects</SectionTitle>
          <ProjectsTable projects={activeProjects.projects} />
        </Box>
      )
    } else {
      return <span />
    }
  }
  return (
    <Box sx={{ mb: 2 }}>
      <SectionTitle variant="h6">Starred projects</SectionTitle>
      <ProjectsTable projects={projects} />
    </Box>
  )
}

export default StarredProjects
