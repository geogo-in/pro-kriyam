import { Button } from "@mui/material"
import { styled } from "@mui/material/styles"
import React from "react"

const RoundButton = styled(props => <Button size="small" {...props} />)(({ theme }) => ({
  "&.MuiButtonBase-root": {
    borderRadius: 20,
    minWidth: 30,
  },
}))

export default RoundButton
