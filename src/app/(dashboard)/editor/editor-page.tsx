'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, Save, Eye, Send, Settings, Image as ImageIcon,
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, List, ListOrdered, 
  Quote, Code as CodeIcon, ImagePlus, Link as LinkIcon,
  AlignLeft, AlignCenter, AlignRight, Highlighter, Minus, Undo, Redo,
  ChevronRight, ChevronLeft, Loader2, X
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { slugify } from '@/lib/utils'
import { blogTemplates } from '@/lib/templates'

// TipTap imports
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import LinkExtension from '@tiptap/extension-link'
import ImageExtension from '@tiptap/extension-image'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'

interface Category {
  id: string
  name: string
}

export default function EditorPage({ postId }: { postId?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentId, setCurrentId] = useState<string | undefined>(postId)
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [saveStatus, setSaveStatus] = useState('Saved')
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(!!postId)
  const [categories, setCategories] = useState<Category[]>([])
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const dirtyRef = useRef(false)
  const currentIdRef = useRef<string | undefined>(postId)
  const statusRef = useRef<string>('DRAFT')
  const tagIdsRef = useRef<string[]>([])
  
  // Sidebar states
  const [category, setCategory] = useState('')
  const [slug, setSlug] = useState('')
  const [seoDescription, setSeoDescription] = useState('')
  const [featuredImage, setFeaturedImage] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const latestRef = useRef({ title, subtitle, slug, category, seoDescription, featuredImage })
  latestRef.current = { title, subtitle, slug, category, seoDescription, featuredImage }
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: {},
      }),
      Underline,
      LinkExtension.configure({ openOnClick: false }),
      ImageExtension,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Start writing your story...' })
    ],
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-lg max-w-none focus:outline-none min-h-[400px] w-full',
      },
    },
    onUpdate: () => {
      triggerAutoSave()
    }
  })

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.ok ? res.json() : [])
      .then(setCategories)
      .catch(() => {})
  }, [])

  // Load existing post if postId is present
  useEffect(() => {
    if (!postId || !editor) return
    let cancelled = false
    async function loadPost() {
      try {
        const res = await fetch(`/api/posts/${postId}`)
        if (!res.ok) throw new Error()
        const post = await res.json()
        if (cancelled) return
        setTitle(post.title || '')
        setSubtitle(post.subtitle || '')
        setSlug(post.slug || '')
        setSeoDescription(post.seoDescription || '')
        setCategory(post.categoryId || '')
        setFeaturedImage(post.featuredImage || '')
        tagIdsRef.current = (post.tags || []).map((t: any) => t.tagId)
        statusRef.current = post.status || 'DRAFT'
        editor!.commands.setContent(post.content || '', { emitUpdate: false })
      } catch {
        toast.error('Failed to load post')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadPost()
    return () => { cancelled = true }
  }, [postId, editor])

  // Prefill from ?title= or ?template= query params for new posts
  useEffect(() => {
    if (postId || !editor) return
    const titleParam = searchParams.get('title')
    const templateParam = searchParams.get('template')
    if (titleParam) {
      setTitle(titleParam)
      setSlug(slugify(titleParam))
    }
    if (templateParam) {
      const template = blogTemplates.find(t => t.id === templateParam)
      if (template) {
        editor.commands.setContent(template.content, { emitUpdate: false })
        if (!titleParam) {
          setTitle(template.name)
          setSlug(slugify(template.name))
        }
      }
    }
  }, [postId, editor, searchParams])

  const savePost = useCallback(async (status?: string): Promise<string | null> => {
    const { title: t, subtitle: st, slug: sl, category: cat, seoDescription: seo, featuredImage: img } = latestRef.current
    if (!t.trim()) {
      setSaveStatus('Unsaved changes')
      return null
    }
    const content = editor?.getHTML() || ''
    setIsSaving(true)
    setSaveStatus('Saving...')
    try {
      const payload = {
        title: t,
        slug: sl || undefined,
        subtitle: st || undefined,
        content,
        excerpt: (seo || st || undefined),
        featuredImage: img || undefined,
        status: status || (currentIdRef.current ? undefined : 'DRAFT'),
        categoryId: cat || undefined,
        tags: tagIdsRef.current,
        seoDescription: seo || undefined,
      }
      let res: Response
      if (currentIdRef.current) {
        res = await fetch(`/api/posts/${currentIdRef.current}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, status: status || statusRef.current || 'DRAFT' }),
        })
      } else {
        res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, status: status || 'DRAFT' }),
        })
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Save failed')
      }
      const saved = await res.json()
      currentIdRef.current = saved.id
      setCurrentId(saved.id)
      statusRef.current = saved.status
      if (saved.slug) setSlug(saved.slug)
      dirtyRef.current = false
      setIsSaving(false)
      setSaveStatus('Saved just now')
      return saved.id
    } catch (e: any) {
      setIsSaving(false)
      setSaveStatus('Unsaved changes')
      toast.error(e?.message || 'Failed to save post')
      return null
    }
  }, [editor])

  const savePostRef = useRef(savePost)
  savePostRef.current = savePost

  const triggerAutoSave = useCallback(() => {
    dirtyRef.current = true
    setSaveStatus('Unsaved changes')
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(() => {
      if (dirtyRef.current) savePostRef.current()
    }, 5000)
  }, [])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    if (!currentId && !slug) {
      setSlug(slugify(e.target.value))
    }
    triggerAutoSave()
  }

  const handlePublish = async () => {
    if (!title.trim()) {
      toast.error('Please add a title before publishing')
      return
    }
    setIsSaving(true)
    const id = await savePost('PUBLISHED')
    setIsSaving(false)
    if (id) {
      toast.success('Post published successfully!')
      router.push('/posts')
    }
  }

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Upload failed')
      }
      const data = await res.json()
      setFeaturedImage(data.url)
      triggerAutoSave()
      toast.success('Image uploaded')
    } catch (e: any) {
      toast.error(e?.message || 'Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading editor...</div>
  }

  const wordCount = editor?.getText().split(/\s+/).filter(w => w.length > 0).length || 0
  const readingTime = Math.ceil(wordCount / 200)

  const ToolbarButton = ({ onClick, isActive, disabled, icon: Icon, title: btnTitle }: any) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={btnTitle}
      className={`p-1.5 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
        isActive 
          ? 'bg-funky-purple/15 text-funky-purple dark:text-funky-pink' 
          : 'text-slate-600 hover:bg-funky-purple/10 dark:text-slate-400'
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  )

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-slate-950 overflow-hidden">
      {/* Topbar */}
      <header className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 bg-white dark:bg-slate-950 z-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/posts"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div className="hidden sm:block">
            <span className="font-display font-extrabold text-gradient-fun">WriteSpace ✍️</span>
            <span className="text-slate-300 dark:text-slate-700 mx-2">|</span>
            <span className="text-sm text-slate-500">{saveStatus}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4 text-xs text-slate-500 mr-2">
            <span>{wordCount} words</span>
            <span>{readingTime} min read</span>
          </div>
          
          <Button variant="outline" size="sm" className="rounded-full border-funky-purple/30 hover:bg-funky-purple/10 font-display font-bold" onClick={() => savePost()} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />} Save Draft
          </Button>
          {currentId ? (
            <Button variant="secondary" size="sm" className="rounded-full bg-funky-teal/15 text-teal-700 dark:text-funky-teal hover:bg-funky-teal/25 font-display font-bold" asChild>
              <Link href={`/preview/${currentId}`}><Eye className="h-4 w-4 mr-2" /> Preview</Link>
            </Button>
          ) : (
            <Button variant="secondary" size="sm" className="rounded-full font-display font-bold" disabled>
              <Eye className="h-4 w-4 mr-2" /> Preview
            </Button>
          )}
          <Button size="sm" className="rounded-full bg-funky animate-gradient hover:opacity-95 text-white font-display font-bold shadow-funky" onClick={handlePublish} disabled={isSaving}>
            <Send className="h-4 w-4 mr-2" /> Publish 🚀
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Area */}
        <div className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'md:pr-80' : ''}`}>
          
          {/* Editor Toolbar - Sticky */}
          <div className="border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm p-2 flex items-center justify-center gap-1 z-10 sticky top-0 overflow-x-auto">
            {editor && (
              <div className="flex items-center gap-1 min-w-max px-4">
                <ToolbarButton icon={Bold} title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} />
                <ToolbarButton icon={Italic} title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} />
                <ToolbarButton icon={UnderlineIcon} title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} />
                <ToolbarButton icon={Strikethrough} title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} />
                
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" />
                
                <ToolbarButton icon={Heading1} title="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} />
                <ToolbarButton icon={Heading2} title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} />
                <ToolbarButton icon={Heading3} title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} />
                
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" />
                
                <ToolbarButton icon={List} title="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} />
                <ToolbarButton icon={ListOrdered} title="Ordered List" onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} />
                <ToolbarButton icon={Quote} title="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} />
                <ToolbarButton icon={CodeIcon} title="Code Block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} />
                
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" />
                
                <ToolbarButton icon={AlignLeft} title="Align Left" onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} />
                <ToolbarButton icon={AlignCenter} title="Align Center" onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} />
                <ToolbarButton icon={AlignRight} title="Align Right" onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} />
                
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" />
                
                <ToolbarButton icon={LinkIcon} title="Link" onClick={() => {
                  const url = window.prompt('URL')
                  if (url) editor.chain().focus().setLink({ href: url }).run()
                }} isActive={editor.isActive('link')} />
                <ToolbarButton icon={ImagePlus} title="Image" onClick={() => {
                  const url = window.prompt('Image URL')
                  if (url) editor.chain().focus().setImage({ src: url }).run()
                }} />
                <ToolbarButton icon={Highlighter} title="Highlight" onClick={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive('highlight')} />
                <ToolbarButton icon={Minus} title="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()} />
                
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" />
                
                <ToolbarButton icon={Undo} title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} />
                <ToolbarButton icon={Redo} title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} />
              </div>
            )}
          </div>

          <ScrollArea className="flex-1 px-4 sm:px-8 lg:px-12 py-8">
            <div className="max-w-3xl mx-auto w-full pb-32">
              <input
                type="text"
                placeholder="Write your headline..."
                className="w-full text-4xl sm:text-5xl font-display font-extrabold bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 mb-4 tracking-tight"
                value={title}
                onChange={handleTitleChange}
              />
              <input
                type="text"
                placeholder="Add a short description..."
                className="w-full text-xl text-slate-500 bg-transparent border-none outline-none mb-8"
                value={subtitle}
                onChange={(e) => { setSubtitle(e.target.value); triggerAutoSave(); }}
              />
              
              <EditorContent editor={editor} className="min-h-[400px]" />
            </div>
          </ScrollArea>
        </div>

        {/* Sidebar Panel */}
        <div className={`
          fixed md:absolute inset-y-0 right-0 w-80 bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 
          transform transition-transform duration-300 ease-in-out z-30 pt-14 md:pt-0
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white md:bg-transparent dark:bg-slate-950 md:dark:bg-transparent">
              <h3 className="font-display font-extrabold">Post Settings ⚙️</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)} className="md:hidden">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={(v) => { setCategory(v); triggerAutoSave(); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Featured Image</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file)
                      e.target.value = ''
                    }}
                  />
                  {featuredImage ? (
                    <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={featuredImage} alt="Featured" className="w-full h-36 object-cover" />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 rounded-full"
                        onClick={() => { setFeaturedImage(''); triggerAutoSave(); }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed border-funky-purple/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-funky-purple/5 hover:border-funky-pink transition-colors text-funky-purple"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {uploadingImage ? <Loader2 className="h-8 w-8 mb-2 animate-spin" /> : <ImageIcon className="h-8 w-8 mb-2 animate-wiggle" />}
                      <span className="text-sm font-display font-bold">Click to upload</span>
                      <span className="text-xs text-slate-500 mt-1">1200 x 630px recommended</span>
                    </div>
                  )}
                </div>

                <Separator className="bg-slate-200 dark:bg-slate-700" />

                <div className="space-y-4">
                  <h4 className="font-medium text-sm">SEO & Metadata</h4>
                  
                  <div className="space-y-2">
                    <Label className="text-xs">URL Slug</Label>
                    <Input value={slug} onChange={e => { setSlug(e.target.value); triggerAutoSave(); }} className="h-8 text-sm" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs">Meta Description</Label>
                    <Textarea 
                      placeholder="Brief description for search engines..." 
                      className="h-20 text-sm resize-none" 
                      value={seoDescription}
                      onChange={e => { setSeoDescription(e.target.value); triggerAutoSave(); }}
                    />
                    <p className="text-xs text-slate-400">{seoDescription.length}/160 characters</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Sidebar Toggle Button (when closed) */}
        {!isSidebarOpen && (
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute right-4 top-20 z-10 hidden md:flex rounded-full shadow-md bg-white dark:bg-slate-900"
            onClick={() => setIsSidebarOpen(true)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
