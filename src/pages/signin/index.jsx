import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import { LoadingButton } from "@mui/lab"
import { Checkbox, FormControlLabel, IconButton } from "@mui/material"
import Box from "@mui/material/Box"
import InputAdornment from "@mui/material/InputAdornment"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"
import { useLoginMutation } from "@redux/services/userApi"
import { useSnackbar } from "notistack"
import { useState } from "react"
import { Link as RouterLink } from "react-router-dom"
import { FormTextField } from "../shared/CustomTextField"
import UserFormLayout from "../shared/UserFormLayout"

export default function SignIn() {
  const { enqueueSnackbar } = useSnackbar()
  const [login, { isLoading }] = useLoginMutation({ fixedCacheKey: "login" })
  // Handling form data in local state
  const [formData, setFormData] = useState({ username: "", password: "", showPassword: false, rememberMe: true })

  const handleClickShowPassword = () => {
    setFormData({ ...formData, showPassword: !formData.showPassword })
  }

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.name === "rememberMe" ? e.target.checked : e.target.value })
  }

  // Handle form submission
  const handleAuthUserAccount = async e => {
    try {
      e.preventDefault()
      await login(formData).unwrap()
    } catch (error) {
      // console.error(error)
      enqueueSnackbar("Invalid username or password.", { variant: "error" })
    }
  }

  return (
    <UserFormLayout>
      <Typography variant="h4" sx={{ fontWeight: 600, color: theme => "#10172a", fontSize: "1.6rem", padding: "2px 8px" }}>
        Signin Now!
      </Typography>
      <Box sx={{ px: 1, mt: 4, mb: 4 }}>
        <form onSubmit={handleAuthUserAccount}>
          <FormTextField
            autoFocus
            autoComplete="username"
            disabled={isLoading}
            placeholder="Enter your username or email ID"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <FormTextField
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                    {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            autoComplete="current-password"
            disabled={isLoading}
            type={formData.showPassword ? "text" : "password"}
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <FormControlLabel
              value="top"
              control={<Checkbox checked={formData.rememberMe} onChange={handleChange} name="rememberMe" size="small" />}
              label={
                <Typography variant="body2" component="p" color="text.secondary">
                  Remember Me
                </Typography>
              }
            />
            <Typography gutterBottom variant="body2" component="p" color="text.secondary">
              <Link component={RouterLink} sx={{ textDecoration: "none", color: "black" }} to={{ pathname: "/users/forgot_password" }}>
                Forgot Password ?
              </Link>
            </Typography>
          </Box>
          <LoadingButton sx={{ mt: 1, mb: 3, py: 1.1, fontSize: "1rem" }} fullWidth loading={isLoading} variant="contained" color="primary" size="large" type="submit">
            Signin
          </LoadingButton>
          {/* <Box p={2} textAlign="center">
        <Typography gutterBottom variant="body2" color="primary">
          <Link component={RouterLink} to={{ pathname: "/users/signup" }}>
            Don’t have an account ? Sign Up
          </Link>
        </Typography>
      </Box> */}
        </form>
      </Box>
    </UserFormLayout>
  )
}
