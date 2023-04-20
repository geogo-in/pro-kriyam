import { Add } from "@mui/icons-material"
import { Button, List, Typography } from "@mui/material"
import CreateTeam from "pages/members/Components/CreateTeam"
import CustomDialog from "pages/shared/CustomDialog"
import Loading from "pages/shared/Loading"
import { SectionTitle } from "pages/shared/SectionTitle"
import { useState } from "react"
import { Navigate, useParams } from "react-router-dom"
import { useGetGroupQuery } from "@redux/services/userApi"
import { getErrorMessage } from "utils/helper"
import User from "./User"

export default function Information() {
  const { team_id } = useParams()
  const { data, error, isLoading } = useGetGroupQuery(team_id)
  const [open, setOpen] = useState(false)

  function handleDialog() {
    setOpen(!open)
  }

  if (isLoading) return <Loading listing />
  if (error) return <Navigate to="/404" replace state={{ status: error.status, message: getErrorMessage(error.data) }} />
  return (
    <div>
      <SectionTitle variant="h6">
        Edit Team: {data.name}
        <Button onClick={handleDialog} variant="contained" disableElevation startIcon={<Add />}>
          Add member
        </Button>
      </SectionTitle>

      {data.users.length ? (
        <List>
          {data.users.map(user => (
            <User user={user} team_id={team_id} />
          ))}
        </List>
      ) : (
        <Typography color="text.secondary" pt={2}>
          No member in this team
        </Typography>
      )}

      <CustomDialog back open={open} onClose={handleDialog}>
        <CreateTeam onClose={handleDialog} team={data} />
      </CustomDialog>
    </div>
  )
}
