'use client'
import { useRouter } from 'next/navigation'
import {
  LayoutTemplate, Zap, Heart, BookOpen, Code, ListOrdered, Star,
  MessageSquare, FileSearch, Briefcase, Plane, Cpu, GraduationCap,
  ArrowLeftRight, Mic, Mail, FileText, type LucideIcon
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { blogTemplates } from '@/lib/templates'

const iconMap: Record<string, LucideIcon> = {
  Heart, BookOpen, Code, ListOrdered, Star, MessageSquare, FileSearch,
  Briefcase, Plane, Zap, Cpu, GraduationCap, ArrowLeftRight, Mic, Mail,
}

export default function TemplatesPage() {
  const router = useRouter()

  const handleUseTemplate = (id: string) => {
    router.push(`/editor?template=${id}`)
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      <div className="relative overflow-hidden flex items-center gap-4 bg-funky animate-gradient p-6 rounded-3xl shadow-funky-lg animate-pop-in">
        <div className="blob w-40 h-40 bg-white/30 -top-10 -left-5" />
        <div className="blob w-32 h-32 bg-white/20 bottom--10 right-10" />
        <div className="relative p-3 bg-white/20 backdrop-blur rounded-2xl text-white">
          <LayoutTemplate className="h-8 w-8" />
        </div>
        <div className="relative">
          <h1 className="font-display text-3xl font-extrabold text-white drop-shadow">Blog Templates 🎨</h1>
          <p className="text-white/85 mt-1">Jumpstart your writing with professional structures and layouts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="rounded-2xl border-0 bg-white/85 dark:bg-slate-900/80 backdrop-blur shadow-funky hover-lift flex flex-col group">
          <CardHeader>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6" />
              </div>
              <Badge variant="secondary" className="rounded-full bg-funky-purple/15 text-funky-purple border-0 font-bold">Basic</Badge>
            </div>
            <CardTitle className="font-display font-extrabold">Blank Post</CardTitle>
            <CardDescription className="line-clamp-2 min-h-[40px]">Start from scratch with an empty canvas.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1" />
          <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-800/50">
            <Button
              className="w-full rounded-full bg-funky animate-gradient hover:opacity-95 text-white font-display font-bold shadow-funky"
              onClick={() => router.push('/editor')}
            >
              Use Template ✨
            </Button>
          </CardFooter>
        </Card>

        {blogTemplates.map((template) => {
          const Icon = iconMap[template.icon] || FileText
          return (
            <Card key={template.id} className="rounded-2xl border-0 bg-white/85 dark:bg-slate-900/80 backdrop-blur shadow-funky hover-lift flex flex-col group">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-gradient-to-br from-funky-purple to-funky-pink text-white rounded-2xl group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <CardTitle className="font-display font-extrabold">{template.name}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px]">{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-center gap-1 text-sm text-slate-500 font-medium">
                  <Zap className="h-4 w-4 text-funky-orange" /> {template.bestFor}
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-800/50">
                <Button
                  className="w-full rounded-full bg-funky animate-gradient hover:opacity-95 text-white font-display font-bold shadow-funky"
                  onClick={() => handleUseTemplate(template.id)}
                >
                  Use Template ✨
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
