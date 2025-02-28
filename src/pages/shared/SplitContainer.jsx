import Box from "@mui/material/Box"
import { styled } from "@mui/material/styles"

const RBoxWidth = 320
export const LeftBox = styled(Box)(({ theme }) => ({
  // background: "white",
  background: theme.palette.background.default,
  minHeight: `calc( 100vh - 64px )`,
  width: `calc( 100% - ${RBoxWidth}px )`,
  [theme.breakpoints.down("lg")]: {
    width: "100%",
  },
}))
export const RightBox = styled(Box)(({ theme }) => ({
  width: RBoxWidth,
  borderLeft: theme.palette.mode === "light" ? "1px solid #f1f5f9" : "",
  [theme.breakpoints.down("lg")]: {
    display: "none",
  },
}))
export const OneBox = styled(Box)(({ theme }) => ({
  // background: "white",
  backgroundColor: theme.palette.mode === "light" ? "white" : theme.palette.background.default,
  minHeight: `calc( 100vh - 64px )`,
  width: `100%`,
}))
