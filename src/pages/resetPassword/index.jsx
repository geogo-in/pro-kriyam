import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import { LoadingButton } from "@mui/lab"
import { IconButton } from "@mui/material"
import InputAdornment from "@mui/material/InputAdornment"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { useSnackbar } from "notistack"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useResetPassMutation } from "@redux/services/redmineApi"
import UserFormLayout from "../shared/UserFormLayout"

const ResetPassword = ({ ...props }) => {
  const [resetPass, { isLoading }] = useResetPassMutation()
  const { enqueueSnackbar } = useSnackbar()
  const search = useLocation().search
  const token = new URLSearchParams(search).get("token")
  const [state, setState] = useState({ token, password: "", confirm: "", showPassword: false })
  const navigate = useNavigate()
  const passwordNotMatch = !state.confirm || state.password !== state.confirm

  const handleResetPass = async e => {
    try {
      e.preventDefault()
      const { message, status } = await resetPass(state).unwrap()
      enqueueSnackbar(message, { variant: status === "Success" ? "success" : "error" })
      if (status === "Success") navigate("../sign_in")
    } catch (error) {
      console.error(error)
      enqueueSnackbar("Password could not be reset, please try again.", { variant: "error" })
    }
  }
  const handleClickShowPassword = e => {
    try {
      e.preventDefault()
      setState({ ...state, showPassword: !state.showPassword })
    } catch (r) {
      console.error(r)
    }
  }
  const handleChange = e => setState({ ...state, [e.target.name]: e.target.value })
  return (
    <UserFormLayout>
      <Typography variant="body1" color="black" fontWeight="bold">
        Set new password
      </Typography>
      <Typography variant="body2" color="gray" fontWeight="300" sx={{ pb: 3 }}>
        create new password and you'll be ready to work
      </Typography>

      <form onSubmit={handleResetPass} style={{ padding: "30px 0px " }}>
        <StyledTextField
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                  {state.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          autoFocus
          disabled={isLoading}
          type={state.showPassword ? "text" : "password"}
          label="Password"
          name="password"
          autoComplete="new-password"
          value={state.password}
          onChange={handleChange}
        />
        <StyledTextField
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                  {state.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          error={Boolean(state.confirm && passwordNotMatch)}
          disabled={isLoading}
          type={state.showPassword ? "text" : "password"}
          label={"Confirm Password"}
          helperText={state.confirm && passwordNotMatch && "Passwords do not match"}
          name="confirm"
          autoComplete="new-password"
          value={state.confirm}
          onChange={handleChange}
        />

        <LoadingButton fullWidth loading={isLoading} disabled={passwordNotMatch} variant="contained" color="secondary" type="submit" sx={{ py: 1, my: 3 }}>
          RESET
        </LoadingButton>
      </form>
    </UserFormLayout>
  )
}

export default ResetPassword
const StyledTextField = props => <TextField required margin="normal" fullWidth {...props} />
