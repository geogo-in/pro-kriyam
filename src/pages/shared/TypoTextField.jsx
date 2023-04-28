import { Close, Done } from "@mui/icons-material"
import { Box, Button, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import "react-quill/dist/quill.snow.css"
import Editor from "./Editor"

export default function TypoTextField({
  value: defaultValue,
  maxWidth,
  bgcolor = "#fff",
  onSubmit,
  required,
  name,
  editor,
  textFieldProps = "rgba(0, 0, 0, 0.87)",
  placeholderColor,
  ...props
}) {
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
          <TextField sx={{ my: 0 }} {...{ value, required }} autoFocus onChange={e => setValue(e.target.value)} fullWidth {...textFieldProps} />
        )}
        <Box position={"absolute"} bottom={-40} right={0} zIndex={100000}>
          <Button onClick={handleClick} sx={{ color: theme => theme.palette.primary.defaultText, minWidth: 48, background: "#f1f5f9", ml: 1 }}>
            <Done />
          </Button>
          <Button onClick={handleClose} sx={{ color: theme => theme.palette.primary.defaultText, minWidth: 48, background: "#f1f5f9", ml: 1 }}>
            <Close />
          </Button>
        </Box>
      </Box>
    )
  return (
    <Typography
      component={"div"}
      className="ql-editor"
      onClick={handleEditable}
      {...props}
      {...(editor ? { dangerouslySetInnerHTML: { __html: value || props.placeholder } } : { children: value || props.placeholder })}
      sx={{
        ":hover": { background: "#f1f5f9", borderRadius: "4px", cursor: "text" },
        minHeight: "1.66rem",
        width: "100%",
        backgroundColor: bgcolor,
        color: placeholderColor,
        maxWidth: maxWidth,
        px: 0.5,
        py: "4px",
        whiteSpace: "pre-line",
      }}
    />
  )
}
