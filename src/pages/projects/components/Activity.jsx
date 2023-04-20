import { Avatar, Button, Card, CardHeader, Divider, Grid, Typography } from "@mui/material"
import { fDate } from "utils/formatDate"

function Activity({ project_id, ...props }) {
  return (
    <Card variant="elevation" sx={{ pb: 2 }}>
      <CardHeader
        titleTypographyProps={{ variant: "h6" }}
        title="Your Activity"
        action={
          <>
            <Button sx={{ fontWeight: 400 }}>View All</Button>
            <Button color="error" sx={{ fontWeight: 400 }}>
              Clear All
            </Button>
          </>
        }
      />
      <Divider />
      <Grid container>
        <Grid item xs={2}>
          <Avatar sx={{ width: 26, height: 26, m: "auto", mt: 1 }}></Avatar>
        </Grid>
        <Grid item xs={10}>
          <Grid container columns={12}>
            <Grid item xs={8}>
              <Typography color="primary" variant="tiny">
                Issues#12
              </Typography>
              <Typography>Dev Admin</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography color="green" variant="tiny">
                Remark: OK
              </Typography>
            </Grid>

            <Grid container>
              <Grid item xs={8}>
                <Typography color="text.secondary" variant="tiny" component="div" lineHeight={1.2} fontWeight={300}>
                  Updated this work order changed it's state from In progress to Complete.
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography color="text.secondary" variant="tiny">
                  {fDate(new Date(), "dd D/M, h:mm A z")}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  )
}

export default Activity
