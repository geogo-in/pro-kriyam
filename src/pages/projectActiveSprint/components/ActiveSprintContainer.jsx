import { Box } from "@mui/material"
import { useUpdateIssuesMutation } from "@redux/services/issueApi"
import FilterContainer from "pages/projectBacklog/components/FilterContainer"
import { ScrollableGrid } from "pages/shared/Scrollables"
import React from "react"
import { DragDropContext } from "react-beautiful-dnd"
import Column from "./column"

export default function ActiveSprintContainer({ columns, setColumns, filter, setFilter, project_id, sprint }) {
  const [updateTask] = useUpdateIssuesMutation()

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
    <>
      <Box sx={{ margin: "0 2px", borderBottom: "1px solid rgba(229,231,235, 0.5)" }}>
        <FilterContainer {...{ filter, setFilter, project_id }} />
      </Box>
      <ScrollableGrid>
        <DragDropContext onDragEnd={onDragEnd}>
          <Box sx={{ display: "flex" }}>
            {Object.values(columns).map(column => (
              <Box display="flex" key={column.id}>
                <Column column={column} project_id={project_id} sprint_id={sprint.id} />
              </Box>
            ))}
          </Box>
        </DragDropContext>
      </ScrollableGrid>
    </>
  )
}
