import { Attachment, Delete, DeleteOutline, Download, MoreVert } from "@mui/icons-material"
import AccountTreeIcon from "@mui/icons-material/AccountTreeOutlined"
import { LoadingButton } from "@mui/lab"
import { DialogContentFull, DialogHeader } from "pages/shared/StyledDialog"

import {
  Alert,
  Button,
  CardContent,
  Grid,
  IconButton,
  LinearProgress,
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  IconButton as MuiIconButton,
  Paper,
  Select,
  Stack,
  Typography,
  styled,
} from "@mui/material"
import Box from "@mui/material/Box"
import CardMedia from "@mui/material/CardMedia"
import { getCurrentUserKey } from "@redux/reducerSlices/user/userAuthSlice"
import { useDeleteIssueMutation, useGetIssueQuery, useGetProjectIssuesStatusesQuery, useUpdateIssuesMutation } from "@redux/services/issueApi"
import { useGetProjectByIdQuery } from "@redux/services/projectApi"
import { useDeleteAttachmentMutation } from "@redux/services/redmineApi"
import { skipToken } from "@reduxjs/toolkit/dist/query"

import { getCurrentUser, isAdmin } from "@redux/reducerSlices/user/userAuthSlice"
import moment from "moment"
import { useSnackbar } from "notistack"
import { SleekSelectWithIcon } from "pages/shared/CustomTextField"
import IssueTypeIcon from "pages/shared/IssueTypeIcon"
import { LineCard as Card } from "pages/shared/StyledCard"
import { StyledTooltip } from "pages/shared/StyledTooltip"
import TypoTextField from "pages/shared/TypoTextField"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { PATH_DASHBOARD } from "routes/paths"
import { copyTextToClipboard } from "utils/Copy"
import { getFileTypeIcon } from "utils/getFileTypeIcon"
import { getIssueStatusColor } from "utils/getIssueStatusColor"
import { getErrorMessage, getRandomMessage, issueDeleteMessages } from "utils/helper"

import MemberAvatar from "pages/shared/MemberAvatar"
import { fDate } from "utils/formatDate"
import { insertParam } from "utils/insertParams"
import CreateIssueRow from "./CreateIssueRow"
import IssueAbout from "./IssueAbout"
import IssueActivity from "./IssueActivity"
import IssueComments from "./IssueComments"
import IssueSubTasks from "./IssueSubTasks"

export const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 4,
  backgroundColor: theme.palette.mode === "light" ? "#F1F5F9" : theme.palette.background.default,
  paddingLeft: 12,
  paddingRight: 12,
  lineHeight: 1.9,
  color: "#000",
  marginRight: 8,
  marginTop: 4,
  minWidth: 20,
}))

// const StyledPaper = styled(Paper)(({ theme }) => ({
//   background: "transparent",
//   fontSize: "0.85rem",
//   boxShadow: "none",
//   width: "100%",
//   wordBreak: "break-word",
//   color: theme.palette.mode === "light" ? "" : theme.palette.primary.secondaryText,
//   "& .mention": {
//     background: "transparent",
//     color: theme.palette.mode === "light" ? "" : theme.palette.primary.secondaryText,
//   },
// }))

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: "8px 16px",
  border: theme.palette.mode === "light" ? "1px solid #E4EEF5" : `1px solid ${theme.palette.background.default}`,
  background: theme.palette.mode === "light" ? "#f1f5f9" : theme.palette.background.default,
  fontSize: "0.85rem",
  width: "100%",
  wordBreak: "break-word",
  borderRadius: "0 20px 20px 20px",
  color: theme.palette.mode === "light" ? "" : theme.palette.primary.secondaryText,
  "& .mention": {
    background: theme.palette.primary.main,
    color: theme.palette.mode === "light" ? "" : theme.palette.primary.secondaryText,
    borderRadius: 15,
    padding: 3,
  },
}))

export const StyledListItemText = styled(ListItemText)(({ theme }) => ({ ".MuiTypography-root": { fontSize: "0.80rem" } }))

