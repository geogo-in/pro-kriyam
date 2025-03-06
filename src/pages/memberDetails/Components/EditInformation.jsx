import { LoadingButton } from "@mui/lab"
import { Box, Stack, TextField, Typography } from "@mui/material"
import { useUpdateUserMutation } from "@redux/services/userApi"
import { enqueueSnackbar } from "notistack"
import { DialogContent, DialogHeader } from "pages/shared/StyledDialog"
import { getErrorMessage } from "utils/helper"

export default function EditInformation({ onClose, user, editedUser, setEditedUser }) {

  const [updateUser, { isLoading, error }] = useUpdateUserMutation()
  const inputErrors = error?.data?.data?.error || {}

  const handleSubmit = async e => {
    e.preventDefault()
    try{
      await updateUser({ id: user.id, firstname: editedUser.firstname, lastname: editedUser.lastname, mail: editedUser.mail, login: editedUser.login }).unwrap()
      enqueueSnackbar("Info updated successfully", {variant: "success"})
      onClose()
    } catch (error) {
      const { message } = getErrorMessage(error)
      enqueueSnackbar(message, { variant: "error" })
    }
  }

  const handleChange = event => {
    setEditedUser({ ...editedUser, [event.target.name]: event.target.value })
  }

  const params = { fullWidth: true, onChange: handleChange, variant: "outlined", margin: "dense", style: { minWidth: 300 } }
  return (
    <Box component="form" onSubmit={handleSubmit}>
      <DialogHeader>
        <Typography variant="h6">Edit profile</Typography>
      </DialogHeader>
      <DialogContent>
        <Box>
          <Box display="flex">
            <TextField sx={{"& fieldset": {borderColor: theme => theme.palette.mode === "light" ? "" : "#444444"}}} label="First Name" autoFocus value={editedUser.firstname} name="firstname" {...params} style={{ marginRight: 12 }} />
            <TextField sx={{"& fieldset": {borderColor: theme => theme.palette.mode === "light" ? "" : "#444444"}}} label="Last Name" value={editedUser.lastname} name="lastname" {...params} />
          </Box>
          <TextField sx={{"& fieldset": {borderColor: theme => theme.palette.mode === "light" ? "" : "#444444"}}} label="Username" autoComplete="username" value={editedUser.login} name="login" helperText={inputErrors.login?.join(", ")} error={inputErrors.login} {...params} />
          <TextField
            sx={{"& fieldset": {borderColor: theme => theme.palette.mode === "light" ? "" : "#444444"}}}
            type="email"
            label="e-mail"
            value={editedUser.mail}
            name="mail"
            helperText={inputErrors["email_address.address"]?.join(", ")}
            error={inputErrors["email_address.address"]}
            {...params}
          />
          
        </Box>
        <Stack py={2} alignItems={`flex-start`}>
          <LoadingButton loading={isLoading} type="submit" variant="contained" sx={{ borderRadius: "4px" }}>
            Save
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Box>
  )
}