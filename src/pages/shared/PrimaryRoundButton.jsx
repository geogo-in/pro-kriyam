import Button from "@mui/material/Button"
import { styled } from "@mui/material/styles"

const PrimaryRoundButton = styled(Button)(({ theme }) => ({
  borderRadius: 6,
  backgroundColor: "#2563EB",
  // backgroundColor: theme.palette.primary.defaultText,
  // backgroundColor: theme.palette.secondary.main,
  // color: "black",
  // color: theme.palette.primary.defaultText,
  // boxShadow: "6px 6px 14px -5px rgba(0,127,255,1)",
  paddingLeft: 20,
  paddingRight: 24,
  lineHeight: 2.0,
  "&:hover": {
    backgroundColor: "#0071e1",
  },
}))

export default PrimaryRoundButton
