import { Add, ArrowDropDown, Clear } from "@mui/icons-material"
import { Box, Button, Card, IconButton, List, ListItem, ListItemButton, ListItemText, Menu, Stack, Typography, styled } from "@mui/material"
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip"
import { toggleEpic } from "@redux/reducerSlices/ui/projectUiSlice"
import { useGetEpicQuery } from "@redux/services/issueApi"
import CustomMenu from "pages/shared/CustomMenu"
import { useState } from "react"
import { useDispatch } from "react-redux"
import CreateEpic from "./CreateEpic"

const BootstrapTooltip = styled(({ className, ...props }) => <Tooltip enterDelay={10} {...props} arrow classes={{ popper: className }} />)(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    fontSize: 12,
  },
}))

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: "8px",
  marginTop: "8px",
  fontSize: "0.80rem",
  "& .MuiListItemSecondaryAction-root": {
    right: "2px",
  },
  "& .MuiListItemButton-root": {
    paddingRight: "36px",
  },
}))
const StickyLineCard = styled(Card)(({ theme }) => ({
  minWidth: "200px",
  height: "calc( 100vh - 194px )",
  position: "sticky",
  top: "4px",
  overflowY: "auto",
  marginTop: 12,
  marginRight: "8px",
  marginLeft: "8px",
  boxShadow: "0px 5px 5px -3px rgb(158 158 158 / 20%), 0px 8px 10px 1px rgb(158 158 158 / 14%), 0px 3px 14px 2px rgb(158 158 158 / 12%)",
  // padding: 4,
}))

export default function EpicContainer({ project_id, category_id, onFilter }) {
  const { data: epics } = useGetEpicQuery(project_id)
  const [createEpicDialog, setCreateEpicDialog] = useState()
  const [minimize, setMinimize] = useState(false)
  const dispatch = useDispatch()

  const handelNewEpic = e => {
    setCreateEpicDialog(e.target)
  }
  const handleDialogClose = () => {
    setCreateEpicDialog()
  }
  const handleEpic = id => e => {
    onFilter({ target: { name: "category_id", value: category_id === id ? null : id } })
  }
  const handelEpicContainer = e => {
    setMinimize(!minimize)
    dispatch(toggleEpic(!minimize))
  }

  if (minimize)
    return (
      <>
        <StickyLineCard>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ padding: "4px 6px 4px 12px", borderBottom: "1px solid #ebebeb" }}>
            <Typography variant="body2" sx={{ padding: "6px 2px", color: theme => theme.palette.primary.defaultText, fontWeight: "bold" }}>
              EPICS
            </Typography>
            <div>
              <BootstrapTooltip title={"Create Epic"} placement="top">
                <IconButton size="small" onClick={handelNewEpic} sx={{ marginRight: 1, color: "#42526E" }}>
                  <Add />
                </IconButton>
              </BootstrapTooltip>

              <IconButton size="small" onClick={handelEpicContainer} sx={{ color: "#42526E" }}>
                <Clear />
              </IconButton>
            </div>
          </Stack>
          <Box sx={{ padding: "8px" }}>
            <List dense sx={{ paddingTop: 0 }}>
              <ListItem sx={{ borderRadius: "8px", border: `1px solid #DFDFDF`, marginTop: "8px", fontSize: "0.80rem" }} disablePadding>
                <ListItemButton selected={!category_id} onClick={handleEpic()}>
                  <ListItemText primary={"All"} />
                </ListItemButton>
              </ListItem>

              {epics?.map(epic => (
                <EpicMenu {...epic} key={epic.id} selected={category_id === epic.id} onEpicSelect={handleEpic} />
              ))}
            </List>
          </Box>
        </StickyLineCard>
        <CustomMenu anchorEl={createEpicDialog} open={Boolean(createEpicDialog)} onClose={handleDialogClose}>
          <CreateEpic onClose={handleDialogClose} project_id={project_id} />
        </CustomMenu>
      </>
    )
  return (
    <Box sx={{ margin: "0 4px" }}>
      <Box width={30}>
        <VerticalButton sx={{ color: "#54637C" }} size="small" onClick={handelEpicContainer} disableRipple>
          EPICS
        </VerticalButton>
      </Box>
    </Box>
  )
}

const VerticalButton = styled(Button)(({ theme }) => ({
  transform: "translate(-17px, 25px) rotate(90deg)",
  width: 62,
  borderRadius: 0,
  paddingBottom: 0,
  paddingTop: 0,
}))
const EpicMenu = ({ id: epic_id, name, color_code, selected, onEpicSelect, ...props }) => {
  const [anchorEl, setAnchorEl] = useState()

  const handleEpicMenu = e => {
    setAnchorEl(e.target)
  }
  const epicMenuClose = e => {
    setAnchorEl()
  }

  return (
    <>
      <StyledListItem
        sx={{ border: `1px dashed ${color_code}`, borderLeft: `6px solid ${color_code}` }}
        disablePadding
        secondaryAction={
          <IconButton size="small" onClick={handleEpicMenu}>
            <ArrowDropDown />
          </IconButton>
        }>
        <ListItemButton dense role={undefined} selected={selected} onClick={onEpicSelect(epic_id)} sx={{ paddingLeft: "8px" }}>
          <ListItemText primary={name} />
        </ListItemButton>
      </StyledListItem>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={epicMenuClose}>
        <CreateEpic onClose={epicMenuClose} update {...{ epic_id, name, color_code }} />
      </Menu>
    </>
  )
}
