import { Box, Table, TableBody, TableContainer, Typography } from "@mui/material"
import { useGetIssuePriorityQuery, useGetProjectIssuesStatusesQuery } from "@redux/services/issueApi"
import { ScrollableGrid } from "pages/shared/Scrollables"
import { SectionTitle } from "pages/shared/SectionTitle"
import SprintIssueListHeader from "./SprintIssueListHeader"
import SprintIssueListItem from "./SprintIssueListItem"

export default function SprintIssues({ projectId, storypoint }) {
  const { issue_completed, total_issue_incomplete, tota_issue_count: total_issue_count, total_issue_count_done } = storypoint
  const { data: priorities } = useGetIssuePriorityQuery()
  const { data: statuses } = useGetProjectIssuesStatusesQuery(projectId)

  const getPriority = priorityId => {
    return priorities?.find(p => p.id === priorityId).name
  }
  const getStatus = statusId => {
    return statuses?.find(p => p.id === statusId).name
  }

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Box display="flex" flexDirection="column">
        <SectionTitle>Issues Complete</SectionTitle>
        {total_issue_count_done !== 0 ? (
          <ScrollableGrid style={{ height: "max-content", maxHeight: "50vh" }}>
            <TableContainer>
              <Table sx={{ minWidth: 750 }} size={"small"}>
                <SprintIssueListHeader issue={issue_completed} />
                <TableBody>
                  {issue_completed.map((issue, index) => (
                    <SprintIssueListItem key={issue.id} projectId={projectId} issue={issue} priority={getPriority(issue.priority_id)} status={getStatus(issue.status_id)} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </ScrollableGrid>
        ) : (
          <Typography variant="body2" sx={{ paddingY: 1 }}>
            No issues were completed
          </Typography>
        )}
      </Box>

      <Box display="flex" flexDirection="column">
        <SectionTitle>Issues Incomplete</SectionTitle>
        {total_issue_count - total_issue_count_done !== 0 ? (
          <ScrollableGrid style={{ height: "max-content", maxHeight: "50vh" }}>
            <TableContainer>
              <Table sx={{ minWidth: 750 }} size={"small"}>
                <SprintIssueListHeader issue={total_issue_incomplete} />
                <TableBody>
                  {total_issue_incomplete.map((issue, index) => (
                    <SprintIssueListItem key={issue.id} projectId={projectId} issue={issue} priority={getPriority(issue.priority_id)} status={getStatus(issue.status_id)} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </ScrollableGrid>
        ) : (
          <Typography variant="body2" sx={{ paddingY: 1 }}>
            All issues are completed
          </Typography>
        )}
      </Box>
    </Box>
  )
}
