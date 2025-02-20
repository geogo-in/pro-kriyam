import { alpha, Box, styled } from "@mui/material"
import { ITEM_HEIGHT } from "utils/Backlog"

export const SprintIssueItem = styled(Box)(({ theme }) => ({
  minWidth: 100,
  maxWidth: 100,
  minHeight: ITEM_HEIGHT,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRight: theme.palette.mode === "light" ? "0.1px solid #ebebeb" : ".1px solid #444444",
  borderRadius: 0,
  color: theme.palette.mode === "light" ? "#42526E" : theme.palette.primary.secondaryText,
  fontSize: "0.8rem",
  "&:last-child": {
    // borderTopRightRadius: 4,
    // borderBottomRightRadius: 4,
    // borderRight: `2px solid ${theme.palette.primary.main}`,
  },
}))
export const SprintBlankSubIssueItem = styled(Box)(({ theme }) => ({
  minWidth: 58,
  maxWidth: 58,
  minHeight: ITEM_HEIGHT,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRight: theme.palette.mode === "light" ? "0.1px solid #ebebeb" : ".1px solid #444444",
  borderRadius: 0,
  color: theme.palette.mode === "light" ? "#42526E" : theme.palette.primary.secondaryText,
  fontSize: "0.8rem",
  "&:last-child": {
    // borderTopRightRadius: 4,
    // borderBottomRightRadius: 4,
    borderRight: theme.palette.mode === "light" ? `2px solid ${theme.palette.primary.main}` : "2px solid #444444",
  },
}))

export const StickyTitle = styled("div", { shouldForwardProp: prop => !["draggableProps", "header", "disabledChildren"].includes(prop) })(
  ({ theme, header, disabledChildren, draggableProps, ...props }) => ({
    backgroundColor: alpha(header ? theme.palette.background.default : theme.palette.common.white, 0.95),
    borderRight: header || disabledChildren ? "none" : theme.palette.mode === "light" ? "0.1px solid #ebebeb" : ".1px solid #444444",
    borderRadius: 0, //TO-DO: use only for header
    position: draggableProps?.style?.position === "fixed" ? "" : "sticky",
    overflow: "hidden",
    minHeight: ITEM_HEIGHT,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    width: header ? 432 : 400,
    left: 0,
    zIndex: theme.zIndex.drawer,
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  })
)
