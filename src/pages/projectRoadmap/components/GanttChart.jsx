import AddIcon from "@mui/icons-material/Add"
import LinearProgress from "@mui/material/LinearProgress"
import { getCurrentUser, isAdmin } from "@redux/reducerSlices/user/userAuthSlice"
import { useCreateIssueRelationMutation, useDeleteIssueMutation, useDeleteIssueRelationMutation, useGetIssuesQuery, useUpdateIssuesMutation } from "@redux/services/issueApi"
import { useGetProjectByIdQuery } from "@redux/services/projectApi"
import "devexpress-gantt/dist/dx-gantt.min.css"
import Gantt, { Column, Dependencies, Editing, Item, ResourceAssignments, Resources, Sorting, StripLine, Tasks, Toolbar, Validation } from "devextreme-react/gantt"
import "devextreme/dist/css/dx.common.css"
import "devextreme/dist/css/dx.light.css"
import moment from "moment"
import { useSnackbar } from "notistack"
import CreateIssue from "pages/projectIssues/components/CreateIssue"
import CustomDialog from "pages/shared/CustomDialog"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { PATH_DASHBOARD } from "routes/paths"
import { getErrorMessage, getRandomMessage, issueDeleteMessages } from "utils/helper"
import { StyledPrimaryButton, StyledSimpleButton, StyledTextButton } from "./StyledButtons"

const currentDate = new Date()

export default function GanttChart({ projectId: project_id }) {
  const { data: project, isLoading: projectLoading } = useGetProjectByIdQuery(project_id)
  const { data, isLoading, error } = useGetIssuesQuery({ project_id: project?.id, include: "relations" }, { refetchOnMountOrArgChange: true, skip: !project?.id })
  const [updateTask] = useUpdateIssuesMutation()
  const [createIssueRelation] = useCreateIssueRelationMutation()
  const [deleteIssueRelation] = useDeleteIssueRelationMutation()
  const [deleteIssue, { isLoading: isDeletingIssue }] = useDeleteIssueMutation()
  const { enqueueSnackbar } = useSnackbar()
  const isSystemAdmin = useSelector(isAdmin)
  const currentUser = useSelector(getCurrentUser)

  const [tasks, setTasks] = useState()
  const [resources, setResources] = useState()
  const [resourceAssignments, setResourceAssignments] = useState()
  const [dependencies, setDependencies] = useState()
  const ganttRef = useRef()

  const [scaleType, setScaleType] = useState("weeks")
  // "auto" | "minutes" | "hours" | "days" | "weeks" | "months" | "quarters" | "years"
  const [openNewTaskDialog, setOpenNewTaskDialog] = useState(false)
  const [parentIssueId, setParentIssueId] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (data?.issues) {
      const tasks = data.issues
        .map(issue => ({
          id: issue.id,
          status: issue.status.id,
          title: issue.subject,
          start: new Date(moment(issue.start_date).startOf("days")),
          end: new Date(moment(issue.due_date).endOf("days")),
          assignee: issue.assigned_to?.name || "unassigned",
          progress: issue.done_ratio || 0,
          parentId: issue.parent?.id,
        }))
        .sort((a, b) => new Date(a.start) - new Date(b.start))
      setTasks(JSON.parse(JSON.stringify(tasks)))

      const resources = data.issues
        .map(issue => ({
          id: issue.assigned_to?.id || "unassigned",
          text: issue.assigned_to?.name || "Unassigned",
          color: issue.status.color_code || issue.status.name,
        }))
        .filter((resource, index, self) => index === self.findIndex(r => r.id === resource.id))
      setResources(JSON.parse(JSON.stringify(resources)))

      const resourceAssignments = data.issues.map(issue => ({
        id: issue.id,
        taskId: issue.id,
        resourceId: issue.assigned_to?.id,
      }))
      setResourceAssignments(JSON.parse(JSON.stringify(resourceAssignments)))

      const dependencies = Array.from(
        new Set(
          data.issues
            .map(issue => {
              return issue.relations.map(relation => {
                return {
                  id: relation.id,
                  predecessorId: relation.issue_id,
                  successorId: relation.issue_to_id,
                  type: relation.relation_type === "precedes" ? 0 : relation.relation_type === "follows" ? 3 : 1,
                }
              })
            })
            .flat()
            .map(JSON.stringify)
        )
      ).map(JSON.parse)
      setDependencies(JSON.parse(JSON.stringify(dependencies)))
    }
  }, [data])

  const _scrollToToday = args => {
    try {
      var date = new Date(moment().subtract(3, "days"))
      setTimeout(() => {
        ganttRef.current.instance.scrollToDate(date)
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
    console.log("Task update triggered")
    if (e.newValues)
      await updateTask({
        id: e.key,
        start_date: e.newValues.start ? moment(e.newValues.start).format("YYYY-MM-DD") : undefined,
        due_date: e.newValues.end ? moment(e.newValues.end).format("YYYY-MM-DD") : undefined,
        done_ratio: e.newValues?.progress,
      }).unwrap()
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
        e.cancel = true
      }
    }
  }

  const onDependencyDeleting = async e => {
    try {
      await deleteIssueRelation(e.values.id).unwrap()
    } catch (error) {
      e.cancel
    }
  }

  if (projectLoading || isLoading) return <LinearProgress />
  if (error) return "error"
  return (
    <>
      <Gantt
        onTaskDblClick={onTaskDblClick}
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
        {/* <ContextMenu enabled={true} /> */}
        <Dependencies dataSource={dependencies} />
        <Sorting mode="multiple" showSortIndexes={true} ascendingText="Ascending Order" descendingText="Descending Order" clearText="Clear Sort" />
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
        <Column dataField="start" sortIndex={0} sortOrder="asc" caption="Start Date" customizeText={({ value }) => moment(value).format("DD/MM/YYYY")} />
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
