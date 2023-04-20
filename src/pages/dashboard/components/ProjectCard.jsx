import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import { Link } from "react-router-dom"

const ProjectCard = ({ project }) => {
  return (
    <Card sx={{ minWidth: 275, height: 1, display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flex: 1 }}>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Project
        </Typography>
        <Typography variant="h5" component="div">
          {project.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          ID {project.id}
        </Typography>
        <Typography variant="body2">{project.description}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small" component={Link} to={`/account/projects/${project.identifier}/backlog`}>
          Learn More
        </Button>
      </CardActions>
    </Card>
  )
}

export default ProjectCard
