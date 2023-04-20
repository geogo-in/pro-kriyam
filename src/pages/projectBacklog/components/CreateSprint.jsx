import { Add, Done } from "@mui/icons-material"
import { LoadingButton } from "@mui/lab"
import { Box, Button, ClickAwayListener, InputBase, Paper, styled } from "@mui/material"
import { useSnackbar } from "notistack"
import { useState } from "react"
import { useCreateSprintMutation } from "@redux/services/redmineApi"

export const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 4,
  border: `1px solid #FFF`,
  backgroundColor: "#F1F5F9",
  paddingLeft: 20,
  paddingRight: 24,
  lineHeight: 1.8,
  color: "#000",
}))

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "20px",
  marginTop: 3,
  padding: "0px 0px 0px 20px",
  display: "flex",
  alignItems: "center",
  width: 320,
}))

const StyledLoadingButton = styled(LoadingButton)(({ theme }) => ({
  borderRadius: "20px",
}))

const initialValue = { name: "", editable: false }

const CreateSprint = ({ project }) => {
  const [createSprint, { isLoading: isSprintCreating }] = useCreateSprintMutation()
  const [state, setState] = useState(initialValue)
  const { enqueueSnackbar } = useSnackbar()

  const handleChange = e => {
    setState({ ...state, name: e.target.value })
  }

  const handleEditable = e => {
    setState({ name: "", editable: !state.editable })
  }

  const handleCreateSprintDialog = async e => {
    try {
      e?.preventDefault()
      await createSprint({ project_id: project.id, name: state.name }).unwrap()
      setState(initialValue)
      const sprintEl = document.getElementById(`sprint-backlog`)
      sprintEl.scrollIntoView()
    } catch (error) {
      console.error(error)
      enqueueSnackbar(error?.data?.message, { variant: "error", anchorOrigin: { horizontal: "right", vertical: "top" } })
    }
  }

  return (
    <Box display={"flex"} alignItems={"center"}>
      {state.editable ? (
        <ClickAwayListener onClickAway={handleEditable}>
          <StyledPaper onSubmit={handleCreateSprintDialog} component="form">
            <InputBase autoFocus sx={{ ml: 1, flex: 1 }} placeholder="Enter sprint name" disabled={isSprintCreating} value={state.name} onChange={handleChange} />
            <StyledLoadingButton type="submit" variant="contained" disableElevation loading={isSprintCreating} edge="end">
              <Done />
            </StyledLoadingButton>
          </StyledPaper>
        </ClickAwayListener>
      ) : (
        <StyledButton startIcon={<Add />} onClick={handleEditable}>
          Create Sprint
        </StyledButton>
      )}
    </Box>
  )
}

export default CreateSprint
