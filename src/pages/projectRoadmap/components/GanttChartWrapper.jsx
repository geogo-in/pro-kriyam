import Box from "@mui/material/Box"

function GanttChartWrapper({ children }) {
  return (
    <>
      {/* <Header title="Roadmap" subtitle /> */}
      <Box className="dx-viewport" py={2}>
        {children}
      </Box>
    </>
  )
}

export default GanttChartWrapper
