import Box from "@mui/material/Box"
import { styled } from "@mui/material/styles"

const RBoxWidth = 320
export const LeftBox = styled(Box)(({ theme }) => ({
  // background: "white",
  background: theme.palette.background.secondary,
  minHeight: `calc( 100vh - 64px )`,
  width: `calc( 100% - ${RBoxWidth}px )`,
  [theme.breakpoints.down("lg")]: {
    width: "100%",
  },
}))
export const RightBox = styled(Box)(({ theme }) => ({
  width: RBoxWidth,
  // borderLeft: "1px solid #f1f5f9",
  borderLeft: theme.palette.mode === "light" ? "1px solid #f1f5f9" : theme.palette.text.secondary,
  [theme.breakpoints.down("lg")]: {
    display: "none",
  },
}))
export const OneBox = styled(Box)(({ theme }) => ({
  // background: "white",
  background: theme.palette.background.secondary,
  minHeight: `calc( 100vh - 64px )`,
  width: `100%`,
}))
