import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import { LoadingButton } from "@mui/lab"
import { IconButton, styled } from "@mui/material"
import InputAdornment from "@mui/material/InputAdornment"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { useResetPassMutation } from "@redux/services/userApi"
import { useSnackbar } from "notistack"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
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
      enqueueSnackbar(error.message || "Password could not be reset, please try again.", { variant: "error" })
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
      <Typography variant="body1" color="black" fontWeight="bold" >
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
                <IconButton sx={{color: theme => theme.palette.mode === "light" ? "" : "#64748B"}} aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
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
                <IconButton sx={{color: theme => theme.palette.mode === "light" ? "" : "#64748B"}} aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
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

        <StyledLoadingButton fullWidth loading={isLoading} disabled={passwordNotMatch} variant="contained" color="secondary" type="submit" sx={{ py: 1, my: 3 }}>
          RESET
        </StyledLoadingButton>
      </form>
    </UserFormLayout>
  )
}

export default ResetPassword
const StyledTextField = styled((props) => (
  <TextField required margin="normal" fullWidth {...props} />
))(({ theme }) => ({
  "& .MuiInputBase-input": {
    color: theme.palette.mode === "light" ? "" : "black",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: theme.palette.mode === "light" ? "" : "#444444",
    },
    "&:hover fieldset": {
      borderColor: theme.palette.mode === "light" ? "" : "#292929",
    },
    "&.Mui-focused fieldset": {
      borderColor: "blue",
    },
  },
  "& .MuiInputLabel-root": {
    color: theme.palette.mode === "light" ? "" : "#292929",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "blue",
  },
  
}));

const StyledLoadingButton = styled(LoadingButton)(({ theme }) => ({
  "&.Mui-disabled": theme.palette.mode === "dark"
    ? {
        backgroundColor: "#E0E0E0",
        color: "#444444",
      }
    : {},
}));

// const StyledTextField = props => <TextField InputProps={{ style: { color: theme => theme.palette.mode === "light" ? "" : theme.palette.primary.secondaryText}}} required margin="normal" fullWidth {...props} />
