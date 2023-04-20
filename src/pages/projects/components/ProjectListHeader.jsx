import StarIcon from "@mui/icons-material/Star"
import Box from "@mui/material/Box"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableSortLabel from "@mui/material/TableSortLabel"
import { visuallyHidden } from "@mui/utils"
import { useState } from "react"

export default function ProjectListHeader({ projects, ...props }) {
  const [order, setOrder] = useState("asc")
  const [orderBy, setOrderBy] = useState("name")
  const createSortHandler = property => event => {
    setOrder()
    setOrderBy()
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Box display="flex">
            <StarIcon fontSize="small" />
          </Box>
        </TableCell>

        {headCells.map(headCell => (
          <TableCell key={headCell.id} padding={headCell.padding} align={headCell.align} sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : "asc"} onClick={createSortHandler(headCell.id)}>
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell>Users</TableCell>
        <TableCell></TableCell>
      </TableRow>
    </TableHead>
  )
}

const headCells = [
  { id: "name", label: "Project" },
  { id: "id", align: "right", label: "ID", padding: "checkbox" },
  { id: "type", align: "center", label: "Type", padding: "checkbox" },
  { id: "admin", label: "Admin" },
]
