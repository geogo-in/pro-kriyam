import { DEFAULT_ERROR_MSG } from "../config/constants"

export const getErrorMessage = error => {
  try {
    let message = error.message || DEFAULT_ERROR_MSG
    if (error.response) {
      if (error.response.data) {
        const errors = error.response.data.errors
        if (Array.isArray(errors)) message = errors.map(err => (typeof err === "string" ? err : `${err.rule} : ${err.field}`)).join(", ")
        else if (error.response.data.message?.message) message = error.response.data.message?.message
        else if (error.response.data.message) message = error.response.data.message
      }
    } else if (error.data) {
      const errors = error.data.errors
      if (Array.isArray(errors)) message = errors.map(err => (typeof err === "string" ? err : `${err.rule} : ${err.field}`)).join(", ")
      else if (error.data.message?.message) message = error.data.message?.message
      else if (error.data.message) message = error.data.message
    }
    console.error("Error => ", error.response?.data || error, message)
    return { error: true, message }
  } catch (r) {
    return { error: true, message: DEFAULT_ERROR_MSG }
  }
}

export const issueDeleteMessages = [
  `Done and dusted! We've given the issue the old 'Ctrl-Alt-Delete' and it's officially outta here!`,
  `The problem has been vanquished from existence! It's like we hit the "delete" button so hard, even its ancestors feel it.`,
  `We've sent that issue on a one-way trip to the digital afterlife! Rest in peace, problem.`,
  `We've just pulled off the digital version of a magic trick - the issue has disappeared into thin air! Poof!`,
  `We've given the problem a one-way ticket to the digital afterlife. Rest in peace, issue.`,
]
export const getRandomMessage = array => array[Math.floor(Math.random() * array.length)]
