import { Visibility, VisibilityOff } from "@mui/icons-material"
import { LoadingButton } from "@mui/lab"
import { Box, DialogContent, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material"
import { useUpdateUserMutation } from "@redux/services/userApi"
import { enqueueSnackbar } from "notistack"
import { DialogHeader } from "pages/shared/StyledDialog"
import { useState } from "react"
import { getErrorMessage } from "utils/helper"

export default function ChangePassword({onClose, user}){

  const [changePass, setChangePass] = useState({newPass: "", confirmPass: "", showPassword: false, showConfirmPass: false}) 
  const [updateUser, { isLoading, error }] = useUpdateUserMutation()
  const inputErrors = error?.data?.data?.error || {}

  const passwordNotMatch = !changePass.confirmPass || changePass.newPass !== changePass.confirmPass

  const handlePassChange = (key, value) => {
    setChangePass((prev) => ({ ...prev, [key]: value }))
  }
  
  const handleSubmit = async e => {
    e.preventDefault()
    if (changePass.newPass.length > 0) {
      if (changePass.newPass.length < 8){
        enqueueSnackbar("Password should be 8 characters or greater", {variant: "error"})
        return
      }
      try{
        await updateUser({ id: user.id, password: changePass.newPass }).unwrap()
        enqueueSnackbar("Password is successfully updated", {variant: "success"})
        onClose()
      } catch (error) {
        const { message } = getErrorMessage(error)
        enqueueSnackbar(message, { variant: "error" })
      }
    }
  }

  const params = { fullWidth: true, required: true, variant: "outlined", margin: "dense", style: { minWidth: 300 } }
  return (
    <Box component="form" onSubmit={handleSubmit} >
      <DialogHeader>
        <Typography variant="h6">Change password</Typography>
      </DialogHeader>
      <DialogContent>
        <Box>
          <TextField
            sx={{
              "& fieldset": { borderColor: (theme) => (theme.palette.mode === "light" ? "" : "#444444") },
            }}
            label="Password"
            {...params}
            type={changePass.showPassword ? "text" : "password"}
            value={changePass.newPass}
            onChange={(e) => handlePassChange("newPass", e.target.value)}
            placeholder="Enter new password"
            helperText={inputErrors.password?.join(", ")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    sx={{ color: (theme) => (theme.palette.mode === "light" ? "" : "#64748B") }}
                    onClick={() => handlePassChange("showPassword", !changePass.showPassword)}
                    edge="end"
                    >
                    {changePass.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            />
          <TextField
            sx={{
              "& fieldset": { borderColor: (theme) => (theme.palette.mode === "light" ? "" : "#444444") },
            }}
            label="Confirm Password"
            {...params}
            type={changePass.showConfirmPass ? "text" : "password"}
            value={changePass.confirmPass}
            onChange={(e) => handlePassChange("confirmPass", e.target.value)}
            placeholder="Confirm password"
            helperText={changePass.confirmPass && passwordNotMatch && "Passwords do not match"}
            error={Boolean(changePass.confirmPass && passwordNotMatch)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    sx={{ color: (theme) => (theme.palette.mode === "light" ? "" : "#64748B") }}
                    onClick={() => handlePassChange("showConfirmPass", !changePass.showConfirmPass)}
                    edge="end"
                    >
                    {changePass.showConfirmPass ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Stack py={2} alignItems={`flex-start`}>
          <LoadingButton disabled={passwordNotMatch} loading={isLoading} type="submit" variant="contained" sx={{ borderRadius: "4px" }}>
            Save
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Box>
  )
}