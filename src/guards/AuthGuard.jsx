import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"
import LinearProgressBar from "../pages/shared/LinearProgressBar"
import { isAdmin, isAuthenticated, isLoading } from "@redux/reducerSlices/user/userAuthSlice"
import { PATH_AUTH } from "../routes/paths"

export default function AuthGuard({ children, admin }) {
  const authenticated = useSelector(isAuthenticated)
  const Admin = useSelector(isAdmin)
  const loading = useSelector(isLoading)
  const { pathname } = useLocation()
  // const [requestedLocation, setRequestedLocation] = useState(null)

  if (loading) return <LinearProgressBar />

  if (authenticated) {
    if (admin) {
      if (!Admin) return <Navigate to={"/404"} replace state={{ status: 401, message: "You are not authorized to access this page" }} />
    }
    return <>{children}</>
  }

  return <Navigate to={PATH_AUTH.signIn} replace state={{ referrer: pathname }} />
}
