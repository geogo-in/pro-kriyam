import { Box } from "@mui/material"
import { SectionTitle } from "pages/shared/SectionTitle"
import { OneBox } from "pages/shared/SplitContainer"
import { Outlet, useParams } from "react-router-dom"
import PageContainer from "../shared/PageContainer"
import GanttChart from "./components/GanttChart"

const ProjectRoadmap = () => {
  const { project_id } = useParams()

  return (
    <PageContainer>
      <Box sx={{ flexDirection: "row", display: "flex" }}>
        <OneBox sx={{ pl: 3, pr: 0, pt: 1, pb: 0 }}>
          <SectionTitle variant="h6">Project Roadmap</SectionTitle>
          <Box className="dx-viewport" sx={{ marginTop: "0px" }}>
            {/* <GanttChartWrapper> */}
            <GanttChart projectId={project_id} />
            {/* </GanttChartWrapper> */}
          </Box>
        </OneBox>
      </Box>
      <Outlet />
    </PageContainer>
  )
  // return (
  //   <Container>
  //     <GanttChartWrapper>
  //       <GanttChart projectId={project_id} />
  //     </GanttChartWrapper>
  //   </Container>
  // )
}

export default ProjectRoadmap
