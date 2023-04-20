import { HelpOutlineOutlined, Support } from "@mui/icons-material"
import { AppBar, Box, Button, Grid, Stack, Toolbar } from "@mui/material"
import Logo from "assets/images/Default_Full.svg"
import { Link, Outlet } from "react-router-dom"
import { PATH_DASHBOARD } from "routes/paths"

export default function LogoOnlyLayout() {
  return (
    <>
      <Box bgcolor="white">
        <AppBar position="static" color="inherit" elevation={1}>
          <Toolbar>
            <Grid container p={0}>
              <Grid xs={6} item>
                <Box sx={{ display: "flex", alignItems: "flex-end", marginBottom: 1 }}>
                  <Link to={PATH_DASHBOARD.root}>
                    <img src={Logo} alt="logo" height={40} />
                  </Link>
                </Box>
              </Grid>
              <Grid xs={6} item m="auto" pr={2}>
                <Stack direction={"row"} justifyContent={"flex-end"} spacing={2}>
                  <Button variant="rounded" color="inherit" endIcon={<Support />}>
                    Help !
                  </Button>
                  <Button variant="rounded" color="primary" endIcon={<HelpOutlineOutlined />}>
                    Contact Us
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
    </>
  )
}
