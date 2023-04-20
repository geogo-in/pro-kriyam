import { CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material"
import createTheme from "@mui/material/styles/createTheme"
import PropTypes from "prop-types"
import { useMemo } from "react"
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
  const isLight = true

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

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
