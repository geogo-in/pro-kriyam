import { Attachment, Delete, DeleteOutline, Download, MoreVert } from "@mui/icons-material"
import AccountTreeIcon from "@mui/icons-material/AccountTreeOutlined"
import { LoadingButton } from "@mui/lab"
import {
  ListItemIcon,
  Menu,
  Alert,
  Button,
  CardContent,
  Grid,
  LinearProgress,
  Link,
  ListItemText,
  MenuItem,
  IconButton,
  IconButton as MuiIconButton,
  Stack,
  Typography,
  styled,
} from "@mui/material"
import Box from "@mui/material/Box"
import CardMedia from "@mui/material/CardMedia"
import { getCurrentUserKey } from "@redux/reducerSlices/user/userAuthSlice"
import { useDeleteIssueMutation, useGetIssueQuery, useGetProjectIssuesStatusesQuery, useUpdateIssuesMutation } from "@redux/services/issueApi"
import { useDeleteAttachmentMutation } from "@redux/services/redmineApi"
import { useSnackbar } from "notistack"
import { SleekSelectWithIcon } from "pages/shared/CustomTextField"
import IssueTypeIcon from "pages/shared/IssueTypeIcon"
import { LineCard as Card } from "pages/shared/StyledCard"
import { StyledTab, StyledTabs } from "pages/shared/StyledTabs"
import { StyledTooltip } from "pages/shared/StyledTooltip"
import TabPanel from "pages/shared/TabPanel"
import TypoTextField from "pages/shared/TypoTextField"
import { useRef, useState } from "react"
import { useSelector } from "react-redux"

import { getCurrentUserKey } from "@redux/reducerSlices/user/userAuthSlice"
import { useGetIssueQuery, useGetProjectIssuesStatusesQuery, useUpdateIssuesMutation } from "@redux/services/issueApi"
import { useDeleteAttachmentMutation } from "@redux/services/redmineApi"
import { useGetProjectByIdQuery } from "@redux/services/projectApi"

import { PATH_DASHBOARD } from "routes/paths"
import { copyTextToClipboard } from "utils/Copy"
import { getFileTypeIcon } from "utils/getFileTypeIcon"
import { getIssueStatusColor } from "utils/getIssueStatusColor"
import { getErrorMessage, getRandomMessage, issueDeleteMessages } from "utils/helper"
import { insertParam } from "utils/insertParams"
import CreateIssueRow from "./CreateIssueRow"
import IssueAbout from "./IssueAbout"
import IssueActivity from "./IssueActivity"
import IssueComments from "./IssueComments"
import IssueSubTasks from "./IssueSubTasks"

export const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 4,
  backgroundColor: "#F1F5F9",
  paddingLeft: 12,
  paddingRight: 12,
  lineHeight: 1.9,
  color: "#000",
  marginRight: 8,
  marginTop: 4,
  minWidth: 20,
}))
export const StyledListItemText = styled(ListItemText)(({ theme }) => ({ ".MuiTypography-root": { fontSize: "0.80rem" } }))

export default function IssueDetails({ project_id, issue_id, referrer = "issues", onClose }) {
  const { data: issue, isLoading, isError } = useGetIssueQuery(issue_id, { refetchOnMountOrArgChange: true })
  const { data: statuses } = useGetProjectIssuesStatusesQuery(project_id)
  const { data: project } = useGetProjectByIdQuery(project_id)

  const currentUserKey = useSelector(getCurrentUserKey)

  const [deleteIssue, { isLoading: isDeletingIssue }] = useDeleteIssueMutation()
  const [deleteAttachment, { isLoading: isDeletingAttachment }] = useDeleteAttachmentMutation()
  const [updateTask] = useUpdateIssuesMutation()
  const { enqueueSnackbar } = useSnackbar()
  const [tab, setTab] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [newSubtask, setNewSubtask] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const inputFile = useRef()
  const subtaskRef = useRef(null)

  const handleMenu = type => event => {
    setAnchorEl({ [type]: event.currentTarget })
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
      onClose()
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
    try {
      if (!window.confirm("Are you sure, you want to delete this issue?")) return
      await deleteIssue(issue.id).unwrap()
      const message = getRandomMessage(issueDeleteMessages)
      enqueueSnackbar(message, { variant: "success" })
      onClose()
    } catch (error) {
      const { message } = getErrorMessage(error)
      enqueueSnackbar(message, { variant: "error" })
    }
  }

  if (isLoading) return <LinearProgress />
  if (isError) return <Alert severity="error">error</Alert>

  return (
    <Box p={3}>
      <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
        {issue.parent?.id && (
          <Typography variant="body2" pl={1} sx={{ fontWeight: 500, mr: 1, color: theme => theme.palette.primary.defaultText }}>
            # {issue.parent?.id} /
          </Typography>
        )}

        <StyledTooltip title={issue.tracker?.name}>
          <IconButton size="small" onClick={handleMenu("tracker")}>
            <IssueTypeIcon type_name={issue.tracker?.name} />
          </IconButton>
        </StyledTooltip>
        <StyledTooltip title="Copy issue URL to clipboard" placement="right">
          <Typography
            variant="body2"
            pl={1}
            sx={{ fontWeight: 500, color: theme => theme.palette.primary.defaultText, cursor: "pointer" }}
            onClick={() => copyTextToClipboard(`${window.location.origin}${PATH_DASHBOARD.projects.root}/${project_id}/issues/${issue.id}`)}>
            #{issue.id}
          </Typography>
        </StyledTooltip>

        <Menu anchorEl={anchorEl?.tracker} open={Boolean(anchorEl?.tracker)} onClose={onClose}>
          {project?.tracker?.map(item => (
            <MenuItem key={item.id} onClick={handleIssueUpdate({ tracker_id: item.id })}>
              <ListItemIcon>
                <IssueTypeIcon type_name={item.name} type_id={item.id} />
              </ListItemIcon>
              <ListItemText>{item.name}</ListItemText>
            </MenuItem>
          ))}
        </Menu>

        <Typography
          variant="body2"
          pl={1}
          sx={{ fontWeight: 500, color: theme => theme.palette.primary.defaultText, cursor: "pointer" }}
          onClick={() => copyTextToClipboard(`${window.location.origin}${PATH_DASHBOARD.projects.root}/${project_id}/issues/${issue.id}`)}>
          #{issue.id}
        </Typography>
      </Stack>
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
          <CreateIssueRow project_id={project_id} parent_issue_id={issue_id} isEditable={newSubtask} />
        </>
      )}
      <Typography
        variant="body1"
        gutterBottom
        sx={{ display: "block", borderBottom: "1px solid rgba(229,231,235, 0.5)", pt: 1, pb: 0.5, mt: 2, mb: 1, fontWeight: 500, color: theme => theme.palette.primary.defaultText }}>
        Details
      </Typography>
      <IssueAbout {...issue} project_id={project_id} />

      <Box sx={{ borderTop: "1px solid rgba(229,231,235, 0.5)", pb: 2, mt: 3 }}>
        <StyledTabs value={tab} onChange={handleTabChange}>
          <StyledTab label="Comments" value={0} />
          <StyledTab label="Activities" value={1} />
        </StyledTabs>
        <TabPanel value={tab} index={0}>
          <IssueComments {...issue} project_id={project_id} />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          {issue.activity_logs?.map(activity => (
            <IssueActivity key={activity.id} {...activity} />
          ))}
        </TabPanel>
      </Box>
    </Box>
  )
}
