import AddIcon from "@mui/icons-material/GroupAddOutlined"
import AddUserIcon from "@mui/icons-material/PersonAddOutlined"
import { Box, Button } from "@mui/material"
import CustomDialog from "pages/shared/CustomDialog"
import PageHeader from "pages/shared/PageHeader"
import { useState } from "react"
import CreateMember from "./CreateMember"
import CreateTeam from "./CreateTeam"

export default function MembersHeaders() {
  const breadcrumbs = [{ linkTo: "/account", linkText: "Dashboard" }]
  const [state, setState] = useState()
  const handleClose = () => {
    setState()
  }
  const handleDialog = type => () => {
    setState(type)
  }
  return (
    <>
      <PageHeader pageTitle="Members" breadcrumbs={breadcrumbs}>
        <Box>
          <Button sx={{ color: theme => theme.palette.primary.defaultText, borderRadius: "4px", paddingLeft: 2, paddingRight: 2 }} startIcon={<AddIcon />} onClick={handleDialog("team")}>
            Create a team
          </Button>
          <Button
            sx={{ color: theme => theme.palette.primary.defaultText, borderRadius: "4px", paddingLeft: 2, paddingRight: 2 }}
            startIcon={<AddUserIcon />}
            onClick={handleDialog("people")}>
            Add new member
          </Button>
          {/* 
          <PrimaryRoundButton disableElevation startIcon={<Add />} onClick={handleDialog("people")}>
            Add People
          </PrimaryRoundButton> */}
        </Box>
      </PageHeader>

      <CustomDialog back open={Boolean(state)} onClose={handleClose}>
        {state === "people" ? <CreateMember onClose={handleClose} /> : state === "team" && <CreateTeam onClose={handleClose} />}
      </CustomDialog>
    </>
  )
}
