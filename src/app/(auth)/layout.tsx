import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#e7dfe3] text-slate-900 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob bg-[#d9bfd0] h-72 w-72 -top-16 -left-10 animate-float-slow" />
        <div className="blob bg-[#f0d6a8] h-80 w-80 bottom-8 left-1/3 animate-float" />
        <div className="blob bg-[#d7dfe8] h-64 w-64 right-12 top-16 opacity-50 animate-drift" />
      </div>

      <div className="relative mx-auto flex max-w-[1360px] items-center gap-8 px-4 py-6 xl:gap-16 xl:px-8">
        <div className="relative hidden lg:flex w-[54%] flex-col justify-between">
          <div className="mb-8 flex items-center gap-3 w-fit pl-2">
            <div className="h-12 w-12 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-funky auth-glyph">
              <span className="font-display font-extrabold text-2xl text-[#4d3f59]">W</span>
            </div>
            <span className="font-display font-extrabold text-[2.1rem] tracking-tight text-[#f9f3f1]">WriteSpace</span>
          </div>

          <div className="relative flex items-center justify-center py-4">
            <div className="auth-hero-card relative w-full max-w-[560px] rounded-[2rem] p-3 shadow-[0_28px_80px_-30px_rgba(85,48,75,0.52)] animate-pop-in overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_28%),radial-gradient(circle_at_75%_15%,rgba(255,214,120,0.2),transparent_25%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_55%)]" />

              <div className="absolute left-8 top-6 h-4 w-4 rounded-full bg-[#ffd46b] animate-sparkle" />
              <div className="absolute right-10 top-10 h-4 w-4 rounded-full bg-[#ff6f61] animate-sparkle" style={{ animationDelay: '0.6s' }} />
              <div className="absolute left-12 bottom-10 h-4 w-4 rounded-full bg-[#52d4d0] animate-sparkle" style={{ animationDelay: '1.1s' }} />

              <div className="relative h-[430px] w-full overflow-hidden rounded-[1.6rem]">
                <div className="absolute left-7 top-8 h-20 w-20 rounded-[26px] bg-[#f7d5a5]/80 rotate-[-18deg] shadow-lg" />
                <div className="absolute left-[18%] top-[26%] h-24 w-24 rounded-full bg-[#ffcf6d] shadow-[0_14px_30px_rgba(255,201,113,0.5)] animate-float" />
                <div className="absolute right-[18%] top-[24%] h-14 w-14 rounded-full bg-[#f8f0ef]/90 shadow-[0_12px_24px_rgba(96,72,74,0.18)] animate-wiggle" />

                <div className="absolute left-[12%] top-[18%] -rotate-12 rounded-[24px] bg-[#fff5f1]/95 px-5 py-3 text-[#5d3f64] shadow-[0_20px_35px_rgba(66,34,74,0.15)]">
                  <span className="font-display text-3xl font-black tracking-tight">Write</span>
                </div>
                <div className="absolute right-[12%] top-[32%] rotate-[12deg] rounded-[24px] bg-[#f7d7a7] px-5 py-3 text-[#4d3c58] shadow-[0_18px_30px_rgba(66,34,74,0.18)]">
                  <span className="font-display text-2xl font-black">Ideas</span>
                </div>

                <div className="absolute left-1/2 top-1/2 h-44 w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-[#e9d3d2] bg-[linear-gradient(150deg,#fdf7f3_0%,#f4e9e6_30%,#efe3ea_100%)] p-5 shadow-[0_30px_50px_rgba(52,33,60,0.18)]">
                  <div className="flex h-full items-center justify-center rounded-[20px] border border-[#d8c6c7] bg-[linear-gradient(180deg,#f9f4f3,#f0eaf1)]">
                    <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#f4c3a9] text-4xl shadow-[inset_0_8px_14px_rgba(255,255,255,0.5)]">✦</div>
                  </div>
                </div>

                <div className="absolute bottom-10 left-8 h-20 w-20 rounded-full bg-[#4bb5b2] shadow-[0_16px_30px_rgba(75,181,178,0.3)]" />
                <div className="absolute bottom-8 right-10 h-14 w-14 rounded-full bg-[#d9c8df] shadow-[0_16px_28px_rgba(73,52,79,0.15)]" />
                <div className="absolute bottom-20 left-1/2 h-24 w-24 -translate-x-1/2 rounded-[28px] bg-[#f2d8e9] shadow-[0_20px_30px_rgba(91,61,88,0.2)]" />
              </div>
            </div>
          </div>

          <div className="mt-4 max-w-xl pl-2">
            <h2 className="font-display font-extrabold text-5xl leading-none tracking-tight text-[#f7f1eb] drop-shadow-[0_10px_18px_rgba(84,52,88,0.18)]">
              Where your words throw a party
            </h2>
            <p className="mt-4 text-lg text-[#f4e6e8]/90 max-w-md">
              Write boldly, publish happily. Your cozy little corner of the internet awaits.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex w-full flex-1 items-center justify-center px-2 py-4 sm:px-6 lg:w-[46%] lg:justify-end">
          <div className="w-full max-w-[520px] animate-pop-in">
            <div className="mb-6 text-center lg:hidden">
              <div className="inline-flex items-center gap-2 mb-2">
                <div className="h-11 w-11 rounded-2xl bg-[#4e3d5f] flex items-center justify-center shadow-funky">
                  <span className="text-white font-display font-extrabold text-xl">W</span>
                </div>
                <h1 className="font-display text-[2rem] font-extrabold text-[#4a3d52]">WriteSpace</h1>
              </div>
              <p className="text-[#705b68] text-sm">Your cozy creative blog studio</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
