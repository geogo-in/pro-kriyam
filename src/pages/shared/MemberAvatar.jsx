import MuiAvatar from "@mui/material/Avatar"
import { styled } from "@mui/material/styles"
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip"
import { stringAvatar } from "utils/Avatar"

const Avatar = styled(MuiAvatar)(({ theme, height, width }) => ({
  fontSize: "0.7rem",
  width: width,
  height: height,
}))

const BootstrapTooltip = styled(({ className, ...props }) => <Tooltip enterDelay={10} {...props} arrow classes={{ popper: className }} />)(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    fontSize: 12,
  },
}))

const MemberAvatar = ({ name, height = 25, width = 25, tooltipPosition = "bottom-start" }) => {
  if (tooltipPosition === "none") {
    return <Avatar height={height} width={width} {...stringAvatar(name)} />
  }
  return (
    <BootstrapTooltip title={name || "Unassigned"} placement={tooltipPosition}>
      <Avatar height={height} width={width} {...stringAvatar(name)} />
    </BootstrapTooltip>
  )
}

export default MemberAvatar
