import AddUserIcon from "@mui/icons-material/PersonAddOutlined"
import { Box, Button } from "@mui/material"
import { styled } from "@mui/material/styles"
import { omitBy } from "lodash"
import CustomDialog from "pages/shared/CustomDialog"
import Loading from "pages/shared/Loading"
import NoData from "pages/shared/NoData"
import { SectionTitle } from "pages/shared/SectionTitle"
import { useState } from "react"
import { useGetUsersQuery } from "@redux/services/userApi"
import { useDebounce } from "use-debounce"
import CreateMember from "./CreateMember"
import MembersListToolbar from "./MembersListToolbar"
import MembersTable from "./MembersTable"

export const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 4,
  backgroundColor: "#F1F5F9",
  paddingLeft: 20,
  paddingRight: 24,
  lineHeight: 2.0,
  color: "#000",
  marginLeft: 8,
}))

const MembersList = () => {
  const [filter, setFilter] = useState({ page: 1 })
  const [debouncedFilter] = useDebounce(filter, 500)

  const { data, isLoading } = useGetUsersQuery({ ...omitBy(debouncedFilter, i => !i) }, { refetchOnMountOrArgChange: true })

  const [state, setState] = useState()
  const handleClose = () => {
    setState()
  }
  const handleDialog = type => () => {
    setState(type)
  }

  if (isLoading) return <Loading listing />
  if (!data) return <NoData />
  return (
    <Box sx={{ mb: 3 }}>
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
      <MembersTable users={data.users} />
    </Box>
  )
}

export default MembersList
