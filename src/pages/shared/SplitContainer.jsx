import Box from "@mui/material/Box"
import { styled } from "@mui/material/styles"

const RBoxWidth = 320
export const LeftBox = styled(Box)(({ theme }) => ({
  background: "white",
  minHeight: `calc( 100vh - 64px )`,
  width: `calc( 100% - ${RBoxWidth}px )`,
}))
export const RightBox = styled(Box)(({ theme }) => ({
  width: RBoxWidth,
  borderLeft: "1px solid #f1f5f9",
}))
export const OneBox = styled(Box)(({ theme }) => ({
  background: "white",
  minHeight: `calc( 100vh - 64px )`,
  width: `100%`,
}))
