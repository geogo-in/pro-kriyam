import MuiBreadcrumbs from "@mui/material/Breadcrumbs"
import MuiLink from "@mui/material/Link"
import { styled } from "@mui/material/styles"

import React from "react"

const StyledBreadcrumbs = styled(MuiBreadcrumbs)(({ theme }) => ({
  fontSize: 12,
  color: "#64727F",
  minHeight: 20,
}))

const Breadcrumbs = ({ breadcrumbs }) => {
  return (
    <StyledBreadcrumbs separator="›" aria-label="breadcrumb">
      {breadcrumbs.map(b => {
        return (
          <MuiLink underline="hover" color="text.secondary" href={b.linkTo} key={b.linkTo}>
            {b.linkText}
          </MuiLink>
        )
      })}
    </StyledBreadcrumbs>
  )
}

export default Breadcrumbs
