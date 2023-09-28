import { Stack } from "@mui/material"
import Box from "@mui/material/Box"
import { useGetProjectIssuesStatusesQuery } from "@redux/services/issueApi"
import { useGetProjectMembershipsQuery } from "@redux/services/projectApi"
import { useDraggableInPortal } from "hooks/draggableInPortal"
import { StrictModeDroppable } from "pages/shared/StrictModeDroppable"
import { Draggable } from "react-beautiful-dnd"
import { useSelector } from "react-redux"
import SprintCreateIssue from "./SprintCreateIssue"
import SprintHeader from "./SprintHeader"
import SprintIssue from "./SprintIssue"

export default function Sprint({ sprint, activeSprint, project_id, filter }) {
  const { data: statuses } = useGetProjectIssuesStatusesQuery(project_id)
  const { data: memberships } = useGetProjectMembershipsQuery(project_id)
  const backlogEpicWidth = useSelector(state => state.projectUi.backlogEpicWidth)
  const backlogContainerWidth = useSelector(state => state.projectUi.backlogContainerWidth)
  const backlogTableWidth = useSelector(state => state.projectUi.backlogTableWidth)

  const renderDraggable = useDraggableInPortal()
  const params = {
    project_memberships: memberships,
    project_statuses: statuses,
    sprint_id: sprint.id,
    project_id,
  }
  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",

    // change background colour if dragging
    width: isDragging ? "calc(100vw - 100px)" : "",
    overflow: isDragging ? "hidden" : "",
    // styles we need to apply on draggables
    ...draggableStyle,
  })
  const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "#F8FAFF" : "",
  })

  let actionbarWidth = backlogContainerWidth
  let dummybarWidth = backlogTableWidth > backlogContainerWidth ? backlogTableWidth - backlogContainerWidth + 1 : 0

  return (
    <Box id={`sprint-${sprint.id}`} mb={2}>
      <Stack direction="column">
        <SprintHeader {...sprint} {...{ activeSprint, project_id, backlogEpicWidth }} />
        <StrictModeDroppable droppableId={sprint.id}>
          {(provided, snapshot) => (
            <Box ref={provided.innerRef} minHeight={40} style={getListStyle(snapshot.isDraggingOver)}>
              {sprint.issues.length > 0 ? (
                <>
                  {sprint.issues?.map((itemObject, index) => (
                    <Draggable draggableId={`${itemObject.id}`} key={`${itemObject.id}`} index={index}>
                      {renderDraggable((provided, snapshot) => (
                        <Box
                          py="0"
                          key={`${itemObject.id}`}
                          role={undefined}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
                          <SprintIssue {...itemObject} dragHandleProps={provided.dragHandleProps} draggableProps={provided.draggableProps} {...params}>
                            {itemObject.child &&
                              itemObject.child.map(child => (
                                <Box py="0" key={child.id}>
                                  <SprintIssue disabledChildren {...params} {...child} />
                                </Box>
                              ))}
                          </SprintIssue>
                        </Box>
                      ))}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </>
              ) : (
                <>
                  <Stack sx={{ borderRadius: 0, boxShadow: "none", border: "none" }} direction="row" alignItems="center" width="fit-content">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        height: "40px",
                        border: "1px dashed #E5E8EC",
                        borderRadius: 1,
                        fontSize: "0.75rem",
                        color: "#606e86",
                        marginBottom: 1,
                        position: "sticky",
                        left: 0,
                        width: `calc( ${actionbarWidth}px )`,
                      }}>
                      No issue found. Create a new issue or drag and drop existing issues here.
                    </Box>
                    <Box sx={{ width: dummybarWidth }}></Box>
                  </Stack>
                </>
              )}
            </Box>
          )}
        </StrictModeDroppable>
      </Stack>
      <SprintCreateIssue {...{ project_id, sprint_id: sprint.id, backlogEpicWidth, category_id: filter.category_id }} />
    </Box>
  )
}
