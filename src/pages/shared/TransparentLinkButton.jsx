import Button from "@mui/material/Button"
import { styled } from "@mui/material/styles"

const TransparentLinkButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  backgroundColor: "transparent",
  color: theme.palette.primary.main,
  boxShadow: "none",
  border: "none",
  lineHeight: 1.8,
  paddingLeft: 16,
  paddingRight: 16,
  // fontWeight: 400,
  // "&:hover": {
  //   border: "none",
  //   color: "#0071e1",
  //   backgroundColor: "#e2edf8",
  // },
}))

export default TransparentLinkButton
