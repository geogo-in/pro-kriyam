import Box from "@mui/material/Box"
import Header from "pages/shared/Header"

function GanttChartWrapper({ children }) {
  return (
    <>
      <Header title="Roadmap" subtitle />
      <Box className="dx-viewport" py={2}>
        {children}
      </Box>
    </>
  )
}

export default GanttChartWrapper
