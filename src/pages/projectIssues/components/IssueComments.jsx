import { Close, Done } from "@mui/icons-material"
import CheckIcon from "@mui/icons-material/Check"
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { LoadingButton } from "@mui/lab"
import { Box, Button, IconButton, Paper, Stack, Typography, styled } from "@mui/material"
import { getCurrentUser } from "@redux/reducerSlices/user/userAuthSlice"
import { useUpdateIssueCommentsMutation, useUpdateIssuesMutation } from "@redux/services/issueApi"
import { useGetProjectMembershipsQuery } from "@redux/services/projectApi"
import moment from "moment"
import { useSnackbar } from "notistack"
import Editor from "pages/shared/Editor"
import MemberAvatar from "pages/shared/MemberAvatar"
import { useState } from "react"
import { useSelector } from "react-redux"
import { fDateTime } from "utils/formatDate"
import { getErrorMessage } from "utils/helper"

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

const IssueComments = ({ project_id, comments, sprint, author, priority, assigned_to, category, created_on, updated_on, ...issue }) => {
  const [updateTask, { isLoading }] = useUpdateIssuesMutation()
  const [updateComments] = useUpdateIssueCommentsMutation()
  const { data } = useGetProjectMembershipsQuery(project_id)
  const { enqueueSnackbar } = useSnackbar()
  const [comment, setComment] = useState("")
  const currentUser = useSelector(getCurrentUser)
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedText, setEditedText] = useState("");

  const handleIssueUpdate = async (data) => {
    try {
      if (editingCommentId !== null){
        await updateComments({ id: issue.id, comment_id: editingCommentId, comment: data.notes }).unwrap()
        setEditingCommentId(null)
      }else{
        await updateTask({ id: issue.id, ...data }).unwrap()
        setComment("")
      }
    } catch (r) {
      const { message } = getErrorMessage(r)
      enqueueSnackbar(message, { variant: "error" })
    }
  }

  return (
    <>
      <Box p={1} pb={1.5}>
        {comments.map(({ user, notes, id, created_on }) => (
          <Stack key={id} direction="row" spacing={1} alignItems="flex-start" pt={0.7} mb={1}>
            <Box sx={{ mt: 0.5 }}>
              <MemberAvatar name={user?.name} tooltipPosition="none" />
            </Box>
            <Box>
              <Box sx={{ display: "flex", mb: 0.5, alignItems: "center" }}>
                <Typography sx={{ fontWeight: 500, fontSize: "0.8rem", color: theme => theme.palette.mode === "light" ? "" : theme.palette.primary.secondaryText }}>{user?.name}</Typography>
                <Typography variant="caption" pl={1} component="div" sx={{ color: theme => theme.palette.mode === "light" ? theme.palette.primary.tertiaryText : "#979BA6" }}>
                  {fDateTime(created_on)}
                </Typography>
                {currentUser.id === user?.id && editingCommentId !== id && (
                  <Box >  
                    <IconButton disabled={moment().diff(moment(created_on), "hours") > 12} onClick={() =>  (setEditingCommentId(id), setEditedText(notes))}>
                      {editingCommentId === id ? <CheckIcon fontSize="small" /> : <EditOutlinedIcon sx={{ color: theme => (moment().diff(moment(created_on), "hours") > 12) ? "" : theme.palette.mode === "light" ? "" : theme.palette.primary.secondaryText }} fontSize="small" />}
                    </IconButton>
                  </Box>
                )}
              </Box>
              {editingCommentId === id ? (
                <Box position={"relative"} sx={{ flex: 1 }}>
                  <Box sx={{width: "100%", overflow: "hidden", whiteSpace: "nowrap"}}>
                    <Editor value={editedText} onChange={e => setEditedText(e)} style={{ height: 250, width: "100%" }} people={data?.filter(d => d.user).map(({ user }) => ({ id: user.id, value: user.name }))} />
                  </Box>
                  <Box position={"absolute"} bottom={-40} right={0} zIndex={100000}>
                    <Button onClick={() => {setEditingCommentId(null), setEditedText(null)}} sx={{ color: theme => theme.palette.mode === "light" ? theme.palette.primary.defaultText : "#f1f5f9", minWidth: 48, background: theme => theme.palette.mode === "light" ? "#f1f5f9" : "", ml: 1 }}>
                      <Close />
                    </Button>
                    <Button variant="contained" onClick={() => handleIssueUpdate({ notes: editedText })} sx={{ minWidth: 48, ml: 1, boxShadow: "none" }}>
                      <Done />
                    </Button>
                  </Box>
                </Box>
              ) : (
                <StyledPaper variant="outlined" dangerouslySetInnerHTML={{ __html: notes }} />
              )}
            </Box>                
          </Stack>
        ))}
      </Box>
      <Stack spacing={1}>
        <Typography variant="body1" gutterBottom sx={{ color: theme => theme.palette.mode === "light" ? theme.palette.primary.defaultText : theme.palette.primary.secondaryText, fontWeight: 500 }}>
          Add a comment
        </Typography>
        <Box>
          <Editor value={comment} onChange={e => setComment(e)} style={{ height: 250 }} people={data?.filter(d => d.user).map(({ user }) => ({ id: user.id, value: user.name }))} />
        </Box>

        <LoadingButton loading={isLoading} mt={1} variant="contained" onClick={() => handleIssueUpdate({ notes: comment })} sx={{ alignSelf: "flex-start", borderRadius: "4px" }}>
          Save comment
        </LoadingButton>
      </Stack>
    </>
  )
}

export default IssueComments