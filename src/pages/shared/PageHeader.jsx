import Box from "@mui/material/Box"
import MuiContainer from "@mui/material/Container"
import { styled } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
// import Breadcrumbs from "./Breadcrumbs"

const Container = styled(MuiContainer)(({ theme }) => ({
  padding: "8px 0 8px 0",
}))

const StyledHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: "1.2rem",
  marginTop: 9,
  marginBottom: 9,
  clear: "both",
  color: "#3e4954",
}))

const PageHeader = ({ breadcrumbs, pageTitle, children }) => {
  return (
    <Box sx={{ backgroundColor: "#FFF", borderBottom: "1px solid rgba(218,220,224, 0.4)" }}>
      <Container>
        {/* <Breadcrumbs separator="›" aria-label="breadcrumb" breadcrumbs={breadcrumbs} /> */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <StyledHeading variant="h5" gutterBottom>
            {pageTitle}
          </StyledHeading>
          {children}
        </Box>
      </Container>
    </Box>
  )
}

export default PageHeader
