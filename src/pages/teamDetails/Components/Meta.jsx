import { Box, ButtonBase, Typography } from "@mui/material"
import { useDeleteGroupMutation } from "@redux/services/userApi"
import { useSnackbar } from "notistack"
import { useNavigate, useParams } from "react-router-dom"
import { PATH_DASHBOARD } from "routes/paths"
import { getErrorMessage } from "utils/helper"

export default function Meta() {
  const { team_id } = useParams()
  const { enqueueSnackbar } = useSnackbar()
  const [deleteGroup] = useDeleteGroupMutation()
  const navigate = useNavigate()

  const handleDelete = async () => {
    try {
      if (!window.confirm("Are you sure?")) return
      await deleteGroup(team_id).unwrap()
      navigate(-1) || navigate(`${PATH_DASHBOARD.members}`, { replace: true })
    } catch (error) {
      const { message } = getErrorMessage(error)
      enqueueSnackbar(message, { variant: "error" })
    }
  }
  return (
    <Box pt={2}>
      <Typography>
        Are you want to delete this{" "}
        <ButtonBase sx={{ color: "error.main" }} onClick={handleDelete}>
          Team
        </ButtonBase>{" "}
        ?
      </Typography>
    </Box>
  )
}
