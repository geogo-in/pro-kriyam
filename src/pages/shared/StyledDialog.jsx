import Box from "@mui/material/Box"
import { styled } from "@mui/material/styles"

export const DialogHeader = styled(Box)(({ theme }) => ({
  boxShadow: "1px 1px 8px -5px #00000080",
  height: "64px",
  display: "flex",
  alignItems: "center",
  paddingLeft: 28,
  paddingRight: 28,
  // padding: "16px 16px 16px 28px",
}))

export const DialogContent = styled(Box)(({ theme }) => ({
  padding: "24px",
  height: "calc( 100vh - 128px )",
  overflowX: "hidden",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: 6,
    height: 16,
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#DFDFDF",
    borderRadius: "1px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
  },
}))

export const DialogFooter = styled(Box)(({ theme }) => ({
  height: "64px",
  display: "flex",
  alignItems: "center",
  paddingLeft: 28,
  paddingRight: 28,
  borderTop: "1px solid #E5E7EB",
}))
