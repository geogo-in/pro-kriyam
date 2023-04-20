import SearchIcon from "@mui/icons-material/Search"
import { Box, Pagination, styled } from "@mui/material"
import IconButton from "@mui/material/IconButton"
import InputBase from "@mui/material/InputBase"
import MenuItem from "@mui/material/MenuItem"
import Paper from "@mui/material/Paper"
import TextField from "@mui/material/TextField"
import { useState } from "react"
import { useGetIssuePriorityQuery, useGetIssueTypeQuery, useGetProjectIssuesStatusesQuery } from "@redux/services/issueApi"

export default function IssueListToolbar({ project_id, onSearch, onFilter, filter, limit, offset, total_count }) {
  const { data: priorities } = useGetIssuePriorityQuery()
  const { data: statuses } = useGetProjectIssuesStatusesQuery(project_id)
  const { data: trackers } = useGetIssueTypeQuery()
  const [page, setPage] = useState(parseInt(offset / limit) + 1)

  const handleChange = (event, value) => {
    setPage(value)
    onFilter({ target: { name: "offset", value: parseInt((value - 1) * limit) } })
  }

  return (
    <Box spacing={2} pb={0} display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" sx={{ margin: "0 2px", borderBottom: "1px solid rgba(229,231,235, 0.5)" }}>
      <Box spacing={0.8} sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        <Paper sx={{ boxShadow: "none", background: "#f1f5f9", color: "#1E293B", borderRadius: "30px", p: "2px 4px", margin: "8px 0px", display: "flex", alignItems: "center", width: 280 }}>
          <IconButton sx={{ p: "6px" }} aria-label="menu">
            <SearchIcon />
          </IconButton>
          <InputBase sx={{ ml: 1, flex: 1 }} name="search" onKeyDown={onSearch} placeholder="Search issues" />
        </Paper>
        <Select
          sx={{ "& .MuiFormLabel-root": { fontSize: "0.8rem", color: theme => theme.palette.primary.defaultText } }}
          label="Issue type"
          name="tracker_id"
          value={filter.tracker_id}
          onChange={onFilter}>
          <MenuItem value="">All</MenuItem>
          {trackers?.map(item => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
        <Select
          sx={{ "& .MuiFormLabel-root": { fontSize: "0.8rem", color: theme => theme.palette.primary.defaultText } }}
          label="Status"
          name="status_id"
          value={filter.status_id}
          onChange={onFilter}>
          <MenuItem value="">All</MenuItem>
          {statuses?.map(({ id, name }) => (
            <MenuItem key={id} value={id}>
              {name}
            </MenuItem>
          ))}
        </Select>
        <Select
          sx={{ "& .MuiFormLabel-root": { fontSize: "0.8rem", color: theme => theme.palette.primary.defaultText } }}
          label="Priority"
          name="priority_id"
          value={filter.priority_id}
          onChange={onFilter}>
          <MenuItem value="">All</MenuItem>
          {priorities?.map(({ id, name }) => (
            <MenuItem key={id} value={id}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box>
        <Pagination count={Math.ceil(total_count / limit)} page={page} onChange={handleChange} />
      </Box>
    </Box>
  )
}

const Select = styled(props => <TextField select {...props} />)(() => ({
  // marginRight: 8,
  marginLeft: 8,
  marginBottom: 8,
  minWidth: 120,
  backgroundColor: "white",
  "& .MuiInputBase-root": {
    borderRadius: 30,
  },
  "& .MuiSelect-outlined": {
    padding: "7px 14px",
  },
  "& fieldset": {
    borderColor: "rgba(229, 231, 235, 1)",
  },
}))
