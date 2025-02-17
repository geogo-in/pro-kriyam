import { styled } from "@mui/material/styles"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  height: 56,
  display: "flex",
  alignItems: "center",
  borderBottom: "1px solid rgba(229,231,235, 0.5)",
  "& .MuiTab-root": {
    marginRight: 8,
    padding: "10px 20px",
    fontWeight: "500",
    // color: theme.palette.primary.secondaryText,
    color: theme.palette.mode === "light" ? theme.palette.primary.secondaryText : theme.palette.text.secondary,
    borderRadius: 30,
    fontSize: "0.9rem",
  },
  "& .Mui-selected": {
    color: "black !important",
    backgroundColor: "#f1f5f9",
  },
  "& .MuiTabs-indicator": {
    height: "0px",
  },
}))

export const StyledTab = styled(Tab)(({ theme }) => ({
  // backgroundColor: "white",
  backgroundColor: theme.palette.background.paper,
  color: "#64727f",
  paddingLeft: 2,
  paddingRight: 2,
  marginRight: 24,
}))
