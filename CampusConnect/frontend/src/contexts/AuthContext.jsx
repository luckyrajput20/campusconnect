"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import api from "../services/api"
import toast from "react-hot-toast"

const AuthContext = createContext()

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: true,
  error: null,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null }
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      }
    case "LOGIN_FAILURE":
      return { ...state, loading: false, error: action.payload }
    case "LOGOUT":
      return { ...initialState, loading: false, token: null }
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_USER":
      return { ...state, user: action.payload, loading: false }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`
          const response = await api.get("/auth/profile")
          dispatch({ type: "SET_USER", payload: response.data.user })
        } catch (error) {
          localStorage.removeItem("token")
          delete api.defaults.headers.common["Authorization"]
          dispatch({ type: "LOGOUT" })
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    initAuth()
  }, [])

  const login = async (credentials) => {
    try {
      dispatch({ type: "LOGIN_START" })
      const response = await api.post("/auth/login", credentials)
      const { token, user } = response.data

      localStorage.setItem("token", token)
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`

      dispatch({ type: "LOGIN_SUCCESS", payload: { user, token } })
      toast.success(`Welcome back, ${user.name}!`)

      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed"
      dispatch({ type: "LOGIN_FAILURE", payload: message })
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    delete api.defaults.headers.common["Authorization"]
    dispatch({ type: "LOGOUT" })
    toast.success("Logged out successfully")
  }

  const value = {
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
