import MenuIcon from "@mui/icons-material/Menu"
import { Typography } from "@mui/material"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Toolbar from "@mui/material/Toolbar"
import Logo from "assets/images/Default_Full.svg"
import React, { useState } from "react"
// import { AvatarWithName } from "pages/shared/AvatarWithName"
import { Link } from "react-router-dom"
import { PATH_DASHBOARD } from "routes/paths"
import QuickActionButton from "./QuickActionButton"
import Search from "./Search"

const drawerWidth = 280

const Appbar = ({ mobileOpen, setMobileOpen }) => {
  const [open, setOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }
  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${0}px)` },
          ml: { sm: `${drawerWidth}px` },
          zIndex: theme => (open ? theme.zIndex.tooltip + 1 : theme.zIndex.drawer + 1),
          background: "white",
          borderBottom: "1px solid #F1F5F9",
          boxShadow: "none",
        }}>
        <Toolbar>
          <IconButton color="primary" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ width: `${drawerWidth - 24}px`, display: "flex", alignItems: "flex-end", marginBottom: 1 }}>
            <Link to={PATH_DASHBOARD.root}>
              <img src={Logo} alt="logo" height={40} />
            </Link>
            <Typography variant="h6" sx={{ textTransform: "uppercase", fontWeight: 600, color: "#10172a", fontSize: "0.8rem", padding: "2px 8px" }}>
              Projects
            </Typography>
          </Box>

          <Search {...{ open, setOpen }} />

          <QuickActionButton />
        </Toolbar>
      </AppBar>
      {open && <Box sx={{ zIndex: theme => theme.zIndex.tooltip, inset: 0, position: "absolute", background: "rgb(0,0,0,.5)" }} />}
    </>
  )
}

export default Appbar
