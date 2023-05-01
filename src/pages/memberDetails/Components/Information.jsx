import { useGetUserQuery } from "@redux/services/userApi"
import CreateMember from "pages/members/Components/CreateMember"
import Loading from "pages/shared/Loading"
import { SectionTitle } from "pages/shared/SectionTitle"
import { useParams } from "react-router-dom"

export default function Information() {
  const { user_id } = useParams()
  const { data, isLoading, isFetching } = useGetUserQuery(user_id, { refetchOnMountOrArgChange: true })

  if (isLoading || isFetching) return <Loading listing />
  return (
    <div>
      <SectionTitle variant="h6">
        Edit Member: {data.firstname} {data.lastname}
      </SectionTitle>

      <CreateMember user={data} />
    </div>
  )
}
