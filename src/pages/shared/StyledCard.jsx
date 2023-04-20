import MuiButton from "@mui/material/Button"
import MuiCard from "@mui/material/Card"
import MuiCardActions from "@mui/material/CardActions"

import { styled } from "@mui/material/styles"

export const Card = styled(MuiCard)(({ theme }) => ({
  boxShadow: "1px 1px 8px -5px #00000080",
}))
export const LineCard = styled(MuiCard)(({ theme }) => ({
  boxShadow: "none",
  border: "1px solid rgba(229,231,235,0.95)",
}))
export const CardHeader = styled("div")(({ theme }) => ({
  borderBottom: "1px solid rgba(218,220,224, 0.7)",
  padding: "14px 20px !important",
}))
export const CardTitle = styled("span")(({ theme }) => ({
  color: theme.palette.primary.defaultText,
  fontWeight: 500,
  padding: "2px 0",
  fontSize: "1.02rem",
}))
export const CardActions = styled(MuiCardActions)(({ theme }) => ({
  padding: "8px 16px !important",
  borderTop: "1px solid rgba(218,220,224, 0.7)",
  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.01)",
  },
}))
export const CardActionUnderlinedButton = styled(MuiButton)(({ theme }) => ({
  borderBottom: "0.125rem dotted #c4cdd5",
  borderRadius: 0,
  padding: "0 2px",
  margin: "4px 6px 8px 6px",
}))
