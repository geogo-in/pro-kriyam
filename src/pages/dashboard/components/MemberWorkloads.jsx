import Box from "@mui/material/Box"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import LineCard from "pages/shared/LineCard"

const MemberWorkloads = () => {
  return (
    <LineCard variant="outlined" sx={{ marginBottom: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h6" color="#3e4954">
              Workloads
            </Typography>
          </Box>
          <Box></Box>
        </Box>
      </CardContent>
    </LineCard>
  )
}

export default MemberWorkloads
