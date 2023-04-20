import { Circle } from "@mui/icons-material"
import { CardHeader, Divider, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Skeleton, Typography } from "@mui/material"
import { useSnackbar } from "notistack"
import { useGetIssuePriorityQuery } from "@redux/services/issueApi"

// const initialState = { name: "", is_closed: false, color_code: EPIC_COLORS[0] }
export default function ProjectIssuePriority({ project_id }) {
  // const [createProjectIssueStatus, { isLoading: isCreating }] = useCreateProjectIssueStatusMutation()
  const { data: priorities, isLoading } = useGetIssuePriorityQuery()
  // const [state, setState] = useState(initialState)
  const { enqueueSnackbar } = useSnackbar()

  // const handleChange = e => {
  //   setState({ ...state, [e.target.name]: e.target.value })
  // }
  const handleSubmit = async e => {
    try {
      e.preventDefault()
      // await createProjectIssueStatus({ project_id, ...state }).unwrap()
      // setState(initialState)
    } catch (error) {
      console.error(error)
      enqueueSnackbar(error.data?.message, { variant: "error" })
    }
  }

  return (
    <Paper component="form" onSubmit={handleSubmit} sx={{ width: 320, maxWidth: "100%" }}>
      <CardHeader title="Issue Priority" />
      <Divider />
      <MenuList>
        {isLoading ? (
          [1, 2, 3, 4].map(e => (
            <MenuItem disabled key={e}>
              <ListItemIcon>
                <Skeleton animation="wave" variant="circular" width={20} height={20} />{" "}
              </ListItemIcon>
              <ListItemText>
                <Skeleton key={e} height={10} />
              </ListItemText>
            </MenuItem>
          ))
        ) : priorities?.length ? (
          priorities.map(({ id, name, color_code }) => (
            <MenuItem key={id}>
              <ListItemIcon sx={{ color: color_code }}>
                <Circle fontSize="small" />
              </ListItemIcon>
              <ListItemText>{name}</ListItemText>
            </MenuItem>
          ))
        ) : (
          <Typography pb={1} align="center" color="text.secondary">
            No priority found.
          </Typography>
        )}
        {/* <Divider />
        <Stack direction="row" spacing={1} px={1} alignItems="center">
          <SelectWithIcon margin="none" sx={{ minWidth: 0 }} required value={state.color_code} onChange={handleChange} name="color_code">
            <MenuItem value="ArrowDownward">
              <ArrowDownwardIcon />
            </MenuItem>
            <MenuItem value="ArrowUpward">
              <ArrowUpwardIcon />
            </MenuItem>
          </SelectWithIcon>
          <InputBase inputProps={{ autoCapitalize: "words" }} required type="text" autoFocus size="small" placeholder="New Status" name="name" onChange={handleChange} value={state.name} />
          <Button disabled={isCreating} variant="contained" type="submit" size="small">
            {isCreating && <CircularProgress size={20} />} Add
          </Button>
        </Stack> */}
      </MenuList>
    </Paper>
  )
}

// TO-DO: not in use
