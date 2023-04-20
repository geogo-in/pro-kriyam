import { Box, Typography } from "@mui/material"
import Loading from "pages/shared/Loading"
import { LineCard as Card } from "pages/shared/StyledCard"
import { useEffect, useState } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import { useParams } from "react-router-dom"
import { useCreateProjectIssueStatusMutation, useGetIssuesStatusQuery, useGetProjectIssuesStatusesQuery, useUpdateProjectIssueStatusMutation } from "@redux/services/issueApi"
import IssueStatusColumn from "./components/IssueStatusColumn"

const ProjectSettingsStatus = () => {
  const { project_id } = useParams()
  const { data: projectIssueStatus, isLoading } = useGetProjectIssuesStatusesQuery(project_id, { skip: false })
  const { data: globalIssueStatus, isLoading: isGISLoading } = useGetIssuesStatusQuery()
  const [columns, setColumns] = useState({ project: [], master: [] })
  const [updateProjectIssueStatusPosition] = useUpdateProjectIssueStatusMutation()
  const [createProjectIssueStatus] = useCreateProjectIssueStatusMutation()

  useEffect(() => {
    setColumns({ project: projectIssueStatus || [], master: globalIssueStatus?.filter(d => !projectIssueStatus?.some(dd => dd.id === d.id)) || [] })
  }, [projectIssueStatus, globalIssueStatus])

  const onDragEnd = async ({ source, destination }) => {
    // Make sure we have a valid destination
    if (destination === undefined || destination === null) return null

    // Make sure we're actually moving the item
    if (source.droppableId === destination.droppableId && destination.index === source.index) return null

    // Set start and end variables
    const start = columns[source.droppableId]
    const end = columns[destination.droppableId]

    try {
      // If start is the same as end, we're in the same column
      if (start === end) {
        // get the draggedItems
        const draggedItem = start[source.index]

        // Move the item within the list
        // Start by making a new list without the dragged item
        var newList = start.filter((_, idx) => idx !== source.index)

        // Then insert the item at the right location
        newList.splice(destination.index, 0, start[source.index])

        // Then create a new copy of the column object

        await updateProjectIssueStatusPosition({ project_id, status_id: draggedItem.id, position: destination.index + 1 }).unwrap

        // Update the state
        setColumns(state => ({ ...state, [source.droppableId]: newList }))
        return null
      } else {
        // get the draggedItems
        const draggedItem = start[source.index]

        // If start is different from end, we need to update multiple columns
        // Filter the start list like before
        var newStartList = start.filter((_, idx) => idx !== source.index)

        // Make a new end list array
        const newEndList = end.slice(0)

        // Insert the item into the end list
        newEndList.splice(destination.index, 0, start[source.index])

        if (destination.droppableId === "master") return
        await createProjectIssueStatus({ project_id, name: draggedItem.name }).unwrap

        setColumns(state => ({ ...state, [source.droppableId]: newStartList, [destination.droppableId]: newEndList }))
        return null
      }
    } catch (r) {
      console.error(r)
    }
  }
  if (isLoading || isGISLoading) return <Loading />
  return (
    <Card sx={{ px: 3, py: 2, mb: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ fontSize: "1rem", color: theme => theme.palette.primary.defaultText }}>
        Project issue statuses
      </Typography>
      <Typography variant="body2" sx={{ color: "primary.defaultText", mb: 1 }}>
        Drag and drop issue statuses from right to left to make it available for this project.
      </Typography>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box display="flex">
          {Object.entries(columns).map(([key, column]) => (
            <Box display="flex" key={key}>
              <IssueStatusColumn id={key} column={column} project_id={project_id} />
            </Box>
          ))}
        </Box>
      </DragDropContext>
    </Card>
  )
}
export default ProjectSettingsStatus
