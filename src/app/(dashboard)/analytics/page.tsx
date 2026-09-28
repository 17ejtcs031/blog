'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { formatNumber } from '@/lib/utils'
import { TrendingUp, FileText, Heart, MessageSquare, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const COLORS = ['#ff4d8d', '#8b5cf6', '#14d3c4', '#ff8a3d', '#ffd23f', '#3b82f6', '#ec4899', '#10b981']

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.ok ? res.json() : null)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const rangeDays = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '12m' ? 365 : 90

  const viewData = useMemo(() => {
    const all = data?.charts?.viewsByDate || []
    return all
      .slice(-Math.min(rangeDays, all.length))
      .map((d: any) => ({
        name: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        views: d.views,
      }))
  }, [data, rangeDays])

  const categoryData = useMemo(
    () => (data?.categoryPerformance || []).filter((c: any) => c.views > 0),
    [data]
  )

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    )
  }

  const stats = data?.stats || { totalViews: 0, publishedPosts: 0, totalLikes: 0, totalComments: 0 }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-gradient-fun flex items-center gap-2">
            Analytics Overview 📈
          </h1>
          <p className="text-slate-500 mt-1">Track your content performance and audience growth.</p>
        </div>
        
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[150px] rounded-full bg-white/85 dark:bg-slate-900 border-0 shadow-funky">
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-funky-purple" /><SelectValue /></div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Views', value: formatNumber(stats.totalViews), icon: TrendingUp, gradient: 'from-funky-purple to-funky-pink' },
          { title: 'Published Posts', value: String(stats.publishedPosts), icon: FileText, gradient: 'from-emerald-400 to-teal-500' },
          { title: 'Total Likes', value: formatNumber(stats.totalLikes), icon: Heart, gradient: 'from-rose-500 to-pink-500' },
          { title: 'Comments', value: formatNumber(stats.totalComments), icon: MessageSquare, gradient: 'from-sky-500 to-indigo-500' },
        ].map((stat, i) => (
          <div key={i} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.gradient} text-white p-6 shadow-funky hover-lift`}>
            <div className="blob bg-white h-24 w-24 -top-8 -right-8 opacity-20" />
            <div className="relative flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white/85">{stat.title}</p>
                <p className="font-display text-3xl font-extrabold">{stat.value}</p>
              </div>
              <div className="p-2 rounded-xl bg-white/25">
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-2xl border-0 bg-white/85 dark:bg-slate-900/80 backdrop-blur shadow-funky">
          <CardHeader>
            <CardTitle className="font-display font-extrabold">Traffic Overview</CardTitle>
            <CardDescription>Views over the selected time range</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={viewData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff4d8d" stopOpacity={0.45}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} allowDecimals={false} />
                  <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="views" name="Page Views" stroke="#ff4d8d" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-2xl border-0 bg-white/85 dark:bg-slate-900/80 backdrop-blur shadow-funky">
            <CardHeader>
              <CardTitle className="font-display font-extrabold">Top Categories</CardTitle>
              <CardDescription>Views distribution by category</CardDescription>
            </CardHeader>
            <CardContent>
              {categoryData.length === 0 ? (
                <div className="h-[220px] flex items-center justify-center text-sm text-slate-400">No view data yet</div>
              ) : (
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="views"
                        nameKey="name"
                      >
                        {categoryData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend layout="vertical" verticalAlign="middle" align="right" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 bg-white/85 dark:bg-slate-900/80 backdrop-blur shadow-funky">
            <CardHeader>
              <CardTitle className="font-display font-extrabold">Posts per Month</CardTitle>
              <CardDescription>Publishing cadence over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.charts?.postsPerMonth || []} margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} allowDecimals={false} />
                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="count" name="Posts" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="rounded-2xl border-0 bg-white/85 dark:bg-slate-900/80 backdrop-blur shadow-funky">
        <CardHeader>
          <CardTitle className="font-display font-extrabold">Top Performing Posts 🏆</CardTitle>
          <CardDescription>Your most viewed content of all time</CardDescription>
        </CardHeader>
        <CardContent>
          {(data?.topPosts || []).length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">No posts yet — start writing!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50">
                  <tr>
                    <th className="px-4 py-3 font-medium rounded-tl-lg">Rank</th>
                    <th className="px-4 py-3 font-medium">Post Title</th>
                    <th className="px-4 py-3 font-medium text-right rounded-tr-lg">Views</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.topPosts || []).map((post: any, index: number) => (
                    <tr key={post.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-4 font-medium">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${index < 3 ? 'bg-funky animate-gradient text-white shadow-funky' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-4 py-4 font-medium text-slate-900 dark:text-slate-100">
                        <Link href={`/preview/${post.id}`} className="hover:text-funky-pink transition-colors">{post.title}</Link>
                      </td>
                      <td className="px-4 py-4 text-right font-medium">{formatNumber(post.views)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
