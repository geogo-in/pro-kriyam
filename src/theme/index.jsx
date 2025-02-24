import { CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material"
import createTheme from "@mui/material/styles/createTheme"
import PropTypes from "prop-types"
import { useEffect, useMemo } from "react"
import { useSelector } from "react-redux"
import breakpoints from "./breakpoints"
import componentsOverride from "./overrides"
import palette from "./palette"
import shadows from "./shadow"
import shape from "./shape"
import typography from "./typography"

ThemeConfig.propTypes = {
  children: PropTypes.node,
}

export default function ThemeConfig({ children }) {
  //for now theme is always in light mode
  const isLight = useSelector((state) => state.theme.isLight);

  const themeOptions = useMemo(
    () => ({
      palette: isLight ? { ...palette.light, mode: "light" } : { ...palette.dark, mode: "dark" },
      typography,
      breakpoints,
      shape,
      shadows: isLight ? shadows.light : shadows.dark,
      // customShadows: isLight ? customShadows.light : customShadows.dark,
    }),
    [isLight]
  )
  
    const theme = createTheme(themeOptions)
    theme.components = componentsOverride(theme)

  const isDarkMode = theme.palette.mode === "light" ? "https://cdn3.devexpress.com/jslib/24.2.5/css/dx.fluent.saas.light.compact.css" : "https://cdn3.devexpress.com/jslib/24.2.5/css/dx.fluent.saas.dark.compact.css"

  useEffect(() => {
    const themeLink = document.getElementById("theme-link")
    if (themeLink) {
      themeLink.href = `${isDarkMode}`
      document.documentElement.style.setProperty("--dx-gantt-border", theme.palette.gantt.defaultBorder)
      document.documentElement.style.setProperty("--dx-gantt-collapsable", theme.palette.gantt.collapsableBg)
      document.documentElement.style.setProperty("--dx-gantt-text", theme.palette.gantt.defaultText)
      document.documentElement.style.setProperty("--dx-gantt-tertiaryText", theme.palette.gantt.tertiaryText)
      document.documentElement.style.setProperty("--dx-gantt-primaryText", theme.palette.gantt.primaryText)
      document.documentElement.style.setProperty("--dx-gantt-selectedBg", theme.palette.gantt.selectedBg)
    }
  }, [isDarkMode])

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
