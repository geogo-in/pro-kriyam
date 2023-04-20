import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import NotFound from ".."

it("renders without crashing", () => {
  const div = document.createElement("div")
  render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>,
    div
  )
  expect(screen.getByText("404")).toBeInTheDocument()
})
