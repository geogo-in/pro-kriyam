import { Avatar, Chip } from "@mui/material"
import { stringAvatar } from "utils/Avatar"

export const AvatarWithName = ({ name }) => {
  if (!name) return ""
  // return <Chip sx={{ backgroundColor: "rgba(0,0,0,0.06)", color: "#5A6978", fontWeight: 500 }} avatar={<Avatar {...stringAvatar(name)} />} label={name} />
  return <Chip sx={{ backgroundColor: "rgba(0,0,0,0.06)", color: theme => theme.palette.mode === "light" ? "#5A6978" : theme.palette.text.secondary , fontWeight: 500 }} avatar={<Avatar {...stringAvatar(name)} />} label={name} />
}
