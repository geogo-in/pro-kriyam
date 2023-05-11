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

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({ 
  padding: "10px 16px", 
  paddingLeft: 16, 
  display: "flex", 
  justifyContent: "space-between", 
  alignItems: "center",
  boxShadow: "1px 1px 8px -5px #00000080",
}))
