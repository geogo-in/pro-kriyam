import { Box, Stack } from "@mui/material"
import { styled } from "@mui/system"
import { setWindowWidth } from "@redux/reducerSlices/ui/projectUiSlice"
import { useAddTaskToSprintOrBacklogMutation, useGetBacklogDetailsQuery } from "@redux/services/redmineApi"
import { omitBy } from "lodash"
import { useSnackbar } from "notistack"
import { useEffect, useState } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import { useDispatch } from "react-redux"
import EpicContainer from "./EpicContainer"
import FilterContainer from "./FilterContainer"
import LoadingSkeleton from "./LoadingSkeleton"
import Sprint from "./Sprint"

export default function BacklogContainer({ project_id, ...props }) {
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const [filter, setFilter] = useState({ search: "", status_id: "", priority_id: "", category_id: "", assigned_to_ids: [], author_id: "", tracker_id: "", unassigned_issues: undefined })
  const { data: backlog, isLoading } = useGetBacklogDetailsQuery({ project_id, filter: omitBy(filter, i => !i) })
  const [updateTask] = useAddTaskToSprintOrBacklogMutation()
  const [columns, setColumns] = useState({})
  const [activeSprint, setActiveSprint] = useState()

  useEffect(() => {
    const { innerWidth } = window
    dispatch(setWindowWidth(innerWidth))
    function handleWindowResize() {
      const { innerWidth: width } = window
      dispatch(setWindowWidth(width))
    }
    window.addEventListener("resize", handleWindowResize)
    return () => {
      window.removeEventListener("resize", handleWindowResize)
    }
  }, [dispatch])

  useEffect(() => {
    if (backlog) {
      let _activeSprint = null
      const sprints = backlog.map(sprint => {
        if (sprint.aasm_state === "running") _activeSprint = { ...sprint, id: sprint.id.toString() }

        return {
          [`${sprint.id}`]: { ...sprint, id: sprint.id.toString() },
        }
      })
      setActiveSprint(_activeSprint)
      setColumns(s => ({ ...Object.assign({}, ...sprints) }))
    }
  }, [backlog])

  const handleFilter = e => {
    setFilter({ ...filter, [e.target.name]: e.target.value })
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
        const draggedItem = start.issues[source.index]
        console.debug({ draggedItem })

        // Move the item within the list
        // Start by making a new list without the dragged item
        var newList = start.issues.filter((_, idx) => idx !== source.index)

        // Then insert the item at the right location
        newList.splice(destination.index, 0, start.issues[source.index])

        // Then create a new copy of the column object
        const newCol = { ...start, issues: newList }

        // update order in server
        // await updateTask({ id: draggedItem.id, position: destination.index + 1 }).unwrap

        // Update the state
        setColumns(state => ({ ...state, [newCol.id]: newCol }))
        return null
      } else {
        // get the draggedItems
        const draggedItem = start.issues[source.index]
        console.debug({ draggedItem })

        // If start is different from end, we need to update multiple columns
        // Filter the start list like before
        var newStartList = start.issues.filter((_, idx) => idx !== source.index)

        // Create a new start column
        const newStartCol = { ...start, issues: newStartList }

        // Make a new end list array
        let newEndList = JSON.parse(JSON.stringify(end.issues))

        // Insert the item into the end list
        newEndList.splice(destination.index, 0, start.issues[source.index])

        // Create a new end column
        const newEndCol = { ...end, issues: newEndList }

        await updateTask({ project_id: project_id, issue_id: draggedItem.id, sprint_id: end.id, position: destination.index + 1 }).unwrap

        // Update the state
        setColumns(state => ({ ...state, [newStartCol.id]: newStartCol, [newEndCol.id]: newEndCol }))
        return null
      }
    } catch (r) {
      console.error(r)
      enqueueSnackbar("Something went wrong. Please try again.", { variant: "error" })
    }
  }

  return (
    <>
      <Box sx={{ margin: "0 2px", borderBottom: "1px solid rgba(229,231,235, 0.5)" }}>
        <FilterContainer {...{ filter, setFilter, project_id }} />
      </Box>
      <Stack direction="row" flex={1}>
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <EpicContainer project_id={project_id} onFilter={handleFilter} category_id={filter.category_id} />

            <DragDropContext onDragEnd={onDragEnd}>
              <BacklogScrollableGrid direction="column">
                {Object.values(columns).map(sprint => {
                  if (sprint.aasm_state === "running" || sprint.aasm_state === "planned" || sprint.id === "backlog")
                    return <Sprint key={sprint.id} {...{ sprint, activeSprint }} project_id={project_id} filter={filter} />
                  return ""
                })}
              </BacklogScrollableGrid>
            </DragDropContext>
          </>
        )}
      </Stack>
    </>
  )
}

const BacklogScrollableGrid = styled(Stack)(({ theme }) => ({
  height: "calc( 100vh - 182px )",
  marginTop: 0,
  paddingTop: 12,
  overflow: "auto",
  outlineOffset: "-2px",
  position: "relative",
  width: "100%",
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
