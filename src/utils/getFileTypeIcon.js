export function getFileTypeIcon(content_type) {
  if (content_type && content_type.split("/")[0] === "image") {
    content_type = "image"
  } else if (content_type && content_type.split("/")[0] === "video") {
    content_type = "video"
  } else if (
    (content_type && content_type === "text/plain") ||
    content_type === "application/msword" ||
    content_type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    content_type = "doc"
  }

  switch (content_type) {
    // case "video":
    //   return <img src={require("../assets/images/video.svg").default} alt="image_icon" />
    case "application/pdf":
      return require("../assets/images/pdf.png")
    case "doc":
      return require("../assets/images/doc.png")
    default:
      return require("../assets/images/file.png")
  }
}
