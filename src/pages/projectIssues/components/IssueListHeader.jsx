import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import { TableHeadCell } from "pages/shared/StyledTable"

export default function IssueListHeader({ projects, ...props }) {
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
  { id: "assignee", label: "Assignee" },
  { id: "reporter", label: "Reporter" },
  { id: "status", label: "Status" },
  { id: "priority", label: "Priority" },
]
