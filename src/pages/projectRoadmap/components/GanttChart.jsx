import Button from "@mui/material/Button"
import LinearProgress from "@mui/material/LinearProgress"
import { useGetIssuesQuery, useUpdateIssuesMutation } from "@redux/services/issueApi"
import { useGetProjectByIdQuery } from "@redux/services/projectApi"
import "devexpress-gantt/dist/dx-gantt.min.css"
import Gantt, { Column, ContextMenu, Editing, Item, StripLine, Tasks, Toolbar, Validation } from "devextreme-react/gantt"
import "devextreme/dist/css/dx.common.css"
import "devextreme/dist/css/dx.light.css"
import moment from "moment"
import CustomMenu from "pages/shared/CustomMenu"
import { useEffect, useRef, useState } from "react"
import TaskDetail from "./TaskDetail"

const currentDate = new Date()

export default function GanttChart({ projectId: project_id }) {
  const { data: project, isLoading: projectLoading } = useGetProjectByIdQuery(project_id)
  const { data, isLoading, error } = useGetIssuesQuery({ project_id: project?.id }, { refetchOnMountOrArgChange: true, skip: !project?.id })
  const [updateTask] = useUpdateIssuesMutation()
  const [tasks, setTasks] = useState()
  const ganttRef = useRef()

  const [scaleType, setScaleType] = useState("weeks")
  // "auto" | "minutes" | "hours" | "days" | "weeks" | "months" | "quarters" | "years"

  const [openAddDialog, setOpenAddDialog] = useState(null)
  const [openEditDialog, setOpenEditDialog] = useState()

  const handleDialogClose = () => {
    setOpenAddDialog(null)
    setOpenEditDialog()
  }
  const handleAddDialogOpen = e => {
    setOpenAddDialog(e.target)
  }

  useEffect(() => {
    if (data?.issues) {
      const tasks = data.issues.map(issue => ({
        id: issue.id,
        status: issue.status.id,
        title: issue.subject,
        start: new Date(moment(issue.start_date).startOf("days")),
        end: new Date(moment(issue.due_date).endOf("days")),
        progress: issue.done_ratio || 0,
        parentId: issue.parent?.id,
      }))
      setTasks(JSON.parse(JSON.stringify(tasks)))
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

  const onTaskUpdating = async e => {
    // e.cancel = true
    if (e.newValues)
      await updateTask({
        id: e.key,
        start_date: e.newValues.start ? moment(e.newValues.start).format("YYYY-MM-DD") : undefined,
        due_date: e.newValues.end ? moment(e.newValues.end).format("YYYY-MM-DD") : undefined,
        done_ratio: e.newValues?.progress,
      }).unwrap()
  }
  const onTaskDblClick = e => {
    e.cancel = true
    setOpenAddDialog(e.element)
    setOpenEditDialog(e.data)
  }
  if (projectLoading || isLoading) return <LinearProgress />
  if (error) return "error"

  console.log(tasks)
  return (
    <>
      <Gantt
        onTaskDblClick={onTaskDblClick}
        onTaskUpdating={onTaskUpdating}
        onContentReady={_scrollToToday}
        scaleType={scaleType}
        ref={ganttRef}
        taskListWidth={450}
        height={"calc(100vh - 128px)"}>
        <Tasks dataSource={tasks} />
        <StripLine start={currentDate} title="Today" />
        <ContextMenu enabled={false} />
        <Toolbar>
          <Item
            widget="dxButton"
            render={() => (
              <Button size="small" aria-haspopup="true" aria-expanded={openAddDialog ? "true" : undefined} disableElevation variant="contained" color="primary" onClick={handleAddDialogOpen}>
                Add Task
              </Button>
            )}
          />

          <Item name="separator" />
          <Item name="collapseAll" />
          <Item name="expandAll" />
          <Item name="separator" />
          <Item name="zoomIn" />
          <Item name="zoomOut" />
          <Item
            widget="dxButton"
            location={"after"}
            render={() => (
              <Button size="small" variant={scaleType === "weeks" ? "contained" : "text"} style={{ boxShadow: "none" }} onClick={() => setScaleType("weeks")}>
                Weeks
              </Button>
            )}
          />
          <Item
            widget="dxButton"
            location={"after"}
            render={() => (
              <Button size="small" variant={scaleType === "months" ? "contained" : "text"} style={{ boxShadow: "none" }} onClick={() => setScaleType("months")}>
                Months
              </Button>
            )}
          />
          <Item
            widget="dxButton"
            location={"after"}
            render={() => (
              <Button size="small" variant={scaleType === "years" ? "contained" : "text"} style={{ boxShadow: "none" }} onClick={() => setScaleType("years")}>
                Years
              </Button>
            )}
          />
        </Toolbar>
        <Column dataField="title" caption="Subject" width={250} />
        <Column dataField="start" caption="Start Date" />
        <Column dataField="end" caption="End Date" />
        <Validation autoUpdateParentTasks={true} />
        <Editing
          enabled={true}
          allowDependencyAdding={false}
          allowDependencyDeleting={false}
          allowResourceAdding={false}
          allowResourceDeleting={false}
          allowTaskAdding={false}
          allowTaskDeleting={false}
          allowTaskResourceUpdating={false}
          allowTaskUpdating={true}
        />
      </Gantt>

      <CustomMenu anchorEl={openAddDialog} open={Boolean(openAddDialog) || Boolean(openEditDialog)} onClose={handleDialogClose}>
        <TaskDetail onClose={handleDialogClose} project_id={project_id} editable={Boolean(openEditDialog)} task={openEditDialog} />
      </CustomMenu>
    </>
  )
}
