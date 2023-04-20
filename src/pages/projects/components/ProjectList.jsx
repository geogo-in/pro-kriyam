import { LinearProgress } from "@mui/material"
import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableContainer from "@mui/material/TableContainer"
import { omitBy } from "lodash"
import * as React from "react"
import { useGetProjectsQuery } from "@redux/services/projectApi"
import ProjectListHeader from "./ProjectListHeader"
import ProjectListItem from "./ProjectListItem"
import ProjectListToolbar from "./ProjectListToolbar"

export default function ProjectList() {
  const [filter, setFilter] = React.useState({
    //TO-DO: name could be search
    name: "",
    project_type_id: "",
  })
  const { data, isLoading, error } = useGetProjectsQuery({ ...omitBy(filter, i => !i) }, { refetchOnMountOrArgChange: true })

  if (isLoading) return <LinearProgress />
  if (error) return "error"
  return (
    <Box>
      <ProjectListToolbar count={data.projects.length} {...{ filter, setFilter, data }} />

      <TableContainer>
        <Table sx={{ minWidth: 750 }} size={"small"}>
          <ProjectListHeader projects={data.projects} />

          <TableBody>
            {data?.projects?.map((project, index) => (
              <ProjectListItem project={project} key={project.id} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
