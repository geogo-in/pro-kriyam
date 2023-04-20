export default function Button(theme) {
  return {
    MuiButton: {
      variants: [
        {
          props: { variant: "rounded" },
          style: {
            "&.MuiButtonBase-root": {
              borderRadius: 20,
              minWidth: 30,
            },
          },
        },
        {
          props: { variant: "rounded", color: "primary" },
          style: {
            "&.MuiButtonBase-root": {
              borderRadius: 20,
              minWidth: 30,
              background: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            },
          },
        },
      ],
      styleOverrides: {
        root: {
          borderRadius: "4px",
        },
      },
    },
  }
}
