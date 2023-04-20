import AddIcon from "@mui/icons-material/Add"
import AddIssueIcon from "@mui/icons-material/AddTask"
import AddUserIcon from "@mui/icons-material/PersonAdd"
import AddProjectIcon from "@mui/icons-material/PostAdd"
import Box from "@mui/material/Box"
import MuiContainer from "@mui/material/Container"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import { alpha, styled } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import SubnavTabs from "pages/dashboard/components/SubnavTabs"
import CreateMember from "pages/members/Components/CreateMember"
import CreateIssue from "pages/projectIssues/components/CreateIssue"
import CustomDialog from "pages/shared/CustomDialog"
import PrimaryRoundButton from "pages/shared/PrimaryRoundButton"
import React, { useState } from "react"
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

const Container = styled(MuiContainer)(({ theme }) => ({
  padding: "4px 0 0px 0",
}))

const StyledHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: "1.5rem",
  marginTop: 6,
  marginBottom: 12,
  clear: "both",
}))

const PageHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [state, setState] = useState()
  const open = Boolean(anchorEl)
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleDialogClose = () => {
    setState()
  }

  const handleMenu = type => () => {
    setState(type)
    handleClose()
  }
  return (
    <Box sx={{ backgroundColor: "white", boxShadow: "0 20px 20px -20px rgb(0 0 0 / 15%)" }}>
      <Container>
        <Box pt={2.5} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <StyledHeading variant="h5" gutterBottom>
            Dashboard
          </StyledHeading>
          <div>
            <PrimaryRoundButton
              id="demo-customized-button"
              aria-controls={open ? "demo-customized-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              variant="contained"
              disableElevation
              startIcon={<AddIcon />}
              onClick={handleClick}>
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
              onClose={handleClose}>
              <MenuItem disableRipple onClick={handleMenu("issue")}>
                <AddIssueIcon />
                New Issue
              </MenuItem>
              <MenuItem disableRipple onClick={handleMenu("member")}>
                <AddUserIcon />
                New Member
              </MenuItem>
              <MenuItem onClick={handleClose} disableRipple component={Link} to={PATH_DASHBOARD.projects.new}>
                <AddProjectIcon />
                New Project
              </MenuItem>
            </StyledMenu>
          </div>
        </Box>

        <Box sx={{ width: "100%" }}>
          <SubnavTabs />
        </Box>
      </Container>
      <CustomDialog back open={Boolean(state)} onClose={handleDialogClose}>
        {state === "member" ? <CreateMember onClose={handleDialogClose} /> : state === "issue" ? <CreateIssue onClose={handleDialogClose} /> : null}
      </CustomDialog>
    </Box>
  )
}

export default PageHeader
