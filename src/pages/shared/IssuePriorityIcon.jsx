import BoltIcon from "@mui/icons-material/BoltOutlined"
import NormalIcon from "@mui/icons-material/DragHandle"
import KeyboardControlKeyIcon from "@mui/icons-material/KeyboardControlKey"
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown"
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp"
import OtherIcon from "@mui/icons-material/ShortText"
import React from "react"

export default function IssuePriorityIcon({ type_name, ...props }) {
  switch (type_name?.toLocaleLowerCase()) {
    case "low":
      return <KeyboardDoubleArrowDownIcon color="primary" sx={{ padding: "0 2px" }} {...props} />
    case "normal":
      return <NormalIcon sx={{ fill: "#4caf50", padding: "0 2px" }} {...props} />
    case "high":
      return <KeyboardControlKeyIcon sx={{ fill: "#f9a825", padding: "0 2px" }} {...props} />
    case "urgent":
      return <KeyboardDoubleArrowUpIcon sx={{ fill: "#ef6c00", padding: "0 2px" }} {...props} />
    case "immediate":
      return <BoltIcon sx={{ fill: "#e91e63", padding: "0 2px" }} {...props} />
    default:
      return <OtherIcon sx={{ fill: "#78909c", padding: "0 2px" }} {...props} />
  }
}
