import SearchIcon from "@mui/icons-material/Search"
import { CircularProgress, Divider, InputAdornment, ListItemButton, ListItemIcon, ListItemText, Typography, useAutocomplete } from "@mui/material"
import InputBase from "@mui/material/InputBase"
import { styled } from "@mui/material/styles"
import { useSearchQuery } from "@redux/services/redmineApi"
import { skipToken } from "@reduxjs/toolkit/dist/query"
import hotkeys from "hotkeys-js"
import IssueTypeIcon from "pages/shared/IssueTypeIcon"
import React, { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { PATH_DASHBOARD } from "routes/paths"
import { useDebounce } from "use-debounce"
import { getOs } from "utils/getOs"

export default function Search({ open, setOpen }) {
  const searchRef = useRef()
  const navigate = useNavigate()
  const [value, setValue] = useState("")
  const [debouncedFilter] = useDebounce(value, 500)
  const { data, isLoading, isFetching } = useSearchQuery(debouncedFilter || skipToken)
  const os = getOs()
  const loading = isLoading || isFetching
  const [anchorEl, setAnchorEl] = React.useState(null)

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

  const handleMenu = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
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
    <SearchWrapper sx={{ flexGrow: 1 }} popupOpen={groupedOptions.length > 0 && open} {...getRootProps()}>
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
          <Divider variant="middle" />
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
    </SearchWrapper>
  )
}

const SearchWrapper = styled("div")(({ theme, popupOpen }) => ({
  position: "relative",
  borderRadius: 21,
  backgroundColor: theme.palette.mode === "light" ? "#f1f5f9" : theme.palette.background.modal,
  // "&:hover": { backgroundColor: "#f1f5f9" },
  ...(popupOpen && { borderEndEndRadius: 0, borderEndStartRadius: 0, boxShadow: theme.shadows[11], backgroundColor: theme.palette.mode === "light" ? theme.palette.common.white : theme.palette.background.modal }),
  marginRight: theme.spacing(12),
  marginLeft: theme.spacing(3),
  width: "auto",
  [theme.breakpoints.down("md")]: {
    marginLeft: 0,
    marginRight: 0,
    width: popupOpen ? "80vw" : "100%",
    ...(popupOpen && { position: "absolute", width: "calc(100% - 30px)", zIndex: theme.zIndex.drawer + 1 }),
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
  color: theme.palette.mode === "light" ? "#1E293B" : theme.palette.primary.secondaryText,
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
  backgroundColor: theme.palette.mode === "light" ? theme.palette.common.white : theme.palette.background.modal,
  color: theme.palette.text.primary,
  clipPath: "inset(0px -10px -10px -10px)",
  "& li.Mui-focused": { backgroundColor: theme.palette.primary.lightest },
}))
