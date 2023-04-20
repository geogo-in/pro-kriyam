import { Close } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { SnackbarProvider } from "notistack"
import React from "react"

export default function NotistackProvider({ children }) {
  const notistackRef = React.createRef()
  const onClickDismiss = key => () => {
    notistackRef.current.closeSnackbar(key)
  }
  return (
    <>
      {/* <SnackbarStyles /> */}
      <SnackbarProvider
        action={key => (
          <IconButton onClick={onClickDismiss(key)} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        )}
        // anchorOrigin={{
        //   vertical: "top",
        //   horizontal: "right",
        // }}
        dense
        ref={notistackRef}
        maxSnack={3}
        autoHideDuration={3000}>
        {children}
      </SnackbarProvider>
    </>
  )
}

// function SnackbarStyles() {
//   const theme = useTheme()
//   const isLight = theme.palette.mode === "light"

//   return (
//     <GlobalStyles
//       styles={{
//         "#root": {
//           "& .SnackbarContent-root": {
//             width: "100%",
//             padding: theme.spacing(1.5),
//             margin: theme.spacing(0.25, 0),
//             // boxShadow: theme.customShadows.z8,
//             borderRadius: theme.shape.borderRadius,
//             color: theme.palette.grey[isLight ? 0 : 800],
//             backgroundColor: theme.palette.grey[isLight ? 900 : 0],
//             "&.SnackbarItem-variantSuccess, &.SnackbarItem-variantError, &.SnackbarItem-variantWarning, &.SnackbarItem-variantInfo": {
//               color: theme.palette.text.primary,
//               backgroundColor: theme.palette.background.paper,
//             },
//           },
//           "& .SnackbarItem-message": {
//             padding: "0 !important",
//             fontWeight: theme.typography.fontWeightMedium,
//           },
//           "& .SnackbarItem-action": {
//             marginRight: 0,
//             color: theme.palette.action.active,
//             "& svg": { width: 20, height: 20 },
//           },
//         },
//       }}
//     />
//   )
// }
