import { Box } from "@mui/material"
import PageContainer from "pages/shared/PageContainer"
import { SectionTitle } from "pages/shared/SectionTitle"
import { OneBox } from "pages/shared/SplitContainer"
import { useState } from "react"
import { Outlet, useParams } from "react-router-dom"
import ReportContainer from "./components/ReportContainer"

export default function ProjectSprintReport() {
  const { project_id } = useParams()
  const [open, setOpen] = useState(false)
  const handleCreateIssue = () => {
    setOpen(!open)
  }

  return (
    <PageContainer>
      <Box sx={{ flexDirection: "row", display: "flex" }}>
        <OneBox sx={{ pl: 3, pr: 0, pt: 1, pb: 0 }}>
          <SectionTitle variant="h6">Sprint Report</SectionTitle>
          <ReportContainer project_id={project_id} />
        </OneBox>
      </Box>
      <Outlet />
    </PageContainer>
  )
}
