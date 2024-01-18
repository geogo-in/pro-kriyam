import { TableHead, TableRow } from "@mui/material"
import { TableHeadCell } from "pages/shared/StyledTable"

export default function SprintIssueListHeader() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableHeadCell key={headCell.id} padding={headCell.padding} align={headCell.align}>
            {headCell.label}
          </TableHeadCell>
        ))}
      </TableRow>
    </TableHead>
  )
}
const headCells = [
  { id: "type", label: "Type", padding: "none" },
  { id: "key", align: "left", label: "#", padding: "checkbox" },
  { id: "summary", label: "Issue Summary" },
  { id: "storypoint", label: "Storypoint" },
  { id: "assignee", label: "Assignee" },
  { id: "status", label: "Status" },
  { id: "priority", label: "Priority" },
]
