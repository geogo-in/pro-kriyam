import { Typography } from "@mui/material"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import { LineCard as Card } from "pages/shared/StyledCard"
import { TableHeadCell } from "pages/shared/StyledTable"
import { useGetProjectMembershipsQuery } from "@redux/services/projectApi"
import Member from "./Member"

const ProjectMembers = ({ project_id }) => {
  const { data: membership, isLoading } = useGetProjectMembershipsQuery(project_id)

  if (isLoading) return <span />
  return (
    <Card sx={{ px: 3, py: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ fontSize: "1rem", color: theme => theme.palette.primary.defaultText }}>
        Project members
      </Typography>
      {membership.length ? (
        <TableContainer sx={{ borderRadius: 0, borderTop: "1px solid rgba(218,220,224, 0.4)", mt: 2 }}>
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: theme => theme.palette.mode === "light" ?  "white" : theme.palette.background.modal, borderRadius: 0, borderBottom: "none" }}>
              <TableRow>
                <TableHeadCell sx={{ width: 20 }}></TableHeadCell>
                <TableHeadCell>Member</TableHeadCell>
                <TableHeadCell>Role</TableHeadCell>
                <TableHeadCell></TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {membership.map(member => (
                <Member {...{ member, project_id }} key={member.id} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="subtitle1" textAlign="center" mt={1}>
          No member
        </Typography>
      )}
    </Card>
  )
}

export default ProjectMembers
