import { Add, Close, Done } from '@mui/icons-material'
import { Box, Container, Divider, MenuItem, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { styled } from "@mui/system"
import { useGetIssuesStatusQuery, useGetIssueTypeQuery } from '@redux/services/issueApi'
import { useDraggableInPortal } from "hooks/draggableInPortal"
import { enqueueSnackbar } from "notistack"
import { StyledButton } from 'pages/projects/components/NewProjectsList'
import CustomDialog from 'pages/shared/CustomDialog'
import Loading from 'pages/shared/Loading'
import { StrictModeDroppable } from "pages/shared/StrictModeDroppable"
import { StyledTableRow, TableHeadCell } from "pages/shared/StyledTable"
import { StyledTab, StyledTabs } from "pages/shared/StyledTabs"
import TabPanel from "pages/shared/TabPanel"
import { useEffect, useState } from "react"
import { DragDropContext, Draggable } from "react-beautiful-dnd"
import AddStatus from './components/AddStatus'
import EditTracker from './components/EditTracker'

export default function Settings() {
  
  const { data: issueStatuses, isLoading } = useGetIssuesStatusQuery()
  const { data: trackers, isLoading: isLoadingIssue } = useGetIssueTypeQuery()
  const [ tab, setTab ] = useState(0)
  const [ columns, setColumns ] = useState({})
  const renderDraggable = useDraggableInPortal()
  const [state, setState] = useState()
  const loading = isLoading || isLoadingIssue

  useEffect(() => {
    setColumns({'issues': issueStatuses})
  },[issueStatuses])
  
  const handleTabChange = (e, newValue) => {
    setTab(newValue)
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
        // get the draggedItems
        const draggedItem = start[source.index]
        console.debug({ draggedItem })

        // Move the item within the list
        // Start by making a new list without the dragged item
        var newList = start.filter((_, idx) => idx !== source.index)

        newList.splice(destination.index, 0, start[source.index])
        
        // await updateTask({ id: draggedItem.id, position: destination.index + 1 }).unwrap
        setColumns({'issues': newList})
        return null
    } catch (r) {
      console.error(r)
      enqueueSnackbar("Something went wrong. Please try again.", { variant: "error" })
    }
  }

  const getListStyle = isDraggingOver => ({
    background: theme => isDraggingOver ? "#F8FAFF" : theme.palette.mode === "light" ? "#f1f5f9" : theme.palette.background.modal ,
  })

  if (loading) return <div style={{ padding: '30px' }}> <Loading listing /></div>

  return (
    <Container component={Box} sx={{minHeight: `calc( 100vh - 64px )`, display: "flex", flexDirection: "column", width: "100%" }}>
      <Box sx={ theme => ({ px: 3, py: 2, display: "flex", flexDirection: "column", flex: 1, width: "calc( 100% - 320px )", [theme.breakpoints.down("lg")]: { width: "100%" } })}>
        <StyledTabs sx={{ mb: 1}} value={tab} onChange={handleTabChange}>
          <StyledTab label="Trackers" value={0} />
          <StyledTab label="Issue Statuses" value={1} />
        </StyledTabs>

        <TabPanel value={tab} index={0}>
          <Box sx={{ display: "flex", flexDirection: "column", width: "100% !important" }} >
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" , justifyContent: "space-between"}}>
              <Typography color={theme => theme.palette.primary.defaultText} variant="h6">
                Trackers
              </Typography>
              <StyledButton startIcon={<Add />} onClick={() => setState("add_tracker")} >
                Add tracker
              </StyledButton>
            </Box>
            <Divider sx={{ mt: 1, mb: 2 }} />
            <TableContainer sx={{ width: "100% !important" }}>
              <Table>
                <TableHead sx={{ backgroundColor: theme => theme.palette.background.modal, borderRadius: 0, borderBottom: "none" }}>
                  <TableRow>
                    <TableHeadCell sx={{ pl: 4 }} >Tracker</TableHeadCell>
                    <TableHeadCell>Description</TableHeadCell>
                    <TableHeadCell>Default Status</TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trackers?.map((tracker) => (
                    <StyledTableRow key={tracker.id} sx={{ background: theme => theme.palette.background.modal, "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell onClick={() => setState(tracker)} component='td' sx={{ pl: 4, py: '5px !important', fontSize: "0.9rem", fontWeight: 500, "&:span": { color: theme => theme.palette.primary.defaultText }, "&:hover": { color: theme => theme.palette.mode === "light" ? "#000" : theme.palette.primary.main } }}>
                        {tracker.name}
                      </TableCell>
                      <TableCell component='td' sx={{ py: '10px !important', }} >
                        {tracker.description}
                      </TableCell>
                      <TableCell component='td' sx={{ py: '10px !important', }}>
                        {tracker.default_status.name}
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <Box sx={{ display: "flex", flexDirection: "column", width: "100% !important" }} >
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" , justifyContent: "space-between"}}>
              <Typography color={theme => theme.palette.primary.defaultText} variant="h6">
                Issue Statuses
              </Typography>
              <StyledButton startIcon={<Add />} onClick={() => setState("add_status")} >
                Add Status
              </StyledButton>
            </Box>
            <Divider sx={{ mt: 1, mb: 2 }} />
            <DragDropContext onDragEnd={onDragEnd}>
              <BacklogScrollableGrid direction="column">
                <TableContainer sx={{ width: "100% !important" }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: theme => theme.palette.background.modal, borderRadius: 0, borderBottom: "none" }}>
                      <TableRow>
                        <TableHeadCell sx={{ pl: 4 }} >Issue Statuses</TableHeadCell>
                        <TableHeadCell sx={{ pl: 4 }} >Final</TableHeadCell>
                      </TableRow>
                    </TableHead>
                    {Object.keys(columns).map((id,ind) => (
                      <StrictModeDroppable droppableId={id}>
                        {(provided, snapshot) => (
                          <TableBody style={getListStyle(snapshot.isDraggingOver)} ref={provided.innerRef}>
                            {columns[id]?.map((status,index) => (
                              <Draggable draggableId={`${status.id}`} key={`${status.id}`} index={index}>
                                {renderDraggable((provided, snapshot) => (
                                  <TableRow ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps} sx={{ ":hover": {cursor: 'default',backgroundColor: theme => theme.palette.mode === "light" ? "rgba(241,245,249, 0.5)" : "#252E38",}, background: theme => theme.palette.mode === "light" ? "#fif5f9" : theme.palette.background.modal, "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell component='td' style={{ width: '50vw'}} sx={{ pl: 4, py: '8px !important', fontSize: "0.9rem", fontWeight: 500, "&:span": { color: theme => theme.palette.primary.defaultText } }}>
                                      {status.name}
                                    </TableCell>
                                    <TableCell component='td' sx={{ py: '8px !important'}}>
                                      <Select sx={{ width: '90px !important', background: theme => theme.palette.mode === "light" ? bgcolor : theme.palette.background.default, ".MuiSelect-select": { padding: "4px 8px 4px 8px !important", display: "flex", alignItems: "center"}, "& fieldset": { borderColor: theme => theme.palette.mode === "light" ? bgcolor : theme.palette.background.default,}, }} value={status.is_closed ? "true" : "false"} >
                                        <MenuItem value={false}><Close fontSize='small' /></MenuItem>
                                        <MenuItem value={true}><Done fontSize='small' /></MenuItem>
                                      </Select>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </TableBody>
                        )}
                      </StrictModeDroppable>
                    ))}
                  </Table>
                </TableContainer>
              </BacklogScrollableGrid>
            </DragDropContext>
          </Box>
        </TabPanel>
      </Box>

      <CustomDialog back open={Boolean(state)} onClose={() => setState(null)} >
        {state === "add_status" ? <AddStatus onClose={() => setState(null)} /> : <EditTracker onClose={() => setState(null)} trackerInfo={state} issueStatuses={issueStatuses} /> }
      </CustomDialog>
    </Container>
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