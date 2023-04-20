import moment from "moment"

export function fDate(date, f = "DD/MM/YYYY") {
  try {
    return moment(date).format(f)
  } catch (r) {
    return ""
  }
}

export function fDateTime(date) {
  return moment(date).format("DD/MM/YYYY @ HH:mma")
}

// export function fTimestamp(date) {
//   return getTime(new Date(date))
// }

// export function fDateTimeSuffix(date) {
//   return moment(date).format("dd/MM/yyyy hh:mm p")
// }

// export function fToNow(date) {
//   return formatDistanceToNow(new Date(date), {
//     addSuffix: true,
//   })
// }
