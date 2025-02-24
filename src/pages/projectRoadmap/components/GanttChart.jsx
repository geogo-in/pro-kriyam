import AddIcon from "@mui/icons-material/Add"
import LinearProgress from "@mui/material/LinearProgress"
import { getCurrentUser, isAdmin } from "@redux/reducerSlices/user/userAuthSlice"
import {
  useCreateIssueRelationMutation,
  useDeleteIssueMutation,
  useDeleteIssueRelationMutation,
  useGetIssuesQuery,
  useGetProjectIssuesStatusesQuery,
  useUpdateIssuesMutation,
} from "@redux/services/issueApi"
import { useGetProjectByIdQuery, useGetProjectMembershipsQuery } from "@redux/services/projectApi"
import "devexpress-gantt/dist/dx-gantt.min.css"
import Gantt, { Column, ContextMenu, Dependencies, Editing, Item, ResourceAssignments, Resources, Sorting, StripLine, Tasks, Toolbar, Validation } from "devextreme-react/gantt"
// import "devextreme/dist/css/dx.common.css"
import { useTheme } from "@mui/material/styles"
// import "assets/styles/dx.material.dark-modal.css"
// import "devextreme/dist/css/dx.light.css"
import moment from "moment"
import { useSnackbar } from "notistack"
import CreateIssue from "pages/projectIssues/components/CreateIssue"
import CustomDialog from "pages/shared/CustomDialog"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { PATH_DASHBOARD } from "routes/paths"
import { getErrorMessage, getRandomMessage, issueDeleteMessages } from "utils/helper"
import { useGanttData } from "../hooks/useGanttData"; // Custom hook
import { StyledPrimaryButton, StyledSimpleButton, StyledTextButton } from "./StyledButtons"
const currentDate = new Date()

