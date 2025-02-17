import AccountTreeIcon from "@mui/icons-material/AccountTree"
import AccountTreeIcon2 from "@mui/icons-material/AccountTreeOutlined"
import { Box, ButtonBase, Chip, IconButton, InputBase, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Stack, Typography } from "@mui/material"
import Collapse from "@mui/material/Collapse"
import { styled } from "@mui/system"
import { useGetEpicQuery, useGetIssuePriorityQuery, useUpdateIssuesMutation } from "@redux/services/issueApi"
import { useGetProjectByIdQuery } from "@redux/services/projectApi"
import { useSnackbar } from "notistack"
import IssuePriorityIcon from "pages/shared/IssuePriorityIcon"
import IssueTypeIcon from "pages/shared/IssueTypeIcon"
import MemberAvatar from "pages/shared/MemberAvatar"
import { StyledTooltip } from "pages/shared/StyledTooltip"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { PATH_DASHBOARD } from "routes/paths"
import { getIssueStatusColor } from "utils/getIssueStatusColor"
import { SprintBlankSubIssueItem, SprintIssueItem, StickyTitle } from "./SprintIssueComponents"
import SprintSubIssue from "./SprintSubIssue"

export const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  ".MuiTypography-root": {
    fontSize: "0.80rem",
  },
}))

