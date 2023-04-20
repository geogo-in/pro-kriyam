import TabUnstyled, { tabUnstyledClasses } from "@mui/base/TabUnstyled"
import { styled } from "@mui/material/styles"

const Tab = styled(TabUnstyled)`
  font-family: IBM Plex Sans, sans-serif;
  color: white;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: bold;
  background-color: transparent;
  padding: 4px 2px;
  margin-right: 16px;
  border: none;
  border-radius: 0;
  display: initial;
  justify-content: center;
  border-bottom: 0.125rem dotted #c4cdd5;
  &:hover {
    background-color: rgb(246, 246, 247);
  }
  &.${tabUnstyledClasses.selected} {
    background-color: #fff;
    border-bottom: 0.125rem dotted #8f68dc;
  }
`

export default Tab
