import { Grid } from "@mui/material"
import { useParams } from "react-router-dom"
import AddGroup from "./components/AddGroup"
import AssignMember from "./components/AssignMember"
import ProjectMembers from "./components/ProjectMembers"

const ProjectSettingsMembers = () => {
  const { project_id } = useParams()
  return (
    <Grid container spacing={2} sx={{ mt: 0 }}>
      <Grid item lg={6}>
        <ProjectMembers project_id={project_id} />
      </Grid>
      <Grid item lg={6}>
        <AssignMember project_id={project_id} />
        <AddGroup project_id={project_id} />
      </Grid>
    </Grid>
  )
}
export default ProjectSettingsMembers
