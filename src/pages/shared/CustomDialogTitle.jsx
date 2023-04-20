import { Clear } from "@mui/icons-material"
import { DialogTitle, IconButton, styled } from "@mui/material"

export default function CustomDialogTitle(props) {
  const { children, onClose, ...other } = props

  return (
    <StyledDialogTitle {...other}>
      {children}
      {onClose ? (
        <IconButton aria-label="close" onClick={onClose}>
          <Clear />
        </IconButton>
      ) : null}
    </StyledDialogTitle>
  )
}

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({ padding: "10px 5px", paddingLeft: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }))
