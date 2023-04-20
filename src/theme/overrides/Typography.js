export default function Typography(theme) {
  return {
    MuiTypography: {
      variants: [
        {
          props: { variant: "tiny" },
          style: {
            fontSize: 10,
          },
        },
      ],
    },
  }
}
