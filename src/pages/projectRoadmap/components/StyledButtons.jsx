import Button from "@mui/material/Button"
import { styled } from "@mui/material/styles"

export const StyledPrimaryButton = styled(Button)(({ theme }) => ({
  borderRadius: 4,
  paddingLeft: 20,
  paddingRight: 24,
  lineHeight: 2.0,
  marginRight: 12,
}))

export const StyledSimpleButton = styled(Button)(({ theme }) => ({
  borderRadius: 4,
  backgroundColor: "#F1F5F9",
  paddingLeft: 12,
  paddingRight: 12,
  lineHeight: 2.0,
  color: "#000",
  boxShadow: "none",
}))

export const StyledTextButton = styled(Button)(({ theme }) => ({
  borderRadius: 4,
  paddingLeft: 12,
  paddingRight: 12,
  lineHeight: 2.0,
  color: "#757575",
  boxShadow: "none",
}))
