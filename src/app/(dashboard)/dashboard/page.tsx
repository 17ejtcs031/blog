'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from '@/hooks/use-session'
import { getGreeting, formatNumber, formatRelativeDate } from '@/lib/utils'
import { 
  FileText, CheckCircle, Clock, Eye, Heart, MessageSquare, 
  PenSquare, Lightbulb, LayoutTemplate, BarChart3, ArrowRight, MoreHorizontal 
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'
import Image from 'next/image'

export default function DashboardPage() {
  const { user } = useSession()
  const [stats, setStats] = useState<any>(null)
  const [recentPosts, setRecentPosts] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [savedIdeas, setSavedIdeas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [analyticsRes, postsRes, ideasRes] = await Promise.all([
          fetch('/api/analytics'),
          fetch('/api/posts?limit=5'),
          fetch('/api/ideas'),
        ])

        if (analyticsRes.ok) {
          const analytics = await analyticsRes.json()
          setStats({
            totalPosts: analytics.stats.totalPosts,
            published: analytics.stats.publishedPosts,
            drafts: analytics.stats.draftPosts,
            views: analytics.stats.totalViews,
            likes: analytics.stats.totalLikes,
            comments: analytics.stats.totalComments,
          })
          setChartData(
            (analytics.charts.viewsByDate || []).slice(-30).map((d: any) => ({
              name: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              views: d.views,
            }))
          )
        }

        if (postsRes.ok) {
          const data = await postsRes.json()
          setRecentPosts(
            (data.posts || []).map((p: any) => ({
              id: p.id,
              title: p.title,
              status: p.status,
              category: p.category?.name || '—',
              date: p.createdAt,
              views: p.views,
            }))
          )
        }

        if (ideasRes.ok) {
          const ideas = await ideasRes.json()
          setSavedIdeas(ideas.slice(0, 3))
        }
      } catch {
        // Errors surface as empty states
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Elegant welcome banner */}
      <div className="relative overflow-hidden rounded-[30px] border border-[#dbc8c1] bg-gradient-to-r from-[#e6d9d3] via-[#efe6df] to-[#f3ebe5] shadow-funky-lg animate-pop-in">
        <div className="blob bg-[#d9c1c8] h-40 w-40 -top-8 right-16 opacity-50 animate-float-slow" />
        <div className="blob bg-[#d3d8c8] h-32 w-32 bottom-0 left-10 opacity-35 animate-float" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 p-8">
          <div className="text-[#473947]">
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold leading-tight">
              {getGreeting?.() || 'Welcome'}, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="mt-2 text-lg text-[#5d4b5e]">Your writing space is ready for the next thoughtful story.</p>
            <Button asChild className="mt-5 rounded-full bg-[#5f4b74] text-[#f7f3f1] hover:bg-[#4f3b64] font-display font-bold shadow-funky hover-lift">
              <Link href="/editor"><PenSquare className="mr-2 h-4 w-4" /> Start writing</Link>
            </Button>
          </div>
          <div className="hidden sm:flex h-32 w-56 items-center justify-center rounded-[26px] border border-[#d9c6c1] bg-[radial-gradient(circle_at_30%_20%,_rgba(255,255,255,0.65),_transparent_28%),linear-gradient(135deg,#ead6d2,#d9d7e8,#e9d7c5)] shadow-funky">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f1efe8] text-3xl shadow-inner shadow-[#bca7a0]">✒️</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Posts', value: stats?.totalPosts, icon: FileText, gradient: 'from-[#8d6b7d] via-[#7d5a73] to-[#6a4d63]' },
          { label: 'Published', value: stats?.published, icon: CheckCircle, gradient: 'from-[#d9a36d] via-[#c9864d] to-[#ba7046]' },
          { label: 'Drafts', value: stats?.drafts, icon: Clock, gradient: 'from-[#d8b57a] via-[#c39a5a] to-[#a77a4a]' },
          { label: 'Total Views', value: stats?.views ? formatNumber?.(stats.views) : 0, icon: Eye, gradient: 'from-[#8d7b8a] via-[#756a7f] to-[#5f586d]' },
          { label: 'Total Likes', value: stats?.likes ? formatNumber?.(stats.likes) : 0, icon: Heart, gradient: 'from-[#d88a75] via-[#c46e63] to-[#b45752]' },
          { label: 'Comments', value: stats?.comments, icon: MessageSquare, gradient: 'from-[#90a7b8] via-[#7d90a8] to-[#657892]' },
        ].map((stat, i) => (
          <div
            key={i}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.gradient} text-[#f7f1eb] p-4 shadow-funky hover-lift flex flex-col items-center justify-center text-center`}
          >
            <div className="blob bg-white h-16 w-16 -top-6 -right-6 opacity-20" />
            <div className="relative p-2 rounded-xl bg-white/25 mb-2">
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="relative text-xs font-semibold text-white/85">{stat.label}</p>
            {loading ? (
              <Skeleton className="h-7 w-16 mt-1 bg-white/30" />
            ) : (
              <p className="relative font-display text-2xl font-extrabold mt-0.5">{stat.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/editor" className="group">
          <div className="relative overflow-hidden h-full rounded-2xl bg-[linear-gradient(135deg,#e9d3c1_0%,#d5b8a8_100%)] text-[#4e3d3b] p-6 shadow-funky-lg hover-lift flex flex-col items-center justify-center text-center gap-3">
            <div className="blob bg-[#f5eadf] h-24 w-24 -top-8 -left-8 opacity-40" />
            <div className="relative p-3 rounded-full bg-[#f7efe9]/70 group-hover:scale-105 transition-transform">
              <PenSquare className="h-6 w-6" />
            </div>
            <div className="relative font-display font-bold text-lg">Write New Blog</div>
          </div>
        </Link>
        
        {[
          { title: 'Get Ideas', icon: Lightbulb, href: '/ideas', gradient: 'from-[#d9b16d] via-[#c59351] to-[#ba7c48]' },
          { title: 'Use Template', icon: LayoutTemplate, href: '/templates', gradient: 'from-[#9bb7a7] via-[#7da38d] to-[#6d8d7d]' },
          { title: 'View Analytics', icon: BarChart3, href: '/analytics', gradient: 'from-[#8d7ca5] via-[#75658e] to-[#5e4d73]' },
        ].map((action, i) => (
          <Link key={i} href={action.href} className="group">
            <div className={`relative overflow-hidden h-full rounded-2xl bg-gradient-to-br ${action.gradient} text-[#f7f1eb] p-6 shadow-funky hover-lift flex flex-col items-center justify-center text-center gap-3`}>
              <div className="blob bg-white/15 h-24 w-24 -bottom-8 -right-8 opacity-20" />
              <div className="relative p-3 rounded-full bg-white/15 group-hover:scale-105 transition-transform">
                <action.icon className="h-6 w-6" />
              </div>
              <div className="relative font-display font-bold text-lg">{action.title}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area - Chart & Table */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-2xl border-0 shadow-funky bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-display font-extrabold">Performance Overview</CardTitle>
                <CardDescription>Views across all content over the last 30 days</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="rounded-full border-funky-purple/40 text-funky-purple hover:bg-funky-purple/10" asChild>
                <Link href="/analytics">Full Report</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {loading ? (
                  <Skeleton className="w-full h-full rounded-xl" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff4d8d" stopOpacity={0.45}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dx={-10} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                      />
                      <Area type="monotone" dataKey="views" stroke="#ff4d8d" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-funky bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-display font-extrabold">Recent Posts</CardTitle>
                <CardDescription>Your latest written content</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="rounded-full text-funky-purple hover:bg-funky-purple/10 flex items-center gap-1" asChild>
                <Link href="/posts">View All <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50">
                      <tr>
                        <th className="px-4 py-3 font-medium rounded-tl-lg">Title</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Category</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium">Views</th>
                        <th className="px-4 py-3 font-medium rounded-tr-lg"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPosts.map((post) => (
                        <tr key={post.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-4 py-4 font-medium text-slate-900 dark:text-slate-100 max-w-[200px] truncate">
                            <Link href={`/editor/${post.id}`} className="hover:text-indigo-600 transition-colors">{post.title}</Link>
                          </td>
                          <td className="px-4 py-4">
                            <Badge variant="outline" className={post.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400'}>
                              {post.status.charAt(0) + post.status.slice(1).toLowerCase()}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 text-slate-500">{post.category}</td>
                          <td className="px-4 py-4 text-slate-500">{formatRelativeDate(post.date)}</td>
                          <td className="px-4 py-4 font-medium">{formatNumber(post.views)}</td>
                          <td className="px-4 py-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild><Link href={`/editor/${post.id}`}>Edit</Link></DropdownMenuItem>
                                <DropdownMenuItem asChild><Link href={`/preview/${post.id}`}>Preview</Link></DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-0 shadow-funky bg-gradient-to-br from-funky-purple/10 via-funky-pink/10 to-funky-teal/10 dark:from-slate-900 dark:to-slate-900">
            <CardHeader>
              <CardTitle className="font-display font-extrabold text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500 animate-wiggle" />
                Writing Inspiration
              </CardTitle>
              <CardDescription>{savedIdeas.length > 0 ? 'Your saved ideas' : 'Trending topics in your niche'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(savedIdeas.length > 0
                ? savedIdeas.map((idea) => ({ title: idea.title, type: idea.contentType || 'Idea' }))
                : [
                    { title: 'The Rise of AI in Front-end', type: 'Opinion' },
                    { title: 'How to structure a Next.js App', type: 'Tutorial' },
                    { title: 'CSS Variables vs Tailwind', type: 'Comparison' },
                  ]
              ).map((idea, i) => (
                <div key={i} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-funky-purple/10 shadow-sm hover-lift">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{idea.title}</h4>
                      <Badge variant="secondary" className="mt-2 text-[10px] rounded-full bg-funky-pink/15 text-funky-pink border-0">{idea.type}</Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3 text-xs rounded-full border-funky-purple/40 text-funky-purple hover:bg-funky-purple/10" asChild>
                    <Link href={`/editor?title=${encodeURIComponent(idea.title)}`}>Write about this</Link>
                  </Button>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-sm rounded-full text-funky-purple hover:bg-funky-purple/10" asChild>
                <Link href="/ideas">Generate more ideas ✨</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
