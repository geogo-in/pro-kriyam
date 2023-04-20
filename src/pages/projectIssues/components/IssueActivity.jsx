import { Avatar, Box, Grid, Stack, Typography } from "@mui/material"
import { stringAvatar } from "utils/Avatar"
import { fDate } from "utils/formatDate"

export default function IssueActivity({ user, details, created_on, id, notes, ...props }) {
  return (
    <Stack spacing={1} direction="row" mt={1}>
      <Box>
        <Avatar {...stringAvatar(user?.name)} />
      </Box>

      <Grid container columns={12}>
        <Grid item xs={9}>
          <Typography>{user?.name}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography color="text.secondary" variant="tiny">
            Remark:{" "}
          </Typography>
          <Typography color="green" variant="tiny">
            OK
          </Typography>
        </Grid>

        <Grid container>
          <Grid item xs={9}>
            {details.map(({ name, new_value, old_value }, i) => (
              <Typography noWrap key={`details-${i}-${id}`} color="text.secondary" variant="tiny" component="div" lineHeight={1.2} fontWeight={300}>
                <Box component="span" color="green">
                  {name}
                </Box>{" "}
                changed
                {name === "description" ? (
                  "."
                ) : (
                  <>
                    {old_value ? ` from ${old_value.substring(0, 100).concat(old_value.length < 100 ? "." : "...")}` : ""}{" "}
                    <Box component="span" color="text.primary" den>
                      {new_value ? ` to ${new_value.substring(0, 100).concat(new_value.length < 100 ? "." : "...")}` : ""}
                    </Box>
                  </>
                )}
              </Typography>
            ))}
            <Typography noWrap color="text.secondary" variant="tiny" component="div" lineHeight={1.2} fontWeight={300}>
              <Box component="span" color="text.primary" dangerouslySetInnerHTML={{ __html: notes.substring(0, 100).concat(notes.length < 100 ? "." : "...") }} />
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography color="text.secondary" variant="tiny">
              {fDate(created_on, "dd D/M, h:mm A z")}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Stack>
  )
}
