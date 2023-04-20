import { Link, Typography } from "@mui/material"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import MemberAvatar from "pages/shared/MemberAvatar"
import { StyledTableRow, TableCell, TableHeadCell } from "pages/shared/StyledTable"
import { Link as RouterLink } from "react-router-dom"
import { PATH_DASHBOARD } from "routes/paths"
import { fDate } from "utils/formatDate"

const MembersTable = ({ users }) => (
  <TableContainer sx={{ borderRadius: 0 }}>
    <Table aria-label="simple table">
      <TableHead sx={{ backgroundColor: "white", borderRadius: 0, borderBottom: "none" }}>
        <TableRow>
          <TableHeadCell sx={{ width: 20 }}></TableHeadCell>
          <TableHeadCell></TableHeadCell>
          <TableHeadCell>#</TableHeadCell>
          <TableHeadCell>Email</TableHeadCell>
          <TableHeadCell>Role</TableHeadCell>
          <TableHeadCell>User since</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map(row => (
          <ProjectItem key={row.id} {...row} />
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)

export default MembersTable

function ProjectItem(row) {
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
    </StyledTableRow>
  )
}
