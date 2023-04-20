import { Box } from "@mui/material"
import { LeftBox, RightBox } from "pages/shared/SplitContainer"
import PageContainer from "../shared/PageContainer"
import Information from "./Components/Information"
import Meta from "./Components/Meta"

export default function TeamDetails() {
  return (
    <PageContainer>
      <Box sx={{ flexDirection: "row", display: "flex" }}>
        <LeftBox sx={{ px: 3, py: 1 }}>
          <Information />
        </LeftBox>
        <RightBox sx={{ px: 3, py: 1 }}>
          <Meta />
        </RightBox>
      </Box>
    </PageContainer>
  )
}
