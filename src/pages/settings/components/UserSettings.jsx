import AddUserIcon from "@mui/icons-material/PersonAddOutlined"
import { Box, Button, Container } from "@mui/material"
import { styled } from "@mui/material/styles"
import { useGetUsersQuery } from "@redux/services/userApi"
import { omitBy } from "lodash"
import CreateMember from "pages/members/Components/CreateMember"
import MembersListToolbar from "pages/members/Components/MembersListToolbar"
import MembersTable from "pages/members/Components/MembersTable"
import CustomDialog from "pages/shared/CustomDialog"
import Loading from "pages/shared/Loading"
import NoData from "pages/shared/NoData"
import { SectionTitle } from "pages/shared/SectionTitle"
import { useState } from "react"
import { useDebounce } from "use-debounce"

export const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 4,
  backgroundColor: theme.palette.mode === "light" ? "#F1F5F9" : "#0071E1",
  paddingLeft: 20,
  paddingRight: 24,
  lineHeight: 2.0,
  color: theme.palette.mode === "light" ? "#000" : "#fff",
  marginLeft: 8,
  ":hover": {
    backgroundColor: theme.palette.mode === "light" ? "" : theme.palette.primary.main,
  }
}))

export default function UserSettings({  }) {

  const [filter, setFilter] = useState({ page: 1 })
  const [debouncedFilter] = useDebounce(filter, 500)

  const { data, isLoading } = useGetUsersQuery({ ...omitBy(debouncedFilter, i => !i) }, { refetchOnMountOrArgChange: true })
  const { data: registeredUsers, isLoading: isLoadingRegisteredUsers } = useGetUsersQuery({ ...omitBy(debouncedFilter, i => !i), status: 2 }, { refetchOnMountOrArgChange: true })
  const { data: lockedUsers, isLoading: isLoadingLockedUsers } = useGetUsersQuery({ ...omitBy(debouncedFilter, i => !i), status: 3 }, { refetchOnMountOrArgChange: true })
  const loading = isLoading || isLoadingLockedUsers || isLoadingRegisteredUsers
  const [state, setState] = useState()
  const handleClose = () => {
    setState()
  }
  const handleDialog = type => () => {
    setState(type)
  }

  if (loading) return <div style={{ padding: '30px' }}> <Loading listing /></div>
  if (!data && !registeredUsers && !lockedUsers) return <NoData />

  return (
    <Container component={Box} sx={{minHeight: `calc( 100vh - 64px )`, display: "flex", flexDirection: "column", width: "100%" }}>
      <Box sx={ theme => ({ px: 3, py: 2, display: "flex", flexDirection: "column", flex: 1, width: "calc( 100% - 320px )", [theme.breakpoints.down("lg")]: { width: "100%" } })}>
        <SectionTitle variant="h6">
          Members
          <Box display={"flex"}>
            <StyledButton startIcon={<AddUserIcon />} onClick={handleDialog("people")}>
              Add new member
            </StyledButton>
          </Box>
        </SectionTitle>
        <CustomDialog back open={Boolean(state)} onClose={handleClose}>
          <CreateMember onClose={handleClose} />
        </CustomDialog>
        <MembersListToolbar count={data.users.length} {...{ filter, setFilter, data }} />
        <MembersTable users={data.users} lockedUsers={lockedUsers.users} registeredUsers={registeredUsers.users} />
      </Box>
    </Container>
  )
}