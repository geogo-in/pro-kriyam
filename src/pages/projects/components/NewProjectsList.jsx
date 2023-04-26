import AddIcon from "@mui/icons-material/Add"
import { Box, Button } from "@mui/material"
import { styled } from "@mui/material/styles"
import { isAdmin } from "@redux/reducerSlices/user/userAuthSlice"
import { useGetProjectsQuery } from "@redux/services/projectApi"
import { omitBy } from "lodash"
import Loading from "pages/shared/Loading"
import NoData from "pages/shared/NoData"
import { SectionTitle } from "pages/shared/SectionTitle"
import React from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { useDebounce } from "use-debounce"
import ProjectListToolbar from "./ProjectListToolbar"
import ProjectsTable from "./ProjectsTable"

export const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 4,
  backgroundColor: "#F1F5F9",
  paddingLeft: 20,
  paddingRight: 24,
  lineHeight: 2.0,
  color: "#000",
}))

const NewProjectsList = () => {
  const [filter, setFilter] = React.useState({ project_name: "", project_type_id: "" })
  const [debouncedFilter] = useDebounce(filter, 500)
  const { data, isLoading } = useGetProjectsQuery({ ...omitBy(debouncedFilter, i => !i) }, { refetchOnMountOrArgChange: true })
  const Admin = useSelector(isAdmin)

  if (isLoading) return <Loading listing />
  if (!data) return <NoData />
  return (
    <div>
      <SectionTitle variant="h6">
        Projects
        {Admin && (
          <Box>
            <StyledButton sx={{}} startIcon={<AddIcon />} component={Link} to="/account/projects/new">
              Create project
            </StyledButton>
          </Box>
        )}
      </SectionTitle>

      <ProjectListToolbar count={data.projects.length} {...{ filter, setFilter, data }} />
      <ProjectsTable projects={data.projects} />
    </div>
  )
}

export default NewProjectsList
