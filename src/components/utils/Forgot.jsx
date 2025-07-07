import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setProfile } from '../../store/registration'
import { Eye, EyeOff } from 'lucide-react'
import  sendOtpEmail  from './sendOTPemail'

const Forgot = () => {
  const [step, setStep] = useState(1) // 1: email, 2: otp, 3: password reset
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    
    if (!email) {
      setError('Please enter your email address.')
      return
    }
    
    setIsLoading(true)
    setError('')
    setMessage('')
    
    try {
      await sendOtpEmail(email)
      setMessage('OTP sent to your email successfully!')
      setStep(2)
    } catch (error) {
      setError('Failed to send OTP. Please check your email and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpVerify = (e) => {
    e.preventDefault()
    
    if (!otp) {
      setError('Please enter the OTP.')
      return
    }
    
    const storedOtp = localStorage.getItem('reset_otp')
    const storedEmail = localStorage.getItem('reset_email')
    
    if (otp === storedOtp && email === storedEmail) {
      setError('')
      setMessage('OTP verified successfully! You can now reset your password.')
      setStep(3)
    } else {
      setError('Invalid OTP. Please try again.')
      setMessage('')
    }
  }

  const handlePasswordReset = (e) => {
    e.preventDefault()
    const { name, password, confirmPassword } = formData

    if (!name || !password || !confirmPassword) {
      setError('All fields are required.')
      setMessage('')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setMessage('')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      setMessage('')
      return
    }

    setError('')
    dispatch(setProfile({ name, email, password }))
    setMessage('Password reset successful! Redirecting to login...')

    setTimeout(() => {
      navigate('/')
    }, 2000)
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="block mb-1 text-sm font-medium">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your registered email"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-md font-semibold transition"
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )

      case 2:
        return (
          <form onSubmit={handleOtpVerify} className="space-y-5">
            <div>
              <label className="block mb-1 text-sm font-medium">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the 6-digit OTP sent to your email"
                maxLength="6"
              />
              <p className="text-xs text-gray-400 mt-1">
                OTP sent to: {email}
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold transition"
            >
              Verify OTP
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md font-semibold transition"
            >
              Back to Email
            </button>
          </form>
        )

      case 3:
        return (
          <form onSubmit={handlePasswordReset} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 pr-10 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-300 hover:text-white"
                  tabIndex={-1}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 pr-10 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-gray-300 hover:text-white"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold transition"
            >
              Reset Password
            </button>
          </form>
        )

      default:
        return null
    }
  }

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return 'Reset Your Password'
      case 2:
        return 'Verify OTP'
      case 3:
        return 'Set New Password'
      default:
        return 'Reset Your Password'
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-400">
          {getStepTitle()}
        </h2>

        {/* Progress indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
            <div className={`w-8 h-1 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
            <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
            <div className={`w-8 h-1 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
            <div className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        {message && <p className="text-green-400 text-sm mb-4 text-center">{message}</p>}

        {renderStepContent()}

        <p className="text-sm text-gray-400 text-center mt-6">
          Remember your password?{' '}
          <Link to="/" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Forgot