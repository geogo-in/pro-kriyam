import MenuIcon from "@mui/icons-material/Menu"
import { CircularProgress, Divider, InputAdornment, ListItemButton, ListItemIcon, ListItemText, Typography, useAutocomplete } from "@mui/material"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Toolbar from "@mui/material/Toolbar"
import Logo from "assets/images/Default_Full.svg"
import React, { useRef, useState } from "react"
// import { AvatarWithName } from "pages/shared/AvatarWithName"
import ProfileIcon from "@mui/icons-material/AccountBoxOutlined"
import LogoutIcon from "@mui/icons-material/Logout"
import SearchIcon from "@mui/icons-material/Search"
import InputBase from "@mui/material/InputBase"
import { alpha, styled } from "@mui/material/styles"
import { getCurrentUser, unauthUser } from "@redux/reducerSlices/user/userAuthSlice"
import { useSearchQuery } from "@redux/services/redmineApi"
import { skipToken } from "@reduxjs/toolkit/dist/query"
import hotkeys from "hotkeys-js"
import IssueTypeIcon from "pages/shared/IssueTypeIcon"
import MemberAvatar from "pages/shared/MemberAvatar"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { PATH_AUTH, PATH_DASHBOARD } from "routes/paths"
import { useDebounce } from "use-debounce"
import { getOs } from "utils/getOs"
import QuickActionButton from "./QuickActionButton"

const drawerWidth = 280

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

const Search = styled("div")(({ theme, popupOpen }) => ({
  position: "relative",
  borderRadius: 21,
  backgroundColor: "#f1f5f9",
  // "&:hover": {
  //   backgroundColor: "#f1f5f9",
  // },
  ...(popupOpen && { borderEndEndRadius: 0, borderEndStartRadius: 0, boxShadow: theme.shadows[11], backgroundColor: theme.palette.common.white }),
  marginRight: theme.spacing(12),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}))

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#64748b",
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#1E293B",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    height: "1.6rem",
  },
}))

const Listbox = styled("ul")(({ theme, popupOpen }) => ({
  width: "100%",
  borderRadius: 21,
  borderStartStartRadius: 0,
  borderStartEndRadius: 0,
  margin: 0,
  marginBottom: 8,
  padding: 0,
  zIndex: 1,
  boxShadow: theme.shadows[11],
  position: "absolute",
  listStyle: "none",
  overflow: "auto",
  maxHeight: "80vh",
  backgroundColor: theme.palette.common.white,
  color: theme.palette.text.primary,
  clipPath: "inset(0px -10px -10px -10px)",

  "& li.Mui-focused": { backgroundColor: theme.palette.primary.lightest },
}))
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

const Appbar = ({ mobileOpen, setMobileOpen }) => {
  const navigate = useNavigate()
  const searchRef = useRef()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [value, setValue] = useState("")
  const [open, setOpen] = useState(false)
  const [debouncedFilter] = useDebounce(value, 500)
  const { data, isLoading, isFetching } = useSearchQuery(debouncedFilter || skipToken)
  const openMenu = Boolean(anchorEl)
  const os = getOs()
  const loading = isLoading || isFetching

  const { getRootProps, getInputProps, getListboxProps, getOptionProps, groupedOptions } = useAutocomplete({
    id: "global-search",
    options: data?.results || [],
    getOptionLabel: option => option.title,
    onInputChange: handleChange,
    inputValue: value,
    onChange: handleSearchClick,
    value: null,
    filterOptions: x => x,
    // getOptionDisabled: x => x.type === "issue-closed",
    open,
    onOpen: () => setOpen(true),
    onClose: () => setOpen(false),
    clearOnBlur: true,
    blurOnSelect: true,
    clearOnEscape: true,
    autoSelect: true,
  })

  hotkeys(`ctrl+k, command+k`, () => {
    searchRef.current?.focus()
  })

  const dispatch = useDispatch()
  const currentUser = useSelector(getCurrentUser)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMenu = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  function onLogoutClick() {
    dispatch(unauthUser())
  }

  function handleChange(e, value) {
    if (e?.type === "change") setValue(value)
    else setValue("")
  }
  function handleSearchClick(e, item) {
    if (e.type === "blur") return
    if (item?.type === "project") navigate(`${PATH_DASHBOARD.projects.root}/${item.id}`)
    if (["issue", "issue-closed"].includes(item?.type)) navigate(`${PATH_DASHBOARD.projects.root}/${item.project.identifier}/issues/${item.id}`)
  }

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${0}px)` },
          ml: { sm: `${drawerWidth}px` },
          zIndex: theme => (open ? theme.zIndex.tooltip + 1 : theme.zIndex.drawer + 1),
          background: "white",
          borderBottom: "1px solid #F1F5F9",
          boxShadow: "none",
        }}>
        <Toolbar>
          <IconButton color="primary" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ width: `${drawerWidth - 24}px`, display: "flex", alignItems: "flex-end", marginBottom: 1 }}>
            <Link to={PATH_DASHBOARD.root}>
              <img src={Logo} alt="logo" height={40} />
            </Link>
            <Typography variant="h6" sx={{ textTransform: "uppercase", fontWeight: 600, color: "#10172a", fontSize: "0.8rem", padding: "2px 8px" }}>
              Projects
            </Typography>
          </Box>

          <Search sx={{ flexGrow: 1 }} popupOpen={groupedOptions.length > 0 && open} {...getRootProps()}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              endAdornment={
                loading && (
                  <InputAdornment position="start">
                    <CircularProgress size={25} color="inherit" />
                  </InputAdornment>
                )
              }
              inputRef={searchRef}
              placeholder={`${os === "Mac" ? "⌘" : "Ctrl"} + K  |  Search Projects, Issues...`}
              inputProps={getInputProps()}
            />
            {groupedOptions.length > 0 ? (
              <>
                <Divider variant="middle" sx={{}} />
                <Listbox {...getListboxProps()}>
                  {groupedOptions.map((option, index) => {
                    const type = option.title.split(" ", 1)[0]
                    const props = getOptionProps({ option, index })

                    return (
                      <ListItemButton component="li" key={index} {...props} disabled={props["aria-disabled"]}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <IssueTypeIcon type_name={type} />
                        </ListItemIcon>
                        <ListItemText
                          primary={option.title}
                          secondary={
                            <Typography
                              sx={{ overflowWrap: "anywhere", overflow: "hidden", maxHeight: 100 }}
                              component={"div"}
                              variant="caption"
                              dangerouslySetInnerHTML={{ __html: option.description }}
                            />
                          }
                        />
                      </ListItemButton>
                    )
                  })}
                </Listbox>
              </>
            ) : null}
          </Search>

          <QuickActionButton />
          <Box sx={{ position: "relative" }}>
            <IconButton sx={{ padding: "4px" }} size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleMenu} color="inherit">
              <MemberAvatar name={`${currentUser.firstname} ${currentUser.lastname}`} height={34} width={34} />
            </IconButton>
            <StyledMenu anchorEl={anchorEl} PaperProps={PAPER_PROPS} open={openMenu} onClose={handleClose}>
              <MenuItem disableRipple component={Link} to={PATH_AUTH.me}>
                <ProfileIcon />
                Profile
              </MenuItem>
              <MenuItem onClick={onLogoutClick} disableRipple>
                <LogoutIcon />
                Logout
              </MenuItem>
            </StyledMenu>
          </Box>
        </Toolbar>
      </AppBar>
      {open && <Box sx={{ zIndex: theme => theme.zIndex.tooltip, inset: 0, position: "absolute", background: "rgb(0,0,0,.5)" }} />}
    </>
  )
}

export default Appbar
