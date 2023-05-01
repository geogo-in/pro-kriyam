import CssBaseline from "@mui/material/CssBaseline"
import Toolbar from "@mui/material/Toolbar"
import { AccountUiContainer, MainContent } from "pages/shared/SidebarContainer"
import * as React from "react"
import { Outlet } from "react-router-dom"
import Appbar from "./components/Appbar"
import Sidebar from "./components/Sidebar"

function ResponsiveDrawer({ sidebar = true, ...props }) {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <AccountUiContainer>
      <CssBaseline />
      <Appbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      {sidebar && <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} {...{ sidebar }} />}
      <MainContent>
        <Toolbar />
        <Outlet />
      </MainContent>
    </AccountUiContainer>
  )
}

export default ResponsiveDrawer
