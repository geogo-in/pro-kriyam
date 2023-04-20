import MuiAvatarGroup from "@mui/material/AvatarGroup"
import { blue } from "@mui/material/colors"
import { styled } from "@mui/material/styles"

const AvatarGroup = styled(MuiAvatarGroup)(({ theme }) => ({
  "& .MuiAvatarGroup-avatar": {
    backgroundColor: blue[700],
    fontSize: "0.7rem",
    width: 28,
    height: 28,
  },
  "& .MuiAvatar-root": {
    fontSize: "0.7rem",
    width: 30,
    height: 30,
  },
  "& .MuiAvatar-root:last-child": {
    marginLeft: -8,
  },
}))

export default AvatarGroup
