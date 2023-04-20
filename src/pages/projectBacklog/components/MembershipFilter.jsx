import Avatar from "@mui/material/Avatar"
import MuiAvatarGroup from "@mui/material/AvatarGroup"
import { styled } from "@mui/material/styles"
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip"
import { useGetProjectMembershipsQuery } from "@redux/services/projectApi"
import { stringAvatar } from "utils/Avatar"

const AvatarGroup = styled(MuiAvatarGroup)(({ theme }) => ({
  display: "flex",
  height: 40,
  alignItems: "center",
  "& .MuiAvatar-root": {
    // backgroundColor: blue[700],
    fontSize: "0.7rem",
    width: 32,
    height: 32,
    cursor: "pointer",
    transitionDuration: "300ms",
    transitionProperty: "margin-bottom",
    ":hover": {
      marginBottom: "8px",
    },
  },
  "& .SelectedAvatar": {
    fontWeight: "bold",
    outlineStyle: "solid",
    outlineColor: "#0069FF",
  },
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

const MembershipFilter = ({ project_id, max, selectedMembers, handleMemberFilter }) => {
  const { data: members, isLoading: isLoadingMembers } = useGetProjectMembershipsQuery(project_id)

  if (isLoadingMembers || !members?.length) return <span />
  return (
    <AvatarGroup total={members.length} max={max || 10}>
      {members?.map(({ user }) => {
        if (!user) return ""
        return (
          <BootstrapTooltip key={user.id} title={user.name} placement="bottom-start">
            <Avatar {...stringAvatar(user.name)} onClick={() => handleMemberFilter(user.id)} className={selectedMembers.includes(user.id) ? "SelectedAvatar" : ""} />
          </BootstrapTooltip>
        )
      })}
    </AvatarGroup>
  )
}

export default MembershipFilter
