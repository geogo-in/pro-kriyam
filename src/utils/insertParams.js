export function insertParam(url, value, key = "key") {
  try {
    var newUrl = new URL(url)
    newUrl.searchParams.append(key, value)
    return newUrl.href
  } catch (error) {
    console.error(error)
    return url
  }
}
