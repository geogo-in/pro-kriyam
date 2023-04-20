export default function TextField(theme) {
  return {
    MuiTextField: {
      defaultProps: {
        size: "small",
        margin: "dense",
      },
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            borderRadius: "4px",
          },
          "& .MuiInputBase-inputSizeSmall": {
            padding: "10px 14px",
          },
          "& .MuiSelect-select": {
            padding: "10px 14px !important",
          },
          "& fieldset": {
            borderColor: "rgb(203 213 225)",
          },
        },
      },
    },
  }
}
