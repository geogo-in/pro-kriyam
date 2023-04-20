import { Box } from "@mui/material"
import { SectionTitle } from "pages/shared/SectionTitle"
import { OneBox } from "pages/shared/SplitContainer"
import PageContainer from "../shared/PageContainer"
import KeyUpdates from "./components/KeyUpdates"

const Members = () => {
  return (
    <PageContainer>
      <Box sx={{ flexDirection: "row", display: "flex" }}>
        <OneBox sx={{ px: 3, py: 1 }}>
          <SectionTitle variant="h6" sx={{ mb: 2 }}>
            Key Stats
          </SectionTitle>
          <KeyUpdates />
        </OneBox>
      </Box>
    </PageContainer>
  )
}
export default Members
