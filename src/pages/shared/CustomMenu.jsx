import MuiListItem from "@mui/material/ListItem"
import MuiListItemIcon from "@mui/material/ListItemIcon"
import Menu from "@mui/material/Menu"
import { alpha, styled } from "@mui/material/styles"
import * as React from "react"

const CustomMenu = styled(props => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
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
export default CustomMenu

const activeLinkMixin = theme => ({
  backgroundColor: "#f1f5f9",
  color: "black",
  "& .MuiSvgIcon-root": {
    height: "1.6em",
    color: "black",
  },
  "& .MuiListItemText-primary": {
    transition: "font-size .1s",

    fontSize: "1.05rem",
    fontWeight: 500,
  },
})

export const ListItem = styled(MuiListItem)(({ theme, active }) => ({
  padding: "7px 2px 7px 20px",
  marginBottom: 4,
  borderRadius: "4px",
  position: "relative",
  // color: theme.palette.primary.defaultText,
  color: theme.palette.mode === "light"? theme.palette.primary.defaultText : theme.palette.text.secondary,
  "& .MuiSvgIcon-root": {
    height: "1.6em",
  },
  "& .MuiListItemText-primary": {
    transition: "font-size .1s",
    fontSize: "0.9rem",
    fontWeight: 500,
  },
  ...(active === "true" && {
    ...activeLinkMixin(theme),
    ...(theme.palette.mode === "dark" && {
      "&:hover": {
        backgroundColor: "#f1f5f9 !important",
      },
    }),
  }),
}))

const activeLinkIconMixin = theme => ({
  color: "#63F5AF",
})

export const ListItemIcon = styled(MuiListItemIcon)(({ theme, active }) => ({
  // color: "#5F6368",
  color: theme.palette.mode === "light" ? "#5F6368" : theme.palette.text.secondary ,
  minWidth: 48,
  ...(active === "true" && {
    ...activeLinkIconMixin(theme),
  }),
}))
