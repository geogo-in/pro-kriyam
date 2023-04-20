import { Box } from "@mui/material"
import { LeftBox, RightBox } from "pages/shared/SplitContainer"
import PageContainer from "../shared/PageContainer"
import Information from "./Components/Information"

export default function MemberDetails() {
  return (
    <PageContainer>
      <Box sx={{ flexDirection: "row", display: "flex" }}>
        <LeftBox sx={{ px: 3, py: 1 }}>
          <Information />
        </LeftBox>
        <RightBox sx={{ px: 3, py: 1 }}>{/* <ActivityStream /> */}</RightBox>
      </Box>
    </PageContainer>
  )
}