export default function IssueDetails({ project_id, issue_id, referrer = "issues", onClose }) {
  const { data: issue, isLoading, isError } = useGetIssueQuery(issue_id, { refetchOnMountOrArgChange: true })
  const { data: statuses } = useGetProjectIssuesStatusesQuery(project_id)
  const { data: project, isLoading: isLoadingProject } = useGetProjectByIdQuery(project_id || skipToken)

  const currentUserKey = useSelector(getCurrentUserKey)

  const [deleteIssue, { isLoading: isDeletingIssue }] = useDeleteIssueMutation()
  const [deleteAttachment, { isLoading: isDeletingAttachment }] = useDeleteAttachmentMutation()
  const [updateTask] = useUpdateIssuesMutation()
  const isSystemAdmin = useSelector(isAdmin)
  const currentUser = useSelector(getCurrentUser)

  const { enqueueSnackbar } = useSnackbar()
  const [tab, setTab] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [newSubtask, setNewSubtask] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedActivity,setSelectedActivity] = useState("comment")
  const [allActivity, setAllActivity] = useState(null)

  useEffect(() => {
    if (issue){
      const allEntries = [...issue?.activity_logs, ...issue?.comments]
      allEntries.sort((a, b) => moment(a.created_on).diff(moment(b.created_on)))
      setAllActivity(allEntries)
    }
  },[issue])

  const inputFile = useRef()
  const subtaskRef = useRef(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleTabChange = (e, newValue) => {
    setTab(newValue)
  }

  const handleCreateSubtask = async () => {
    await setNewSubtask(true)
    await subtaskRef.current.scrollIntoView({ behavior: "smooth" })
  }

  const handleUpdate = async data => {
    await updateTask({ id: issue_id, ...data }).unwrap()
  }
  const handleIssueUpdate = data => async () => {
    try {
      await updateTask({ id: issue_id, ...data }).unwrap()
    } catch (r) {
      const { message } = getErrorMessage(r)
      enqueueSnackbar(message, { variant: "error" })
    }
  }
  const handleAttachment = e => {
    inputFile.current?.click()
  }
  const onChangeFile = async event => {
    try {
      event.stopPropagation()
      event.preventDefault()
      var file = event.target.files[0]
      if (file) {
        setIsUploading(true)
        await updateTask({ id: issue_id, file }).unwrap()
        setIsUploading(false)
      }
    } catch (r) {
      const { message } = getErrorMessage(r)
      enqueueSnackbar(message, { variant: "error" })
    }
  }
  const handleDeleteAttachment = id => async e => {
    e.stopPropagation()
    e.preventDefault()
    await deleteAttachment({ id, invalidatesTags: ["Issue"] }).unwrap()
  }
  const handleIssueDelete = async () => {
    if (isSystemAdmin || project?.lead?.id === currentUser.id) {
      try {
        if (!window.confirm("Are you sure, you want to delete this issue?")) return
        await deleteIssue(issue.id).unwrap()
        const message = getRandomMessage(issueDeleteMessages)
        enqueueSnackbar(message, { variant: "success", title: "Success!" })
        onClose()
      } catch (error) {
        const { message } = getErrorMessage(error)
        enqueueSnackbar(message, { variant: "error", title: "Oops!" })
      }
    } else {
      enqueueSnackbar("Only admins and project lead can delete issues", { variant: "error", title: "Oops!" })
    }
  }

  if (isLoading || isLoadingProject) return <LinearProgress />
  if (isError) return <Alert severity="error">error</Alert>
  // console.log(project)
  return (
    <Box>
      <DialogHeader>
        <Typography variant="h6" sx={{ display: "flex", width: "100%", alignItems: "center" }}>
          {issue.parent?.id && (
            <Typography variant="body2" pl={1} sx={{ fontWeight: 500, mr: 1, color: theme => theme.palette.mode === "light" ? theme.palette.primary.defaultText : theme.palette.primary.secondaryText }}>
              # {issue.parent?.id} /
            </Typography>
          )}
          <StyledTooltip title={issue.tracker?.name}>
            <Box display="flex">
              <IssueTypeIcon type_name={issue.tracker?.name} />
            </Box>
          </StyledTooltip>
          <StyledTooltip title="Copy issue URL to clipboard" placement="right">
            <Typography
              variant="body2"
              pl={1}
              sx={{ fontWeight: 500, color: theme => theme.palette.mode === "light" ? theme.palette.primary.defaultText : theme.palette.primary.secondaryText, cursor: "pointer" }}
              onClick={() => copyTextToClipboard(`${window.location.origin}${PATH_DASHBOARD.projects.root}/${project_id}/${referrer}/issues/${issue.id}?referrer=${referrer}`)}>
              #{issue.id}
            </Typography>
          </StyledTooltip>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={handleClick}>
            <MoreVert />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={handleIssueDelete}>
              <ListItemIcon>
                <Delete fontSize="small" />
              </ListItemIcon>
              Delete
            </MenuItem>
          </Menu>
        </Typography>
      </DialogHeader>
      <DialogContentFull sx={{ pt: 1 }}>
        <Box sx={{ minHeight: "44px" }}>
          <TypoTextField variant="h6" py={0.8} value={issue.subject} name="subject" onSubmit={handleUpdate} />
        </Box>
        <Stack direction="row" alignItems="flex-start">
          <StyledTooltip title="Add attachment">
            <StyledButton component={LoadingButton} onClick={handleAttachment} loading={isUploading}>
              <Attachment sx={{ color: theme => theme.palette.primary.secondaryText }} />
            </StyledButton>
          </StyledTooltip>
          <input type="file" id="file" onChange={onChangeFile} ref={inputFile} style={{ display: "none" }} />
          {!issue.parent && (
            <StyledTooltip title="Create subtask">
              <StyledButton>
                <AccountTreeIcon onClick={handleCreateSubtask} sx={{ color: theme => theme.palette.primary.secondaryText }} />
              </StyledButton>
            </StyledTooltip>
          )}
          <SleekSelectWithIcon
            value={issue.status?.id}
            variant="outlined"
            bgcolor={getIssueStatusColor(issue.status)}
            sx={{ minWidth: 100 }}
            onChange={e => handleIssueUpdate({ status_id: e.target.value })()}>
            {statuses?.map(item => (
              <MenuItem key={item.id} value={item.id}>
                <ListItemText>{item.name}</ListItemText>
              </MenuItem>
            ))}
          </SleekSelectWithIcon>
        </Stack>
        <Typography variant="body1" gutterBottom sx={{ mt: 2, fontWeight: 500, color: theme => theme.palette.primary.defaultText }}>
          Description
        </Typography>
        <TypoTextField
          variant="body2"
          textFieldProps={{ fullWidth: true, multiline: true }}
          editor
          value={issue.description}
          placeholder="Add a more detailed description..."
          placeholderColor={theme => theme.palette.primary.defaultText}
          name="description"
          bgcolor="#f6f9fb"
          onSubmit={handleUpdate}
        />
        {issue.attachments?.length ? (
          <>
            <Typography
              variant="body1"
              gutterBottom
              sx={{ display: "block", borderBottom: "1px solid rgba(229,231,235, 0.5)", pt: 1, pb: 0.5, mt: 2, mb: 1, fontWeight: 500, color: theme => theme.palette.primary.defaultText }}>
              Attachments
            </Typography>
            <Grid container spacing={1}>
              {issue.attachments?.map(({ thumbnail_url, created_on, filename, content_url, content_type, id }) => {
                return (
                  <Grid key={id} lg={3} item>
                    <Card sx={{ position: "relative", "&:hover": { "& .attachActionbar": { display: "block" } } }}>
                      {content_type === "image/jpeg" || content_type === "image/png" ? (
                        <CardMedia component="img" alt="green iguana" height="90" image={insertParam(content_url, currentUserKey)} />
                      ) : (
                        <CardMedia component="img" alt="green iguana" height="90" image={getFileTypeIcon(content_type)} />
                      )}
                      <CardContent sx={{ py: "4px" }}>
                        <Typography variant="body2" noWrap component="p">
                          {filename}
                        </Typography>
                      </CardContent>
                      <Box
                        className="attachActionbar"
                        sx={{ background: "rgba(50,51,52, 0.6)", position: "absolute", width: "100%", height: "90px", zIndex: 100, top: 0, right: 0, display: "none" }}>
                        <Box sx={{ width: "100%", height: "90px", px: 1, py: "6px", display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
                          <MuiIconButton sx={{ color: "white" }} disabled={isDeletingAttachment} onClick={handleDeleteAttachment(id)}>
                            <DeleteOutline />
                          </MuiIconButton>
                          <MuiIconButton sx={{ color: "white" }} disabled={isDeletingAttachment} component={Link} href={insertParam(content_url, currentUserKey)} target="_blank">
                            <Download />
                          </MuiIconButton>
                        </Box>
                      </Box>

                      <Stack px={0.7}></Stack>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          </>
        ) : (
          <span />
        )}
        {!issue.parent && (
          <>
            <Typography
              variant="body1"
              gutterBottom
              ref={subtaskRef}
              sx={{ display: "block", borderBottom: "1px solid rgba(229,231,235, 0.5)", pt: 1, pb: 0.5, mt: 2, mb: 1, fontWeight: 500, color: theme => theme.palette.primary.defaultText }}>
              Subtasks
            </Typography>
            <IssueSubTasks {...issue} project_id={project_id} referrer={referrer} />
            <CreateIssueRow project_id={project_id} parent_issue_priority={issue.priority} parent_issue_id={issue_id} isEditable={newSubtask} />
          </>
        )}
        <Typography
          variant="body1"
          gutterBottom
          sx={{ display: "block", borderBottom: "1px solid rgba(229,231,235, 0.5)", pt: 1, pb: 0.5, mt: 2, mb: 1, fontWeight: 500, color: theme => theme.palette.primary.defaultText }}>
          Details
        </Typography>
        {/* {project?.project_type?.name === "Kanban" ? <KanbanIssueAbout {...issue} project_id={project_id} /> : <IssueAbout {...issue} project_id={project_id} />} */}
        <IssueAbout {...issue} project_id={project_id} project_type={project?.project_type?.name} />
        <Box sx={{ borderTop: "1px solid rgba(229,231,235, 0.5)", pb: 2, mt: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2, borderBottom: "1px solid rgba(229,231,235, 0.5)", pt: 1, pb: 1, mt: 2, mb: 1 }} >
            <Typography
              variant="body1"
              gutterBottom
              sx={{ display: "block", fontWeight: 500, color: theme => theme.palette.primary.defaultText }}>
              Activity
            </Typography>
            <Select size="small" value={selectedActivity} onChange={(e) => setSelectedActivity(e.target.value)} >
              <MenuItem value="comment">Comments</MenuItem>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="history">History</MenuItem>
            </Select>
          </Box>
          {selectedActivity === "comment" ? <IssueComments {...issue} project_id={project_id} /> : selectedActivity === "history" ? 
            issue.activity_logs?.map(activity => (
              <IssueActivity tag={false} key={activity.id} statuses={statuses} project={project} {...activity} />
            )) : selectedActivity === "all" ? allActivity.map(activity => (
              (activity.notes !== "" || activity.details.length === 0) ? 
                <Stack spacing={1} direction="row" mt={1} pt={0.7} mb={1}>
                  <Box>
                    <MemberAvatar name={activity.user?.name} tooltipPosition="none" />
                  </Box>
            
                  <Grid container columns={12}>
                    <Grid sx={{ mb: 0.5 }} item xs={9}>
                      <Typography>{activity.user?.name}{" "}
                      <Box sx={{fontSize: "0.8rem"}} component="span" noWrap key={`activity-${activity.id}`} color="text.secondary"  fontWeight={300}>
                        added a comment
                      </Box>
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography color="text.secondary" variant="tiny">
                        {fDate(activity?.created_on, "dd D/M, h:mm A z")}
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <StyledPaper variant="outlined" dangerouslySetInnerHTML={{ __html: activity.notes}} />
                    </Grid>
                  </Grid>
                </Stack>
                : <IssueActivity tag={true} key={activity.id} statuses={statuses} project={project} {...activity} />
            )) : null
          }
        </Box>
      </DialogContentFull>
    </Box>
  )
}
