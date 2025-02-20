import { Lock, LockOpen } from "@mui/icons-material"
import { CircularProgress, IconButton, Link, Tooltip, Typography } from "@mui/material"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import { useUpdateUserMutation } from "@redux/services/userApi"
import { enqueueSnackbar } from "notistack"
import MemberAvatar from "pages/shared/MemberAvatar"
import { StyledTableRow, TableCell, TableHeadCell } from "pages/shared/StyledTable"
import { Link as RouterLink } from "react-router-dom"
import { PATH_DASHBOARD } from "routes/paths"
import { fDate } from "utils/formatDate"
import { getErrorMessage } from "utils/helper"

const MembersTable = ({ users, lockedUsers, registeredUsers }) => (
  <TableContainer sx={{ borderRadius: 0 }}>
    <Table aria-label="simple table">
      <TableHead sx={{ backgroundColor: theme => theme.palette.background.modal, borderRadius: 0, borderBottom: "none" }}>
        <TableRow>
          <TableHeadCell sx={{ width: 20 }}></TableHeadCell>
          <TableHeadCell></TableHeadCell>
          <TableHeadCell>#</TableHeadCell>
          <TableHeadCell>Email</TableHeadCell>
          <TableHeadCell>Role</TableHeadCell>
          <TableHeadCell>User since</TableHeadCell>
          <TableHeadCell align="center">Lock user</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map(row => (
          <ProjectItem key={row.id} {...row} />
        ))}
        {registeredUsers.map(row => (
          <ProjectItem key={row.id} {...row} registered />
        ))}
        {lockedUsers.map(row => (
          <ProjectItem key={row.id} {...row} locked />
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)

export default MembersTable

function ProjectItem({ locked, registered, ...row }) {
  const [updateUser, { isLoading }] = useUpdateUserMutation()
  const handleUpdateUser = async () => {
    try {
      if (!window.confirm("Are you sure?")) return
      await updateUser({ id: row.id, status: locked ? 1 : 3 }).unwrap()
      enqueueSnackbar("User updated successfully", { variant: "success" })
    } catch (error) {
      const { message } = getErrorMessage(error)
      enqueueSnackbar(message, { variant: "error" })
    }
  }
  return (
    <StyledTableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell>
        <MemberAvatar name={`${row.firstname} ${row.lastname}`} height={34} width={34} />
      </TableCell>
      <TableCell component="th">
        <Typography sx={{ lineHeight: "1.1rem", "& span": { color: theme => theme.palette.primary.defaultText }, "& :hover": { color: theme => theme.palette.primary.main } }}>
          <Link component={RouterLink} to={`${PATH_DASHBOARD.members}/${row.id}`}>
            <span style={{ fontSize: "0.9rem", fontWeight: 500, display: "block" }}>
              {row.firstname} {row.lastname}
            </span>
          </Link>
        </Typography>
        <Typography variant="caption" sx={{ color: theme => theme.palette.primary.tertiaryText }}>
          {row.login}
        </Typography>
      </TableCell>
      <TableCell component="th" scope="row">
        {row.id}
      </TableCell>
      <TableCell component="th" scope="row">
        {row.mail}
      </TableCell>
      <TableCell component="th" scope="row">
        {row.admin ? <Typography sx={{ fontWeight: 500 }}>Admin</Typography> : "Normal user"}
      </TableCell>
      <TableCell>{fDate(row.created_on)}</TableCell>
      <TableCell align="center">
        <IconButton onClick={handleUpdateUser} disabled={isLoading}>
          {isLoading ? (
            <CircularProgress size={20} />
          ) : registered ? (
            <></>
          ) : locked ? (
            <Tooltip title="Un-lock user">
              <LockOpen />
            </Tooltip>
          ) : (
            <Tooltip title="Lock user">
              <Lock />
            </Tooltip>
          )}
        </IconButton>
      </TableCell>
    </StyledTableRow>
  )
}
