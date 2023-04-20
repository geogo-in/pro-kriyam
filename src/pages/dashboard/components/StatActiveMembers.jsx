import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import ActiveMembers from "pages/shared/MemberAvatars"
import { Card } from "pages/shared/StyledCard"
import TextWithPopover from "./TextWithPopover"

const StatActiveMembers = ({ activeMembers, members }) => {
  return (
    <Card>
      <CardContent sx={{ px: 3 }}>
        <TextWithPopover text="Active members" popoverText="Number of members, along with the top 10 most active members." />
        <Typography variant="h4" color={theme => theme.palette.primary.defaultText} sx={{ fontSize: "1.6rem", fontWeight: 500, marginTop: 1, mb: "16px" }}>
          {activeMembers}
        </Typography>
        <ActiveMembers members={members} align="left" />
      </CardContent>
    </Card>
  )
}

export default StatActiveMembers
