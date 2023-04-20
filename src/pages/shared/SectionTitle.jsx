import { Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

export const SectionTitle = styled(Typography)(({ theme }) => ({
  borderBottom: "1px solid rgba(229,231,235, 0.5)",
  height: "54px",
  fontSize: "1.08rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexDirection: "row",
}))
