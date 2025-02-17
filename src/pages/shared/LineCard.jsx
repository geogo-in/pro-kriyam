import Card from "@mui/material/Card"
import { styled } from "@mui/material/styles"

const LineCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  // backgroundColor: "white",
  border: "1px solid rgba(218,220,224, 0.5)",
  boxShadow: "none",
}))

export default LineCard
