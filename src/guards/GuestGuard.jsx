import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"
import LinearProgressBar from "../pages/shared/LinearProgressBar"
import { isAuthenticated, isLoading } from "@redux/reducerSlices/user/userAuthSlice"
import { PATH_DASHBOARD } from "../routes/paths"

export default function GuestGuard({ children }) {
  const authenticated = useSelector(isAuthenticated)
  const loading = useSelector(isLoading)
  const location = useLocation()
  if (loading) return <LinearProgressBar />

  if (authenticated) return <Navigate to={location.state?.referrer || PATH_DASHBOARD.root} />

  return <>{children}</>
}
