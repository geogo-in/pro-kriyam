// SETUP COLORS

// Primary of Blue color ->
const PRIMARY = {
  lightest: "#f1f5f9",
  light: "#63a4ff",
  main: "#2563EB",
  medium: "#1A73E8",
  dark: "#1967D2",
  defaultText: "#3e4954",
  secondaryText: "#646d76",
  tertiaryText: "#777f87",
  mutedText: "#7b949f",
  contrastText: "#ffffff",
}

// const PRIMARY = {
//   light: "#8F68DC",
//   main: "#5E21D8",
//   dark: "#3C148B",
//   defaultText: "#3e4954",
//   // secondaryText: "#6D7175",
//   secondaryText: "#646d76",
//   // tertiaryText: "#80868B",
//   tertiaryText: "#777f87",
//   mutedText: "#DADCE0",
//   contrastText: "#ffffff",
// }
const SECONDARY = {
  main: "#F5C23E",
  // light: "#ffc947",
  // dark: "#c66900",
  contrastText: "#ffffff",
}
const COMMON = {
  primary: { ...PRIMARY },
  secondary: { ...SECONDARY },
}

const palette = {
  light: {
    ...COMMON,
    // background: { default: "#F8FAFF" },
  },
  dark: {
    ...COMMON,
  },
}

export default palette
