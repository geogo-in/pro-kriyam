export function getIssueStatusColor(status) {
  if (status?.color_code) return status?.color_code

  switch (status?.name.toLocaleLowerCase()) {
    case "new":
      return "#ffeb3b"
    case "in progress":
      return "#b3e5fc"
    case "developed":
      return "#f8bbd0"
    case "deployed":
      return "#a7ffeb"
    case "feedback":
      return "#ffe0b2"
    case "resolved":
      return "#0f0"
    case "closed":
      return "#f00"
    case "rejected":
      return "#ffcdd2"
    case "process":
      return "#0f0"
    case "done":
      return "#c6ff00"
    default:
      return ""
  }
}
