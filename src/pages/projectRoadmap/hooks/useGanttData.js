import moment from "moment"
import { useEffect, useState } from "react"

export function useGanttData(data) {
  const [tasks, setTasks] = useState([])
  const [resources, setResources] = useState([])
  const [resourceAssignments, setResourceAssignments] = useState([])
  const [dependencies, setDependencies] = useState([])

  useEffect(() => {
    if (data?.issues) {
      const tasks = data.issues
        .map(issue => ({
          id: issue.id,
          status: issue.status.id,
          title: issue.subject,
          start: new Date(moment(issue.start_date).startOf("days")),
          end: new Date(moment(issue.due_date).endOf("days")),
          assigneeId: issue.assigned_to?.id || null,
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
            .map(issue =>
              issue.relations.map(relation => ({
                id: relation.id,
                predecessorId: relation.issue_id,
                successorId: relation.issue_to_id,
                type: relation.relation_type === "precedes" ? 0 : relation.relation_type === "follows" ? 3 : 1,
              }))
            )
            .flat()
            .map(JSON.stringify)
        )
      ).map(JSON.parse)
      setDependencies(JSON.parse(JSON.stringify(dependencies)))
    }
  }, [data])

  return { tasks, resources, resourceAssignments, dependencies }
}
