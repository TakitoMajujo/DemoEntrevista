import { Navigate } from "react-router-dom";
import { storage } from "../storage";

export default function ProtectedRoute({ children }) {
  const token = storage.read("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
