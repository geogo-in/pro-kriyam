import { Box, Stack, Typography } from "@mui/material"
import { useLayoutEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setBacklogTableWidth } from "@redux/reducerSlices/ui/projectUiSlice"
import { ITEM_HEIGHT } from "utils/Backlog"
import SprintHeaderActionbar from "./SprintHeaderActionbar"
import { StickyTitle } from "./SprintIssueComponents"

export default function SprintHeader({ project_id, activeSprint, epicContainerWidth, ...sprint }) {
  const dispatch = useDispatch()
  const tableRef = useRef()
  const backlogContainerWidth = useSelector(state => state.projectUi.backlogContainerWidth)
  const backlogTableWidth = useSelector(state => state.projectUi.backlogTableWidth)
  useLayoutEffect(() => {
    if (tableRef.current && tableRef.current.offsetWidth > backlogTableWidth) {
      dispatch(setBacklogTableWidth(tableRef.current.offsetWidth))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  let dummybarWidth = 0
  if (backlogTableWidth > 0 && backlogContainerWidth > backlogTableWidth) {
    dummybarWidth = backlogContainerWidth - backlogTableWidth
  }
  return (
    <>
      <SprintHeaderActionbar {...sprint} {...{ activeSprint, project_id, epicContainerWidth }} />
      {sprint.issues.length > 0 && (
        <Stack direction="row" alignItems="end" py={0}>
          <Stack direction="row" sx={{ background: "rgba(255,255,255,0.6)" }} ref={tableRef}>
            <StickyTitle sx={{ display: "flex", alignItems: "center", cursor: "pointer", border: "0.1px solid #ebebeb", borderLeft: "none" }}>
              <Typography sx={{ width: 432, paddingLeft: "44px", fontSize: "0.85rem", color: theme => theme.palette.primary.secondaryText }}>Issue summary</Typography>
            </StickyTitle>
            {SPRINT_ISSUE_HEADERS.map(d => (
              <Typography
                key={d}
                minWidth={100}
                maxWidth={d === "Epic" ? 140 : 100}
                width={d === "Epic" ? 140 : 100}
                minHeight={ITEM_HEIGHT}
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{ border: "0.1px solid #ebebeb", fontSize: "0.75rem", color: theme => theme.palette.primary.secondaryText }}>
                {d}
              </Typography>
            ))}
            <Box sx={{ width: dummybarWidth }}></Box>
          </Stack>
        </Stack>
      )}
    </>
  )
}

const SPRINT_ISSUE_HEADERS = ["Subtask", "Issue ID", "Assignee", "Status", "Priority", /*"Issue type",*/ "Epic", "Story Points", "Reporter" /*"Due Date"*/]
