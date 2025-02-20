import { styled } from "@mui/material/styles"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  height: 56,
  display: "flex",
  alignItems: "center",
  borderBottom: theme.palette.mode === "light" ? "1px solid rgba(229,231,235, 0.5)" : "1px solid #292929",
  "& .MuiTab-root": {
    marginRight: 8,
    padding: "10px 20px",
    fontWeight: "500",
    color: theme.palette.primary.secondaryText,
    borderRadius: 30,
    fontSize: "0.9rem",
  },
  "& .Mui-selected": {
    color: theme.palette.mode === "light" ? "black !important" : "#69ADF3",
    backgroundColor: theme.palette.mode === "light" ? "#f1f5f9" : "#1A3455",
  },
  "& .MuiTabs-indicator": {
    height: "0px",
  },
}))

export const StyledTab = styled(Tab)(({ theme }) => ({
  backgroundColor: theme.palette.background.modal,
  color: theme.palette.mode === "light" ? "#64727f" : theme.palette.primary.secondaryText,
  paddingLeft: 2,
  paddingRight: 2,
  marginRight: 24,
}))
