import { Paper } from "@mui/material"
import Box from "@mui/material/Box"
import React from "react"

export default function SprintSubIssue({ children }) {
  return (
    <Paper elevation={0} component={Box} sx={{ background: "transparent", borderRadius: 0, width: "100%", paddingLeft: "42px" }} py={1}>
      {children}
    </Paper>
  )
}
