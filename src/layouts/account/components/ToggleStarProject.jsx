import { Star, StarBorderOutlined } from "@mui/icons-material"
import { Box, CircularProgress, IconButton } from "@mui/material"
import { useUpdateFavoriteMutation } from "@redux/services/projectApi"
import React from "react"

const ToggleStarProject = ({ project }) => {
  const [fav, setFav] = React.useState(project.is_favourite)
  const [updateFavorite, { isLoading }] = useUpdateFavoriteMutation()

  const handleClick = () => {
    updateFavorite(project.id)
    setFav(!fav)
  }
  return (
    <>
      {isLoading ? (
        <Box display="flex" justifyContent="center" p={0.5}>
          <CircularProgress size={20} />
        </Box>
      ) : (
        <IconButton sx={{color: theme => theme.palette.mode === "light" ? theme.palette.text.secondary : "black"}} size="small" onClick={handleClick}>
          {fav ? <Star color="warning" /> : <StarBorderOutlined />}
        </IconButton>
      )}
    </>
  )
}

export default ToggleStarProject
