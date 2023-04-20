export default function Tab(theme) {
  return {
    MuiTab: {
      styleOverrides: {
        root: {
          borderRadius: theme.shape.borderRadius,
          minHeight: 26,
        },
      },
    },
  }
}
