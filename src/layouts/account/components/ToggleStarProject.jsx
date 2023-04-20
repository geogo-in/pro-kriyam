import { Star, StarBorderOutlined } from "@mui/icons-material"
import { Box, CircularProgress, IconButton } from "@mui/material"
import React from "react"
import { useUpdateFavoriteMutation } from "@redux/services/projectApi"

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
        <IconButton size="small" onClick={handleClick}>
          {fav ? <Star color="warning" /> : <StarBorderOutlined />}
        </IconButton>
      )}
    </>
  )
}

export default ToggleStarProject
