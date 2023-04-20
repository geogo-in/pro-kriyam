import { styled } from "@mui/material/styles"
import MuiTableCell from "@mui/material/TableCell"
import TableRow from "@mui/material/TableRow"

export const TableHeadCell = styled(MuiTableCell)(({ theme }) => ({
  padding: "10px 8px",
  fontWeight: 400,
  color: theme.palette.primary.secondaryText,
  borderBottom: "1px solid rgba(218,220,224, 0.4)",
  fontSize: "0.8rem",
  "&:first-of-child": {
    paddingLeft: "16px",
  },
  "&:last-child": {
    paddingRight: "16px",
  },
}))

export const TableCell = styled(MuiTableCell)(({ theme }) => ({
  padding: "10px 8px",
  borderBottom: "1px solid #EEE",
  color: theme.palette.primary.secondaryText,
  "&:first-of-child": {
    paddingLeft: "16px",
  },
  "&:last-child": {
    paddingRight: "16px",
    borderRightRadius: 30,
  },
}))

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  borderRadius: 30,
  borderBottom: "1px solid white",
  "&:hover": {
    backgroundColor: "rgba(241,245,249, 0.5)",
    "& .MuiTableCell-root": {},
  },
}))
