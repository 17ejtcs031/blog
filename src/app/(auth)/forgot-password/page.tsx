'use client'
import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Loader2, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email')
      return
    }
    
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
      toast.success('Reset link sent to your email')
    }, 1500)
  }

  return (
    <Card className="rounded-3xl border-0 bg-white/90 backdrop-blur dark:bg-slate-900/90 shadow-funky-lg">
      <CardHeader>
        <CardTitle className="font-display text-2xl font-extrabold text-gradient-fun">Reset password 🔑</CardTitle>
        <CardDescription>
          {isSubmitted 
            ? "Check your email for a reset link" 
            : "Enter your email address and we'll send you a link to reset your password."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isSubmitted ? (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full rounded-full bg-funky animate-gradient hover:opacity-95 text-white font-display font-bold text-base shadow-funky hover-lift" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send reset link 🚀'}
            </Button>
          </form>
        ) : (
          <div className="bg-funky-purple/10 text-funky-purple dark:text-funky-pink p-4 rounded-2xl text-sm text-center font-medium">
            If an account exists for {email}, you will receive a password reset link shortly.
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t border-slate-100 dark:border-slate-800 pt-4">
        <Link href="/login" className="flex items-center text-sm font-bold text-funky-purple hover:text-funky-pink">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>
      </CardFooter>
    </Card>
  )
}
