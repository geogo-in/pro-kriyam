import React, { Suspense } from "react"
import LinearProgressBar from "../pages/shared/LinearProgressBar"

const withSuspense = BaseComponent => props =>
  (
    <Suspense fallback={<LinearProgressBar />}>
      <BaseComponent {...props} />
    </Suspense>
  )

export default withSuspense
