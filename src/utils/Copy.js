import { enqueueSnackbar } from "notistack"

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea")
  textArea.value = text

  // Avoid scrolling to bottom
  textArea.style.top = "0"
  textArea.style.left = "0"
  textArea.style.position = "fixed"

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    var successful = document.execCommand("copy")
    if (!successful) throw new Error()

    enqueueSnackbar("Successfully copied the URL to clipboard", { variant: "success", title: "Copied!" })
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err)
    enqueueSnackbar("Copying to clipboard was failed!", { variant: "error" })
  }

  document.body.removeChild(textArea)
}

export function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text)
    return
  }
  navigator.clipboard.writeText(text).then(
    function () {
      // console.debug("Async: Copying to clipboard was successful!")
      enqueueSnackbar("Successfully copied the URL to clipboard", { variant: "success", title: "Copied!" })
    },
    function (err) {
      console.error("Async: Could not copy text: ", err)
      enqueueSnackbar("Copying to clipboard was failed!", { variant: "error" })
    }
  )
}
