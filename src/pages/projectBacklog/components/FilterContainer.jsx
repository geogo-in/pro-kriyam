import { Add } from "@mui/icons-material"
import SearchIcon from "@mui/icons-material/Search"
import { Button, DialogContent, MenuItem, TextField as MuiTextField, Stack, styled } from "@mui/material"
import IconButton from "@mui/material/IconButton"
import InputBase from "@mui/material/InputBase"
import Paper from "@mui/material/Paper"
import { getCurrentUser } from "@redux/reducerSlices/user/userAuthSlice"
import { useGetEpicQuery, useGetIssuePriorityQuery, useGetProjectIssuesStatusesQuery } from "@redux/services/issueApi"
import { useGetProjectByIdQuery, useGetProjectMembershipsQuery } from "@redux/services/projectApi"
import CustomDialogTitle from "pages/shared/CustomDialogTitle"
import CustomMenu from "pages/shared/CustomMenu"
import { useState } from "react"
import { useSelector } from "react-redux"
import MembershipFilter from "./MembershipFilter"

const SmallButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: 20,
  border: `1px solid rgba(229,231,235, 1)`,
  color: variant === "contained" ? "#fff" : theme.palette.primary.defaultText,
  paddingLeft: 12,
  paddingRight: 12,
  lineHeight: 2.1,
  "&:hover": {
    borderColor: "#007FFF",
  },
  fontWeight: "normal",
}))
const TextField = styled(MuiTextField)(({ theme }) => ({
  minWidth: 200,
  marginRight: 12,
}))

export default function FilterContainer({ filter, setFilter, project_id }) {
  const { data: epic } = useGetEpicQuery(project_id)
  const { data: priorities } = useGetIssuePriorityQuery()
  const { data: statuses } = useGetProjectIssuesStatusesQuery(project_id)
  const { data: project } = useGetProjectByIdQuery(project_id)
  const { data: members } = useGetProjectMembershipsQuery(project_id)
  const [state, setState] = useState({ search: "", assigned_to_id: null })
  const [filterOpen, setFilterOpen] = useState()
  const user = useSelector(getCurrentUser)
  const isMyIssue = filter.assigned_to_ids.length === 1 && filter.assigned_to_ids[0] === user.id
  const isMoreFilterApplied = Boolean(filter.category_id || filter.status_id || filter.priority_id || filter.tracker_id || filter.author_id)

  const handleFilterOpen = e => {
    setFilterOpen(e.target)
  }
  const handleChange = e => {
    setState({ ...state, [e.target.name]: e.target.value })
  }
  const handleMemberFilter = id => {
    const ids = new Set(filter.assigned_to_ids)
    if (ids.has(id)) ids.delete(id)
    else ids.add(id)
    setFilter({ ...filter, assigned_to_ids: [...ids] })
  }
  const handleMyIssue = id => {
    setFilter(f => ({ ...f, assigned_to_ids: isMyIssue ? [] : [user.id] }))
  }
  const handleUnassigned = () => {
    setFilter(f => ({ ...f, unassigned_issues: f.unassigned_issues ? undefined : true }))
  }
  const handleDialogClose = e => {
    setFilterOpen()
  }
  const handleFilter = e => {
    setFilter(f => ({ ...f, [e.target.name]: e.target.value }))
  }
  const handleSearch = e => {
    if (e.keyCode === 13) {
      setFilter(f => ({ ...f, search: e.target.value }))
    }
  }

  return (
    <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
      <Paper sx={{ boxShadow: "none", background: "#f1f5f9", color: "#1E293B", borderRadius: "30px", p: "2px 4px", margin: "8px 0", display: "flex", alignItems: "center", width: 280 }}>
        <IconButton sx={{ p: "6px" }} aria-label="menu">
          <SearchIcon />
        </IconButton>
        <InputBase sx={{ ml: 1, flex: 1 }} name="search" onKeyDown={handleSearch} onChange={handleChange} placeholder="Search issues" />
      </Paper>
      <MembershipFilter max={20} project_id={project_id} selectedMembers={filter.assigned_to_ids} handleMemberFilter={handleMemberFilter} />
      <SmallButton variant={isMyIssue ? "contained" : "outlined"} size="small" onClick={handleMyIssue}>
        My Issues
      </SmallButton>
      <SmallButton variant={filter.unassigned_issues ? "contained" : "outlined"} size="small" onClick={handleUnassigned}>
        Unassigned
      </SmallButton>

      <SmallButton variant={isMoreFilterApplied ? "contained" : "outlined"} onClick={handleFilterOpen} endIcon={<Add />} size="small">
        More Filters
      </SmallButton>
      <CustomMenu anchorEl={filterOpen} open={Boolean(filterOpen)} onClose={handleDialogClose}>
        <CustomDialogTitle onClose={handleDialogClose} sx={{ borderBottom: "1px solid #DFDFDF", fontSize: "1.0rem" }}>
          Filter by
        </CustomDialogTitle>
        <DialogContent sx={{ maxWidth: 260, marginTop: 1, marginLeft: 1, padding: 1 }}>
          <TextField select label="Epic" name="category_id" value={filter.category_id} onChange={handleFilter}>
            <MenuItem value="">All</MenuItem>
            {epic?.length &&
              epic.map(({ id, name }) => (
                <MenuItem key={id} value={id}>
                  {name}
                </MenuItem>
              ))}
          </TextField>
          <TextField select label="Status" name="status_id" value={filter.status_id} onChange={handleFilter}>
            <MenuItem value="">All</MenuItem>
            {statuses?.map(({ id, name }) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
          </TextField>
          <TextField select label="Priority" name="priority_id" value={filter.priority_id} onChange={handleFilter}>
            <MenuItem value="">All</MenuItem>
            {priorities?.map(({ name, id, active }) => (
              <MenuItem key={id} value={id} disabled={!active}>
                {name}
              </MenuItem>
            ))}
          </TextField>
          <TextField select label="IssueType" name="tracker_id" value={filter.tracker_id} onChange={handleFilter}>
            <MenuItem value="">All</MenuItem>
            {project?.tracker?.map(({ id, name }) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
          </TextField>

          <TextField select label="Reported by" name="author_id" value={filter.author_id} onChange={handleFilter}>
            <MenuItem value="">All</MenuItem>
            {members?.map(({ user }) => {
              if (!user) return ""
              return (
                <MenuItem value={user.id} key={user.id}>
                  {user.name}
                </MenuItem>
              )
            })}
          </TextField>
        </DialogContent>
      </CustomMenu>
    </Stack>
  )
}
