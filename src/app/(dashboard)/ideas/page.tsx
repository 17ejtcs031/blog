'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Save, PenSquare, Clock, Lightbulb, Check } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

interface GeneratedIdea {
  title: string
  description: string
  targetAudience: string
  contentType: string
  keywords: string[]
  difficulty: string
  readingTime: number
}

export default function IdeasPage() {
  const [loading, setLoading] = useState(false)
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([])
  const [savedTitles, setSavedTitles] = useState<Set<string>>(new Set())
  const [savingTitle, setSavingTitle] = useState<string | null>(null)
  const [form, setForm] = useState({ topic: '', audience: '', tone: 'professional' })

  const generateIdeas = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.topic.trim()) {
      toast.error('Please enter a topic')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/ideas/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: form.topic, audience: form.audience || undefined, tone: form.tone }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setIdeas((data.ideas || []).slice(0, 6))
    } catch {
      toast.error('Failed to generate ideas')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (idea: GeneratedIdea) => {
    setSavingTitle(idea.title)
    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: idea.title,
          description: idea.description,
          targetAudience: idea.targetAudience,
          contentType: idea.contentType,
          keywords: idea.keywords.join(', '),
          difficulty: idea.difficulty,
          readingTime: idea.readingTime,
          tone: form.tone,
        }),
      })
      if (!res.ok) throw new Error()
      setSavedTitles(prev => new Set(prev).add(idea.title))
      toast.success('Idea saved to your list!')
    } catch {
      toast.error('Failed to save idea')
    } finally {
      setSavingTitle(null)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-gradient-fun flex items-center gap-2">
            Idea Generator 💡
          </h1>
          <p className="text-slate-500 mt-1">Stuck? Generate high-converting blog topics for your niche.</p>
        </div>
        <Button variant="outline" className="rounded-full border-funky-purple/40 text-funky-purple hover:bg-funky-purple/10" asChild>
          <Link href="/ideas/saved">View Saved Ideas</Link>
        </Button>
      </div>

      <Card className="rounded-2xl border-0 bg-white/85 dark:bg-slate-900/80 backdrop-blur shadow-funky">
        <CardContent className="p-6">
          <form onSubmit={generateIdeas} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 md:col-span-3 lg:col-span-1">
              <Label htmlFor="topic">Main Topic or Keyword <span className="text-red-500">*</span></Label>
              <Input
                id="topic"
                placeholder="e.g., React Hooks, remote work, minimalism"
                required
                className="bg-slate-50 dark:bg-slate-900"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Input
                id="audience"
                placeholder="e.g., Beginners, CTOs, designers"
                className="bg-slate-50 dark:bg-slate-900"
                value={form.audience}
                onChange={(e) => setForm({ ...form, audience: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Content Tone</Label>
              <Select value={form.tone} onValueChange={(v) => setForm({ ...form, tone: v })}>
                <SelectTrigger className="bg-slate-50 dark:bg-slate-900">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual / Conversational</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                  <SelectItem value="opinionated">Opinionated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-3 flex justify-end pt-2">
              <Button type="submit" disabled={loading} className="rounded-full bg-funky animate-gradient hover:opacity-95 text-white font-display font-bold shadow-funky hover-lift w-full sm:w-auto">
                {loading ? (
                  <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 animate-spin" /> Generating...</span>
                ) : (
                  <span className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> Generate Ideas ✨</span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3].map(i => (
            <Card key={i} className="border-slate-200 dark:border-slate-800">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2 pt-4">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && ideas.length > 0 && (
        <div className="space-y-6 mt-8">
          <h2 className="font-display text-xl font-extrabold flex items-center gap-2 text-slate-900 dark:text-white pb-2">
            Generated Ideas 🎈
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => {
              const isSaved = savedTitles.has(idea.title)
              return (
                <Card key={idea.title} className="rounded-2xl border-0 bg-gradient-to-b from-white to-funky-purple/5 dark:from-slate-900 dark:to-funky-purple/10 shadow-funky hover-lift flex flex-col animate-pop-in">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="rounded-full bg-funky-purple/15 border-0 text-funky-purple">
                        {idea.contentType}
                      </Badge>
                      <Badge variant="secondary" className={
                        idea.difficulty === 'Beginner' ? 'rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        idea.difficulty === 'Advanced' ? 'rounded-full bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400' :
                        'rounded-full bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400'
                      }>
                        {idea.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="font-display text-xl font-extrabold leading-tight">{idea.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 pb-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">{idea.description}</p>
                    <div className="flex items-center gap-2 mt-4 text-xs font-medium text-slate-500">
                      <Clock className="h-3.5 w-3.5 text-funky-pink" /> Est. {idea.readingTime} min read
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex gap-2">
                    <Button className="flex-1 rounded-full bg-funky animate-gradient hover:opacity-95 text-white font-display font-bold shadow-funky" asChild>
                      <Link href={`/editor?title=${encodeURIComponent(idea.title)}`}><PenSquare className="mr-2 h-4 w-4" /> Write</Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-funky-purple/40 hover:bg-funky-purple/10"
                      onClick={() => handleSave(idea)}
                      disabled={isSaved || savingTitle === idea.title}
                      title={isSaved ? 'Saved' : 'Save for later'}
                    >
                      {isSaved ? <Check className="h-4 w-4 text-emerald-500" /> : <Save className="h-4 w-4 text-funky-purple" />}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {!loading && ideas.length === 0 && (
        <div className="mt-12 text-center py-14 px-4 bg-white/70 dark:bg-slate-900/60 rounded-3xl shadow-funky">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-funky animate-gradient mb-4 shadow-funky animate-wiggle">
            <Lightbulb className="h-8 w-8 text-white" />
          </div>
          <h3 className="font-display text-xl font-extrabold text-slate-900 dark:text-slate-100">Ready to brainstorm?</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
            Fill out the form above with your topic, and we&apos;ll generate engaging, high-quality article ideas tailored for your audience.
          </p>
        </div>
      )}
    </div>
  )
}
