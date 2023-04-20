import { Lock } from "@mui/icons-material"
import { Button } from "@mui/material"
import CreateMember from "pages/members/Components/CreateMember"
import Loading from "pages/shared/Loading"
import { SectionTitle } from "pages/shared/SectionTitle"
import { useParams } from "react-router-dom"
import { useGetUserQuery } from "@redux/services/userApi"

export default function Information() {
  const { user_id } = useParams()
  const { data, isLoading, isFetching } = useGetUserQuery(user_id, { refetchOnMountOrArgChange: true })

  if (isLoading || isFetching) return <Loading listing />
  return (
    <div>
      <SectionTitle variant="h6">
        Edit Member: {data.firstname} {data.lastname}
        <Button variant="contained" disableElevation startIcon={<Lock />}>
          Lock
        </Button>
      </SectionTitle>

      <CreateMember user={data} />
    </div>
  )
}
