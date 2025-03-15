import SearchIcon from "@mui/icons-material/Search"
import { Box, Button, MenuItem, Pagination, Stack, styled } from "@mui/material"
import IconButton from "@mui/material/IconButton"
import InputBase from "@mui/material/InputBase"
import Paper from "@mui/material/Paper"
import { useGetGroupsQuery } from "@redux/services/userApi"
import { SleekSelectWithIcon } from "pages/shared/CustomTextField"
import { useState } from "react"

const SmallButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: 20,
  border: theme.palette.mode === "light" ? `1px solid rgba(229,231,235, 1)` : "1px solid #5E5E5E",
  color: variant === "contained" ? "#fff" : theme.palette.mode === "light" ? theme.palette.primary.defaultText : theme.palette.primary.secondaryText,
  paddingLeft: 12,
  paddingRight: 12,
  lineHeight: 2.1,
  "&:hover": {
    borderColor: "#007FFF",
  },
  fontWeight: "normal",
}))

export default function MembersListToolbar({ handleChangePage, handleChangeRowsPerPage, rowsPerPage, count, filter, setFilter, data }) {
  const { data: groups } = useGetGroupsQuery()
  const [ selected, setSelected ] = useState({status: "", group_id: ""})
  
  const handleFilter = e => {
    setFilter({ ...filter, [e.target.name]: e.target.value })
  }
  const handleChange = (event, value) => {
    setFilter({ ...filter, page: value })
  }
  
  return (
    <Stack direction="row" spacing={0.8} sx={{ gap: 1, my: 2, alignItems: "center", borderBottom: theme => theme.palette.mode === "light" ? "1px solid rgba(229,231,235, 0.5)" : "1px solid #292929", padding: "8px 0" }}>
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
      <SleekSelectWithIcon
        label="Status"
        name="status"
        value={selected.status}
        onChange={(event) => { handleFilter(event); setSelected({ ...selected, [event.target.name]: event.target.value })} } 
        displayEmpty
        sx={{ background: theme => theme.palette.mode === "light" ? "" : theme.palette.background.default, ".MuiSelect-select": { padding: "10px 14px 10px 14px !important" }, "& fieldset": {borderColor: theme => theme.palette.mode === "light" ? "" : "#444444" } }} >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="1">Active</MenuItem>
        <MenuItem value="3">Locked</MenuItem>
      </SleekSelectWithIcon>
      <SleekSelectWithIcon
        label="Group"
        name="group_id"
        value={selected.group_id}
        onChange={(event) => { handleFilter(event); setSelected({ ...selected, [event.target.name]: event.target.value })} }
        displayEmpty
        sx={{ background: theme => theme.palette.mode === "light" ? "" : theme.palette.background.default, ".MuiSelect-select": { padding: "10px 14px 10px 14px !important" }, "& fieldset": {borderColor: theme => theme.palette.mode === "light" ? "" : "#444444" } }}>
        <MenuItem value="">None</MenuItem>
        { groups?.map(group => (
          <MenuItem key={group.id} value={group.id}>
            {group.name}
          </MenuItem>
        )) }
      </SleekSelectWithIcon>
      <Box sx={{ flexGrow: 1 }} />
      <Pagination count={Math.ceil(data.total_count / data.limit)} page={filter.page} onChange={handleChange} />
    </Stack>
  )
}
