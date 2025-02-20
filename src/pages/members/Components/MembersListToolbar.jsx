import SearchIcon from "@mui/icons-material/Search"
import { Box, Pagination, Stack } from "@mui/material"
import IconButton from "@mui/material/IconButton"
import InputBase from "@mui/material/InputBase"
import Paper from "@mui/material/Paper"

export default function MembersListToolbar({ handleChangePage, handleChangeRowsPerPage, rowsPerPage, count, filter, setFilter, data }) {
  const handleFilter = e => {
    setFilter({ ...filter, [e.target.name]: e.target.value })
  }
  const handleChange = (event, value) => {
    setFilter({ ...filter, page: value })
  }

  return (
    <Stack direction="row" spacing={0.8} sx={{ alignItems: "center", borderBottom: theme => theme.palette.mode === "light" ? "1px solid rgba(229,231,235, 0.5)" : "1px solid #292929", padding: "8px 0" }}>
      <Paper
        sx={{
          boxShadow: "none",
          background: theme => theme.palette.mode === "light" ? "#f1f5f9" : theme.palette.background.modal,
          color: theme => theme.palette.mode === "light" ? "#1E293B" : theme.palette.primary.secondaryText,
          borderRadius: "30px",
          p: "2px 4px",
          margin: "8px 0",
          display: "flex",
          alignItems: "center",
          width: 280,
        }}>
        <IconButton sx={{ p: "6px", color: theme => theme.palette.mode === "light" ? "#1E293B" : theme.palette.primary.secondaryText, }} aria-label="menu">
          <SearchIcon />
        </IconButton>
        <InputBase sx={{ ml: 1, flex: 1 }} name="name" onKeyDown={handleFilter} onChange={handleFilter} placeholder="Search for members" />
      </Paper>
      <Box sx={{ flexGrow: 1 }} />
      <Pagination count={Math.ceil(data.total_count / data.limit)} page={filter.page} onChange={handleChange} />
    </Stack>
  )
}
