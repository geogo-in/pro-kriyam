import { Divider, Stack, Typography } from "@mui/material"
import React from "react"
import { useLocation } from "react-router-dom"

export default function NotFound() {
  const location = useLocation()

  return (
    <Stack justifyContent="center" alignItems="center" sx={{ maxHeight: `calc(100vh - 60px)`, height: 1 }}>
      <Stack direction="row">
        <Typography variant="h1">{location.state?.status || 404}</Typography>
        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
        <Typography variant="subtitle1" alignSelf="center" color="text.secondary">
          {JSON.stringify(location.state?.message) || `This page could not be found.`}
        </Typography>
      </Stack>
    </Stack>
  )
}
