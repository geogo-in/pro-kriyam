import { Box, Typography } from "@mui/material"
import Logo from "assets/images/Default_Full.svg"

export default function UserFormLayout({ children, ...props }) {
  return (
    <Box display="flex" flexDirection="column" p={2} {...props}>
      <Box sx={{ display: "flex", alignItems: "flex-end", marginBottom: 3 }}>
        <img src={Logo} alt="logo" height={64} />
        <Typography variant="h6" sx={{ textTransform: "uppercase", fontWeight: 600, color: "#10172a", fontSize: "1.4rem", padding: "2px 8px" }}>
          Projects
        </Typography>
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 600, color: "#10172a", fontSize: "1.6rem", padding: "2px 8px" }}>
        Create something amazing.
      </Typography>

      {children}
    </Box>
  )
}
