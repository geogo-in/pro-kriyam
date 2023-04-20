import Grid from "@mui/material/Grid"
import { styled } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import { useGetProjectsQuery } from "@redux/services/projectApi"
import ProjectCard from "./ProjectCard"
import ProjectStats from "./ProjectStats"

const StyledHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: "1.2rem",
  marginTop: 8,
  marginBottom: 12,
  color: theme.palette.grey[800],
}))

const ProjectList = () => {
  const { data, isLoading, error } = useGetProjectsQuery()
  return (
    <div>
      <StyledHeading variant="h6" gutterBottom>
        Projects
      </StyledHeading>
      {error ? (
        <>Oh no, there was an error</>
      ) : isLoading ? (
        <>Loading...</>
      ) : data ? (
        <>
          <ProjectStats />
          <Grid container spacing={2}>
            {data.projects.map(project => (
              <Grid item key={project.id} xs={4}>
                <ProjectCard project={project} />
              </Grid>
            ))}
          </Grid>
        </>
      ) : null}
    </div>
  )
}

export default ProjectList
