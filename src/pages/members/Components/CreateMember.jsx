import { LoadingButton } from "@mui/lab"
import { Box, Checkbox, FormControlLabel, FormGroup, Stack, TextField, Typography } from "@mui/material"
import { useSnackbar } from "notistack"
import { DialogContent, DialogHeader } from "pages/shared/StyledDialog"
import { useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getCurrentUser } from "@redux/reducerSlices/user/userAuthSlice"
import { useCreateUserMutation, useUpdateUserMutation } from "@redux/services/userApi"
import { PATH_DASHBOARD } from "routes/paths"
import { getErrorMessage } from "utils/helper"

export default function CreateMember({ onClose, user }) {
  const [state, setState] = useState({
    login: user?.login || "",
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    mail: user?.mail || "",
    password: "",
    must_change_passwd: false,
    generate_password: false,
    admin: user?.admin || false,
  })
  const currentUser = useSelector(getCurrentUser)
  const [createUser, { isLoading: isCreating, error: createError }] = useCreateUserMutation()
  const [updateUser, { isLoading: isUpdating, error }] = useUpdateUserMutation()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const inputErrors = (error || createError)?.data?.data?.error || {}
  const isLoading = isCreating || isUpdating

  const handleSubmit = async e => {
    try {
      e.preventDefault()
      if (user) {
        await updateUser({ id: user.id, ...state }).unwrap()
        enqueueSnackbar("User is successfully updated", { variant: "success" })
      } else {
        const payload = await createUser(state).unwrap()
        enqueueSnackbar(payload.message, { variant: "success" })
        if (typeof onClose === "function") onClose()
        else navigate.replace(PATH_DASHBOARD.members.root)
      }
    } catch (error) {
      const { message } = getErrorMessage(error)
      enqueueSnackbar(message, { variant: "error" })
    }
  }
  const handleChange = event => {
    setState({ ...state, [event.target.name]: event.target.value })
  }
  const handleChecked = event => {
    setState({ ...state, [event.target.name]: event.target.checked, password: event.target.checked ? "" : state.password })
  }

  const params = { fullWidth: true, required: true, onChange: handleChange, variant: "outlined", margin: "dense", style: { minWidth: 300 } }
  return (
    <Box component="form" onSubmit={handleSubmit}>
      {!user && (
        <DialogHeader>
          <Typography variant="h6">Create new user</Typography>
        </DialogHeader>
      )}
      <DialogContent>
        <Box>
          <Box display="flex">
            <TextField label="First Name" autoFocus value={state.firstname} name="firstname" {...params} style={{ marginRight: 12 }} />
            <TextField label="Last Name" value={state.lastname} name="lastname" {...params} />
          </Box>
          <TextField label="Username" autoComplete="username" value={state.login} name="login" helperText={inputErrors.login?.join(", ")} error={inputErrors.login} {...params} />
          <TextField
            type="email"
            label="e-mail"
            value={state.mail}
            name="mail"
            helperText={inputErrors["email_address.address"]?.join(", ")}
            error={inputErrors["email_address.address"]}
            {...params}
          />
          <TextField
            autoComplete="new-password"
            type="password"
            label="Password"
            value={state.password}
            name="password"
            helperText={inputErrors.password?.join(", ")}
            error={inputErrors.password}
            {...params}
            required={!state.must_change_passwd && !state.generate_password && !user}
          />
        </Box>
        <FormGroup>
          <FormControlLabel
            disabled={state.generate_password}
            control={<Checkbox name="must_change_passwd" checked={state.must_change_passwd} onChange={handleChecked} />}
            label="Must changed password"
          />
          <FormControlLabel
            disabled={state.must_change_passwd}
            control={<Checkbox name="generate_password" checked={state.generate_password} onChange={handleChecked} />}
            label="Generate password"
          />
          <FormControlLabel disabled={currentUser.id === user?.id} control={<Checkbox name="admin" checked={state.admin} onChange={handleChecked} />} label="Administrator" />
        </FormGroup>
        <Stack py={2} alignItems={user ? `flex-start` : `flex-start`}>
          <LoadingButton loading={isLoading} type="submit" variant="contained" sx={{ borderRadius: "4px" }}>
            {user ? "Update" : "Create"} user
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Box>
  )
}
