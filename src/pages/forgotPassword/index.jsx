import { LoadingButton } from "@mui/lab"
import Box from "@mui/material/Box"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"
import { useForgotPassMutation } from "@redux/services/userApi"
import { useSnackbar } from "notistack"
import { useState } from "react"
import { Link as RouterLink } from "react-router-dom"
import { validateEmail } from "utils/Validator"
import { FormTextField } from "../shared/CustomTextField"
import UserFormLayout from "../shared/UserFormLayout"

const ForgotPassword = ({ ...props }) => {
  const [forgotPass, { isLoading }] = useForgotPassMutation()
  const { enqueueSnackbar } = useSnackbar()
  const [mail, setMail] = useState("")
  const handleChange = e => setMail(e.target.value)

  const handleForgotPass = async e => {
    try {
      e.preventDefault()
      if (!validateEmail(mail)) return enqueueSnackbar("Invalid email address !", { variant: "error" })
      const { message } = await forgotPass({ mail }).unwrap()
      //  TO-DO: check invalid mail message
      enqueueSnackbar(message, { variant: "success" })
    } catch (r) {
      console.error(r)
      enqueueSnackbar("Something went wrong. Please try again.", { variant: "error" })
    }
  }

  return (
    <UserFormLayout>
      <Typography variant="h4" sx={{ fontWeight: 600, color: theme => "#10172a", fontSize: "1.6rem", padding: "2px 8px" }}>
        Wait, forgot your password?
      </Typography>
      <Typography variant="body1" sx={{ padding: "2px 8px", color: theme => theme.palette.mode === "light" ? "" : "#292929" }}>
        Don't worry, we'll send the reset link to your registered mail ID.
      </Typography>
      <Box sx={{ px: 1, mt: 4, mb: 4 }}>
        <form onSubmit={handleForgotPass}>
          <FormTextField autoFocus autoComplete="username" disabled={isLoading} placeholder="Enter the registered email ID" name="username" value={mail} onChange={handleChange} />

          {/* <StyledTextField autoFocus disabled={isLoading} label="Email" name="mail" value={mail} onChange={handleChange} sx={{ pb: 2 }} /> */}

          <LoadingButton sx={{ mt: 1, mb: 3, py: 1.1, fontSize: "1rem" }} fullWidth loading={isLoading} variant="contained" color="primary" size="large" type="submit">
            Submit
          </LoadingButton>

          <Box py={2} textAlign="left">
            <Typography gutterBottom variant="body2" color="primary">
              <Link component={RouterLink} to={{ pathname: "/users/sign_in" }}>
                Remembered account ? Sign In
              </Link>
            </Typography>
          </Box>
        </form>
      </Box>
    </UserFormLayout>
  )
}

export default ForgotPassword
// const StyledTextField = styled(props => <TextField required margin="normal" size="small" fullWidth {...props} />)({})
