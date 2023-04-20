export function stringAvatar(name) {
  if (name) {
    const firstName = name.split(" ")[0]
    const lastName = name.split(" ")[1]

    let newName = `${firstName[0]}${lastName ? lastName[0] : ""}`
    return {
      sx: { bgcolor: stringToColor(name), color: "white !important" },
      children: newName,
    }
  } else {
    return {
      sx: { bgcolor: "#b8bec9" },
      children: "UA",
    }
  }
}

function stringToColor(string, saturation = 65, lightness = 40) {
  let stringUniqueHash = [...string].reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)
  return `hsl(${stringUniqueHash % 300}, ${saturation}%, ${lightness}%)`
}
