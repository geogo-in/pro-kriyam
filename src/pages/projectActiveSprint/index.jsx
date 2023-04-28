import AddIcon from "@mui/icons-material/Check"
import { Box, Button, Dialog, Grid, LinearProgress, Typography } from "@mui/material"
import { styled } from "@mui/system"
import NoTaskImg from "assets/images/no-task.png"
import { omitBy } from "lodash"
import SprintClose from "pages/projectBacklog/components/SprintClose"
import Loading from "pages/shared/Loading"
import { SectionTitle } from "pages/shared/SectionTitle"
import { OneBox } from "pages/shared/SplitContainer"
import { useEffect, useState } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import { Outlet, useParams } from "react-router-dom"
import { useUpdateIssuesMutation } from "@redux/services/issueApi"
import { useGetProjectByIdQuery } from "@redux/services/projectApi"
import { useGetActiveSprintQuery } from "@redux/services/redmineApi"
import { fDate } from "utils/formatDate"
import FilterContainer from "../projectBacklog/components/FilterContainer"
import PageContainer from "../shared/PageContainer"
import Column from "./components/column"
import { StyledTooltip } from "pages/shared/StyledTooltip"
import {Tooltip} from "@mui/material"

export const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 4,
  backgroundColor: "#F1F5F9",
  paddingLeft: 20,
  paddingRight: 24,
  lineHeight: 2.0,
  color: "#000",
  marginRight: 12,
  marginLeft: 8,
}))

export const ScrollableGrid = styled(Box)(({ theme }) => ({
  height: "calc( 100vh - 182px )",
  width: "100%",
  overflow: "auto",
  paddingTop: 16,
  // },
  "&::-webkit-scrollbar": {
    width: 6,
    height: 16,
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#DFDFDF",
    borderRadius: "1px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
  },
}))

const ProjectSprint = () => {
  const { project_id } = useParams()
  const [columns, setColumns] = useState()
  const [closeSprint, setCloseSprint] = useState(false)
  const [filter, setFilter] = useState({ search: "", status_id: "", priority_id: "", category_id: "", assigned_to_ids: [], author_id: "", tracker_id: "", unassigned_issues: undefined })
  const { data: issues, isLoading, error } = useGetActiveSprintQuery({ project_id, filter: omitBy(filter, i => !i) })
  const { data: project } = useGetProjectByIdQuery(project_id)

  const [updateTask] = useUpdateIssuesMutation()

  useEffect(() => {
    if (issues?.status === "Success") {
      const tasks = issues.issue_status?.map(status => ({ [status.id]: { id: `${status.id}`, title: status.name, list: [...status.issues] } }))
      setColumns(Object.assign({}, ...tasks))
    }
  }, [issues])

  const handleCloseSprint = () => {
    setCloseSprint(!closeSprint)
  }

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
        const draggedItem = start.list[source.index]

        // Move the item within the list
        // Start by making a new list without the dragged item
        var newList = start.list.filter((_, idx) => idx !== source.index)

        // Then insert the item at the right location
        newList.splice(destination.index, 0, start.list[source.index])

        // Then create a new copy of the column object
        const newCol = {
          id: start.id,
          title: start.title,
          list: newList,
        }

        await updateTask({ id: draggedItem.id, status_id: end.id, position: destination.index + 1 }).unwrap
        // Update the state

        setColumns(state => ({ ...state, [newCol.id]: newCol }))
        return null
      } else {
        // get the draggedItems
        const draggedItem = start.list[source.index]

        // If start is different from end, we need to update multiple columns
        // Filter the start list like before
        var newStartList = start.list.filter((_, idx) => idx !== source.index)

        // Create a new start column
        const newStartCol = {
          id: start.id,
          title: start.title,
          list: newStartList,
        }

        // Make a new end list array
        const newEndList = end.list

        // Insert the item into the end list
        newEndList.splice(destination.index, 0, start.list[source.index])

        // Create a new end column
        const newEndCol = {
          id: end.id,
          title: end.title,
          list: newEndList,
        }
        await updateTask({ id: draggedItem.id, status_id: end.id, position: destination.index + 1 }).unwrap
        // Update the state
        setColumns(state => ({ ...state, [newStartCol.id]: newStartCol, [newEndCol.id]: newEndCol }))
        return null
      }
    } catch (r) {
      console.error(r)
      window.alert(r)
    }
  }

  return (
    <PageContainer>
      <Box sx={{ flexDirection: "row", display: "flex" }}>
        <OneBox sx={{ pl: 3, pr: 0, pt: 1, pb: 0 }}>
          <Box sx={{ marginTop: "0px" }} display="flex" flexDirection="column" flex={1} id="backlog-container">
            {project?.project_type?.name === "Scrum" && (
              <SectionTitle variant="h6">
                <Grid container spacing={1}>
                  <Grid item lg={4} sx={{ flexDirection: "row", display: "flex", alignItems: "center" }}>
                    {issues?.status !== "Error" && !isLoading ? (
                        <StyledTooltip title={`Change it to popover: Started at: ${fDate(issues.start_date)} & Due on: ${fDate(issues.end_date)}. ${issues.goals && `Goals: ${issues.goals}`}`}>
                          <span>Active Sprint Board: {issues.name}</span>
                        </StyledTooltip>
                    ) : (
                      <>Active Sprint Board</>
                    )}
                  </Grid>
                  <Grid item lg={4}>
                    {issues?.status !== "Error" && !isLoading && (
                      <LinearProgress />
                    )}
                  </Grid>
                  <Grid item lg={4}>
                    {issues?.status !== "Error" && !isLoading && (
                      <Box sx={{ flexDirection: "row", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                        <StyledButton onClick={handleCloseSprint} disableElevation startIcon={<AddIcon />}>
                          Complete sprint
                        </StyledButton>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </SectionTitle>
            )}
            {issues?.status === "Error" ? (
              <>
                <Box sx={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center", height: "420px", justifyContent: "center" }}>
                  <img src={NoTaskImg} alt="There are no active sprints" width={180} />
                  <Typography variant="h6" sx={{ color: theme => theme.palette.primary.secondaryText }}>
                    {issues.message}
                  </Typography>
                  <Typography variant="body1" gutterBottom sx={{ color: theme => theme.palette.primary.secondaryText }}>
                    Start sprints in the Backlog
                  </Typography>
                </Box>
              </>
            ) : isLoading || !columns ? (
              <Box sx={{ mt: 3 }}>
                <Loading grid height={400} cols={3} />
              </Box>
            ) : error ? (
              "error"
            ) : (
              <>
                <Box sx={{ margin: "0 2px", borderBottom: "1px solid rgba(229,231,235, 0.5)" }}>
                  <FilterContainer {...{ filter, setFilter, project_id }} />
                </Box>
                <ScrollableGrid>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Box sx={{ display: "flex" }}>
                      {Object.values(columns).map(column => (
                        <Box display="flex" key={column.id}>
                          <Column column={column} project_id={project_id} />
                        </Box>
                      ))}
                    </Box>
                  </DragDropContext>
                </ScrollableGrid>
              </>
            )}
          </Box>
        </OneBox>
      </Box>
      <Dialog open={closeSprint} onClose={handleCloseSprint}>
        <SprintClose {...issues} onClose={handleCloseSprint} />
      </Dialog>

      <Outlet />
    </PageContainer>
  )
}

export default ProjectSprint
