import { Box, Paper, Tab, Tabs } from "@mui/material"
import TabPanel from "pages/shared/TabPanel"
import { useState } from "react"
import AddGroup from "./AddGroup"
import AssignMember from "./AssignMember"

const Assign = ({ project_id }) => {
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Paper sx={{ p: 1, height: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Assign Member" />
          <Tab label="Add Group" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <AssignMember {...{ project_id }} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AddGroup {...{ project_id }} />
      </TabPanel>
    </Paper>
  )
}

export default Assign
