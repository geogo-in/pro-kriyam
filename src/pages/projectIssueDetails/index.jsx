import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { PATH_DASHBOARD } from "../../routes/paths"
import IssueDetails from "../projectIssues/components/IssueDetails"
import CustomDialog from "../shared/CustomDialog"

export default function ProjectIssueDetails() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const referrer = searchParams.get("referrer")
  const { project_id, issue_id } = useParams()

  const handleDetails = () => {
    if (location.state) {
      navigate(location.state?.background)
    } else {
      navigate(`${PATH_DASHBOARD.projects.root}/${project_id}/${referrer || "issues"}`, { state: { background: location } })
    }
  }
  return (
    <CustomDialog back open onClose={handleDetails}>
      <IssueDetails onClose={handleDetails} referrer={referrer} issue_id={issue_id} project_id={project_id} />
    </CustomDialog>
  )
}
