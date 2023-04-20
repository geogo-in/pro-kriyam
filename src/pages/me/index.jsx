import { Box, Container, Typography } from "@mui/material"
import { useSelector } from "react-redux"
import { getCurrentUser } from "@redux/reducerSlices/user/userAuthSlice"

export default function Me() {
  const user = useSelector(getCurrentUser)

  return (
    <Container component={Box} py={2}>
      <Typography variant="h6">
        {user.firstname} {user.lastname}
      </Typography>
    </Container>
  )
}
