import { LoadingButton } from "@mui/lab"
import { Box, Typography } from "@mui/material"
import { useDeleteProjectMembershipMutation } from "@redux/services/projectApi"
import { DEFAULT_ERROR_MSG } from "config/constants"
import { useSnackbar } from "notistack"
import MemberAvatar from "pages/shared/MemberAvatar"
import { StyledTableRow, TableCell } from "pages/shared/StyledTable"

const Member = ({ member, project_id }) => {
  const [deleteProjectMembership, { isLoading }] = useDeleteProjectMembershipMutation()
  const { enqueueSnackbar } = useSnackbar()

  const handleDelete = async user_id => {
    try {
      if (!user_id) return enqueueSnackbar("Something went wrong.", { variant: "error" })
      await deleteProjectMembership({ project_id, user_id }).unwrap()
    } catch (error) {
      console.error(error)
      enqueueSnackbar(error.data?.message || error.data?.errors?.join(", ") || DEFAULT_ERROR_MSG, { variant: "error" })
    }
  }

  return (
    <StyledTableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell sx={{ px: "2px" }}>
        {member.group ? <MemberAvatar name={member.group.name} height={30} width={30} /> : <MemberAvatar name={member.user?.name} height={30} width={30} />}
      </TableCell>
      <TableCell scope="row" sx={{ "& span": { color: theme => theme.palette.mode === "light" ? theme.palette.primary.defaultText : theme.palette.text.secondary }, "& :hover": { color: theme => theme.palette.primary.main } }}>
        {member.group ? <Typography variant="subtitle1">{member.group.name}</Typography> : <Typography variant="subtitle1">{member.user.name}</Typography>}
      </TableCell>
      <TableCell scope="row">
        <Box>
          {member.roles?.map(role => (
            <Typography key={role.id} variant="body2">
              {role.name}
              {role.inherited && " (team role)"}
            </Typography>
          ))}
        </Box>
      </TableCell>
      <TableCell sx={{ px: "1px" }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          {!member.roles?.find(role => role.inherited) ? (
            <LoadingButton loading={isLoading} onClick={() => handleDelete(member.id)} color="error">
              {member.group ? "Remove team" : "Remove member"}
            </LoadingButton>
          ) : (
            <Box sx={{ py: 1.1 }}>&nbsp;</Box>
          )}
        </Box>
      </TableCell>
    </StyledTableRow>
  )
}

export default Member
