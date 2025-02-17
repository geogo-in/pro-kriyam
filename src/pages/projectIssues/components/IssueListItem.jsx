import { Chip, Stack } from "@mui/material"
import { AvatarWithName } from "pages/shared/AvatarWithName"
import IssuePriorityIcon from "pages/shared/IssuePriorityIcon"
import IssueTypeIcon from "pages/shared/IssueTypeIcon"
import MemberAvatar from "pages/shared/MemberAvatar"
import { StyledTableRow, TableCell } from "pages/shared/StyledTable"
import { useLocation, useNavigate } from "react-router-dom"
import { PATH_DASHBOARD } from "routes/paths"
import { getIssueStatusColor } from "utils/getIssueStatusColor"
// import CustomDialog from "../shared/CustomDialog"
// import IssueDetails from "./IssueDetails"

export default function IssueListItem({ issue, project_id, referrer, display, ...props }) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleDetails = () => {
    if (referrer) navigate(`${PATH_DASHBOARD.projects.root}/${project_id}/${referrer}/issues/${issue.id}?referrer=${referrer}`, { state: { background: location } })
    else navigate(`${PATH_DASHBOARD.projects.root}/${project_id}/issues/${issue.id}`, { state: { background: location } })
  }

  return (
    <>
      <StyledTableRow tabIndex={-1} key={issue.id} hover className="button" onClick={handleDetails} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell padding="none" sx={{ width: "32px", paddingLeft: "13px !important" }}>
          <IssueTypeIcon type_id={issue.tracker?.id} />
        </TableCell>
        <TableCell component="th" scope="row" padding="checkbox" sx={{ padding: "6px !important" }}>
          {issue.id}
        </TableCell>
        <TableCell sx={{ padding: "6px !important", "& span": { color: theme => theme.palette.mode === "light" ? theme.palette.primary.defaultText : theme.palette.text.default }, "& :hover": { color: theme => theme.palette.mode === "light" ? "#000" : theme.palette.text.primary } }}>
          <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>{issue.subject}</span>
        </TableCell>
        <TableCell align="right" sx={{ padding: "6px !important" }}>
          <MemberAvatar height={32} width={32} name={issue.assigned_to?.name} tooltipPosition="right" />
        </TableCell>
        {display !== "sleek" && (
          <TableCell align="right" sx={{ padding: "6px !important" }}>
            <Stack direction={"row"} alignItems="baseline" spacing={1}>
              <AvatarWithName name={issue.author?.name} />
            </Stack>
          </TableCell>
        )}

        <TableCell padding="checkbox" sx={{ padding: "6px !important" }}>
          <Chip variant="contained" label={issue.status?.name} sx={{ backgroundColor: getIssueStatusColor(issue.status), color: "#42526E" }} />
        </TableCell>
        <TableCell padding="checkbox" sx={{ padding: "6px !important" }}>
          <Chip label={issue.priority?.name} variant="outlined" avatar={<IssuePriorityIcon type_name={issue.priority?.name} />} />
        </TableCell>
      </StyledTableRow>
      {/* <CustomDialog back open={open.details} onClose={handleClose}>
      <IssueDetails onClose={handleClose} issue_id={issue.id} project_id={project_id} />
    </CustomDialog> */}
    </>
  )
}
