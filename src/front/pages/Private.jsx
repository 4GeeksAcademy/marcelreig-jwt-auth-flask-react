import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { Navigate } from "react-router-dom"

export const Private = () => {
  const navigate = useNavigate()
  const { store } = useGlobalReducer()
  const [message, setMessage] = useState("")

  useEffect(() => {
    const token = sessionStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    fetch(import.meta.env.VITE_BACKEND_URL + "/api/private", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) setMessage(data.message)
        else navigate("/login")
      })
      .catch(() => navigate("/login"))
  }, [])

  if (!store.auth) return <Navigate to="/login" />
  
  return (
    <div className="container mt-5">
      <h2>Área privada</h2>
      <p>{message}</p>
    </div>
  )
} 
