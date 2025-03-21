import { Box, Typography } from "@mui/material"
import { useGetIssuesQuery } from "@redux/services/issueApi"
import { useGetStoryPointQuery } from "@redux/services/redmineApi"
import Loading from "pages/shared/Loading"
import { SectionTitle } from "pages/shared/SectionTitle"
import AssigneeChart from "./AssigneeChart"
import PriorityChart from "./PriorityChart"
import StatusChart from "./StatusChart"
import TrackerChart from "./TrackerChart"

export default function StorypointBreakdown({ projectId, sprintId }) {
  const { data: storypoint, isLoading, error } = useGetStoryPointQuery({ project_id: projectId, sprint_id: sprintId })
  const { data: issues, isLoading: issuesLoading } = useGetIssuesQuery({project_id: sprintId})

  if (isLoading || issuesLoading) return <Loading />
  return (
    <Box display="flex" flexDirection="column" alignItems="stretch" gap={2} my={2}>
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
                {storypoint.total_issue_count_done}/{storypoint.total_issue_count}
              </Typography>
            </Box>
          </Box>
          {issues.issues.length > 0 ? 
          <Box sx={{ width: 'full', height: 'full' }} display="flex" flexWrap='wrap' gap={2}>
            <Box sx={theme => ({ p: 4, display: "flex", flexDirection: 'column', [theme.breakpoints.up('xs')]: {maxWidth: 'full'}, [theme.breakpoints.up('md')]: { minWidth: '500px' }, minHeight: '400px', border: "1px solid #444444", borderRadius: '10px', alignItems: 'center' })} >
                <Typography variant="h6" sx={{ mr: 'auto', mb: 2, color: theme => theme.palette.mode === "light" ? "" : theme.palette.primary.defaultText }} >Status Review</Typography>
                <StatusChart issues={issues} projectId={projectId} />
            </Box>
            <Box sx={theme => ({ p: 4, display: "flex", flexDirection: 'column', [theme.breakpoints.up('xs')]: {maxWidth: 'full'}, [theme.breakpoints.up('md')]: { minWidth: '500px' }, minHeight: '400px', border: "1px solid #444444", borderRadius: '10px', alignItems: 'center' })} >
                <Typography variant="h6" sx={{ mr: 'auto', mb: 2, color: theme => theme.palette.mode === "light" ? "" : theme.palette.primary.defaultText }} >Priority Review</Typography>
                <Box sx={{ width: 'fit', height: 'full' }} >
                    <PriorityChart issues={issues} sprintId={sprintId} />
                </Box>
            </Box>
            <Box sx={theme => ({ p: 4, display: "flex", flexDirection: 'column', [theme.breakpoints.up('xs')]: {maxWidth: 'full'}, [theme.breakpoints.up('md')]: { minWidth: '500px' }, minHeight: '400px', border: "1px solid #444444", borderRadius: '10px', alignItems: 'center' })} >
                <Typography variant="h6" sx={{ mr: 'auto', mb: 2, color: theme => theme.palette.mode === "light" ? "" : theme.palette.primary.defaultText }} >Tracker Review</Typography>
                <TrackerChart issues={issues} />
            </Box>
            <Box sx={theme => ({ p: 4, display: "flex", flexDirection: 'column', [theme.breakpoints.up('xs')]: {maxWidth: 'full'}, [theme.breakpoints.up('md')]: { minWidth: '500px' }, minHeight: '400px', border: "1px solid #444444", borderRadius: '10px', alignItems: 'center' })} >
                <Typography variant="h6" sx={{ mr: 'auto', mb: 2, color: theme => theme.palette.mode === "light" ? "" : theme.palette.primary.defaultText }} >Assignee Review</Typography>
                <AssigneeChart issues={issues}  />
            </Box>
          </Box>
          : <></> }
        </>
      )}
    </Box>
  )
}
