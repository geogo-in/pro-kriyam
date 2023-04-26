import AddIcon from "@mui/icons-material/Add"
import AddIssueIcon from "@mui/icons-material/AddTask"
import AddUserIcon from "@mui/icons-material/PersonAdd"
import AddProjectIcon from "@mui/icons-material/PostAdd"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import { alpha, styled } from "@mui/material/styles"
import { isAdmin } from "@redux/reducerSlices/user/userAuthSlice"
import CreateMember from "pages/members/Components/CreateMember"
import CreateIssue from "pages/projectIssues/components/CreateIssue"
import CustomDialog from "pages/shared/CustomDialog"
import PrimaryRoundButton from "pages/shared/PrimaryRoundButton"
import { useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { PATH_DASHBOARD } from "routes/paths"

const StyledMenu = styled(props => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === "light" ? "rgb(55, 65, 81)" : theme.palette.grey[300],
    boxShadow: "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}))

const QuickActionButton = () => {
  const Admin = useSelector(isAdmin)
  const [anchorEl, setAnchorEl] = useState(null)
  const [state, setState] = useState()
  const open = Boolean(anchorEl)
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }
  const handleClose = () => {
    setState(null)
  }

  const handleMenu = type => () => {
    setState(type)
    handleMenuClose()
  }

  return (
    <div>
      <PrimaryRoundButton
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        disableElevation
        startIcon={<AddIcon />}
        onClick={handleClick}
        sx={{ mr: 2 }}>
        Add
      </PrimaryRoundButton>
      <StyledMenu
        anchorEl={anchorEl}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        open={open}
        onClose={handleMenuClose}>
        <MenuItem disableRipple onClick={handleMenu("issue")}>
          <AddIssueIcon />
          New Issue
        </MenuItem>
        {Admin && (
          <MenuItem disableRipple onClick={handleMenu("member")}>
            <AddUserIcon />
            New Member
          </MenuItem>
        )}
        {Admin && (
          <MenuItem onClick={handleMenuClose} disableRipple component={Link} to={PATH_DASHBOARD.projects.new}>
            <AddProjectIcon />
            New Project
          </MenuItem>
        )}
      </StyledMenu>
      <CustomDialog back open={Boolean(state)} onClose={handleClose}>
        {state === "member" ? <CreateMember onClose={handleClose} /> : state === "issue" ? <CreateIssue onClose={handleClose} /> : null}
      </CustomDialog>
    </div>
  )
}

export default QuickActionButton
