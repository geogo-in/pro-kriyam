export function convertToSlug(Text) {
  return Text.toLowerCase()
    .replace(/[^-a-zA-Z0-9\s+]+/gi, "")
    .replace(/\s+/gi, "-")
}
