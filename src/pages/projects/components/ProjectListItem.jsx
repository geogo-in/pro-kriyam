import { Delete } from "@mui/icons-material"
import Edit from "@mui/icons-material/Edit"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import StarIcon from "@mui/icons-material/Star"
import StarOutlineIcon from "@mui/icons-material/StarOutline"
import { Chip, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Typography } from "@mui/material"
import Avatar from "@mui/material/Avatar"
import AvatarGroup from "@mui/material/AvatarGroup"
import Box from "@mui/material/Box"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import TableCell from "@mui/material/TableCell"
import TableRow from "@mui/material/TableRow"
import projectIcon from "assets/images/project.svg"
import * as React from "react"
import { Link as RouterLink } from "react-router-dom"
import { stringAvatar } from "utils/Avatar"

export default function ProjectListItem({ project, ...props }) {
  const [fav, setFav] = React.useState(false)
  const [menu, setMenu] = React.useState()
  const handleFav = event => {
    setFav(event.target.checked)
  }
  const handleMenu = e => {
    setMenu(e.target)
  }

  return (
    <TableRow hover tabIndex={-1} key={project.name}>
      <TableCell padding="checkbox">
        <Checkbox icon={<StarOutlineIcon />} checkedIcon={<StarIcon />} color="primary" onChange={handleFav} checked={fav} />
      </TableCell>
      <TableCell component="th" scope="row" padding="none">
        <Box sx={{ color: "inherit", textDecoration: "none" }} component={RouterLink} to={`/account/projects/${project.identifier}`}>
          <IconButton sx={{ minWidth: 37 }}>
            <img src={projectIcon} alt={project.id} />
          </IconButton>
          {project.name}
        </Box>
      </TableCell>
      <TableCell align="right" padding="checkbox">
        {project.id}
      </TableCell>
      <TableCell padding="checkbox" scope={project.project_type?.name}>
        <Chip size="small" label={project.project_type?.name} color="primary"></Chip>
      </TableCell>
      <TableCell align="right">
        <Stack direction={"row"} alignItems="baseline" spacing={1}>
          <Avatar style={{ width: 24, height: 24 }} {...stringAvatar("Kent Dod")} />
          <Typography>Kent Dod</Typography>
        </Stack>
      </TableCell>
      <TableCell align="left">
        <Stack direction="row">
          <AvatarGroup sx={{ ".MuiAvatarGroup-avatar": { width: 25, height: 25 } }} max={4}>
            {project?.members?.map(member => (
              <Avatar {...stringAvatar(member.name)} key={member.id} />
            ))}
          </AvatarGroup>
        </Stack>
      </TableCell>
      <TableCell padding="checkbox">
        <IconButton onClick={handleMenu}>
          <MoreHorizIcon />
        </IconButton>
      </TableCell>
      <Menu open={Boolean(menu)} anchorEl={menu} onClose={() => setMenu()}>
        {menuItems.map((item, i) => (
          <IconMenuItem key={item.id} {...item} />
        ))}
      </Menu>
    </TableRow>
  )
}
const IconMenuItem = ({ label, icon, ...props }) => (
  <MenuItem {...props}>
    <ListItemIcon>{icon} </ListItemIcon>
    <ListItemText>{label}</ListItemText>
  </MenuItem>
)

const menuItems = [
  { id: 1, label: "Edit", icon: <Edit /> },
  { id: 2, label: "Delete", icon: <Delete /> },
]
