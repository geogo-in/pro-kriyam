import { Stack, Typography } from "@mui/material"

export default function NoData() {
  return (
    <Stack py={5}>
      <Typography variant="h6" color="text.secondary">
        Sorry, No data found here :(
      </Typography>
    </Stack>
  )
}
