import { useGetIssueQuery } from "@redux/services/issueApi"
import LinearProgressBar from "pages/shared/LinearProgressBar"
import React from "react"
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"

export default function IssueDetails() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const referrer = searchParams.get("referrer")
  const { issue_id } = useParams()

  const { data: issue, isLoading: issueLoading, isError } = useGetIssueQuery(issue_id)
  // const { data, isLoading: projectLoading } = useGetProjectByIdQuery(issue?.project?.id || skipToken)
  // const loading = issueLoading || projectLoading

  if (issueLoading) return <LinearProgressBar />
  if (isError) return <Navigate to={`/404`} replace />
  return <Navigate to={`/account/projects/${issue.project.id}/issues/${issue_id}`} replace />
}
