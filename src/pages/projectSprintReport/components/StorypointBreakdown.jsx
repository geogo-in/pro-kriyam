import { Box, Typography } from "@mui/material"
import { useGetStoryPointQuery } from "@redux/services/redmineApi"
import Loading from "pages/shared/Loading"
import { SectionTitle } from "pages/shared/SectionTitle"
import SprintIssues from "./SprintIssues"
import MembershipFilter from "pages/projectBacklog/components/MembershipFilter"

export default function StorypointBreakdown({ projectId, sprintId }) {
  const { data: storypoint, isLoading, error } = useGetStoryPointQuery({ project_id: projectId, sprint_id: sprintId })

  return (
    <Box display="flex" flexDirection="column" alignItems="stretch" gap={2} mt={2}>
      <SectionTitle>Storypoint Breakdown</SectionTitle>
      {isLoading ? (
        <Loading listing2 />
      ) : error ? (
        "Error"
      ) : (
        <>
          {/* <Typography variant="body2" color="grey">
            Completed storypoints
            <Typography>{storyPoint.total_story_points}</Typography>
          </Typography> */}
          <Box display="flex" maxWidth="350px" gap={6}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="body2" color="grey">
                Storypoints Completed
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "light" }}>
                {storypoint.total_completed_story_points}/{storypoint.total_story_points}
              </Typography>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="body2" color="grey">
                Issues Completed
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "light" }}>
                {storypoint.total_issue_count_done}/{storypoint.tota_issue_count}
              </Typography>
            </Box>
          </Box>
          <SprintIssues projectId={projectId} storypoint={storypoint} />
        </>
      )}
    </Box>
  )
}
