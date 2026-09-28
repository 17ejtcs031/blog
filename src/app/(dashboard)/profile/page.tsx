'use client'
import { useState, useEffect, useRef } from 'react'
import { User, Mail, Link as LinkIcon, MapPin, Globe, Globe2, ExternalLink, Loader2, Camera } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'
import { formatNumber } from '@/lib/utils'

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [stats, setStats] = useState({ totalPosts: 0, totalViews: 0 })
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
    website: '',
    location: '',
    avatar: '',
    socialTwitter: '',
    socialGithub: '',
    socialLinkedin: '',
  })
  const avatarInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [profileRes, analyticsRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/analytics'),
        ])
        if (profileRes.ok) {
          const profile = await profileRes.json()
          setForm({
            name: profile.name || '',
            username: profile.username || '',
            email: profile.email || '',
            bio: profile.bio || '',
            website: profile.website || '',
            location: profile.location || '',
            avatar: profile.avatar || '',
            socialTwitter: profile.socialTwitter || '',
            socialGithub: profile.socialGithub || '',
            socialLinkedin: profile.socialLinkedin || '',
          })
        }
        if (analyticsRes.ok) {
          const analytics = await analyticsRes.json()
          setStats({
            totalPosts: analytics.stats?.totalPosts || 0,
            totalViews: analytics.stats?.totalViews || 0,
          })
        }
      } catch {
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Name is required')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          username: form.username || null,
          bio: form.bio || null,
          website: form.website || null,
          location: form.location || null,
          avatar: form.avatar || null,
          socialTwitter: form.socialTwitter || null,
          socialGithub: form.socialGithub || null,
          socialLinkedin: form.socialLinkedin || null,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to save profile')
      }
      toast.success('Profile updated successfully')
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (file: File) => {
    setUploadingAvatar(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setForm(f => ({ ...f, avatar: data.url }))
      toast.success('Avatar updated — remember to save changes')
    } catch {
      toast.error('Failed to upload avatar')
    } finally {
      setUploadingAvatar(false)
      if (avatarInputRef.current) avatarInputRef.current.value = ''
    }
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="md:col-span-2 h-80 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-gradient-fun">Profile 🌈</h1>
        <p className="text-slate-500 mt-1">Manage your public profile and personal details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Stats Card */}
        <Card className="md:col-span-1 rounded-2xl border-0 bg-white/85 dark:bg-slate-900/80 backdrop-blur shadow-funky">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleAvatarUpload(file)
              }}
            />
            <div className="relative group mb-4">
              <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-950 shadow-md">
                <AvatarImage src={form.avatar} alt={form.name} />
                <AvatarFallback className="bg-funky animate-gradient text-white text-2xl font-display font-extrabold">
                  {form.name.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
                aria-label="Change avatar"
              >
                {uploadingAvatar ? <Loader2 className="h-6 w-6 animate-spin" /> : <Camera className="h-6 w-6" />}
              </button>
            </div>
            <h2 className="font-display text-xl font-extrabold text-slate-900 dark:text-white">{form.name}</h2>
            <p className="text-sm text-slate-500 mb-4">{form.username ? `@${form.username}` : form.email}</p>
            
            <div className="w-full flex justify-around border-t border-b border-slate-100 dark:border-slate-800 py-4 my-2">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalPosts}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Posts</p>
              </div>
              <Separator orientation="vertical" className="h-auto bg-slate-200 dark:bg-slate-800" />
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatNumber(stats.totalViews)}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Views</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="md:col-span-2 rounded-2xl border-0 bg-white/85 dark:bg-slate-900/80 backdrop-blur shadow-funky">
          <form onSubmit={handleSave}>
            <CardHeader>
              <CardTitle className="font-display font-extrabold">Edit Profile ✏️</CardTitle>
              <CardDescription>Update your personal information and social links.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input id="name" className="pl-9" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input id="email" type="email" value={form.email} disabled className="pl-9 bg-slate-50 dark:bg-slate-900 cursor-not-allowed" />
                </div>
                <p className="text-xs text-slate-500">Email addresses cannot be changed.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  rows={4} 
                  className="resize-none"
                  maxLength={500}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Personal Website</Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input id="website" className="pl-9" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input id="location" className="pl-9" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-200 dark:bg-slate-800" />
              
              <div className="space-y-4">
                <h3 className="font-medium text-sm">Social Profiles</h3>
                
                <div className="space-y-2">
                  <div className="relative">
                    <Globe className="absolute left-3 top-2.5 h-4 w-4 text-[#1DA1F2]" />
                    <Input placeholder="Twitter username or URL" className="pl-9" value={form.socialTwitter} onChange={(e) => setForm({ ...form, socialTwitter: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Globe2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-800 dark:text-slate-200" />
                    <Input placeholder="GitHub username or URL" className="pl-9" value={form.socialGithub} onChange={(e) => setForm({ ...form, socialGithub: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-2.5 h-4 w-4 text-[#0077b5]" />
                    <Input placeholder="LinkedIn username or URL" className="pl-9" value={form.socialLinkedin} onChange={(e) => setForm({ ...form, socialLinkedin: e.target.value })} />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-6">
              <Button type="submit" disabled={saving} className="rounded-full bg-funky animate-gradient hover:opacity-95 text-white font-display font-bold shadow-funky">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes ✨
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
