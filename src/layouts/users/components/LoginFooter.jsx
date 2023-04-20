import FavoriteIcon from "@mui/icons-material/Favorite"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import React from "react"

function LoginFooter() {
  return (
    <Stack md={"auto"} justifyContent="center" direction="row" flexWrap="wrap" textAlign={"center"}>
      <Typography variant="caption">Build and crafted with</Typography>
      <FavoriteIcon style={{ color: "red", fontSize: "10px", margin: "4px 4px 0px 4px" }} />
      <Typography variant="caption">by Geogo Techsolutions Pvt. Ltd.</Typography>

      <Typography pl={1.5} component="p" variant="caption" color="lightgray">
        <Box component="span" color="orange">
          Proudly
        </Box>{" "}
        made{" "}
        <Box component="span" color="green">
          in India.
        </Box>
      </Typography>
    </Stack>
  )
}

export default LoginFooter
