import { Star, StarBorderOutlined } from "@mui/icons-material"
import { Box, CircularProgress, IconButton } from "@mui/material"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import { useUpdateFavoriteMutation } from "@redux/services/projectApi"
import { AvatarWithName } from "pages/shared/AvatarWithName"
import MemberAvatars from "pages/shared/MemberAvatars"
import { StyledTableRow, TableCell, TableHeadCell } from "pages/shared/StyledTable"
import { useLocation, useNavigate } from "react-router-dom"
import { PATH_DASHBOARD } from "routes/paths"

const ProjectsTable = ({ projects }) => (
  <TableContainer sx={{ borderRadius: 0 }}>
    <Table aria-label="simple table">
      {/* <TableHead sx={{ backgroundColor: "white", borderRadius: 0, borderBottom: "none" }}> */}
      <TableHead sx={{ backgroundColor: theme => theme.palette.background.paper, borderRadius: 0, borderBottom: "none" }}>
        <TableRow>
          <TableHeadCell sx={{ width: 20 }}></TableHeadCell>
          <TableHeadCell>Project</TableHeadCell>
          <TableHeadCell>#</TableHeadCell>
          <TableHeadCell>Board</TableHeadCell>
          <TableHeadCell>Lead</TableHeadCell>
          <TableHeadCell align="center"></TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {projects.map(row => (
          <ProjectItem key={row.id} {...row} />
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)

export default ProjectsTable

function ProjectItem(row) {
  const [updateFavorite, { isLoading }] = useUpdateFavoriteMutation()
  const location = useLocation()
  const navigate = useNavigate()

  const handleDetails = () => {
    navigate(`${PATH_DASHBOARD.projects.root}/${row.identifier}`, { state: { background: location } })
  }
  return (
    <StyledTableRow key={row.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell>
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={0.5}>
            <CircularProgress size={20} />
          </Box>
        ) : (
          <IconButton
            size="small"
            onClick={() => {
              updateFavorite(row.id)
            }}>
            {row.is_favourite ? <Star color="warning" /> : <StarBorderOutlined />}
          </IconButton>
        )}
      </TableCell>
      <TableCell
        onClick={handleDetails}
        component="th"
        scope="row"
        // sx={{ "&:hover": { cursor: "pointer" }, "& span": { color: theme => theme.palette.primary.defaultText }, "& :hover": { color: theme => theme.palette.primary.main } }}>
        sx={{ "&:hover": { cursor: "pointer" }, "& span": { color: theme => theme.palette.mode === "light" ? theme.palette.primary.defaultText : theme.palette.text.default }, "& :hover": { color: theme => theme.palette.mode === "light" ? theme.palette.primary.main : "#FFFFFF" } }}>
        {/* <Link component={RouterLink} to={`${PATH_DASHBOARD.projects.root}/${row.identifier}`}> */}
        <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>{row.name}</span>
        {/* </Link> */}
      </TableCell>
      <TableCell component="th" scope="row">
        {row.id}
      </TableCell>
      <TableCell component="th" scope="row">
        {row.project_type?.name}
      </TableCell>
      <TableCell>{row.lead?.name ? <AvatarWithName name={row.lead?.name} /> : "---"}</TableCell>
      <TableCell>
        <MemberAvatars total={row.members.length} members={row.members} max={6} />
      </TableCell>
    </StyledTableRow>
  )
}

// function ProjectItem(row) {
//   const [updateFavorite, { isLoading }] = useUpdateFavoriteMutation()

//   return (
//     <TableRow key={row.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
//       <TableCell>
//         {isLoading ? (
//           <Box display="flex" justifyContent="center" p={0.5}>
//             <CircularProgress size={20} />
//           </Box>
//         ) : (
//           <IconButton
//             size="small"
//             onClick={() => {
//               updateFavorite(row.id)
//             }}>
//             {row.is_favourite ? <Star color="warning" /> : <StarBorderOutlined />}
//           </IconButton>
//         )}
//       </TableCell>

//       <TableCell component="th" scope="row">
//         <Link component={RouterLink} to={`/account/projects/${row.identifier}`}>
//           <span style={{ color: "#1A73E8", fontWeight: 500 }}>{row.name}</span>
//         </Link>
//       </TableCell>
//       <TableCell component="th" scope="row">
//         {row.id}
//       </TableCell>
//       <TableCell component="th" scope="row">
//         {row.project_type?.name}
//       </TableCell>
//       <TableCell>
//         <AvatarWithName name={row.lead?.name} />
//       </TableCell>
//       <TableCell>
//         <MemberAvatars total={row.members.length} members={row.members} max={6} />
//       </TableCell>
//     </TableRow>
//   )
// }
