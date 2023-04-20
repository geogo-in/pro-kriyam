import Avatar from "@mui/material/Avatar"
import { styled } from "@mui/material/styles"
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip"
import AvatarGroup from "pages/shared/AvatarGroup"
import { stringAvatar } from "utils/Avatar"

const BootstrapTooltip = styled(({ className, ...props }) => <Tooltip enterDelay={10} {...props} arrow classes={{ popper: className }} />)(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    fontSize: 12,
  },
}))

const ActiveMembers = ({ members, max = 10, align = "right" }) => {
  if (!members?.length) return <span />

  return (
    <AvatarGroup total={members.length} max={max} align={align} sx={{ flexDirection: align === "left" ? "inherit" : "row-reverse" }}>
      {members.map(member => (
        <BootstrapTooltip key={member.id || member.name} title={member.name} placement="bottom-start">
          <Avatar {...stringAvatar(member.name)} />
        </BootstrapTooltip>
      ))}
    </AvatarGroup>
  )
}

export default ActiveMembers
