import { FiberManualRecord } from "@mui/icons-material"
import { Box, ListItemIcon, ListItemText, MenuItem, Typography, styled } from "@mui/material"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import MuiTableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableRow from "@mui/material/TableRow"
import { useGetEpicQuery, useGetIssuePriorityQuery, useUpdateIssuesMutation } from "@redux/services/issueApi"
import { useGetProjectMembershipsQuery } from "@redux/services/projectApi"
import { useSnackbar } from "notistack"
import { SleekSelectWithIcon } from "pages/shared/CustomTextField"
import IssuePriorityIcon from "pages/shared/IssuePriorityIcon"
import MemberAvatar from "pages/shared/MemberAvatar"
import TypoTextField from "pages/shared/TypoTextField"
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

  const handleIssueUpdate = data => async () => {
    try {
      await updateTask({ id: issue.id, ...data }).unwrap()
    } catch (r) {
      console.error(r)
      enqueueSnackbar(r.data?.errors?.join(", "), { variant: "error" })
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
              <SleekSelectWithIcon bgcolor="#f1f5f9" minWidth={300} fullWidth={false} value={assigned_to?.id || ""} onChange={e => handleIssueUpdate({ assigned_to_id: e.target.value })()}>
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
              <SleekSelectWithIcon bgcolor="#f1f5f9" minWidth={300} fullWidth={false} value={priority.id} onChange={e => handleIssueUpdate({ priority_id: e.target.value })()}>
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
            <TableCell>Epic</TableCell>
            <TableCell align="left">
              <SleekSelectWithIcon bgcolor="#f1f5f9" minWidth={300} fullWidth={false} value={category?.id || ""} onChange={e => handleIssueUpdate({ category_id: e.target.value })()}>
                <MenuItem value="">
                  <ListItemText>Select Epic</ListItemText>
                </MenuItem>
                {epics?.map(({ id, name, color_code }) => (
                  <MenuItem key={id} value={id}>
                    <ListItemIcon sx={{ color: color_code }}>
                      <FiberManualRecord />
                    </ListItemIcon>
                    <ListItemText>{name}</ListItemText>
                  </MenuItem>
                ))}
              </SleekSelectWithIcon>
            </TableCell>
          </TableRow>
          <TableRow sx={{ "td, th": { border: 0 } }}>
            <TableCell>Story Point</TableCell>
            <TableCell align="left">
              <Box sx={{ minHeight: 50, display: "flex", alignItems: "center", width: "300px" }}>
                <TypoTextField type="number" placeholder="" my={0.8} maxWidth={300} bgcolor="#f1f5f9" p={0.8} value={issue.story_point} name="story_point" onSubmit={handleUpdate} />
              </Box>
            </TableCell>
          </TableRow>
          <TableRow sx={{ "td, th": { border: 0 } }}>
            <TableCell sx={{ width: "120px" }}>Sprint</TableCell>
            <TableCell align="left" sx={{ fontWeight: 500 }}>
              {sprint?.name || "-"}
            </TableCell>
          </TableRow>
          <TableRow sx={{ "td, th": { border: 0 } }}>
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
