import { Close, Done } from "@mui/icons-material"
import { Box, Button, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import "react-quill/dist/quill.snow.css"
import Editor from "./Editor"

export default function TypoTextField({ value: defaultValue, maxWidth, bgcolor = "#fff", onSubmit, required, name, editor, textFieldProps, placeholderColor, ...props }) {
  const [editable, setEditable] = useState(props?.editable || false)
  const [value, setValue] = useState(defaultValue)
  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  const handleEditable = () => {
    setEditable(true)
  }
  const handleClose = () => {
    setValue(defaultValue)
    setEditable(false)
  }
  const handleClick = async e => {
    try {
      await onSubmit({ [name]: value })
      setEditable(false)
    } catch (error) {}
  }

  if (editable)
    return (
      <Box position={"relative"} sx={{ flex: 1 }}>
        {editor ? (
          <Editor value={value} onChange={setValue} placeholder="Add a more detailed description..." />
        ) : (
          <TextField sx={{ my: 0 }} {...{ required }} autoFocus value={value || ""} onChange={e => setValue(e.target.value)} fullWidth {...textFieldProps} />
        )}
        <Box position={"absolute"} bottom={-40} right={0} zIndex={100000}>
          <Button onClick={handleClick} sx={{ color: theme => theme.palette.primary.defaultText, minWidth: 48, background: theme => theme.palette.mode === "light" ? "#f1f5f9" : theme.palette.background.default, ml: 1 }}>
            <Done />
          </Button>
          <Button onClick={handleClose} sx={{ color: theme => theme.palette.primary.defaultText, minWidth: 48, background: theme => theme.palette.mode === "light" ? "#f1f5f9" : theme.palette.background.default, ml: 1 }}>
            <Close />
          </Button>
        </Box>
      </Box>
    )
  return (
    <Typography
      component={"div"}
      onClick={handleEditable}
      {...props}
      {...(editor ? { className: "ql-editor ql-snow", dangerouslySetInnerHTML: { __html: value || props.placeholder } } : { children: value || props.placeholder })}
      sx={{
        ":hover": { background: theme => theme.palette.mode === "light" ? "#f1f5f9" : theme.palette.background.default, borderRadius: "4px", cursor: "text" },
        minHeight: "1.76rem",
        width: "100%",
        backgroundColor: theme => theme.palette.mode === "light" ? bgcolor : theme.palette.background.modal,
        color: placeholderColor,
        maxWidth,
        px: 0.5,
        py: 0.8,
        whiteSpace: "pre-line",
        borderRadius: "4px",
      }}
    />
  )
}
