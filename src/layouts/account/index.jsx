import CssBaseline from "@mui/material/CssBaseline"
import Toolbar from "@mui/material/Toolbar"
import { styled } from "@mui/material/styles"
import * as React from "react"
import { Outlet } from "react-router-dom"
import Appbar from "./components/Appbar"
import Sidebar from "./components/Sidebar"

const drawerWidth = 280

const AccountUiContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexGrow: 1,
  height: "100vh",
  width: "100vw",
  overflow: "hidden",
  position: "relative",
}))

const MainContent = styled("main")(({ theme }) => ({
  flexGrow: 1,
  width: { sm: `calc(100% - ${drawerWidth}px)` },
  overflowY: "auto",
  "&:hover": {
    overflowY: "auto",
  },
  // backgroundColor: "#f9fafb",
  // fontFamily: theme.typography.fontFamily,
  // fontSize: "14px",
  // outlineOffset: "-2px",
}))

function ResponsiveDrawer(props) {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <AccountUiContainer>
      <CssBaseline />
      <Appbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <MainContent>
        <Toolbar />
        <Outlet />
      </MainContent>
    </AccountUiContainer>
  )
}

export default ResponsiveDrawer
