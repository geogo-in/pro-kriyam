import { Box, Stack, Typography } from "@mui/material"
import { fDate } from "utils/formatDate"

export default function Header({ title, subtitle, description, children, ...props }) {
  return (
    <Stack direction={"row"} justifyContent={"space-between"}>
      <Box>
        <Typography variant="h6" lineHeight={1} pt={2}>
          {title}
        </Typography>
        <Typography gutterBottom variant="caption" component="p">
          {typeof subtitle === "boolean" && subtitle ? (
            <>
              <Typography variant="caption" color="primary.main">
                {fDate(new Date(), "dddd")},{" "}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {fDate(new Date(), "D MMMM yyyy")}
              </Typography>
            </>
          ) : (
            subtitle
          )}
        </Typography>
        {description && (
          <Typography gutterBottom variant="caption" component="p" color="text.secondary" pt={1}>
            {description}
          </Typography>
        )}
      </Box>
      {children}
    </Stack>
  )
}
