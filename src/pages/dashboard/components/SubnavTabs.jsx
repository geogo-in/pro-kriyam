import { styled } from "@mui/material/styles"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import { Link, matchPath, useLocation } from "react-router-dom"

const StyledTabs = styled(Tabs)(({ theme }) => ({
  // backgroundColor: "white",
  // color: "#64727f",
  minHeight: 44,
  "& .MuiTab-root": {
    paddingTop: "12px",
    paddingBottom: "12px",
    borderRadius: 0,
    fontWeight: "400",
  },
  "& .Mui-selected": {
    color: "#3e4954 !important",
    fontWeight: "500",
  },
  "& .MuiTabs-indicator": {
    backgroundColor: "#0069FF",
    height: "3px",
  },
}))

const StyledTab = styled(Tab)(({ theme }) => ({
  backgroundColor: "white",
  color: "#64727f",
  paddingLeft: 2,
  paddingRight: 2,
  marginRight: 24,
  // "& .Mui-selected": {
  //   color: "#64727f",
  // },
}))

function useRouteMatch(patterns: string[]) {
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
  // You need to provide the routes in descendant order.
  // This means that if you have nested routes like:
  // users, users/new, users/edit.
  // Then the order should be ['users/add', 'users/edit', 'users'].
  const routeMatch = useRouteMatch(["/account/dashboard", "/account/dashboard/of-mine"])
  const currentTab = routeMatch?.pattern?.path
  console.debug(currentTab)
  return (
    <StyledTabs value={currentTab}>
      <StyledTab label="System Dashboard" value="/account/dashboard" to="/account/dashboard" component={Link} />
      <StyledTab label="My Dashboard" value="/account/dashboard/of-mine" to="/account/dashboard/of-mine" component={Link} disabled />
    </StyledTabs>
  )
}

export default SubnavTabs
