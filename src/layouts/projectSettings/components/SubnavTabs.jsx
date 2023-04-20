import { StyledTab, StyledTabs } from "pages/shared/StyledTabs"
import { Link, matchPath, useLocation, useParams } from "react-router-dom"

function useRouteMatch(patterns) {
  const { pathname } = useLocation()

  for (let i = 0; i < patterns.length; i += 1) {
    const pattern = patterns[i]
    const possibleMatch = matchPath(pattern, pathname)
    if (possibleMatch !== null) {
      return possibleMatch
    }
  }

  return null
}

const SubnavTabs = () => {
  const { project_id } = useParams()
  const SETTING_PATH = `/account/projects/${project_id}/settings`
  const routeMatch = useRouteMatch([SETTING_PATH, `${SETTING_PATH}/members`, `${SETTING_PATH}/statuses`, `${SETTING_PATH}/issue-types`])
  const currentTab = routeMatch?.pattern?.path

  return (
    <StyledTabs value={currentTab}>
      <StyledTab label="Basic Details" value={SETTING_PATH} to={SETTING_PATH} component={Link} />
      <StyledTab label="Members" value={`${SETTING_PATH}/members`} to={`${SETTING_PATH}/members`} component={Link} />
      <StyledTab label="Issue Statuses" value={`${SETTING_PATH}/statuses`} to={`${SETTING_PATH}/statuses`} component={Link} />
      <StyledTab label="Issue Types" value={`${SETTING_PATH}/issue-types`} to={`${SETTING_PATH}/issue-types`} component={Link} />
    </StyledTabs>
  )
}

export default SubnavTabs
