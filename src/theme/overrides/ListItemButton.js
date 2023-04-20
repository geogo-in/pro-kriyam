export default function ListItemButton(theme) {
  return {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: theme.spacing(1),
        },
      },
    },
  }
}
