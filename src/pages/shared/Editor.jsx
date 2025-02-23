import { Box, styled } from "@mui/material"
import "quill-mention"
import "quill-mention/dist/quill.mention.css"
import { useEffect, useMemo, useRef } from "react"
import ReactQuill, { Quill } from "react-quill"
import "react-quill/dist/quill.snow.css"

// Custom Undo button icon component for Quill editor. You can import it directly
// from 'quill/assets/icons/undo.svg' but I found that a number of loaders do not
// handle them correctly
const CustomUndo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
    <path className="ql-stroke" d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9" />
  </svg>
)

// Redo button icon component for Quill editor
const CustomRedo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
    <path className="ql-stroke" d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5" />
  </svg>
)

// Undo and redo functions for Custom Toolbar
function undoChange() {
  this.quill.history.undo()
}
function redoChange() {
  this.quill.history.redo()
}

// Add sizes to whitelist and register them
const Size = Quill.import("formats/size")
Size.whitelist = ["extra-small", "small", "medium", "large"]
Quill.register(Size, true)

// Add fonts to whitelist and register them
const Font = Quill.import("formats/font")
Font.whitelist = ["arial", "comic-sans", "courier-new", "georgia", "helvetica", "lucida"]
Quill.register(Font, true)

// Modules object for setting up the Quill editor
export const modules = {
  toolbar: {
    container: "#toolbar",
    handlers: {
      undo: undoChange,
      redo: redoChange,
    },
  },

  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true,
  },
}

const StyledQlBox = styled(Box)(({ theme }) => ({
  marginRight: "4px !important",
}))

const StyledEditorBox = styled(Box)(({ theme }) => ({
  "& .quill": {
    height: "150px !important",
  },
  "& .ql-container": {
    border: theme.palette.mode === "light" ? "1px solid #d2dae5 !important" : "1px solid #444444 !important",
    borderRadius: "4px",
  },
  "& .ql-container.on-focus": {
    border: "1px solid #2563eb !important",
    outline: "1px solid #2563eb !important",
    borderRadius: "4px",
  },
  "& .mention": {
    background: theme.palette.primary.main,
    color: theme.palette.mode === "light" ? "white" : theme.palette.primary.defaultText,
    borderRadius: 15,
    padding: 3,
  },
}))

// Formats objects for setting up the Quill editor
export const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "align",
  "strike",
  "script",
  "blockquote",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "color",
  "code-block",
  "mention",
]

// Quill Toolbar component
export const QuillToolbar = () => {
  return (
    <Box id="toolbar" sx={{ background: theme => theme.palette.mode === "light" ? "#f1f5f9" : "#CBD5E1", borderRadius: "4px 4px 0 0", border: "none !important" }}>
      <StyledQlBox className="ql-formats">
        {/* <select className="ql-font" defaultValue="arial">
        <option value="arial">Arial</option>
        <option value="comic-sans">Comic Sans</option>
        <option value="courier-new">Courier New</option>
        <option value="georgia">Georgia</option>
        <option value="helvetica">Helvetica</option>
        <option value="lucida">Lucida</option>
      </select> */}
        <select className="ql-header" defaultValue="3">
          <option value="1">Heading</option>
          <option value="2">Subheading</option>
          <option value="3">Normal</option>
        </select>
        {/* <select className="ql-size" defaultValue="medium">
          <option value="small">Size 2</option>
          <option value="medium">Size 3</option>
          <option value="large">Size 4</option>
        </select> */}
      </StyledQlBox>
      <StyledQlBox className="ql-formats">
        <button className="ql-bold" title="Bold" />
        <button className="ql-italic" title="Italic" />
        <button className="ql-underline" title="Underline" />
        <button className="ql-strike" title="Strike" />
      </StyledQlBox>
      <StyledQlBox className="ql-formats">
        <button className="ql-list" value="ordered" title="Numbered list" />
        <button className="ql-list" value="bullet" title="Bulleted list" />
        {/* <button className="ql-indent" value="-1" />
        <button className="ql-indent" value="+1" /> */}
      </StyledQlBox>
      <StyledQlBox className="ql-formats">
        <select className="ql-align" title="Horizontal align" />
        <select className="ql-color" title="Text color" />
        <select className="ql-background" title="Background color" />
      </StyledQlBox>
      <StyledQlBox className="ql-formats">
        <button className="ql-link" />
        <button className="ql-image" title="Insert image" />
        {/*  <button className="ql-video" /> */}
      </StyledQlBox>
      <StyledQlBox className="ql-formats">
        {/* <button className="ql-formula" /> */}
        <button className="ql-code-block" title="Code block" />
        <button className="ql-clean" title="Clear formatting" />
      </StyledQlBox>
      {/* <StyledQlBox className="ql-formats">
        <button className="ql-undo" title="Undo">
          <CustomUndo />
        </button>
        <button className="ql-redo" title="Redo">
          <CustomRedo />
        </button>
      </StyledQlBox> */}
    </Box>
  )
}

export default function Editor({ people, autoFocus, hash, ...props }) {
  const module = useMemo(
    () => ({
      ...modules,
      mention: {
        allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
        mentionDenotationChars: ["@", "#"],
        // linkTarget: "https://www.google.com",
        source: function (searchTerm, renderList, mentionChar) {
          let values
          if (mentionChar === "@") {
            values = people
          } else {
            values = hash
          }

          if (searchTerm.length === 0) {
            renderList(values, searchTerm)
          } else {
            const matches = []
            for (let i = 0; i < values.length; i++) if (~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())) matches.push(values[i])
            renderList(matches, searchTerm)
          }
        },
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  const editorRef = useRef(null)

  useEffect(() => {
    if (editorRef.current && autoFocus) {
      editorRef.current.focus()
    }
  }, [])

  const handleFocus = () => {
    if (editorRef.current) {
      editorRef.current.getEditor().root.parentNode.classList.add("on-focus")
    }
  }

  const handleBlur = () => {
    if (editorRef.current) {
      editorRef.current.getEditor().root.parentNode.classList.remove("on-focus")
    }
  }

  return (
    <>
      <QuillToolbar />
      <StyledEditorBox>
        <ReactQuill
          ref={editorRef}
          autoFocus
          theme="snow"
          modules={module}
          formats={formats}
          placeholder="Type @ to mention and notify other project members"
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </StyledEditorBox>
    </>
  )
}
