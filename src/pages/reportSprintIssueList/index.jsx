import { Box } from "@mui/material";
import { useGetIssuePriorityQuery, useGetIssuesQuery, useGetProjectIssuesStatusesQuery } from "@redux/services/issueApi";
import IssueList from "pages/projectIssues/components/IssueList";
import IssueListToolbar from "pages/projectIssues/components/IssueListToolbar";
import Loading from "pages/shared/Loading";
import PageContainer from "pages/shared/PageContainer";
import { ScrollableGrid } from "pages/shared/Scrollables";
import { SectionTitle } from "pages/shared/SectionTitle";
import { OneBox } from "pages/shared/SplitContainer";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

export default function ReportSprintIssueList(){

  const { data: issues, isLoading } = useGetIssuesQuery({project_id: sprintId})
  const { project_id, sprint_id } = useParams()
  const [data, setData] = useState(issues)
  const [filter, setFilter] = useState({ offset: 0, search: "", status_id: "", priority_id: "", category_id: "", assigned_to_id: "", author_id: "", tracker_id: "" })
  const [searchParams] = useSearchParams()
  const trackerLabel = searchParams.get('tracker')
  const statusLabel = searchParams.get('status')
  const priorityLabel = searchParams.get('priority')
  const assigneeLabel = searchParams.get('assignee')
  const { data: priorities } = useGetIssuePriorityQuery()
  const { data: statuses } = useGetProjectIssuesStatusesQuery(project_id)

  useEffect(() => {
    let filtered

    if (trackerLabel){
      filtered = issues.issues.filter(
        issue => issue.tracker.name.toLowerCase() === trackerLabel.toLowerCase()
      )
    } else if(statusLabel){
      filtered = issues.issues.filter(
        issue => issue.status.name.toLowerCase() === statusLabel.toLowerCase()
      )
    } else if(priorityLabel){
      filtered = issues.issues.filter(
        issue => issue.priority.name.toLowerCase() === priorityLabel.toLowerCase()
      )
    } else if (assigneeLabel){
      filtered = issues.issues.filter(
        issue => issue.assigned_to.name.toLowerCase() === assigneeLabel.toLowerCase()
      )
    } else {
      filtered = issues.issues
    }

    setData({ issues: filtered, total_count: filtered.length, offset: issues.offset, limit: issues.limit })
  },[])

  const handleSearch = e => {
    if (e.keyCode === 13) {
      setFilter({ ...filter, search: e.target.value })
    }
  }

  const handleFilter = e => {
    setFilter({ ...filter, [e.target.name]: e.target.value })
  }

  const getPriority = priorityId => {
    return priorities?.find(p => p.id === priorityId)?.name
  }
  const getStatus = statusId => {
    return statuses?.find(p => p.id === statusId)?.name
  }

  if (isLoading) return <Loading /> 
  return (
    <PageContainer>
      <Box display="flex" flexDirection="column">
        <OneBox sx={{ px: 3, pt: 1, pb: 0 }}>
          <SectionTitle>Issues</SectionTitle>
          <IssueListToolbar {...data} {...{ project_id, filter, onFilter: handleFilter, onSearch: handleSearch }} />
          <ScrollableGrid style={{ height: "max-content", maxHeight: "50vh" }}>
            <IssueList issues={data?.issues} project_id={project_id} />
          </ScrollableGrid>
        </OneBox>
      </Box>
    </PageContainer>
  )
}