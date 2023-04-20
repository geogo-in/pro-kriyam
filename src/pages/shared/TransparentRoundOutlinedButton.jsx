import Button from "@mui/material/Button"
import { styled } from "@mui/material/styles"

const TransparentRoundOutlinedButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  backgroundColor: "transparent",
  color: "#64727f",
  boxShadow: "none",
  border: "1px solid #eeeeee",
  paddingLeft: 12,
  paddingRight: 12,
  lineHeight: 1.8,
  "&:hover": {
    backgroundColor: "#0069FF",
    color: "#FFF",
  },
}))

export default TransparentRoundOutlinedButton