export default function GanttChart({ projectId: project_id }) {
  const { data: project, isLoading: projectLoading } = useGetProjectByIdQuery(project_id)
  const { data, isLoading, error } = useGetIssuesQuery({ project_id: project?.id, include: "relations" }, { refetchOnMountOrArgChange: true, skip: !project?.id })
  const [updateTask] = useUpdateIssuesMutation()
  const [createIssueRelation] = useCreateIssueRelationMutation()
  const [deleteIssueRelation] = useDeleteIssueRelationMutation()
  const [deleteIssue, { isLoading: isDeletingIssue }] = useDeleteIssueMutation()
  const isSystemAdmin = useSelector(isAdmin)
  const currentUser = useSelector(getCurrentUser)
  const { data: statuses } = useGetProjectIssuesStatusesQuery(project_id)
  const { data: memberships, isLoading: isMembershipsLoading } = useGetProjectMembershipsQuery(project_id)
  const { tasks, resources, resourceAssignments, dependencies } = useGanttData(data)
  const theme = useTheme()

  const isDarkMode = theme.palette.mode === "light" ? "https://cdn3.devexpress.com/jslib/24.2.5/css/dx.fluent.saas.light.compact.css" : "https://cdn3.devexpress.com/jslib/24.2.5/css/dx.fluent.saas.dark.compact.css"

  useEffect(() => {
    const themeLink = document.getElementById("theme-link")
    if (themeLink) {
      themeLink.href = `${isDarkMode}`
      document.documentElement.style.setProperty("--dx-gantt-border", theme.palette.gantt.defaultBorder)
      document.documentElement.style.setProperty("--dx-gantt-collapsable", theme.palette.gantt.collapsableBg)
      document.documentElement.style.setProperty("--dx-gantt-text", theme.palette.gantt.defaultText)
      document.documentElement.style.setProperty("--dx-gantt-tertiaryText", theme.palette.gantt.tertiaryText)
      document.documentElement.style.setProperty("--dx-gantt-primaryText", theme.palette.gantt.primaryText)
      document.documentElement.style.setProperty("--dx-gantt-selectedBg", theme.palette.gantt.selectedBg)
    }
  }, [isDarkMode])

  const [scaleType, setScaleType] = useState("weeks") // "auto" | "minutes" | "hours" | "days" | "weeks" | "months" | "quarters" | "years"
  const [openNewTaskDialog, setOpenNewTaskDialog] = useState(false)
  const [parentIssueId, setParentIssueId] = useState(null)
  const [selectedTask, setSelectedTask] = useState({
    id: null,
    statusId: null,
    assigneeId: null,
  })

  const ganttRef = useRef()
  const { enqueueSnackbar } = useSnackbar()

  const location = useLocation()
  const navigate = useNavigate()

  const _scrollToToday = args => {
    try {
      var date = new Date(moment())
      setTimeout(() => {
        if (ganttRef.current?.instance) {
          ganttRef.current.instance.scrollToDate(date)
        }
      }, 0)
    } catch (r) {
      console.error(r)
    }
  }

  const handleNewTaskDialogOpen = e => {
    setOpenNewTaskDialog(true)
  }

  const handleNewTaskDialogClose = () => {
    setOpenNewTaskDialog(false)
  }

  const onTaskInserting = e => {
    e.cancel = true
    setParentIssueId(e.values.parentId)
    setOpenNewTaskDialog(true)
  }

  const onTaskDblClick = e => {
    e.cancel = true
    let issuePath = `${PATH_DASHBOARD.projects.root}/${project_id}/roadmap/issues/${e.data.id}?referrer=roadmap`
    navigate(issuePath, { state: { background: location } })
  }

  const onTaskEditDialogShowing = e => {
    e.cancel = true
    let issuePath = `${PATH_DASHBOARD.projects.root}/${project_id}/roadmap/issues/${e.key}?referrer=roadmap`
    navigate(issuePath, { state: { background: location } })
  }

  const onTaskUpdating = async e => {
    // e.cancel = true
    if (e.newValues)
      try {
        await updateTask({
          id: e.key,
          start_date: e.newValues.start ? moment(e.newValues.start).format("YYYY-MM-DD") : undefined,
          due_date: e.newValues.end ? moment(e.newValues.end).format("YYYY-MM-DD") : undefined,
          done_ratio: e.newValues?.progress,
        }).unwrap()
      } catch (error) {
        const { message } = getErrorMessage(error)
        enqueueSnackbar(message, { variant: "error", title: "Oops!" })
        e.cancel = true
      }
  }

  const onTaskDeleting = async e => {
    if (isSystemAdmin || project?.lead?.id === currentUser.id) {
      try {
        await deleteIssue(e.key).unwrap()
        const message = getRandomMessage(issueDeleteMessages)
        enqueueSnackbar(message, { variant: "success", title: "Success!" })
      } catch (error) {
        const { message } = getErrorMessage(error)
        enqueueSnackbar(message, { variant: "error", title: "Oops!" })
      }
    } else {
      enqueueSnackbar("Only admins and project lead can delete issues", { variant: "error", title: "Oops!" })
      e.cancel = true
    }
  }

  const onDependencyInserting = async e => {
    if (e.values.type === 2) {
      console.log("Inserting invalid dependency", e.values.type)
      e.cancel = true
    } else {
      const relation = e.values.type === 0 ? "precedes" : e.values.type === 3 ? "follows" : "relates"
      console.log("Valid dependency", e.values.type, relation)
      try {
        await createIssueRelation({
          id: e.values.predecessorId,
          relation: {
            issue_id: e.values.predecessorId,
            issue_to_id: parseInt(e.values.successorId),
            relation_type: relation,
          },
        }).unwrap()
      } catch (error) {
        const { message } = getErrorMessage(error)
        enqueueSnackbar(message, { variant: "error", title: "Oops!" })
        e.cancel = true
      }
    }
  }

  const onDependencyDeleting = async e => {
    console.log(e)
    try {
      await deleteIssueRelation(e.values.id).unwrap()
    } catch (error) {
      const { message } = getErrorMessage(error)
      enqueueSnackbar(message, { variant: "error", title: "Oops!" })
      e.cancel = true
    }
  }

  const onContextMenuPreparing = e => {
    console.log(e)
    if (e.targetType === "dependency") {
      e.items = [
        {
          commandId: 3,
          text: "Delete Dependency",
          // onItemClick: () => deleteDependency(e.data),
          icon: "dx-gantt-i dx-gantt-i-delete-dependency",
          visible: true,
          disabled: false,
        },
      ]
    } else {
      let task = tasks.find(task => task.id === e.data.id)
      setSelectedTask({ id: task.id, statusId: task.status, assigneeId: task.assigneeId })
    }
  }

  const onCustomCommand = async e => {
    console.log(e)
    const selectedValue = e.name.split("_")
    try {
      let updatePayload = {
        id: selectedTask.id,
      }
      if (selectedValue[0] === "status") {
        updatePayload = { ...updatePayload, status_id: parseInt(selectedValue[1]) }
      } else if (selectedValue[0] === "assignee") {
        updatePayload = { ...updatePayload, assigned_to_id: parseInt(selectedValue[1]) }
      }
      console.log(updatePayload)
      await updateTask(updatePayload).unwrap()
    } catch (r) {
      const { message } = getErrorMessage(r)
      enqueueSnackbar(message, { variant: "error", title: "Oops!" })
    }
  }

  if (projectLoading || isLoading) return <LinearProgress />
  if (error) return "error"
  console.log("Gantt render")

  return (
    <>
      <Gantt
        onTaskDblClick={onTaskDblClick}
        onContextMenuPreparing={onContextMenuPreparing}
        onCustomCommand={onCustomCommand}
        onTaskEditDialogShowing={onTaskEditDialogShowing}
        onTaskUpdating={onTaskUpdating}
        onTaskInserting={onTaskInserting}
        onTaskDeleting={onTaskDeleting}
        onDependencyInserting={onDependencyInserting}
        onDependencyDeleting={onDependencyDeleting}
        onContentReady={_scrollToToday}
        scaleType={scaleType}
        ref={ganttRef}
        taskListWidth={320}
        // taskContentRender={TaskTemplate}
        height={"calc(100vh - 128px)"}>
        <Tasks dataSource={tasks} />
        <StripLine start={currentDate} title="Today" />
        <Dependencies dataSource={dependencies} />
        <Sorting mode="multiple" showSortIndexes={true} ascendingText="Ascending Order" descendingText="Descending Order" clearText="Clear Sort" />
        <ContextMenu enabled={true}>
          <Item name="taskDetails" text="Details" />
          <Item icon="add" text="Add">
            <Item name="addTask" text="Add Task" />
            <Item name="addSubtask" text="Add SubTask" />
          </Item>
          <Item icon="chevronright" text="Status">
            {statuses?.map(status => (
              <Item key={status.id} name={`status_${status.id}`} text={status.name} icon={status.id === selectedTask.statusId ? "check" : undefined} />
            ))}
          </Item>
          <Item icon="user" text="Assignee">
            {memberships?.map(({ user }) => (
              <Item key={`tuser_${user?.id}`} name={`assignee_${user?.id}`} text={user?.name} icon={user?.id === selectedTask.assigneeId ? "check" : undefined} />
            ))}
          </Item>
          <Item name="deleteTask" text="Delete Task" />
        </ContextMenu>
        <Resources dataSource={resources} />
        <ResourceAssignments dataSource={resourceAssignments} />
        <Toolbar>
          <Item
            widget="dxButton"
            render={() => (
              <StyledPrimaryButton
                startIcon={<AddIcon />}
                size="small"
                aria-haspopup="true"
                aria-expanded={openNewTaskDialog ? "true" : undefined}
                disableElevation
                variant="contained"
                onClick={handleNewTaskDialogOpen}>
                New Task
              </StyledPrimaryButton>
            )}
          />

          <Item name="separator" />
          <Item name="collapseAll" />
          <Item name="expandAll" />
          <Item name="separator" />
          <Item name="showResources" />
          <Item name="zoomIn" location={"after"} />
          <Item name="zoomOut" location={"after"} />
          <Item name="separator" location={"after"} />
          <Item
            widget="dxButton"
            location={"after"}
            render={() =>
              scaleType === "weeks" ? (
                <StyledSimpleButton size="small" onClick={() => setScaleType("weeks")}>
                  Weeks
                </StyledSimpleButton>
              ) : (
                <StyledTextButton size="small" onClick={() => setScaleType("weeks")}>
                  Weeks
                </StyledTextButton>
              )
            }
          />
          <Item
            widget="dxButton"
            location={"after"}
            render={() =>
              scaleType === "months" ? (
                <StyledSimpleButton size="small" onClick={() => setScaleType("months")}>
                  Months
                </StyledSimpleButton>
              ) : (
                <StyledTextButton size="small" onClick={() => setScaleType("months")}>
                  Months
                </StyledTextButton>
              )
            }
          />
          <Item
            widget="dxButton"
            location={"after"}
            render={() =>
              scaleType === "years" ? (
                <StyledSimpleButton size="small" onClick={() => setScaleType("years")}>
                  Years
                </StyledSimpleButton>
              ) : (
                <StyledTextButton size="small" onClick={() => setScaleType("years")}>
                  Years
                </StyledTextButton>
              )
            }
          />
        </Toolbar>
        <Column dataField="title" caption="Task Summary" width={315} />
        <Column dataField="start" caption="Start Date" customizeText={({ value }) => moment(value).format("DD/MM/YYYY")} />
        <Column dataField="end" caption="End Date" customizeText={({ value }) => moment(value).format("DD/MM/YYYY")} />
        <Validation autoUpdateParentTasks={true} />
        <Editing
          enabled={true}
          allowDependencyAdding={true}
          allowDependencyDeleting={true}
          allowResourceAdding={false}
          allowResourceDeleting={false}
          allowTaskAdding={true}
          allowTaskUpdating={true}
          allowTaskDeleting={true}
          allowTaskResourceUpdating={false}
        />
      </Gantt>
      <CustomDialog back open={openNewTaskDialog} onClose={handleNewTaskDialogClose}>
        {openNewTaskDialog && <CreateIssue onClose={handleNewTaskDialogClose} parent_issue_id={parentIssueId} project_id={project_id} />}
      </CustomDialog>
    </>
  )
}
