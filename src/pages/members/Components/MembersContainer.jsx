import { Avatar, CardMedia, Link } from "@mui/material"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import { useGetGroupsQuery, useGetUsersQuery } from "@redux/services/userApi"
import Loading from "pages/shared/Loading"
import NoData from "pages/shared/NoData"
import { useState } from "react"
import { Link as RouterLink } from "react-router-dom"
import { PATH_DASHBOARD } from "routes/paths"
import { useDebounce } from "use-debounce"
import { stringAvatar } from "utils/Avatar"

export default function MembersContainer() {
  const [state, setState] = useState({ name: "" })
  const [filter] = useDebounce(state, 500)
  const { data: users, isLoading } = useGetUsersQuery(filter)
  const { data: teams, isLoading: isTeamsLoading } = useGetGroupsQuery(filter)

  const handleFilter = e => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  if (isLoading || isTeamsLoading) return <Loading listing />
  if (!users) return <NoData />
  return (
    <div>
      {/* <Paper component="form" sx={{ boxShadow: "none", background: "#E5E8EC", borderRadius: "30px", p: "2px 4px", margin: "24px 0", display: "flex", alignItems: "center", width: 400 }}>
        <IconButton sx={{ p: "6px" }}>
          <Search />
        </IconButton>
        <InputBase sx={{ ml: 1, flex: 1 }} name="name" onChange={handleFilter} placeholder="Search for Members" />
      </Paper>
      <Typography variant="h6">People</Typography> */}
      <Box display="flex" flexWrap="wrap">
        {users.users.map(user => (
          <Link key={user.id} component={RouterLink} to={`${PATH_DASHBOARD.members}/${user.id}`}>
            <Card key={user.id} variant="outlined" sx={{ minWidth: 160, m: 1 }}>
              <CardMedia sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
                <Avatar sx={{ width: 70, height: 70 }} {...stringAvatar(`${user.firstname} ${user.lastname}`)} />
              </CardMedia>
              <CardContent>
                <Typography align="center">
                  {user.firstname} {user.lastname}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        ))}
      </Box>
      <Typography variant="h6">Your teams</Typography>
      <Box display="flex" flexWrap="wrap">
        {teams.map(team => (
          <Card key={team.id} variant="outlined" sx={{ minWidth: 160, m: 1 }}>
            <CardMedia sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
              <Avatar sx={{ width: 70, height: 70 }} {...stringAvatar(team.name)} />
            </CardMedia>
            <CardContent>
              <Typography align="center">{team.name}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </div>
  )
}
