import { Chip } from "@mui/material"
import IssuePriorityIcon from "pages/shared/IssuePriorityIcon"
import IssueTypeIcon from "pages/shared/IssueTypeIcon"
import MemberAvatar from "pages/shared/MemberAvatar"
import { StyledTableRow, TableCell } from "pages/shared/StyledTable"
import { useLocation, useNavigate } from "react-router-dom"
import { PATH_DASHBOARD } from "routes/paths"
import { getIssueStatusColor } from "utils/getIssueStatusColor"

export default function SprintIssueListItem({ issue, projectId, priority, status, referrer, display, ...props }) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleDetails = () => {
    if (referrer) navigate(`${PATH_DASHBOARD.projects.root}/${projectId}/${referrer}/issues/${issue.id}?referrer=${referrer}`, { state: { background: location } })
    else navigate(`${PATH_DASHBOARD.projects.root}/${projectId}/issues/${issue.id}`, { state: { background: location } })
  }

  return (
    <>
      <StyledTableRow tabIndex={-1} hover className="button" sx={{ "&:last-child td, &:last-child th": { border: 0 } }} onClick={handleDetails}>
        <TableCell padding="none" sx={{ width: "32px", paddingLeft: "13px !important" }}>
          <IssueTypeIcon type_id={issue.tracker_id} />
        </TableCell>
        <TableCell component="th" scope="row" padding="checkbox" sx={{ padding: "6px !important" }}>
          {issue.id}
        </TableCell>
        <TableCell sx={{ padding: "6px !important", "& span": { color: theme => theme.palette.primary.defaultText }, "& :hover": { color: "#000" } }}>
          <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>{issue.subject}</span>
        </TableCell>
        <TableCell>{issue.story_point ?? "SP"}</TableCell>
        <TableCell align="right" sx={{ padding: "6px !important" }}>
          <MemberAvatar height={32} width={32} name={issue.assigned_to?.name} tooltipPosition="right" />
        </TableCell>
        <TableCell padding="checkbox" sx={{ padding: "6px !important" }}>
          <Chip variant="contained" label={status} sx={{ backgroundColor: getIssueStatusColor(issue.status), color: "#42526E" }} />
        </TableCell>
        <TableCell padding="checkbox" sx={{ padding: "6px !important" }}>
          <Chip label={priority} variant="outlined" avatar={<IssuePriorityIcon type_name={priority} />} />
        </TableCell>
      </StyledTableRow>
    </>
  )
}
