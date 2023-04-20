import AbcIcon from "@mui/icons-material/Abc"
import BugReportIcon from "@mui/icons-material/BugReportOutlined"
import FeatureIcon from "@mui/icons-material/CategoryOutlined"
import SupportIcon from "@mui/icons-material/HelpCenterOutlined"
import EpicIcon from "@mui/icons-material/Pages"
import StoryIcon from "@mui/icons-material/PlaylistAddCheck"
import SubTaskIcon from "@mui/icons-material/StyleOutlined"
import TaskIcon from "@mui/icons-material/VerticalSplitOutlined"

export default function IssueTypeIcon({ type_id, type_name }) {
  if (type_name) {
    const name = type_name.toLocaleLowerCase()

    switch (name) {
      case "bug":
        return <BugReportIcon sx={{ fill: "#ef5350", width: "0.8em", height: "0.8em" }} />
      case "feature":
        return <FeatureIcon color="green" sx={{ fill: "#4caf50", width: "0.8em", height: "0.8em" }} />
      case "support":
        return <SupportIcon sx={{ fill: "#00bcd4", width: "0.8em", height: "0.8em" }} />
      case "task":
        return <TaskIcon sx={{ fill: "#009688", width: "0.8em", height: "0.8em" }} />
      case "story":
        return <StoryIcon sx={{ fill: "#651fff", width: "0.8em", height: "0.8em" }} />
      case "epic":
        return <EpicIcon sx={{ fill: "#ff9800", width: "0.8em", height: "0.8em" }} />
      case "sub-task":
        return <SubTaskIcon sx={{ fill: "#ec407a", width: "0.8em", height: "0.8em" }} />
      default:
        return <AbcIcon />
    }
  } else if (type_id === 1) return <BugReportIcon sx={{ fill: "#ef5350", width: "0.8em", height: "0.8em" }} />
  else if (type_id === 2) return <FeatureIcon color="green" sx={{ fill: "#4caf50", width: "0.8em", height: "0.8em" }} />
  else if (type_id === 3) return <SupportIcon sx={{ fill: "#00bcd4", width: "0.8em", height: "0.8em" }} />
  else return <AbcIcon />
}
