import { Close, Done } from "@mui/icons-material"
import CheckIcon from "@mui/icons-material/Check"
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { LoadingButton } from "@mui/lab"
import { Box, Button, IconButton, Paper, Stack, Typography, styled } from "@mui/material"
import { getCurrentUser } from "@redux/reducerSlices/user/userAuthSlice"
import { useUpdateIssuesMutation } from "@redux/services/issueApi"
import { useGetProjectMembershipsQuery } from "@redux/services/projectApi"
import { useSnackbar } from "notistack"
import Editor from "pages/shared/Editor"
import MemberAvatar from "pages/shared/MemberAvatar"
import { useState } from "react"
import { useSelector } from "react-redux"
import { fDateTime } from "utils/formatDate"
import { getErrorMessage } from "utils/helper"

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: "8px 16px",
  border: "1px solid #E4EEF5",
  background: "#f1f5f9",
  fontSize: "0.85rem",
  width: "100%",
  wordBreak: "break-word",
  borderRadius: "0 20px 20px 20px",
  "& .mention": {
    background: theme.palette.primary.main,
    color: "white",
    borderRadius: 15,
    padding: 3,
  },
}))

const IssueComments = ({ project_id, comments, sprint, author, priority, assigned_to, category, created_on, updated_on, ...issue }) => {
  const [updateTask, { isLoading }] = useUpdateIssuesMutation()
  const { data } = useGetProjectMembershipsQuery(project_id)
  const { enqueueSnackbar } = useSnackbar()
  const [comment, setComment] = useState("")
  const currentUser = useSelector(getCurrentUser)
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedText, setEditedText] = useState("");

  const handleIssueUpdate = async (data) => {
    try {
      if (editingCommentId !== null){
        await updateTask({ id: issue.id, comments_id: editingCommentId, ...data }).unwrap()
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
  
  const allowEdit = (created_on) => {
    return new Date().getTime()-new Date(created_on).getTime() > 12*60*60*1000
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
                <Typography sx={{ fontWeight: 500, fontSize: "0.8rem" }}>{user?.name}</Typography>
                <Typography variant="caption" pl={1} component="div" sx={{ color: theme => theme.palette.primary.tertiaryText }}>
                  {fDateTime(created_on)}
                </Typography>
                {currentUser.id === user?.id && editingCommentId !== id && (
                  <Box >  
                    <IconButton disabled={allowEdit(created_on)} onClick={() =>  (setEditingCommentId(id), setEditedText(notes))}>
                      {editingCommentId === id ? <CheckIcon fontSize="small" /> : <EditOutlinedIcon fontSize="small" />}
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
                    <Button onClick={() => {setEditingCommentId(null), setEditedText(null)}} sx={{ color: theme => theme.palette.primary.defaultText, minWidth: 48, background: "#f1f5f9", ml: 1 }}>
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
        <Typography variant="body1" gutterBottom sx={{ color: theme => theme.palette.primary.defaultText, fontWeight: 500 }}>
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
