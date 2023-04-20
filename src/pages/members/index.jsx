import { Box } from "@mui/material"
import { LeftBox, RightBox } from "pages/shared/SplitContainer"
import PageContainer from "../shared/PageContainer"
import MembersList from "./Components/MembersList"
import TeamsList from "./Components/TeamsList"

const Members = () => {
  return (
    <PageContainer>
      <Box sx={{ flexDirection: "row", display: "flex" }}>
        <LeftBox sx={{ px: 3, py: 1 }}>
          <MembersList />
          <TeamsList />
        </LeftBox>
        <RightBox sx={{ px: 3, py: 1 }}></RightBox>
      </Box>
    </PageContainer>
  )
}
export default Members
