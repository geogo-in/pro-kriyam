import { ListItemIcon, ListItemText, MenuItem, Typography, styled } from "@mui/material"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import MuiTableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableRow from "@mui/material/TableRow"
import { useGetEpicQuery, useGetIssuePriorityQuery, useUpdateIssuesMutation } from "@redux/services/issueApi"
import { useGetProjectMembershipsQuery } from "@redux/services/projectApi"
import moment from "moment"
import { useSnackbar } from "notistack"
import { SleekSelectWithIcon, SleekTextField } from "pages/shared/CustomTextField"
import IssuePriorityIcon from "pages/shared/IssuePriorityIcon"
import MemberAvatar from "pages/shared/MemberAvatar"
import { useState } from "react"
import { fDate } from "utils/formatDate"

export const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  ".MuiTypography-root": { fontSize: "0.80rem" },
}))
const TableCell = styled(MuiTableCell)(({ theme }) => ({
  padding: "4px 8px",
  // borderBottom: "1px solid #EEE",
  color: theme.palette.primary.secondaryText,
  "&:first-of-child": { paddingLeft: "4px", fontWeight: 500 },
  "&:last-child": { paddingRight: "32px" },
}))

export default function IssueAbout({ project_id, comments, sprint, author, priority, assigned_to, category, created_on, updated_on, ...issue }) {
  const { data: membership } = useGetProjectMembershipsQuery(project_id)
  const { data: priorities } = useGetIssuePriorityQuery()
  const [updateTask] = useUpdateIssuesMutation()
  const { data: epics } = useGetEpicQuery(project_id)
  const { enqueueSnackbar } = useSnackbar()

  const [tempValues, setTempValues] = useState({
    assigned_to_id: assigned_to?.id || "",
    priority_id: priority.id,
    start_date: moment(issue?.start_date).format("YYYY-MM-DD"),
    due_date: moment(issue?.due_date).format("YYYY-MM-DD"),
  })

  const handleIssueUpdate = async (field, value) => {
    setTempValues(prev => ({ ...prev, [field]: value })) // Optimistic UI update

    try {
      await updateTask({ id: issue.id, [field]: value }).unwrap()
    } catch (r) {
      console.error(r)
      enqueueSnackbar(r.data?.errors?.join(", "), { variant: "error" })
      // Revert to original value on failure
      setTempValues(prev => ({
        ...prev,
        [field]:
          field === "assigned_to_id"
            ? assigned_to?.id || ""
            : field === "priority_id"
            ? priority.id
            : field === "start_date"
            ? moment(issue?.start_date).format("YYYY-MM-DD")
            : field === "due_date"
            ? moment(issue?.due_date).format("YYYY-MM-DD")
            : prev[field],
      }))
    }
  }

  const handleUpdate = async data => {
    handleIssueUpdate(data)()
  }

  return (
    <TableContainer>
      <Table aria-label="simple table">
        <TableBody>
          <TableRow sx={{ "td, th": { border: 0 } }}>
            <TableCell sx={{ maxWidth: "120px", minWidth: "120px" }}>Assignee</TableCell>
            <TableCell align="left">
              <SleekSelectWithIcon bgcolor="#f1f5f9" minwidth={300} fullWidth={false} value={tempValues.assigned_to_id} onChange={e => handleIssueUpdate("assigned_to_id", e.target.value)}>
                <MenuItem value="">
                  <ListItemIcon>
                    <MemberAvatar tooltipPosition="none" />
                  </ListItemIcon>
                  Unassigned
                </MenuItem>
                {membership?.map(({ user }) => {
                  if (!user) return ""
                  return (
                    <MenuItem key={user.id} value={user.id}>
                      <ListItemIcon>
                        <MemberAvatar name={user?.name} tooltipPosition="none" />
                      </ListItemIcon>
                      <ListItemText primary={user.name} primaryTypographyProps={{ noWrap: true }} />
                    </MenuItem>
                  )
                })}
              </SleekSelectWithIcon>
            </TableCell>
          </TableRow>
          <TableRow sx={{ "td, th": { border: 0 } }}>
            <TableCell>Priority</TableCell>
            <TableCell align="left">
              <SleekSelectWithIcon bgcolor="#f1f5f9" minwidth={300} fullWidth={false} value={tempValues.priority_id} onChange={e => handleIssueUpdate("priority_id", e.target.value)}>
                {priorities?.map(({ name, id }) => (
                  <MenuItem key={id} value={id}>
                    <ListItemIcon>
                      <IssuePriorityIcon type_name={name} />
                    </ListItemIcon>
                    {name}
                  </MenuItem>
                ))}
              </SleekSelectWithIcon>
            </TableCell>
          </TableRow>
          <TableRow sx={{ "td, th": { border: 0 } }}>
            <TableCell>Start date</TableCell>
            <TableCell align="left">
              <SleekTextField
                type="date"
                bgcolor="#f1f5f9"
                minwidth={300}
                fullWidth={false}
                value={tempValues.start_date}
                onChange={e => handleIssueUpdate("start_date", e.target.value)}
                required
                size="small"
                inputProps={{ min: moment().format("YYYY-MM-DD") }}
              />
            </TableCell>
          </TableRow>
          <TableRow sx={{ "td, th": { border: 0 } }}>
            <TableCell>End date</TableCell>
            <TableCell align="left">
              <SleekTextField
                type="date"
                value={tempValues.due_date}
                onChange={e => handleIssueUpdate("due_date", e.target.value)}
                required
                bgcolor="#f1f5f9"
                minwidth={300}
                fullWidth={false}
                size="small"
                inputProps={{ min: moment().format("YYYY-MM-DD") }}
              />
            </TableCell>
          </TableRow>

          <TableRow sx={{ "td, th": { border: 0, py: 2 } }}>
            <TableCell>Reporter</TableCell>
            <TableCell align="left">
              <Typography variant="body2">
                {author?.name} <Typography variant="caption">(Reported at {fDate(created_on)})</Typography>
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