export default function SprintIssue({
  project_memberships,
  project_statuses,
  story_point,
  sprint_id,
  child,
  disabledChildren,
  children,
  dragHandleProps,
  draggableProps,
  project_id,
  ...issue
}) {
  const { id, subject, status, priority, tracker, due_date, assigned_to, category: epic } = issue
  const { data: priorities } = useGetIssuePriorityQuery()
  const { data: epics } = useGetEpicQuery(project_id)
  const { data: project } = useGetProjectByIdQuery(project_id)

  const { enqueueSnackbar } = useSnackbar()
  const [updateTask] = useUpdateIssuesMutation()
  const [open, setOpen] = useState({ collapse: false, details: false })
  const [state, setState] = useState({ due_date, story_point })
  const [anchorEl, setAnchorEl] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  const backlogContainerWidth = useSelector(state => state.projectUi.backlogContainerWidth)
  const backlogTableWidth = useSelector(state => state.projectUi.backlogTableWidth)

  useEffect(() => {
    setState({ due_date, story_point })
  }, [due_date, story_point])

  const handleSubTask = () => {
    setOpen({ ...open, collapse: !open.collapse })
  }
  const handleMenu = type => event => {
    setAnchorEl({ [type]: event.currentTarget })
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDetails = () => {
    navigate(`${PATH_DASHBOARD.projects.root}/${project_id}/backlog/issues/${issue.id}?referrer=backlog`, { state: { background: location } })
  }

  const handleIssueUpdate = data => async () => {
    try {
      await updateTask({ id, ...data }).unwrap()
      handleClose()
    } catch (r) {
      console.error(r)
      enqueueSnackbar(r.data?.errors?.join(", "), { variant: "error" })
    }
  }
  const handleStoryPoint = e => {
    handleIssueUpdate({ story_point: e.target.value })()
  }

  let dummybarWidth = 0
  if (backlogTableWidth > 0 && backlogContainerWidth > backlogTableWidth) {
    dummybarWidth = backlogContainerWidth - backlogTableWidth - 1
  }

  return (
    <>
      <Stack
        component={Paper}
        sx={{ borderRadius: 0, boxShadow: "none", border: theme => theme.palette.mode === "light" ? ".1px solid #edeff1" : `.1px solid ${theme.palette.text.secondary}`, borderLeft: "none" }}
        direction="row"
        alignItems="center"
        pb={open.collapse ? 0 : ""}
        width="fit-content">
        <StickyTitle
          disabledChildren={disabledChildren}
          draggableProps={draggableProps}
          {...dragHandleProps}
          sx={{ display: "flex", cursor: "pointer", borderBottomLeftRadius: open.collapse ? 0 : "" , backgroundColor: "transparent" }}>
          <Box minWidth={10} sx={{ marginLeft: 1, marginRight: 1, position: "sticky", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <StyledTooltip title={`Issue type: ${tracker?.name}`} placement="left">
              <IconButton size="small" onClick={handleMenu("tracker")}>
                <IssueTypeIcon type_name={tracker?.name} />
              </IconButton>
            </StyledTooltip>
          </Box>
          {subject.length > 50 ? (
            <StyledTooltip title={subject} enterDelay={500}>
              {/* <Typography sx={{ alignSelf: "center", width: 350, fontSize: "0.88rem", fontWeight: 500, color: theme => theme.palette.primary.defaultText }} onClick={handleDetails} noWrap> */}
              <Typography sx={{ alignSelf: "center", width: 350, fontSize: "0.88rem", fontWeight: 500, color: theme => theme.palette.mode === "light" ? theme.palette.primary.defaultText : theme.palette.text.primary }} onClick={handleDetails} noWrap>
                {subject}
              </Typography>
            </StyledTooltip>
          ) : (
            <Typography sx={{ alignSelf: "center", width: 350, fontSize: "0.88rem", fontWeight: 500, color: theme => theme.palette.mode === "light" ? theme.palette.primary.defaultText : theme.palette.text.primary }} onClick={handleDetails} noWrap>
              {subject}
            </Typography>
          )}
        </StickyTitle>
        {!disabledChildren ? (
          <SprintIssueItem component={IconButton} size="small" disabled={!child} onClick={() => child && handleSubTask()}>
            {child ? <AccountTreeIcon sx={{ color: "#b8bec9" }} /> : <AccountTreeIcon2 sx={{ color: "#b8bec9" }} />}
            {child?.length && <Chip sx={{ ml: 1, background: "#41526e", color: "#FFF" }} size="small" label={child?.length} />}
          </SprintIssueItem>
        ) : (
          <SprintBlankSubIssueItem />
        )}
        <SprintIssueItem sx={{ color: theme => theme.palette.mode === "light" ? "#42526E" : theme.palette.text.secondary}}>{id}</SprintIssueItem>

        <SprintIssueItem>
          <IconButton size="small" onClick={handleMenu("membership")}>
            <MemberAvatar name={assigned_to?.name} tooltipPosition="right" />
          </IconButton>
        </SprintIssueItem>
        <SprintIssueItem sx={{ padding: "4px 0px" }}>
          <ButtonBase
            onClick={handleMenu("status")}
            sx={{ backgroundColor: getIssueStatusColor(status), color: "#42526E", padding: "9px 0", width: "100%", borderRadius: "1px", fontSize: "0.80rem" }}>
            {status?.name}
          </ButtonBase>
        </SprintIssueItem>
        <SprintIssueItem component={ButtonBase} onClick={handleMenu("priority")} sx={{ justifyContent: "flex-start", color: theme => theme.palette.mode === "light" ? "#42526E" : theme.palette.text.secondary }}>
          <Box sx={{ margin: "0 4px" }}>
            <IssuePriorityIcon type_name={priority?.name} />
          </Box>
          {priority?.name}
        </SprintIssueItem>
        <SprintIssueItem sx={{ padding: "4px 0px", width: "140px", maxWidth: "140px" }}>
          <ButtonBase
            onClick={handleMenu("epic")}
            sx={{
              backgroundColor: epics?.find(item => item.id === epic?.id)?.color_code || "inherit",
              color: "#FFFFFF",
              padding: "9px 6px",
              width: "100%",
              borderRadius: "1px",
              fontSize: "0.80rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              justifyContent: "flex-start",
              minHeight: "30px",
            }}>
            {epic?.name}
          </ButtonBase>
        </SprintIssueItem>
        <SprintIssueItem
          component={InputBase}
          type="number"
          placeholder="SP"
          inputProps={{ style: { textAlign: "center" } }}
          value={state.story_point || ""}
          onChange={e => setState({ ...state, story_point: e.target.value })}
          onBlur={handleStoryPoint}
          sx={{ width: 100, px: 1, color: theme => theme.palette.mode === "light" ? "#42526E" : theme.palette.text.secondary }}
        />
        <SprintIssueItem sx={{ color: theme => theme.palette.mode === "light" ? "#42526E" : theme.palette.text.secondary }}>{issue.author?.name}</SprintIssueItem>
        {/* <SprintIssueItem sx={{ width: 100, px: 1 }}>
          <MobileDatePicker
            label="Due Date"
            disableCloseOnSelect={false}
            value={state.due_date}
            disablePast
            inputFormat="DD/MM/YYYY"
            onChange={date => {
              setState({ ...state, due_date: date })
              handleIssueUpdate({ due_date: fDate(date, "YYYY-MM-DD") })()
            }}
            renderInput={({ InputProps, ...params }) => <InputBase {...params} />}
          />
        </SprintIssueItem> */}
        <Box sx={{ width: dummybarWidth }}></Box>
      </Stack>

      <Collapse in={open.collapse}>
        <SprintSubIssue {...{ children }} />
      </Collapse>
      <Menu anchorEl={anchorEl?.membership} open={Boolean(anchorEl?.membership)} onClose={handleClose}>
        <Typography variant="body2" sx={{ padding: "6px 12px", color: theme => theme.palette.mode === "light" ? "#64748b" : theme.palette.text.default }}>
          Change assignee to:{" "}
        </Typography>
        <MenuItem value="" onClick={handleIssueUpdate({ assigned_to_id: "" })} sx={{ margin: "1px 10px", borderRadius: "4px" }}>
          <ListItemIcon>
            <MemberAvatar tooltipPosition="left" />
          </ListItemIcon>
          Unassigned
        </MenuItem>
        {project_memberships?.map(({ user }) => {
          if (!user) return ""
          return (
            <MenuItem key={user.id} onClick={handleIssueUpdate({ assigned_to_id: user.id })} sx={{ margin: "1px 10px", borderRadius: "4px" }}>
              <ListItemIcon>
                <MemberAvatar name={user?.name} tooltipPosition="left" />
              </ListItemIcon>
              <StyledListItemText>{user?.name}</StyledListItemText>
            </MenuItem>
          )
        })}
      </Menu>
      <Menu anchorEl={anchorEl?.status} open={Boolean(anchorEl?.status)} onClose={handleClose}>
        <Typography variant="body2" sx={{ padding: "6px 12px", color: theme => theme.palette.mode === "light" ? "#64748b" : theme.palette.text.default }}>
          Change status to:{" "}
        </Typography>
        {project_statuses?.map(item => (
          <MenuItem
            key={item.id}
            onClick={handleIssueUpdate({ status_id: item.id })}
            sx={{ margin: "6px 12px", borderRadius: "4px", background: getIssueStatusColor(item), minWidth: "140px", color:"black" }}>
            <StyledListItemText>{item.name}</StyledListItemText>
          </MenuItem>
        ))}
      </Menu>
      <Menu anchorEl={anchorEl?.priority} open={Boolean(anchorEl?.priority)} onClose={handleClose}>
        <Typography variant="body2" sx={{ padding: "6px 12px", color: theme => theme.palette.mode === "light" ? "#64748b" : theme.palette.text.default }}>
          Change priority to:{" "}
        </Typography>
        {priorities?.map(item => (
          <MenuItem key={item.id} onClick={handleIssueUpdate({ priority_id: item.id })} sx={{ margin: "1px 10px", borderRadius: "4px", minWidth: "140px" }}>
            <ListItemIcon sx={{ color: item.color_code }}>
              <IssuePriorityIcon type_name={item.name} />
            </ListItemIcon>
            <StyledListItemText>{item.name}</StyledListItemText>
          </MenuItem>
        ))}
      </Menu>
      <Menu anchorEl={anchorEl?.tracker} open={Boolean(anchorEl?.tracker)} onClose={handleClose}>
        {project?.tracker?.map(item => (
          <MenuItem key={item.id} onClick={handleIssueUpdate({ tracker_id: item.id })}>
            <ListItemIcon>
              <IssueTypeIcon type_name={item.name} type_id={item.id} />
            </ListItemIcon>
            <ListItemText>{item.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
      <Menu anchorEl={anchorEl?.epic} open={Boolean(anchorEl?.epic)} onClose={handleClose}>
        <Typography variant="body2" sx={{ padding: "6px 12px", color: theme => theme.palette.mode === "light" ? "#64748b" : theme.palette.text.default }}>
          Change Epic to:{" "}
        </Typography>
        {epics?.length ? (
          epics.map(item => (
            <MenuItem
              key={item.id}
              onClick={handleIssueUpdate({ category_id: item.id })}
              sx={{
                margin: "6px 12px",
                borderRadius: "4px",
                background: item.color_code,
                minWidth: "160px",
                color: "white",
                "&:hover": { color: "white", opacity: 0.8, background: item.color_code },
              }}>
              <StyledListItemText>{item.name}</StyledListItemText>
            </MenuItem>
          ))
        ) : (
          <Typography p={1} variant="caption">
            No EPIC found. Create a new EPIC to assign.
          </Typography>
        )}
      </Menu>
    </>
  )
}
