import RightArrowIcon from "@mui/icons-material/ArrowForward"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import LineCard from "pages/shared/LineCard"
import Loading from "pages/shared/Loading"
import TransparentLinkButton from "pages/shared/TransparentLinkButton"
import { Link } from "react-router-dom"
import { useGetProjectsQuery } from "@redux/services/projectApi"
import ProjectsTable from "./ProjectsTable"

const ActiveProjects = () => {
  const { data, isLoading, error } = useGetProjectsQuery({ limit: 5 })

  return (
    <LineCard variant="outlined" sx={{ marginBottom: 2 }}>
      <CardContent sx={{ padding: "12px 16px !important", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h6" color="#3e4954">
          Active Projects
        </Typography>
        <TransparentLinkButton to="/account/projects" component={Link} endIcon={<RightArrowIcon />}>
          View all projects
        </TransparentLinkButton>
      </CardContent>
      {error ? <>Oh no, there was an error</> : isLoading ? <Loading listing /> : data ? <ProjectsTable projects={data.projects} /> : null}
    </LineCard>
  )
}

export default ActiveProjects
