import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import { Outlet } from "react-router-dom"
import BacklogScreen from "../../assets/images/screen-project-backlog.png"

export default function UserLayout(props) {
  return (
    <Box height="100vh" display="flex" flexDirection="column" flexGrow={1}>
      <Grid container sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }} flex={1}>
        <Grid md={7} sx={{ backgroundColor: "#161f2d", alignItems: "center" }} p={0} m={0} display={{ xs: "none", md: "flex" }} item>
          <Box mx={12} sx={{ borderRadius: "4px", overflow: "hidden" }}>
            <img src={BacklogScreen} alt="Backlog Screen" />
          </Box>
        </Grid>
        <Grid xs={12} md={5} item sx={{ backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center", flexGrow: "1" }}>
          <Outlet />
        </Grid>
      </Grid>
    </Box>
  )
}
