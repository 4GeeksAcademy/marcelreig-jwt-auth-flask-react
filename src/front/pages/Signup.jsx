import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const Signup = () => {
  const navigate = useNavigate()
  const { dispatch } = useGlobalReducer()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.msg || "Error al registrarse")

      // Guardar token y hacer login automático
      sessionStorage.setItem("token", data.token)
      dispatch({ type: "login_success" })
      navigate("/private")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container mt-5">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control my-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="form-control my-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div className="alert alert-danger">{error}</div>}
        <button className="btn btn-primary" type="submit">Registrarse</button>
      </form>
    </div>
  )
}
