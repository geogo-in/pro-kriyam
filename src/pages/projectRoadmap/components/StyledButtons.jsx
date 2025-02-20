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
  backgroundColor: theme.palette.mode === "light" ? "#F1F5F9" : "#0071E1",
  paddingLeft: 12,
  paddingRight: 12,
  lineHeight: 2.0,
  color: theme.palette.mode === "light" ? "#000" : "#fff",
  boxShadow: "none",
  ":hover": {
    backgroundColor: theme.palette.mode === "light" ? "" : theme.palette.primary.main
  }
}))

export const StyledTextButton = styled(Button)(({ theme }) => ({
  borderRadius: 4,
  paddingLeft: 12,
  paddingRight: 12,
  lineHeight: 2.0,
  color: "#757575",
  boxShadow: "none",
}))
