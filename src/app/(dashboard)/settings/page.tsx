'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Key, Moon, Monitor, Sun, Trash2, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface Category {
  id: string
  name: string
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [categories, setCategories] = useState<Category[]>([])

  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwdSaving, setPwdSaving] = useState(false)

  const [prefs, setPrefs] = useState({ autoSaveInterval: '5', defaultCategory: 'none' })
  const [prefsSaving, setPrefsSaving] = useState(false)
  const [prefsLoading, setPrefsLoading] = useState(true)

  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.ok ? res.json() : { user: null })
      .then(data => setEmail(data.user?.email || ''))
      .catch(() => {})

    fetch('/api/categories')
      .then(res => res.ok ? res.json() : [])
      .then(setCategories)
      .catch(() => {})

    fetch('/api/profile')
      .then(res => res.ok ? res.json() : null)
      .then(profile => {
        if (profile) {
          setPrefs({
            autoSaveInterval: String(profile.autoSaveInterval || 5),
            defaultCategory: profile.defaultCategory || 'none',
          })
        }
      })
      .catch(() => {})
      .finally(() => setPrefsLoading(false))
  }, [])

  const handleChangePassword = async () => {
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      toast.error("Passwords don't match")
      return
    }
    setPwdSaving(true)
    try {
      const res = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pwdForm),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed to change password')
      toast.success('Password changed successfully')
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (e: any) {
      toast.error(e?.message || 'Failed to change password')
    } finally {
      setPwdSaving(false)
    }
  }

  const handleSavePrefs = async () => {
    setPrefsSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          autoSaveInterval: parseInt(prefs.autoSaveInterval, 10),
          defaultCategory: prefs.defaultCategory === 'none' ? null : prefs.defaultCategory,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success('Preferences saved successfully')
    } catch {
      toast.error('Failed to save preferences')
    } finally {
      setPrefsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      const res = await fetch('/api/profile', { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Account deleted')
      router.push('/register')
    } catch {
      toast.error('Failed to delete account')
      setDeleting(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-gradient-fun">Settings ⚙️</h1>
        <p className="text-slate-500 mt-1">Manage your account preferences and application settings.</p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-funky p-1 mb-6 flex-wrap h-auto rounded-full">
          <TabsTrigger value="account" className="rounded-full data-[state=active]:bg-funky data-[state=active]:text-white font-display font-bold">Account</TabsTrigger>
          <TabsTrigger value="security" className="rounded-full data-[state=active]:bg-funky data-[state=active]:text-white font-display font-bold">Security</TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-full data-[state=active]:bg-funky data-[state=active]:text-white font-display font-bold">Appearance</TabsTrigger>
          <TabsTrigger value="writing" className="rounded-full data-[state=active]:bg-funky data-[state=active]:text-white font-display font-bold">Writing & Editor</TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card className="rounded-2xl border-0 bg-white/85 dark:bg-slate-900/80 backdrop-blur shadow-funky">
            <CardHeader>
              <CardTitle className="font-display font-extrabold">Account Information</CardTitle>
              <CardDescription>Update your basic account credentials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="account-email">Email Address</Label>
                <Input id="account-email" value={email} disabled className="bg-slate-50 dark:bg-slate-900" />
                <p className="text-xs text-slate-500">Email addresses cannot be changed.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 bg-gradient-to-br from-red-50 to-rose-100/60 dark:from-red-950/20 dark:to-rose-950/20 shadow-funky">
            <CardHeader>
              <CardTitle className="font-display font-extrabold text-red-600 dark:text-red-400 flex items-center gap-2">
                <Trash2 className="h-5 w-5" /> Danger Zone ⚠️
              </CardTitle>
              <CardDescription>Permanently delete your account and all your content.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Once you delete your account, there is no going back. All posts, ideas, and media will be permanently removed. Please be certain.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={deleting} className="rounded-full font-display font-bold">
                    {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete your account permanently?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will delete your account and all associated posts, ideas, and media. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                      Yes, delete everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="rounded-2xl border-0 bg-white/85 dark:bg-slate-900/80 backdrop-blur shadow-funky">
            <CardHeader>
              <CardTitle className="font-display font-extrabold flex items-center gap-2">
                <Key className="h-5 w-5 text-funky-purple" /> Change Password 🔐
              </CardTitle>
              <CardDescription>Update your password to keep your account secure.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-pwd">Current Password</Label>
                <Input id="current-pwd" type="password" value={pwdForm.currentPassword} onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-pwd">New Password</Label>
                <Input id="new-pwd" type="password" value={pwdForm.newPassword} onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })} />
                <p className="text-xs text-slate-500">Minimum 8 characters with uppercase, lowercase, number, and special character.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-pwd">Confirm New Password</Label>
                <Input id="confirm-pwd" type="password" value={pwdForm.confirmPassword} onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })} />
              </div>
            </CardContent>
            <CardFooter className="border-t border-slate-100 dark:border-slate-800 pt-6">
              <Button onClick={handleChangePassword} disabled={pwdSaving || !pwdForm.currentPassword || !pwdForm.newPassword} className="rounded-full bg-funky animate-gradient hover:opacity-95 text-white font-display font-bold shadow-funky">
                {pwdSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Update Password
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="rounded-2xl border-0 bg-white/85 dark:bg-slate-900/80 backdrop-blur shadow-funky">
            <CardHeader>
              <CardTitle className="font-display font-extrabold">Theme Preferences 🎨</CardTitle>
              <CardDescription>Customize how WriteSpace looks on your device.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'light', name: 'Light', icon: Sun },
                  { id: 'dark', name: 'Dark', icon: Moon },
                  { id: 'system', name: 'System', icon: Monitor },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all hover-lift ${
                      theme === t.id 
                        ? 'border-transparent bg-funky animate-gradient text-white shadow-funky' 
                        : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 hover:border-funky-purple text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <t.icon className="h-8 w-8 mb-3" />
                    <span className="font-display font-bold">{t.name}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Writing Tab */}
        <TabsContent value="writing" className="space-y-6">
          <Card className="rounded-2xl border-0 bg-white/85 dark:bg-slate-900/80 backdrop-blur shadow-funky">
            <CardHeader>
              <CardTitle className="font-display font-extrabold">Editor Preferences ✍️</CardTitle>
              <CardDescription>Customize your writing experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Auto-save Interval</Label>
                <Select value={prefs.autoSaveInterval} onValueChange={(v) => setPrefs({ ...prefs, autoSaveInterval: v })} disabled={prefsLoading}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">Every 5 seconds</SelectItem>
                    <SelectItem value="30">Every 30 seconds</SelectItem>
                    <SelectItem value="60">Every 1 minute</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">Drafts are saved automatically while you write.</p>
              </div>

              <Separator className="bg-slate-200 dark:bg-slate-800" />

              <div className="space-y-3">
                <Label>Default Category</Label>
                <Select value={prefs.defaultCategory} onValueChange={(v) => setPrefs({ ...prefs, defaultCategory: v })} disabled={prefsLoading}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No default</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">New posts will be assigned to this category by default.</p>
              </div>
            </CardContent>
            <CardFooter className="border-t border-slate-100 dark:border-slate-800 pt-6">
              <Button onClick={handleSavePrefs} disabled={prefsSaving || prefsLoading} className="rounded-full bg-funky animate-gradient hover:opacity-95 text-white font-display font-bold shadow-funky">
                {prefsSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Save Preferences ✨
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
