'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Mail, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false }
  })

  const getErrorMessage = (payload: any) => {
    if (typeof payload?.error === 'string') return payload.error
    if (typeof payload?.message === 'string') return payload.message
    if (payload?.errors && typeof payload.errors === 'object') {
      const firstError = Object.values(payload.errors).flat().find((value) => typeof value === 'string')
      if (firstError) return String(firstError)
    }
    return 'Login failed'
  }

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const response = await res.json().catch(() => ({}))

      if (res.ok) {
        toast.success('Welcome back!')
        router.replace('/dashboard')
      } else {
        toast.error(getErrorMessage(response))
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="auth-panel rounded-[2rem] border-0 backdrop-blur-sm">
      <CardHeader className="space-y-2 pb-4">
        <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4e0d5] text-[#5c3f5b] shadow-sm animate-wiggle">
          <Sparkles className="h-5 w-5" />
        </div>
        <CardTitle className="font-display text-[2.2rem] leading-none font-extrabold text-[#4f3d56]">Welcome back</CardTitle>
        <CardDescription className="text-[#705b68] text-base">Sign in to keep the good vibes rolling</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-[#52415a]">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a6d7c]" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                className="h-12 rounded-2xl border-[#d7c4d1] bg-white/80 pl-10 text-[#2f2432] shadow-sm focus-visible:ring-[#c38fa0]"
                {...register('email')}
              />
            </div>
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-[#52415a]">Password</Label>
              <Link href="/forgot-password" className="text-sm font-medium text-[#785d7e] hover:text-[#5d486a]">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                className="h-12 rounded-2xl border-[#d7c4d1] bg-white/80 pr-10 text-[#2f2432] shadow-sm focus-visible:ring-[#c38fa0]"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#806a7a] hover:text-[#473b4a]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="remember"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="border-[#c7a9b8] data-[state=checked]:bg-[#62527d] data-[state=checked]:text-white"
                />
              )}
            />
            <label htmlFor="remember" className="text-sm font-medium text-[#5b4a5d] leading-none">Remember me</label>
          </div>

          <Button type="submit" className="h-12 w-full rounded-full bg-[#7a5d7d] text-white font-display text-lg font-bold shadow-[0_18px_30px_-18px_rgba(80,54,88,0.7)] hover:bg-[#654e6b] transition-all duration-200 hover:scale-[1.01]" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Let me in'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-[#f0e3ea] pt-4">
        <p className="text-sm text-[#6d5d69]">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-semibold text-[#614d75] hover:text-[#4d3d63]">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
