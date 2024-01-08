import { Box, Stack, Typography } from "@mui/material"
import { useGetIssuesQuery } from "@redux/services/issueApi"
import { useGetProjectByIdQuery } from "@redux/services/projectApi"
import { omitBy } from "lodash"
import IssueList from "pages/projectIssues/components/IssueList"
import Loading from "pages/shared/Loading"
import { ScrollableGrid } from "pages/shared/Scrollables"
import { SectionTitle } from "pages/shared/SectionTitle"

export default function ReportContainer({ project_id, ...props }) {
  const { data: project, isLoading: projectLoading } = useGetProjectByIdQuery(project_id)
  // filter by issue {status_id: "7"} (Done)
  const { data, isLoading, error } = useGetIssuesQuery({ project_id: project?.id, ...omitBy({ status_id: "7" }, i => !i) }, { refetchOnMountOrArgChange: true, skip: !project?.id })

  return (
    <Stack direction="column" flex={1} gap={2}>
      {/* Details */}
      <Box display="flex" flexDirection="column" mt="1rem" gap>
        <SectionTitle>Details</SectionTitle>
        <Typography color="grey" fontSize="0.9rem">
          Started
        </Typography>
        <Typography color="grey" fontSize="0.9rem">
          Ended
        </Typography>
      </Box>

      {/* Completed issues */}
      <Box display="flex" flexDirection="column">
        <SectionTitle>Completed Issues</SectionTitle>
        {isLoading || projectLoading ? (
          <Loading listing2 />
        ) : error ? (
          "error"
        ) : (
          <Box pt={0}>
            {data && (
              <>
                <ScrollableGrid style={{ height: "calc( 100vh - 186px )" }}>
                  <IssueList issues={data.issues} project_id={project_id} />
                </ScrollableGrid>
              </>
            )}
          </Box>
        )}
      </Box>
    </Stack>
  )
}
