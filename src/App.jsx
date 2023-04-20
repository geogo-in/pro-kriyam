import Router from "routes"
import ThemeConfig from "theme"
import GlobalStyles from "theme/globalStyles"
import NotistackProvider from "utils/NotistackProvider"

export default function App() {
  return (
    <ThemeConfig>
      <NotistackProvider>
        <GlobalStyles />
        {/* <GoogleAnalytics /> */}
        <Router />
      </NotistackProvider>
    </ThemeConfig>
  )
}
