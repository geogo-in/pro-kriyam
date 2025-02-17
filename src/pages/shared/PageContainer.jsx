import Container from "@mui/material/Container"
import { styled } from "@mui/material/styles"

const PageContainer = styled(Container)(({ theme }) => ({
  maxWidth: "1700px !important", // For larger screen
  height: "calc( 100vh - 64px)",
  overflowY: "auto",
  padding: "0 !important",
  backgroundColor: theme.palette.background.secondary,
  // backgroundColor: "#f7fafc",
}))

export default PageContainer
