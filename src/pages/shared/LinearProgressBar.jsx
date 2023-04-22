import { LinearProgress } from "@mui/material"
import React from "react"

export default function LinearProgressBar() {
  return <LinearProgress color="primary" style={styles} />
}

const styles = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: 3,
  zIndex: 9999,
  backgroundColor: "rgb(255, 255, 255, 0.4)",
}
