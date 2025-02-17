import SearchIcon from "@mui/icons-material/Search"
import { Stack } from "@mui/material"
import IconButton from "@mui/material/IconButton"
import InputBase from "@mui/material/InputBase"
import Paper from "@mui/material/Paper"

export default function ProjectListToolbar({ handleChangePage, handleChangeRowsPerPage, rowsPerPage, count, filter, setFilter, data }) {
  const handleFilter = e => {
    setFilter({ ...filter, [e.target.name]: e.target.value })
  }

  return (
    <Stack direction="row" spacing={0.8} sx={{ alignItems: "center", borderBottom: "1px solid rgba(229,231,235, 0.5)" }}>
      {/* <Paper sx={{ boxShadow: "none", background: "#f1f5f9", color: "#1E293B", borderRadius: "30px", p: "2px 4px", margin: "8px 0", display: "flex", alignItems: "center", width: 280 }}> */}
      <Paper sx={{ boxShadow: "none", background: theme => theme.palette.mode === "light" ? "#f1f5f9" : theme.palette.background.secondary, color: "#1E293B", borderRadius: "30px", p: "2px 4px", margin: "8px 0", display: "flex", alignItems: "center", width: 280 }}>
        <IconButton sx={{ p: "6px" }} aria-label="menu">
          <SearchIcon />
        </IconButton>
        <InputBase sx={{ ml: 1, flex: 1 }} name="project_name" onKeyDown={handleFilter} onChange={handleFilter} placeholder="Search for projects" />
      </Paper>
    </Stack>
  )
  // return (
  //   <Paper component="form" sx={{ boxShadow: "none", background: "#f0f3f4", borderRadius: "30px", p: "2px 4px", margin: "24px 0", display: "flex", alignItems: "center", width: 400 }}>
  //     <IconButton sx={{ p: "6px" }} aria-label="menu">
  //       <SearchIcon />
  //     </IconButton>
  //     <InputBase sx={{ ml: 1, flex: 1 }} name="project_name" onChange={handleFilter} placeholder="Search for projects" inputProps={{ "aria-label": "search google maps" }} />
  //   </Paper>
  // )
}
