import { Box, Fade, Grid, Skeleton, Stack } from "@mui/material"
import Backdrop from "@mui/material/Backdrop"
import CircularProgress from "@mui/material/CircularProgress"

export default function Loading({ imgAndTitle, sidenav, circular, listing, listing2, block, grid, height = 100, cols = 6 }) {
  if (circular)
    return (
      <Backdrop open={true}>
        <CircularProgress color="primary" />
      </Backdrop>
    )
  if (listing)
    return (
      <Stack spacing={1}>
        <Skeleton variant="text" height={40} width={400} sx={{ background: "#f1f5f9", fontSize: "1rem", borderRadius: "12px" }} />
        {/* For other variants, adjust the size with `width` and `height` */}
        {[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
          <Fade in key={item} timeout={200 * item}>
            <Skeleton variant="rounded" animation="wave" sx={{ background: "#f1f5f9", width: "100%" }} height={50} />
          </Fade>
        ))}
      </Stack>
    )
  if (listing2)
    return (
      <Stack spacing={1} sx={{ padding: "12px", width: "100%" }}>
        <Fade in>
          <Skeleton variant="text" height={40} width={400} sx={{ background: "#f1f5f9", fontSize: "1rem", borderRadius: "12px" }} />
        </Fade>
        {[1, 2, 3, 4].map(item => (
          <Fade in key={item} timeout={500 * item}>
            <Skeleton variant="rounded" animation="wave" sx={{ background: "#f1f5f9", width: "100%" }} height={40} />
          </Fade>
        ))}
        <Fade in timeout={2200}>
          <Skeleton variant="text" height={40} width={400} sx={{ background: "#f1f5f9", fontSize: "1rem", borderRadius: "12px" }} />
        </Fade>
        {[1, 2, 3, 4, 5].map(item => (
          <Fade in key={item} timeout={2400 + 500 * item}>
            <Skeleton variant="rounded" animation="wave" sx={{ background: "#f1f5f9", width: "100%" }} height={40} />
          </Fade>
        ))}
      </Stack>
    )

  if (block) return <Skeleton variant="rectangular" width={"100%"} height={height} />
  if (imgAndTitle)
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", marginTop: 1, marginBottom: 4 }}>
          <Skeleton animation="wave" variant="circular" width={40} height={40} sx={{ background: "#f1f5f9" }} />
          <Box sx={{ paddingLeft: 1 }}>
            <Skeleton animation="wave" variant="text" width={160} sx={{ background: "#f1f5f9" }} />
            <Skeleton animation="wave" variant="text" width={120} sx={{ background: "#f1f5f9" }} />
          </Box>
        </Box>
      </Box>
    )
  if (sidenav)
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", marginTop: 1, marginBottom: 4 }}>
          <Skeleton animation="wave" variant="circular" width={40} height={40} sx={{ background: "#f1f5f9" }} />
          <Box sx={{ paddingLeft: 1 }}>
            <Skeleton animation="wave" variant="text" width={160} sx={{ background: "#f1f5f9" }} />
            <Skeleton animation="wave" variant="text" width={120} sx={{ background: "#f1f5f9" }} />
          </Box>
        </Box>
        <Skeleton animation="pulse" sx={{ background: "#f1f5f9", height: 42, borderRadius: 1, transform: "scale(1, 0.80)", marginBottom: 2 }} />
        {[1, 2, 3, 4, 5].map(e => (
          <Fade in key={e} timeout={200 * e}>
            <Skeleton key={e} animation="pulse" sx={{ background: "#f1f5f9", height: 48, borderRadius: 1, transform: "scale(1, 0.80)", marginBottom: 1 }} />
          </Fade>
        ))}
      </Box>
    )
  if (grid) {
    let arr = [1, 2, 3]
    if (cols === 6) {
      arr = [1, 2, 3, 4, 5, 6]
    }
    return (
      <Stack spacing={1}>
        {/* <Skeleton variant="text" height={40} width={400} sx={{ background: "#f1f5f9", fontSize: "1rem", borderRadius: "12px" }} /> */}
        {/* For other variants, adjust the size with `width` and `height` */}
        <Grid container spacing={2}>
          {arr.map(item => (
            <Grid item lg={4} key={item}>
              <Fade in timeout={200 * item}>
                <Skeleton variant="rectangular" animation="wave" sx={{ background: "#f1f5f9", width: "100%" }} height={height} />
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Stack>
    )
  }

  return <>Loading...</>
}
