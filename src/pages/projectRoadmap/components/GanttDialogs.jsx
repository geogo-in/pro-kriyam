import CreateIssue from "pages/projectIssues/components/CreateIssue"
import CustomDialog from "pages/shared/CustomDialog"
import IssueDetails from "../../projectIssues/components/IssueDetails"

export default function GanttDialogs({ open, onClose, openNewTaskForm, openTaskDetails, selectedTaskId, project_id, parentIssueId }) {
  return (
    <CustomDialog open={open} onClose={onClose}>
      {openNewTaskForm && <CreateIssue onClose={onClose} parent_issue_id={parentIssueId} project_id={project_id} />}
      {openTaskDetails && <IssueDetails onClose={onClose} referrer="roadmap" issue_id={selectedTaskId} project_id={project_id} />}
    </CustomDialog>
  )
}
