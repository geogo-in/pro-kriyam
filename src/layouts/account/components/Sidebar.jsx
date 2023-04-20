// import AppBar from "@mui/material/AppBar"
import DashboardActiveIcon from "@mui/icons-material/DonutSmall"
import DashboardIcon from "@mui/icons-material/DonutSmallOutlined"
import MembersActiveIcon from "@mui/icons-material/People"
import MembersIcon from "@mui/icons-material/PeopleOutline"
// import SettingsActiveIcon from "@mui/icons-material/Settings"
// import SettingsIcon from "@mui/icons-material/SettingsOutlined"
import ProjectActiveIcon from "@mui/icons-material/Widgets"
import ProjectIcon from "@mui/icons-material/WidgetsOutlined"
import { ListItemText } from "@mui/material"
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import MuiListItem from "@mui/material/ListItem"
import MuiListItemIcon from "@mui/material/ListItemIcon"
import Toolbar from "@mui/material/Toolbar"
import { styled } from "@mui/material/styles"
import { useSelector } from "react-redux"
import { NavLink, useLocation, useParams } from "react-router-dom"
import { isAdmin } from "@redux/reducerSlices/user/userAuthSlice"
import ProjectSidebar from "./ProjectSidebar"

const drawerWidth = 280

const activeLinkMixin = theme => ({
  backgroundColor: "#f1f5f9",
  color: "black",
  "& .MuiSvgIcon-root": {
    height: "1.6em",
    color: "black",
  },
  "& .MuiListItemText-primary": {
    transition: "font-size .1s",

    fontSize: "1.05rem",
    fontWeight: 500,
  },
})

const ListItem = styled(MuiListItem)(({ theme, active }) => ({
  padding: "7px 2px 7px 20px",
  marginBottom: 4,
  borderRadius: "4px",
  position: "relative",
  color: theme.palette.primary.defaultText,
  "& .MuiSvgIcon-root": {
    height: "1.6em",
  },
  "& .MuiListItemText-primary": {
    transition: "font-size .1s",
    fontSize: "0.9rem",
    fontWeight: 500,
  },
  ...(active === "true" && {
    ...activeLinkMixin(theme),
  }),
}))

const activeLinkIconMixin = theme => ({
  color: "#63F5AF",
})

const ListItemIcon = styled(MuiListItemIcon)(({ theme, active }) => ({
  color: "#5F6368",
  minWidth: 48,
  ...(active === "true" && {
    ...activeLinkIconMixin(theme),
  }),
}))

const Sidebar = ({ window, mobileOpen, setMobileOpen }) => {
  const Admin = useSelector(isAdmin)
  const location = useLocation()
  const { project_id } = useParams()
  const currentLocation = location.pathname
  const primaryLinks = [
    { icon: <DashboardIcon />, activeIcon: <DashboardActiveIcon />, label: "Dashboard", to: "/account/dashboard" },
    { icon: <ProjectIcon />, activeIcon: <ProjectActiveIcon />, label: "Projects", to: "/account/projects" },
  ]
  if (Admin) {
    primaryLinks.push({ icon: <MembersIcon />, activeIcon: <MembersActiveIcon />, label: "Members", to: "/account/members" })
    // primaryLinks.push({ icon: <AnalyticsIcon />, activeIcon: <AnalyticsActiveIcon />, label: "Analytics", to: "/account/analytics" })
    // primaryLinks.push({ icon: <SettingsIcon />, activeIcon: <SettingsActiveIcon />, label: "Settings", to: "/account/analytics" })
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      {project_id ? (
        <ProjectSidebar project_id={project_id} />
      ) : (
        <List sx={{ paddingRight: 3, paddingTop: 3, paddingLeft: 3 }}>
          {primaryLinks.map(link => {
            const isActive = currentLocation.includes(link.to)
            return (
              <ListItem button key={link.to} component={NavLink} to={link.to} active={`${isActive}`}>
                <ListItemIcon active={`${isActive}`}>{isActive ? link.activeIcon : link.icon}</ListItemIcon>
                <ListItemText sx={{}} primary={link.label} />
              </ListItem>
            )
          })}
        </List>
      )}
    </div>
  )

  const container = window !== undefined ? () => window().document.body : undefined

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}>
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, borderRight: "1px solid #E5E7EB" },
        }}
        open>
        {drawer}
      </Drawer>
    </Box>
  )
}

export default Sidebar
