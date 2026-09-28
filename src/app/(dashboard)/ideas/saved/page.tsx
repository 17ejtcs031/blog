'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Trash2, PenSquare, Search, Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface SavedIdea {
  id: string
  title: string
  description: string | null
  contentType: string | null
  difficulty: string | null
  createdAt: string
}

export default function SavedIdeasPage() {
  const [ideas, setIdeas] = useState<SavedIdea[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const loadIdeas = useCallback(async () => {
    try {
      const res = await fetch('/api/ideas')
      if (res.ok) setIdeas(await res.json())
    } catch {
      toast.error('Failed to load saved ideas')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadIdeas()
  }, [loadIdeas])

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/ideas/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setIdeas(ideas.filter(idea => idea.id !== id))
      toast.success('Idea removed from saved list')
    } catch {
      toast.error('Failed to remove idea')
    }
  }

  const filtered = ideas.filter(i =>
    i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (i.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-gradient-fun flex items-center gap-2">
            Saved Ideas 🔖
          </h1>
          <p className="text-slate-500 mt-1">Ideas you've saved for future writing.</p>
        </div>
        <Button variant="outline" className="rounded-full border-funky-purple/40 text-funky-purple hover:bg-funky-purple/10" asChild>
          <Link href="/ideas">Generate New Ideas</Link>
        </Button>
      </div>

      <div className="bg-white/85 dark:bg-slate-900/80 backdrop-blur p-4 rounded-2xl border-0 shadow-funky flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-funky-purple" />
          <Input
            placeholder="Search saved ideas..."
            className="pl-9 rounded-full bg-slate-50 dark:bg-slate-900 border-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {loading && [1, 2].map(i => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
            <Skeleton className="h-5 w-2/3 mb-3" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}

        {!loading && filtered.map((idea) => (
          <div key={idea.id} className="bg-white/85 dark:bg-slate-900/80 backdrop-blur rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center shadow-funky hover-lift">
            <div className="space-y-2 flex-1">
              <div className="flex gap-2 mb-1">
                {idea.contentType && <Badge variant="outline" className="rounded-full bg-funky-purple/15 border-0 text-funky-purple">{idea.contentType}</Badge>}
                {idea.difficulty && <Badge variant="secondary" className="rounded-full bg-funky-pink/15 text-funky-pink border-0">{idea.difficulty}</Badge>}
              </div>
              <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">{idea.title}</h3>
              {idea.description && <p className="text-sm text-slate-500 line-clamp-2">{idea.description}</p>}
              <p className="text-xs text-slate-400">Saved on {formatDate(idea.createdAt)}</p>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t border-slate-100 dark:border-slate-800 sm:border-0">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border-slate-200 dark:border-slate-800">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Idea?</AlertDialogTitle>
                    <AlertDialogDescription>This will remove the idea from your saved list.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(idea.id)} className="bg-red-600 hover:bg-red-700">Remove</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button className="flex-1 sm:flex-none rounded-full bg-funky animate-gradient hover:opacity-95 text-white font-display font-bold shadow-funky" asChild>
                <Link href={`/editor?title=${encodeURIComponent(idea.title)}`}>
                  <PenSquare className="mr-2 h-4 w-4" /> Start Writing
                </Link>
              </Button>
            </div>
          </div>
        ))}
        
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 rounded-3xl bg-white/70 dark:bg-slate-900/60 shadow-funky">
            <Bookmark className="h-12 w-12 text-funky-purple/40 mx-auto mb-4 animate-wiggle" />
            <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-slate-100">
              {searchQuery ? 'No matching ideas' : 'No saved ideas'}
            </h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `Nothing matches "${searchQuery}". Try a different search.`
                : "You haven't saved any ideas yet. Use the Idea Generator to find and save inspiration."}
            </p>
            {!searchQuery && (
              <Button className="mt-6 rounded-full bg-funky animate-gradient hover:opacity-95 text-white font-display font-bold shadow-funky hover-lift" asChild>
                <Link href="/ideas">Go to Generator</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
