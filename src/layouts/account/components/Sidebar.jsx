// import AppBar from "@mui/material/AppBar"
import DashboardActiveIcon from "@mui/icons-material/DonutSmall"
import DashboardIcon from "@mui/icons-material/DonutSmallOutlined"
import MembersActiveIcon from "@mui/icons-material/People"
import MembersIcon from "@mui/icons-material/PeopleOutline"
// import SettingsActiveIcon from "@mui/icons-material/Settings"
// import SettingsIcon from "@mui/icons-material/SettingsOutlined"
import { Tune } from "@mui/icons-material"
import ProjectActiveIcon from "@mui/icons-material/Widgets"
import ProjectIcon from "@mui/icons-material/WidgetsOutlined"
import { ListItemText } from "@mui/material"
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import Toolbar from "@mui/material/Toolbar"
import { isAdmin } from "@redux/reducerSlices/user/userAuthSlice"
import { ListItem, ListItemIcon } from "pages/shared/CustomMenu"
import { useSelector } from "react-redux"
import { NavLink, useLocation, useParams } from "react-router-dom"
import ProjectSidebar from "./ProjectSidebar"

const drawerWidth = 280

const Sidebar = ({ sidebar, mobileOpen, setMobileOpen }) => {
  const Admin = useSelector(isAdmin)
  const location = useLocation()
  const { project_id } = useParams()
  const currentLocation = location.pathname
  const primaryLinks = sidebar => {
    const links = []
    switch (sidebar) {
      case "settings": {
        links.push({ icon: <Tune />, label: "General Settings", to: "/account/settings" })
        break
      }

      default:
        links.push({ icon: <DashboardIcon />, activeIcon: <DashboardActiveIcon />, label: "Dashboard", to: "/account/dashboard" })
        links.push({ icon: <ProjectIcon />, activeIcon: <ProjectActiveIcon />, label: "Projects", to: "/account/projects" })

        if (Admin) {
          links.push({ icon: <MembersIcon />, activeIcon: <MembersActiveIcon />, label: "Members", to: "/account/members" })
          // primaryLinks.push({ icon: <AnalyticsIcon />, activeIcon: <AnalyticsActiveIcon />, label: "Analytics", to: "/account/analytics" })
          // primaryLinks.push({ icon: <SettingsIcon />, activeIcon: <SettingsActiveIcon />, label: "Settings", to: "/account/analytics" })
        }
        break
    }

    return links
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
          {primaryLinks(sidebar).map(link => {
            const isActive = currentLocation.includes(link.to)
            return (
              <ListItem button key={link.to} component={NavLink} to={link.to} active={`${isActive}`}>
                <ListItemIcon active={`${isActive}`}>{isActive && link.activeIcon ? link.activeIcon : link.icon}</ListItemIcon>
                <ListItemText primary={link.label} />
              </ListItem>
            )
          })}
        </List>
      )}
    </div>
  )

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, background: theme => theme.palette.mode === "light" ? "" : `${theme.palette.background.modal}` },
        }}>
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, borderRight: theme => theme.palette.mode === "light" ? "1px solid #E5E7EB" : "1px solid #292929", backgroundColor: theme =>  theme.palette.background.default },
        }}
        open>
        {drawer}
      </Drawer>
    </Box>
  )
}

export default Sidebar
