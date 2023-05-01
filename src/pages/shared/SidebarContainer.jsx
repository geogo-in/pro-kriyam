import { styled } from "@mui/material"

export const drawerWidth = 280

export const AccountUiContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexGrow: 1,
  height: "100vh",
  width: "100vw",
  overflow: "hidden",
  position: "relative",
}))

export const MainContent = styled("main")(({ theme }) => ({
  flexGrow: 1,
  width: { sm: `calc(100% - ${drawerWidth}px)` },
  overflowY: "auto",
  "&:hover": { overflowY: "auto" },
  // backgroundColor: "#f9fafb",
  // fontFamily: theme.typography.fontFamily,
  // fontSize: "14px",
  // outlineOffset: "-2px",
}))
