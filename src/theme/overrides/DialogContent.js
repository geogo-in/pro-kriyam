export default function DialogContent(theme) {
  return {
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1, 2),
        },
      },
    },
  }
}
