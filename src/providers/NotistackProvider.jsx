import { Close } from "@mui/icons-material"
import { Box, IconButton, Typography, styled } from "@mui/material"
import { MaterialDesignContent, SnackbarProvider } from "notistack"
import React, { forwardRef } from "react"

export default function NotistackProvider({ children }) {
  const notistackRef = React.createRef()
  const onClickDismiss = key => () => {
    notistackRef.current.closeSnackbar(key)
  }
  return (
    <SnackbarProvider
      action={key => (
        <IconButton onClick={onClickDismiss(key)} color="default">
          <Close />
        </IconButton>
      )}
      Components={{
        success: StyledMaterialDesignContent,
        error: StyledMaterialDesignContent,
        default: StyledMaterialDesignContent,
        info: StyledMaterialDesignContent,
        warning: StyledMaterialDesignContent,
      }}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      ref={notistackRef}
      maxSnack={5}
      autoHideDuration={30000}>
      {children}
    </SnackbarProvider>
  )
}

const StyledMaterialDesignContent = styled(
  forwardRef(({ title, ...props }, ref) => (
    <MaterialDesignContent
      ref={ref}
      {...props}
      message={
        <Box pl={1}>
          <Typography fontWeight="bold" gutterBottom>
            {title}
          </Typography>
          <Typography>{props.message}</Typography>
        </Box>
      }
    />
  ))
)(({ theme }) => ({
  "& #notistack-snackbar": {
    alignItems: "flex-start",
    padding: 12,
  },
  "&.notistack-MuiContent-success": {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.getContrastText(theme.palette.background.default),
    "& #notistack-snackbar svg": {
      fill: `${theme.palette.success.main} !important`,
    },
  },
  "&.notistack-MuiContent-error": {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.getContrastText(theme.palette.background.default),
    "& #notistack-snackbar svg": {
      fill: `${theme.palette.error.main} !important`,
    },
  },
  "&.notistack-MuiContent-default": {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.getContrastText(theme.palette.background.default),
  },
  "&.notistack-MuiContent-info": {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.getContrastText(theme.palette.background.default),
    "& #notistack-snackbar svg": {
      fill: `${theme.palette.info.main} !important`,
    },
  },
  "&.notistack-MuiContent-warning": {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.getContrastText(theme.palette.background.default),
    "& #notistack-snackbar svg": {
      fill: `${theme.palette.warning.main} !important`,
    },
  },
}))
