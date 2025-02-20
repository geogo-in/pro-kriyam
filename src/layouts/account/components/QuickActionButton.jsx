import { Add, DarkModeOutlined, NotificationsNoneSharp, Settings } from "@mui/icons-material"
import ProfileIcon from "@mui/icons-material/AccountBoxOutlined"
import AddIcon from "@mui/icons-material/Add"
import AddIssueIcon from "@mui/icons-material/AddTask"
import LogoutIcon from "@mui/icons-material/Logout"
import AddUserIcon from "@mui/icons-material/PersonAdd"
import AddProjectIcon from "@mui/icons-material/PostAdd"
import { IconButton, ListItem, ListItemText, Stack, Typography, useMediaQuery, useTheme } from "@mui/material"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import { alpha, styled } from "@mui/material/styles"
import { getCurrentUser, isAdmin, unauthUser } from "@redux/reducerSlices/user/userAuthSlice"
import CreateMember from "pages/members/Components/CreateMember"
import CreateIssue from "pages/projectIssues/components/CreateIssue"
import CustomDialog from "pages/shared/CustomDialog"
import MemberAvatar from "pages/shared/MemberAvatar"
import PrimaryRoundButton from "pages/shared/PrimaryRoundButton"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { PATH_AUTH, PATH_DASHBOARD } from "routes/paths"
import { toggleTheme } from "@redux/reducerSlices/theme/themeSlice"

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
  const currentUser = useSelector(getCurrentUser)
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState({ profile: null, add: null, notification: null })
  const [state, setState] = useState()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const handleClick = type => event => {
    setAnchorEl({ [type]: event.currentTarget })
  }

  const handleMenuClose = () => {
    setAnchorEl({})
  }
  const handleClose = () => {
    setState(null)
  }

  const handleMenu = type => () => {
    setState(type)
    handleMenuClose()
  }
  function onLogoutClick() {
    dispatch(unauthUser())
    window.location.href = "/users/sign_in"
  }

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {isMobile ? (
        <IconButton onClick={handleClick("add")} color="primary">
          <Add />
        </IconButton>
      ) : (
        <PrimaryRoundButton variant="contained" disableElevation startIcon={<AddIcon />} onClick={handleClick("add")}>
          Add
        </PrimaryRoundButton>
      )}
      <StyledMenu anchorEl={anchorEl.add} PaperProps={PAPER_PROPS} open={Boolean(anchorEl.add)} onClose={handleMenuClose}>
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

      <IconButton onClick={handleClick("notification")} sx={{ color: "primary.main" }}>
        <NotificationsNoneSharp />
      </IconButton>
      <StyledMenu anchorEl={anchorEl.notification} PaperProps={PAPER_PROPS} open={Boolean(anchorEl.notification)} onClose={handleMenuClose} onClick={handleMenuClose}>
        <ListItem>
          <ListItemText primary="No notification" />
        </ListItem>

        <Typography component="li" align="center">
          <NavLink to={PATH_DASHBOARD.notifications}>See more</NavLink>
        </Typography>
      </StyledMenu>

      <IconButton sx={{ padding: "4px" }} size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleClick("profile")} color="inherit">
        <MemberAvatar name={`${currentUser.firstname} ${currentUser.lastname}`} height={34} width={34} />
      </IconButton>
      <StyledMenu anchorEl={anchorEl.profile} PaperProps={PAPER_PROPS} open={Boolean(anchorEl.profile)} onClose={handleMenuClose} onClick={handleMenuClose}>
        <MenuItem disableRipple component={Link} to={PATH_AUTH.me}>
          <ProfileIcon />
          Profile
        </MenuItem>
        <MenuItem disableRipple component={Link} to={PATH_DASHBOARD.settings}>
          <Settings />
          Settings
        </MenuItem>
        <MenuItem disableRipple onClick={() => dispatch(toggleTheme())}>
          <DarkModeOutlined />
          Change Theme
        </MenuItem>
        <MenuItem onClick={onLogoutClick} disableRipple>
          <LogoutIcon />
          Logout
        </MenuItem>
      </StyledMenu>

      <CustomDialog back open={Boolean(state)} onClose={handleClose}>
        {state === "member" ? <CreateMember onClose={handleClose} /> : state === "issue" ? <CreateIssue onClose={handleClose} /> : null}
      </CustomDialog>
    </Stack>
  )
}

export default QuickActionButton

const PAPER_PROPS = {
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
}
