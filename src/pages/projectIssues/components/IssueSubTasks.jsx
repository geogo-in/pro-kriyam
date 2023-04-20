import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableContainer from "@mui/material/TableContainer"
import IssueListItem from "./IssueListItem"

const Subtasks = ({ project_id, referrer, ...issue }) => {
  return (
    <TableContainer>
      <Table size={"small"}>
        <TableBody>
          {issue.children?.map(issue => (
            <IssueListItem {...{ issue, project_id }} key={issue.id} referrer={referrer} display="sleek" />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default Subtasks
