import Container from "@mui/material/Container"
import { useParams } from "react-router-dom"
import GanttChart from "./components/GanttChart"
import GanttChartWrapper from "./components/GanttChartWrapper"

const ProjectRoadmap = () => {
  const { project_id } = useParams()

  return (
    <Container>
      <GanttChartWrapper>
        <GanttChart projectId={project_id} />
      </GanttChartWrapper>
    </Container>
  )
}

export default ProjectRoadmap
