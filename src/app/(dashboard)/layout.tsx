'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from '@/hooks/use-session'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, FileText, PenSquare, Lightbulb, 
  LayoutTemplate, BarChart3, ImageIcon, FolderOpen, 
  Settings, User, LogOut, Menu, Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const mainNavItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, color: 'text-funky-purple' },
  { name: 'Feed', href: '/feed', icon: FileText, color: 'text-blue-500' },
  { name: 'Posts', href: '/posts', icon: FileText, color: 'text-blue-500' },
  { name: 'Write', href: '/editor', icon: PenSquare, color: 'text-funky-pink' },
  { name: 'Ideas', href: '/ideas', icon: Lightbulb, color: 'text-amber-500' },
  { name: 'Templates', href: '/templates', icon: LayoutTemplate, color: 'text-emerald-500' },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, color: 'text-indigo-500' },
  { name: 'Media', href: '/media', icon: ImageIcon, color: 'text-rose-500' },
  { name: 'Categories', href: '/categories', icon: FolderOpen, color: 'text-teal-500' },
]

const bottomNavItems = [
  { name: 'Settings', href: '/settings', icon: Settings, color: 'text-slate-600' },
  { name: 'Profile', href: '/profile', icon: User, color: 'text-funky-orange' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useSession?.() || { user: { name: 'User', email: 'user@example.com' } }
  
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (e) {
      console.error(e)
    }
  }

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <div className="flex flex-col gap-1.5 w-full">
      {mainNavItems.map((item) => {
        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onClick}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
              isActive 
                ? "bg-white text-slate-900 shadow-funky scale-[1.02]" 
                : "text-white/75 hover:bg-white/15 hover:text-white"
            )}
          >
            <item.icon className={cn("h-5 w-5", isActive ? item.color : "text-white/80")} />
            {item.name}
          </Link>
        )
      })}
      <div className="my-3 border-t border-white/20" />
      {bottomNavItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onClick}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
              isActive 
                ? "bg-white text-slate-900 shadow-funky scale-[1.02]" 
                : "text-white/75 hover:bg-white/15 hover:text-white"
            )}
          >
            <item.icon className={cn("h-5 w-5", isActive ? item.color : "text-white/80")} />
            {item.name}
          </Link>
        )
      })}
    </div>
  )

  const Brand = () => (
    <Link href="/dashboard" className="flex items-center gap-2.5">
      <div className="h-9 w-9 rounded-xl bg-white/25 backdrop-blur flex items-center justify-center shadow-funky animate-wiggle">
        <span className="text-white font-display font-extrabold text-lg">W</span>
      </div>
      <span className="font-display font-extrabold text-xl text-white tracking-tight">WriteSpace</span>
    </Link>
  )

  return (
    <div className="flex h-screen bg-funky-soft dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="relative hidden md:flex flex-col w-64 bg-[linear-gradient(180deg,#d8c9d8_0%,#c9b2c7_24%,#c3b4b2_100%)] overflow-hidden border-r border-[#bca5af]/70">
        <div className="blob bg-[#efe1d9] h-36 w-36 -top-10 -right-8 opacity-40 animate-float-slow" />
        <div className="blob bg-[#dfe7d7] h-32 w-32 bottom-8 -left-10 opacity-35 animate-float" />
        <div className="relative h-16 flex items-center px-6">
          <Brand />
        </div>
        
        <div className="relative flex-1 overflow-y-auto p-4">
          <NavLinks />
        </div>
        
        <div className="relative p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-white/15 transition-colors text-left">
                <Avatar className="h-9 w-9 ring-2 ring-white/50">
                  <AvatarImage src={user?.avatar || ""} alt={user?.name || "User"} />
                  <AvatarFallback className="bg-white text-funky-purple font-bold">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-white/70 truncate">{user?.email || 'user@example.com'}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/profile')}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings')}>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-white/40 dark:border-slate-800 bg-white/70 dark:bg-slate-950/60 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 flex flex-col bg-funky animate-gradient border-0">
                <div className="h-16 flex items-center px-6">
                  <Brand />
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <NavLinks onClick={() => {}} />
                </div>
                <div className="p-4">
                  <Button variant="outline" className="w-full justify-start rounded-xl bg-white/15 border-white/30 text-white hover:bg-white/25 hover:text-white" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            
            <h1 className="font-display text-xl font-extrabold hidden sm:block capitalize text-gradient-fun">
              {pathname.split('/')[1] || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full text-funky-purple hover:bg-funky-purple/10">
              <Search className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full md:hidden">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-funky text-white font-bold">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => router.push('/profile')}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
