import Popover from "@mui/material/Popover"
import { styled } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import * as React from "react"

const CardTitle = styled("span")(({ theme }) => ({
  // borderBottom: ".125rem dotted #c4cdd5",
  color: theme.palette.primary.defaultText,
  fontWeight: 500,
  padding: "2px 0",
}))

const TextWithPopover = ({ text, popoverText, fontSize, showBorder = true }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handlePopoverOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return (
    <>
      <CardTitle
        sx={{ fontSize, borderBottom: showBorder ? ".125rem dotted #c4cdd5" : "none" }}
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}>
        {text}
      </CardTitle>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: "none",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus>
        <Typography variant="body1" color={theme => theme.palette.primary.defaultText} sx={{ p: 2, py: 1.5, maxWidth: 300 }}>
          {popoverText}
        </Typography>
      </Popover>
    </>
  )
}

export default TextWithPopover
