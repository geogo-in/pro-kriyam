import Loading from "pages/shared/Loading"
import { useLayoutEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useGetProjectByIdQuery } from "@redux/services/projectApi"
import { PATH_DASHBOARD } from "routes/paths"

export default function Project() {
  const navigate = useNavigate()
  const { project_id } = useParams()
  const { data: project } = useGetProjectByIdQuery(project_id)

  useLayoutEffect(() => {
    switch (project?.project_type?.name) {
      case "Scrum":
        return navigate(`${PATH_DASHBOARD.projects.root}/${project_id}/backlog`, { replace: true })
      case "Kanban":
        return navigate(`${PATH_DASHBOARD.projects.root}/${project_id}/board`, { replace: true })
      default:
        return navigate(`${PATH_DASHBOARD.projects.root}/${project_id}/issues`, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project])

  // return <span />
  return <Loading imgAndTitle />
  // return <LinearProgress />
}
