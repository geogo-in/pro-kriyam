import MemberAvatar from "pages/shared/MemberAvatar"
import React from "react"
import { getIssueStatusColor } from "utils/getIssueStatusColor"

function getTaskColor(taskId) {
  const color = taskId % 6
  return ``
}
export default function TaskTemplate({ taskData, taskSize, taskResources }) {
  // console.log(taskResources[0])
  let bgColor = "#FFF"
  if (taskResources[0] !== undefined && taskResources[0] !== null) {
    // console.log(taskResources[0]?.color)
    bgColor = getIssueStatusColor({ name: taskResources[0]?.color })
  }

  return (
    <div className={`dx-gantt-custom-task ${getTaskColor(taskData.id)}`} style={{ width: `${taskSize.width}px`, backgroundColor: bgColor, color: "#42526E" }}>
      <div className="dx-gantt-custom-task-img-wrapper">
        <MemberAvatar height={28} width={28} name={taskResources[0]?.text} tooltipPosition="right" />
      </div>
      <div className="dx-gantt-custom-task-wrapper">
        <div className="dx-gantt-custom-task-title">{taskData.title}</div>
        <div className="dx-gantt-custom-task-row">{taskResources[0]?.text}</div>
      </div>
      <div className="dx-gantt-custom-task-progress" style={{ width: `${taskData.progress}%` }}></div>
    </div>
  )
}
