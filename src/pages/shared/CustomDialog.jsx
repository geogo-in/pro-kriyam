import { ArrowBack } from "@mui/icons-material"
import { Box, IconButton, styled } from "@mui/material"
import Dialog from "@mui/material/Dialog"
import Slide from "@mui/material/Slide"
import React from "react"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />
})

const CustomDialog = ({ open, back, onClose, ...props }) => (
  <BootstrapDialog maxWidth="sm" scroll="body" fullWidth open={Boolean(open)} onClose={onClose} TransitionComponent={Transition}>
    {back && (
      <FloatingBack onClick={onClose}>
        <ArrowBack />
      </FloatingBack>
    )}
    <Box height={1} overflow={"auto"}>
      {props.children}
    </Box>
  </BootstrapDialog>
)

export default CustomDialog

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-container": {
    textAlign: "end",
  },
  "& .MuiDialog-paper": {
    overflowY: "visible",
    // overflowY: "auto",
    margin: 0,
    height: "100% !important",
    width: "100% !important",
    borderRadius: "8px 0 0 8px",
    minWidth: 500,
    [theme.breakpoints.down("sm")]: {
      maxWidth: "100% !important",
    },
    [theme.breakpoints.down("xs")]: {
      minWidth: "unset",
    },
  },
}))
const FloatingBack = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  left: "-20px",
  top: 30,
  backgroundColor: "white",
  ":hover": { backgroundColor: "#eee" },
}))
