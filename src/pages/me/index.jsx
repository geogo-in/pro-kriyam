import { Edit } from "@mui/icons-material"
import { Box, Container, Divider, FormControl, Grid, IconButton, LinearProgress, Link, MenuItem, Select, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { getCurrentUser } from "@redux/reducerSlices/user/userAuthSlice"
import { useGetRolesQuery, useGetUserIssuesQuery, useGetUserQuery } from "@redux/services/userApi"
import moment from "moment"
import ChangePassword from "pages/memberDetails/Components/ChangePassword"
import EditInformation from "pages/memberDetails/Components/EditInformation"
import { StyledButton } from "pages/projectIssues"
import CustomDialog from "pages/shared/CustomDialog"
import IssueTypeIcon from "pages/shared/IssueTypeIcon"
import MemberAvatar from "pages/shared/MemberAvatar"
import PrimaryRoundButton from "pages/shared/PrimaryRoundButton"
import { Card } from "pages/shared/StyledCard"
import { StyledTableRow, TableCell, TableHeadCell } from "pages/shared/StyledTable"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom"
import { PATH_DASHBOARD } from "routes/paths"

export default function Me() {
  const user = useSelector(getCurrentUser)
  const {data: me, isLoading } = useGetUserQuery(user?.id)
  const {data: issues} = useGetUserIssuesQuery(user.id)
  const { data: roles } = useGetRolesQuery()
  const location = useLocation()
  const navigate = useNavigate()
  
  const [groupedIssues, setGroupedIssues] = useState({})
  const [visibleMonths, setVisibleMonths] = useState(2)
  const [filterType, setFilterType] = useState("start_date")
  const [selectedRole, setSelectedRole] = useState("")

  const [state, setState] = useState()
  const [editedUser, setEditedUser] = useState({ ...user })

  const filteredMemberships = selectedRole ? me?.memberships.filter(member => member.roles.some(role => role.name === selectedRole)): me?.memberships

  const handleIssue = (issue) => {
    if(issue.sprint){
      navigate(`${PATH_DASHBOARD.projects.root}/${issue.project.id}/board/issues/${issue.id}?referrer=board`, { state: { background: `${PATH_DASHBOARD.projects.root}/${issue.project.id}/board` } })
    } else {
      navigate(`${PATH_DASHBOARD.projects.root}/${issue.project.id}/issues/${issue.id}`)
    }
  }
  
  const handleMemberships = (project) => {
    navigate(`${PATH_DASHBOARD.projects.root}/${project}`, { state: { background: location } })
  }

  useEffect(() => {
    if (issues?.issues && Array.isArray(issues.issues)) {
      const grouped = issues.issues.reduce((acc, issue) => {
        const dateValue = issue[filterType]
        const isValidDate = moment(dateValue, moment.ISO_8601, true).isValid()
        const monthYear = isValidDate ? moment(issue[filterType]).format("MMMM YYYY") : "Missing Date"
        if (!acc[monthYear]) {
          acc[monthYear] = []
        }
        acc[monthYear].push(issue)
        return acc
      }, {})
      
      setGroupedIssues(grouped)
      setVisibleMonths(2)
    }
  }, [issues,filterType])


  const allMonths = Object.keys(groupedIssues)
  const visibleMonthsList = allMonths.slice(0, visibleMonths)
  const hasMore = visibleMonths < allMonths.length

  if (isLoading) return <LinearProgress />
  return (
    <Container component={Box}  sx={{minHeight: `calc( 100vh - 64px )`, display: "flex", flexDirection: "column" }}>
      <Box sx={{ flexDirection: { xs: "column", sm: "row" }, display: "flex", flex: 1 }}>
        <Box sx={{ px: 3, py: 4, width: { xs: "100%", sm: "280px !important" }, minWidth: "280px", display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", flexDirection: { xs: "row", sm: "column" }, gap: { xs: 3, sm: 1 } }} >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", }}>
              <MemberAvatar height={40} width={40} name={`${user.firstname} ${user.lastname}`} />
              <IconButton size="small" variant="contained" sx={{ mr: 1, my: 1, backgroundColor: (theme) => (theme.palette.mode === "light" ? "#f1f5f9" : theme.palette.background.modal),"&:hover": { backgroundColor: (theme) => (theme.palette.mode === "light" ? "#f1f5f9" : theme.palette.background.modal),}, color: theme => theme.palette.mode === "light" ? "" : theme.palette.primary.defaultText }} onClick={() => setState("edit_profile")} >
                <Edit />
              </IconButton>
            </Box>
            <Box>
              <Box>
                <Typography variant="h5">
                  {me?.firstname} {me?.lastname}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ color: theme => theme.palette.mode === "light" ? "#64748B" : theme.palette.primary.secondaryText, fontWeight: 200 }}>
                {me?.login}
              </Typography>
              <Typography sx={{ display: { xs: "none", sm: "block" } }}>
                {me?.mail}
              </Typography>
            </Box>
          </Box>
          <Box>
            <PrimaryRoundButton variant="contained" sx={{ mr: 1, my: 1 }} onClick={() => setState("change_pwd")}>
              Change Password
            </PrimaryRoundButton>
          </Box>
        </Box>
        <Divider
          sx={{
            width: { xs: "100%", sm: "1px" },
            height: { xs: "1px", sm: "auto" },
            backgroundColor: theme => theme.palette.mode === "light" ? "#F1F5F9" : "#292929"
          }}
        />
        <Box sx={ theme => ({ px: 3, py: 4,  width: "calc( 100% - 600px )", display: "flex", flexDirection: "column", gap: 2, [theme.breakpoints.down("lg")]: { width: "100%" } })}>
          <Box sx={{mb: 3, display: "flex", flexDirection: "column"}} >
            <Box sx={{ mb: 2, display: "flex", flexDirection: "row", alignItems: "center" , justifyContent: "space-between"}} >
              <Typography color={theme => theme.palette.primary.defaultText} variant="h6">
                Projects
              </Typography>
              <FormControl size="small" sx={{ minWidth: 120, display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" display="block" sx={{ color: theme => theme.palette.primary.defaultText }}>
                  Filter by: 
                </Typography>
                <Select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} displayEmpty>
                  <MenuItem value="">All Roles</MenuItem>
                  {roles?.roles?.map(role => (
                    <MenuItem key={role.id} value={role.name}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Divider/>
            <TableContainer sx={{ mt: 2}}>
              <Table>
                <TableHead sx={{ backgroundColor: theme => theme.palette.background.modal, borderRadius: 0, borderBottom: "none" }}>
                  <TableRow>
                    <TableHeadCell sx={{ pl: 4 }} >Project</TableHeadCell>
                    <TableHeadCell>Role</TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {filteredMemberships?.map((member) => (
                  <StyledTableRow key={member.id} hover className="button" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell onClick={() => handleMemberships(member.project.id)} sx={{ pl: 4, py: 2, fontSize: "0.9rem", fontWeight: 500, "&:span": { color: theme => theme.palette.primary.defaultText }, "&:hover": { color: theme => theme.palette.mode === "light" ? "#000" : theme.palette.primary.main } }}>
                      {member.project.name}
                    </TableCell>
                    <TableCell>
                    {member.roles.map((role) => (
                      <div key={role.id}>
                      {role.name}
                      </div>
                    ))}
                    </TableCell>
                  </StyledTableRow>
                ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box sx={{mb: 3}}>
            <Typography sx={{mb: 1}} color={theme => theme.palette.primary.defaultText} variant="h6">
              Teams
            </Typography>
            <Divider/>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {me?.groups.map(team => (
                <Grid item lg={4} key={team.id}>
                  <Link component={RouterLink} to={`${PATH_DASHBOARD.members}/teams/${team.id}`}>
                    <Card sx={{ ":hover": { cursor: "pointer" }, background: theme => theme.palette.mode === "light" ? "" : theme.palette.background.modal }}>
                      <Box sx={{ display: "flex", alignItems: "center", py: 1.5, px: 2 }}>
                        <MemberAvatar name={`${team.name}`} height={34} width={34} />
                        <Typography variant="subtitle1" sx={{ ml: 2, color: theme => theme.palette.primary.secondaryText }}>
                          {team.name}
                        </Typography>
                      </Box>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" , justifyContent: "space-between", mb: 2}} >
              <Typography color={theme => theme.palette.primary.defaultText} variant="h6">
                Assigned Issues
              </Typography>
              <FormControl size="small" sx={{ minWidth: 120, display: "flex", flexDirection: "row", alignItems: "center" , gap: 1 }}>
                <Typography variant="body2" display="block" sx={{ color: theme => theme.palette.primary.defaultText }}>
                  Sort by: 
                </Typography>
                <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <MenuItem value="start_date">Start Date</MenuItem>
                  <MenuItem value="due_date">Due Date</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Divider/>
            {allMonths.length === 0 ? (
              <Typography sx={{ mt: 2, color: theme => theme.palette.mode === "light" ? "" : theme.palette.primary.defaultText }}>No activity yet for this period.</Typography>
            ) : (
              <>
                {visibleMonthsList.map((month) => (
                  <Box key={month} sx={{ mt: 2, mb: 3, position: "relative", pl: 3 }}>
                    <Typography sx={{ mb:1, color: theme => theme.palette.mode === "light" ? "" : theme.palette.primary.defaultText }} variant="h6">{month}</Typography>
                    <Divider sx={{width: "50%", my: 1 }} />                      
                      {groupedIssues[month].map((issue, index) => (
                        <Box key={issue.id} sx={{ display: "flex", alignItems: "center", position: "relative", mb: 2 }}>
                          {index !== 0 && (
                            <Box
                              sx={{                                
                                position: "absolute",
                                left: 24,
                                top: "-18px",
                                width: "1px",
                                height: "16px",
                                bgcolor: "#444444",
                              }}
                            />
                          )}
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: theme => theme.palette.mode === "light" ? "#f1f5f9" : theme.palette.background.modal ,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              zIndex: 1,
                              ml: "8px",
                            }}
                          >
                            <IssueTypeIcon type_name={issue.tracker.name} sx={{ color: "white" }} />
                          </Box>
                          <Typography sx={{ color: theme => theme.palette.mode === "light" ? "" : theme.palette.primary.defaultText, ml: 2 }}>
                            <Box component="span" onClick={() => handleIssue(issue)} sx={{ fontWeight: 500, cursor: "pointer", "&:hover": { color: "#0071E1" } }}> {issue.subject} </Box>
                          </Typography>
                        </Box>
                      ))}
                  </Box>
                ))}
                {hasMore && (
                  <Box sx={{ textAlign: "center", mt: 2 }}>
                    <StyledButton onClick={() => setVisibleMonths((prev) => prev + 2)}>
                      Show More
                    </StyledButton>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>

      <CustomDialog back open={Boolean(state)} onClose={() => setState(null)} >
        {state === "edit_profile" ? <EditInformation onClose={() => setState(null)} user={user} editedUser={editedUser} setEditedUser={setEditedUser} /> : state === "change_pwd" ? <ChangePassword onClose={() => setState(null)} user={user} /> : null }
      </CustomDialog>
    </Container>
  )
}
