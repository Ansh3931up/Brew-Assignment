'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { Eye, EyeOff, ArrowLeft, Mail, Lock, CheckCircle2 } from 'lucide-react'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { login } from '@/lib/slices/authSlice'
import type { AppDispatch, RootState } from '@/lib/store'
import { toastService } from '@/lib/utils/toast'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { loading, user } = useSelector((state: RootState) => state.auth)
  
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(() => {
    if (typeof window !== 'undefined') {
      const remembered = localStorage.getItem('rememberMe')
      return remembered === 'true'
    }
    return false
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Load remembered email on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const rememberedEmail = localStorage.getItem('rememberedEmail')
      if (rememberedEmail && rememberMe) {
        setValue('email', rememberedEmail)
      }
    }
  }, [setValue, rememberMe])

  // Check if user is already logged in
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      router.push('/dashboard')
    }
  }, [user, router])

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Save email if remember me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', data.email)
        localStorage.setItem('rememberMe', 'true')
      } else {
        localStorage.removeItem('rememberedEmail')
        localStorage.removeItem('rememberMe')
      }

      await dispatch(login(data)).unwrap()
      toastService.success('Login successful!')
      router.push('/dashboard')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please check your credentials.'
      toastService.error(errorMessage)
    }
  }

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    toastService.info('Google OAuth will be implemented soon')
  }

  if (user && Object.keys(user).length > 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden min-h-screen flex">
      <AnimatedBackground />

      {/* Left Section - Login Form */}
      <div className="relative z-10 w-full md:w-1/2 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link
            href="/"
            className="absolute top-8 left-8 p-2 text-foreground hover:text-primary transition-colors duration-200 rounded-full hover:bg-primary/10 group"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 transform group-hover:translate-x-[-2px] transition-transform" />
          </Link>

          <div className="glass rounded-2xl p-8 shadow-2xl border-2 border-primary/20">
            {/* Logo/Brand */}
            <div className="flex flex-col items-center justify-center mb-8 text-center">
              <div className="bg-primary/10 rounded-full p-4 mb-4">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Task Tracker
              </h1>
              <p className="text-muted-foreground">
                Sign in to manage your tasks
              </p>
              <Link 
                href="/signup" 
                className="text-muted-foreground text-center mt-4 hover:text-primary text-sm transition-colors"
              >
                Don&apos;t have an account? <span className="font-semibold">Sign up</span>
              </Link>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-4">
                {/* Email Input */}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="Email address"
                    className="w-full pl-10 pr-4 py-3 bg-background/50 border-2 border-primary/20 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                {/* Password Input */}
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="Password"
                    className="w-full pl-10 pr-12 py-3 bg-background/50 border-2 border-primary/20 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  {errors.password && (
                    <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-primary/30 text-primary focus:ring-primary transition-colors"
                  />
                  <label htmlFor="remember-me" className="ml-2 text-sm text-muted-foreground">
                    Remember me
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 bg-primary text-primary-foreground rounded-xl font-semibold 
                  hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 
                  transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] 
                  shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30
                  ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-3"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-border"></div>
              <span className="px-4 text-sm text-muted-foreground">Or continue with</span>
              <div className="flex-1 border-t border-border"></div>
            </div>

            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 bg-background border-2 border-primary/20 text-foreground rounded-xl font-semibold 
                hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 
                transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] 
                flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </div>

      {/* Right Section - Content */}
      <div className="relative z-10 hidden md:flex w-1/2 items-center justify-center p-12">
        <div className="text-center max-w-lg">
          <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">
            Organize Your{' '}
            <span className="text-primary">Tasks</span>
            <br />
            Stay Productive
          </h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Manage your tasks efficiently with our intuitive task tracker. 
            Create, organize, and complete your tasks all in one place.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-12">
            {[
              { icon: '✓', title: 'Create Tasks', color: 'text-primary' },
              { icon: '📅', title: 'Set Deadlines', color: 'text-primary' },
              { icon: '🎯', title: 'Track Progress', color: 'text-primary' },
            ].map((feature, idx) => (
              <div key={idx} className="glass rounded-xl p-4 border-2 border-primary/20">
                <div className="text-3xl mb-2">{feature.icon}</div>
                <p className="text-sm font-semibold text-foreground">{feature.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

