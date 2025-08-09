"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useAuth } from "../contexts/AuthContext"
import { Eye, EyeOff, GraduationCap } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    await login(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-600">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to CampusConnect</h2>
          <p className="mt-2 text-center text-sm text-gray-600">College Management System</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                className="input mt-1"
                placeholder="Enter your email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  className="input pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>
          </div>

          <div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
              {loading ? <LoadingSpinner size="sm" /> : "Sign in"}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Demo Credentials</span>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="bg-white p-3 rounded border">
                <p className="font-medium">Admin:</p>
                <p>Email: admin@campus.com</p>
                <p>Password: admin123</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <p className="font-medium">Faculty:</p>
                <p>Email: faculty@campus.com</p>
                <p>Password: faculty123</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <p className="font-medium">Student:</p>
                <p>Email: student@campus.com</p>
                <p>Password: student123</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
