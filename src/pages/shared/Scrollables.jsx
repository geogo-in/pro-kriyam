import { Box, styled } from "@mui/material"

export const ScrollableGrid = styled(Box)(({ theme }) => ({
  height: "calc( 100vh - 182px )",
  width: "100%",
  overflow: "auto",
  paddingTop: 16,
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
