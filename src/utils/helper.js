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
      else if (typeof error.data.error === "string") message = error.data.error
    }
    console.error("Error => ", error.response?.data || error, message)
    return { error: true, message }
  } catch (r) {
    return { error: true, message: DEFAULT_ERROR_MSG }
  }
}

export const issueDeleteMessages = [
  `Issue deleted.`,
  `Issue sent to the digital afterlife.`,
  `Problem vanquished!`,
  `Issue on a one-way trip to the digital afterlife.`,
  `Issue disappeared into thin air!`,
  `Problem sent to the digital afterlife.`,
]
export const getRandomMessage = array => array[Math.floor(Math.random() * array.length)]
