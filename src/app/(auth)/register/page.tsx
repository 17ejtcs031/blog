'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema)
  })

  const passwordValue = watch('password', '')

  const getPasswordStrength = (pass: string) => {
    let score = 0
    if (!pass) return { score: 0, text: '', color: 'bg-[#eadbe3]' }
    if (pass.length > 7) score += 1
    if (/[A-Z]/.test(pass)) score += 1
    if (/[a-z]/.test(pass)) score += 1
    if (/[0-9]/.test(pass)) score += 1
    if (/[^A-Za-z0-9]/.test(pass)) score += 1

    if (score <= 2) return { score, text: 'Weak', color: 'bg-red-400' }
    if (score <= 3) return { score, text: 'Fair', color: 'bg-amber-400' }
    if (score <= 4) return { score, text: 'Good', color: 'bg-emerald-400' }
    return { score, text: 'Strong', color: 'bg-emerald-600' }
  }

  const strength = getPasswordStrength(passwordValue)

  const getErrorMessage = (payload: any) => {
    if (typeof payload?.error === 'string') return payload.error
    if (typeof payload?.message === 'string') return payload.message
    if (payload?.errors && typeof payload.errors === 'object') {
      const firstError = Object.values(payload.errors).flat().find((value) => typeof value === 'string')
      if (firstError) return String(firstError)
    }
    return 'Registration failed'
  }

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const response = await res.json().catch(() => ({}))

      if (res.ok) {
        toast.success('Account created successfully!')
        router.replace('/login')
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
        <CardTitle className="font-display text-[2.2rem] leading-none font-extrabold text-[#4f3d56]">Join the party</CardTitle>
        <CardDescription className="text-[#705b68] text-base">Create your account and start writing</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-[#52415a]">Full Name</Label>
            <Input id="name" autoComplete="name" placeholder="John Doe" {...register('name')} className="h-12 rounded-2xl border-[#d7c4d1] bg-white/80 text-[#2f2432] shadow-sm focus-visible:ring-[#c38fa0]" />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-[#52415a]">Email</Label>
            <Input id="email" type="email" autoComplete="email" placeholder="name@example.com" {...register('email')} className="h-12 rounded-2xl border-[#d7c4d1] bg-white/80 text-[#2f2432] shadow-sm focus-visible:ring-[#c38fa0]" />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-[#52415a]">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
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
            {passwordValue && (
              <div className="mt-2 space-y-1">
                <div className="flex h-1.5 w-full gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-full w-full rounded-full ${
                        i <= Math.min(4, Math.ceil(strength.score * 0.8)) ? strength.color : 'bg-[#eadbe3]'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-right text-xs font-medium text-[#7b6972]">{strength.text}</p>
              </div>
            )}
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#52415a]">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className="h-12 rounded-2xl border-[#d7c4d1] bg-white/80 pr-10 text-[#2f2432] shadow-sm focus-visible:ring-[#c38fa0]"
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#806a7a] hover:text-[#473b4a]"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" className="h-12 w-full rounded-full bg-[#7a5d7d] text-white font-display text-lg font-bold shadow-[0_18px_30px_-18px_rgba(80,54,88,0.7)] hover:bg-[#654e6b] transition-all duration-200 hover:scale-[1.01]" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Account'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-[#f0e3ea] pt-4">
        <p className="text-sm text-[#6d5d69]">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-[#614d75] hover:text-[#4d3d63]">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
