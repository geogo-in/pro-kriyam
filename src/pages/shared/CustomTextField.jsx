import { styled, TextField } from "@mui/material";

// export const FormTextField = styled(props => <TextField required margin="normal" fullWidth {...props} />)({})
export const FormTextField = styled((props) => {
  return <TextField required margin="normal" fullWidth {...props} />;
})(({ theme }) => ({
  "& .MuiInputBase-input": {
    color: "black",
  },
  "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        borderColor: "black",
      },
    },
}));
export const SelectWithIcon = styled(props => <TextField select SelectProps={{ displayEmpty: true }} InputLabelProps={{ shrink: true }} size="small" {...props} />, {
  shouldForwardProp: prop => prop !== "minwidth",
})(({ theme, minwidth = 150 }) => ({
  minWidth: `${minwidth}px !important`,
  ".MuiSelect-select": {
    paddingLeft: 4,
    display: "flex",
    alignItems: "center",
    paddingTop: theme.spacing(0.8),
    paddingBottom: theme.spacing(0.8),
    color: theme => theme.palette.mode === "light" ? "" : theme.palette.primary.defaultText,
    ".MuiListItemIcon-root": {
      minWidth: 40,
    },
    ".MuiListItemText-root": {
      margin: 0,
    },
  },
  "& fieldset": {
    borderColor: theme.palette.mode === "light" ? "" : "#444444",
  },
}))

export const SleekSelectWithIcon = styled(props => <TextField select SelectProps={{ displayEmpty: true }} InputLabelProps={{ shrink: true }} size="small" {...props} />, {
  shouldForwardProp: prop => prop !== "minwidth",
})(({ theme, bgcolor = "white", minwidth = 120 }) => {
  return {
    marginTop: "4px",
    minWidth: `${minwidth}px !important`,
    background: theme.palette.mode === "light" ? bgcolor : theme.palette.background.default,
    borderRadius: 4,
    ".MuiSelect-select": {
      padding: "6px 14px 6px 14px !important",
      // paddingLeft: 4,
      display: "flex",
      alignItems: "center",
      ".MuiListItemIcon-root": {
        minWidth: 40,
      },
      ".MuiListItemText-root": {
        margin: 0,
      },
    },
    "& fieldset": {
      borderColor: theme.palette.mode === "light" ? bgcolor : theme.palette.background.default,
    },
  }
})

export const SleekTextField = styled(props => <TextField required margin="normal" {...props} />)(({ theme, bgcolor, minwidth = 120 }) => {
  return {
    marginTop: "4px",
    marginBottom: "4px",
    minWidth: `${minwidth}px !important`,
    background: theme.palette.mode === "light" ? bgcolor : theme.palette.background.default,
    borderRadius: 2,
    ".MuiInputBase-inputSizeSmall": {
      padding: "7px 14px",
    },
    fieldset: {
      borderColor: theme.palette.mode === "light" ? bgcolor : theme.palette.background.default,
    },
  }
})
