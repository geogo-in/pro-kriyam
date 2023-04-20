import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableContainer from "@mui/material/TableContainer"
import React from "react"
import IssueListHeader from "./IssueListHeader"
import IssueListItem from "./IssueListItem"

export default function IssueList({ issues, project_id, ...props }) {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 750 }} size={"small"}>
        <IssueListHeader issue={issues} />

        <TableBody>
          {issues.map((issue, index) => (
            <IssueListItem {...{ issue, project_id }} key={issue.id} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
