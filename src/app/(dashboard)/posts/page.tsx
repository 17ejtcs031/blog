'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { PenSquare, Search, MoreVertical, Filter, Trash2, Eye, Edit, Copy, Send, Archive } from 'lucide-react'
import { formatRelativeDate, formatNumber } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import Image from 'next/image'

interface Category {
  id: string
  name: string
}

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [postToDelete, setPostToDelete] = useState<string | null>(null)

  const loadPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/posts?limit=200')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setPosts(data.posts || [])
    } catch {
      toast.error('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPosts()
    fetch('/api/categories')
      .then(res => res.ok ? res.json() : [])
      .then(setCategories)
      .catch(() => {})
  }, [loadPosts])

  const handleDelete = async () => {
    if (!postToDelete) return
    try {
      const res = await fetch(`/api/posts/${postToDelete}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setPosts(posts.filter(p => p.id !== postToDelete))
      toast.success('Post deleted successfully')
    } catch {
      toast.error('Failed to delete post')
    } finally {
      setPostToDelete(null)
    }
  }

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/posts/${id}/duplicate`, { method: 'POST' })
      if (!res.ok) throw new Error()
      toast.success('Post duplicated as draft')
      loadPosts()
    } catch {
      toast.error('Failed to duplicate post')
    }
  }

  const handleStatusChange = async (id: string, status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED') => {
    try {
      const res = await fetch(`/api/posts/${id}/publish`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      setPosts(posts.map(p => p.id === id ? { ...p, status } : p))
      toast.success(status === 'PUBLISHED' ? 'Post published!' : `Post moved to ${status.charAt(0) + status.slice(1).toLowerCase()}`)
    } catch {
      toast.error('Failed to update post status')
    }
  }

  const PostList = ({ statusFilter = 'all' }: { statusFilter?: string }) => {
    const filtered = posts
      .filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter
        const matchesCategory = categoryFilter === 'all' || p.categoryId === categoryFilter
        return matchesSearch && matchesStatus && matchesCategory
      })
      .sort((a, b) => {
        if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        if (sortBy === 'most-viewed') return b.views - a.views
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })

    if (loading) {
      return (
        <div className="space-y-4 mt-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="border-slate-200 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="space-y-3 w-full max-w-lg">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }

    if (filtered.length === 0) {
      return (
        <div className="mt-12 text-center py-10 rounded-3xl bg-white/70 dark:bg-slate-900/60 shadow-funky">
          <Image src="/images/empty-state.png" alt="" width={180} height={180} className="mx-auto h-40 w-40 object-contain animate-float" />
          <h3 className="font-display text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">Nothing here yet!</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery ? `No results for "${searchQuery}"` : "Your next great story is one click away."}
          </p>
          {!searchQuery && (
            <Button className="mt-6 rounded-full bg-funky animate-gradient hover:opacity-95 text-white font-display font-bold shadow-funky hover-lift" asChild>
              <Link href="/editor">
                <PenSquare className="mr-2 h-4 w-4" /> Create your first post
              </Link>
            </Button>
          )}
        </div>
      )
    }

    return (
      <div className="space-y-4 mt-6">
        {filtered.map(post => (
          <Card key={post.id} className="rounded-2xl border-0 bg-white/85 dark:bg-slate-900/80 backdrop-blur shadow-funky hover-lift">
            <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge variant="outline" className={
                    post.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400' : 
                    post.status === 'DRAFT' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400' :
                    'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                  }>
                    {post.status.charAt(0) + post.status.slice(1).toLowerCase()}
                  </Badge>
                  {post.category && (
                    <Badge variant="secondary" className="rounded-full bg-funky-purple/15 text-funky-purple border-0">{post.category.name}</Badge>
                  )}
                  <span className="text-xs text-slate-500">{formatRelativeDate(post.createdAt)}</span>
                </div>
                <Link href={`/editor/${post.id}`} className="block group">
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-funky-pink transition-colors truncate">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-1 sm:line-clamp-2">{post.excerpt || post.subtitle}</p>
                </Link>
              </div>
              
              <div className="flex items-center gap-4 sm:gap-6 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1" title="Views">
                    <Eye className="h-4 w-4" />
                    <span>{formatNumber(post.views)}</span>
                  </div>
                  <div className="hidden sm:block text-xs">{post.readingTime} min</div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild className="hidden sm:flex">
                    <Link href={`/editor/${post.id}`}>Edit</Link>
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild><Link href={`/editor/${post.id}`}><Edit className="mr-2 h-4 w-4" /> Edit</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link href={`/preview/${post.id}`}><Eye className="mr-2 h-4 w-4" /> Preview</Link></DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(post.id)}><Copy className="mr-2 h-4 w-4" /> Duplicate</DropdownMenuItem>
                      {post.status !== 'PUBLISHED' ? (
                        <DropdownMenuItem onClick={() => handleStatusChange(post.id, 'PUBLISHED')}><Send className="mr-2 h-4 w-4" /> Publish</DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleStatusChange(post.id, 'DRAFT')}><Send className="mr-2 h-4 w-4" /> Unpublish</DropdownMenuItem>
                      )}
                      {post.status !== 'ARCHIVED' && (
                        <DropdownMenuItem onClick={() => handleStatusChange(post.id, 'ARCHIVED')}><Archive className="mr-2 h-4 w-4" /> Archive</DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setPostToDelete(post.id); }} className="text-red-600 focus:text-red-600 dark:text-red-400">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the post
                              and remove it from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setPostToDelete(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-gradient-fun">My Posts 📚</h1>
          <p className="text-slate-500 mt-1">Manage and organize all your written content.</p>
        </div>
        <Button asChild className="rounded-full bg-funky animate-gradient hover:opacity-95 text-white font-display font-bold shadow-funky hover-lift">
          <Link href="/editor">
            <PenSquare className="mr-2 h-4 w-4" /> Write New Post
          </Link>
        </Button>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur p-4 rounded-2xl border-0 shadow-funky flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search posts..." 
            className="pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px] bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-2"><Filter className="h-4 w-4" /> <SelectValue placeholder="Category" /></div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px] bg-slate-50 dark:bg-slate-900">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="most-viewed">Most Viewed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-slate-100 dark:bg-slate-900 p-1">
          <TabsTrigger value="all" className="rounded-md">All Posts</TabsTrigger>
          <TabsTrigger value="published" className="rounded-md">Published</TabsTrigger>
          <TabsTrigger value="drafts" className="rounded-md">Drafts</TabsTrigger>
          <TabsTrigger value="archived" className="rounded-md">Archived</TabsTrigger>
        </TabsList>
        <TabsContent value="all"><PostList statusFilter="all" /></TabsContent>
        <TabsContent value="published"><PostList statusFilter="PUBLISHED" /></TabsContent>
        <TabsContent value="drafts"><PostList statusFilter="DRAFT" /></TabsContent>
        <TabsContent value="archived"><PostList statusFilter="ARCHIVED" /></TabsContent>
      </Tabs>
    </div>
  )
}
