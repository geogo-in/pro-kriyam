import Fade from "@mui/material/Fade"
import Skeleton from "@mui/material/Skeleton"
import Stack from "@mui/material/Stack"

const LoadingSkeleton = () => {
  return (
    <Stack spacing={1} sx={{ padding: "12px", width: "100%" }}>
      <Fade in>
        <Skeleton variant="text" height={40} width={400} sx={{ background: theme => theme.palette.mode === "light" ? "#f1f5f9" : "#38414C", fontSize: "1rem", borderRadius: "12px" }} />
      </Fade>
      {[1, 2, 3, 4].map(item => (
        <Fade in key={item} timeout={200 * item}>
          <Skeleton variant="rounded" animation="wave" sx={{ background: theme => theme.palette.mode === "light" ? "#f1f5f9" : "#38414C", width: "100%" }} height={40} />
        </Fade>
      ))}
      <Fade in timeout={2200}>
        <Skeleton variant="text" height={40} width={400} sx={{ background: theme => theme.palette.mode === "light" ? "#f1f5f9" : "#38414C", fontSize: "1rem", borderRadius: "12px" }} />
      </Fade>
      {[1, 2, 3, 4, 5].map(item => (
        <Fade in key={item} timeout={1400 + 500 * item}>
          <Skeleton variant="rounded" animation="wave" sx={{ background: theme => theme.palette.mode === "light" ? "#f1f5f9" : "#38414C", width: "100%" }} height={40} />
        </Fade>
      ))}
    </Stack>
  )
}

export default LoadingSkeleton
