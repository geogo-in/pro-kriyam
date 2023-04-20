import { styled } from "@mui/material"
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip"

export const StyledTooltip = styled(({ className, ...props }) => <Tooltip enterDelay={10} {...props} arrow classes={{ popper: className }} />)(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    fontSize: 12,
  },
}))
