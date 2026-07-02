'use client'

import Image from 'next/image'
import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Image sequence player ─────────────────────────────────────────── */

const TOTAL_FRAMES = 104
const FPS = 30

function frameSrc(n) {
  const name = n < 100 ? String(n).padStart(5, '0') : String(n).padStart(6, '0')
  return `/image-sequences/${name}.webp`
}

function ImageSequencePlayer() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // Preload all frames
    const images = []
    let loaded = 0
    let rafId = null
    let frameIdx = 0
    let lastTime = 0
    const interval = 1000 / FPS

    function tick(now) {
      rafId = requestAnimationFrame(tick)
      if (now - lastTime < interval) return
      lastTime = now
      const img = images[frameIdx]
      if (img?.complete && img.naturalWidth) {
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        ctx.drawImage(img, 0, 0)
      }
      frameIdx = (frameIdx + 1) % TOTAL_FRAMES
    }

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new window.Image()
      img.src = frameSrc(i)
      img.onload = () => {
        loaded++
        if (loaded === TOTAL_FRAMES) rafId = requestAnimationFrame(tick)
      }
      images.push(img)
    }

    return () => { if (rafId) cancelAnimationFrame(rafId) }
  }, [])

  return (
    <canvas ref={canvasRef} className="absolute inset-0 size-full object-cover pointer-events-none" />
  )
}

/* ─── Data ─────────────────────────────────────────────────────────── */

// Exact dot positions from Figma (x, y) in a 120×80px container
const SPARKLINE_DOTS = [
  { x: 0, y: 56 }, { x: 8, y: 56 }, { x: 16, y: 48 }, { x: 24, y: 40 },
  { x: 32, y: 48 }, { x: 40, y: 48 }, { x: 48, y: 40 }, { x: 56, y: 32 },
  { x: 64, y: 24 }, { x: 72, y: 24 }, { x: 80, y: 32 }, { x: 88, y: 32 },
  { x: 96, y: 24 }, { x: 104, y: 16 }, { x: 112, y: 8 },
]

const BONDS = [
  { id: 'vhm1', ticker: 'VHM12605', maturity: '30th July 2026', amount: '7,000,000đ', yieldStr: 'Est. Yield 10.8%' },
  { id: 'vhm2', ticker: 'VHM12605', maturity: '30th Jun 2026',  amount: '5,000,000đ', yieldStr: 'Est. Yield 9.8%'  },
]

/* ─── Micro-components ──────────────────────────────────────────────── */

function Icon({ name, size = 24, className = '' }) {
  return (
    <span className={`material-symbols-outlined leading-none select-none ${className}`} style={{ fontSize: size }}>
      {name}
    </span>
  )
}

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-14 pt-3.5 pb-1 shrink-0">
      <span className="text-[15px] font-semibold text-content-primary">9:41</span>
      <div className="flex items-center gap-1">
        <Image src="/cellular.svg" alt="" width={16} height={16} />
        <Image src="/wifi.svg"     alt="" width={16} height={16} />
        <Image src="/battery.svg"  alt="" width={16} height={16} />
      </div>
    </div>
  )
}

function Sparkline() {
  return (
    <div className="relative w-[120px] h-[80px] shrink-0">
      {SPARKLINE_DOTS.map((dot, i) => (
        <div
          key={i}
          className="absolute size-2 rounded-xs bg-success border-[0.5px] border-solid border-[#f9fafb]"
          style={{ left: dot.x, top: dot.y }}
        />
      ))}
    </div>
  )
}

function FanCard({ ticker, yieldStr }) {
  return (
    <div className="bg-surface-raised border border-border-default rounded-2xl overflow-hidden">
      <div className="flex gap-2.5 items-start p-4">
        <div className="flex flex-col gap-1 w-10">
          <p className="text-md font-medium text-content-primary leading-6">{ticker}</p>
          <p className="text-[12px] text-content-primary leading-4">Equities</p>
        </div>
        <p className="text-[16px] font-medium text-success leading-6 whitespace-nowrap">{yieldStr}</p>
      </div>
    </div>
  )
}

function AssetDivider() {
  return (
    <div className="bg-white pl-20 pr-4 w-full">
      <div className="bg-surface-overlay h-px opacity-10 rounded-full w-full" />
    </div>
  )
}

/* ── Explore tab sub-components ─────────────────────────────────────── */

function YieldBadge({ value, up = true }) {
  return (
    <div className={`flex items-center gap-1 pl-1 pr-3 py-1 rounded-full shrink-0 ${up ? 'bg-[#dcfce7]' : 'bg-[#ffe2e2]'}`}>
      <span className="material-symbols-outlined leading-none select-none text-[20px]" style={{ transform: up ? 'rotate(180deg)' : 'none', color: up ? '#00a63e' : '#e7000b' }}>
        arrow_drop_down
      </span>
      <span className={`text-[14px] font-medium whitespace-nowrap ${up ? 'text-success' : 'text-danger'}`}>{value}</span>
    </div>
  )
}

function SectionHeader({ title }) {
  return (
    <div className="flex items-center justify-between w-full">
      <p className="text-[16px] font-semibold text-content-primary leading-6">{title}</p>
      <p className="text-[14px] font-medium text-info leading-5">See all</p>
    </div>
  )
}

function IndexCard({ name, time, date, value, change, positive }) {
  return (
    <div className="flex flex-col h-40 w-[156px] shrink-0 items-start justify-between overflow-hidden p-4 rounded-2xl bg-surface">
      <div className="flex flex-col gap-1 w-full">
        <p className="text-[14px] font-medium text-content-primary leading-5">{name}</p>
        <div className="flex gap-1 text-[12px] text-content-secondary leading-4">
          <span>{time}</span><span>·</span><span>{date}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[24px] font-semibold text-content-primary leading-8 whitespace-nowrap">{value}</p>
        <p className={`text-[14px] font-medium leading-5 ${positive ? 'text-success' : 'text-danger'}`}>{change}</p>
      </div>
    </div>
  )
}

const VIETNAM_INDICES = [
  { name: 'Hose',  time: '15:00:00', date: '01 Jul', value: '1,867.21', change: '+0.39%', positive: true  },
  { name: 'HNX',   time: '15:00:00', date: '01 Jul', value: '310.98',   change: '-0.39%', positive: false },
  { name: 'UPCOM', time: '15:00:00', date: '01 Jul', value: '129.57',   change: '+0.39%', positive: true  },
]

const COMMODITY_INDICES = [
  { name: 'Gold',   time: '15:00:00', date: '01 Jul', value: '3,342.10', change: '+0.52%', positive: true  },
  { name: 'Silver', time: '15:00:00', date: '01 Jul', value: '36.48',    change: '-0.21%', positive: false },
  { name: 'Oil',    time: '15:00:00', date: '01 Jul', value: '83.77',    change: '+0.39%', positive: true  },
]

const GLOBAL_INDICES = [
  { name: 'S&P 500', time: '16:00:00', date: '01 Jul', value: '5,460.48', change: '+0.54%', positive: true  },
  { name: 'Nikkei',  time: '15:30:00', date: '01 Jul', value: '39,681.32', change: '-0.32%', positive: false },
  { name: 'FTSE',    time: '16:30:00', date: '01 Jul', value: '8,164.12', change: '+0.18%', positive: true  },
]

const EXPLORE_FILTERS = [
  { id: 'equities',    label: 'Top equities'  },
  { id: 'bonds',       label: 'Top bonds'     },
  { id: 'fund',        label: 'Top fund'      },
  { id: 'vietnam',     label: 'Vietnam stock' },
  { id: 'commodities', label: 'Commodities'   },
  { id: 'global',      label: 'Global stock'  },
]

function ExploreContent() {
  const [activeFilter, setActiveFilter] = useState('equities')
  const scrollRef = useRef(null)
  const isProgrammaticScroll = useRef(false)
  const sectionRefs = {
    equities:    useRef(null),
    bonds:       useRef(null),
    fund:        useRef(null),
    vietnam:     useRef(null),
    commodities: useRef(null),
    global:      useRef(null),
  }

  // Scroll to section when chip clicked
  const handleChipClick = (id) => {
    setActiveFilter(id)
    const el = sectionRefs[id]?.current
    const container = scrollRef.current
    if (!el || !container) return
    isProgrammaticScroll.current = true
    const containerRect = container.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    container.scrollTo({ top: container.scrollTop + (elRect.top - containerRect.top), behavior: 'smooth' })
    // Re-enable spy after smooth scroll finishes (~500ms)
    setTimeout(() => { isProgrammaticScroll.current = false }, 600)
  }

  // Scroll spy: update active chip as sections hit the top
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const onScroll = () => {
      if (isProgrammaticScroll.current) return
      const containerTop = container.getBoundingClientRect().top
      let current = 'equities'
      for (const { id } of EXPLORE_FILTERS) {
        const el = sectionRefs[id]?.current
        if (!el) continue
        if (el.getBoundingClientRect().top - containerTop <= 8) current = id
      }
      setActiveFilter(current)
    }
    container.addEventListener('scroll', onScroll, { passive: true })
    return () => container.removeEventListener('scroll', onScroll)
  }, [])

  return (
    /* Outer: flex col so chips stay above scroll area */
    <div
      className="flex-1 min-h-0 flex flex-col rounded-tl-4xl rounded-tr-4xl border-t-[0.5px] border-l-[0.5px] border-r-[0.5px] border-border-default bg-surface"
      style={{ backdropFilter: 'blur(20px)' }}
    >
      {/* Filter chips — pinned above scroll */}
      <div className="flex gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden shrink-0 px-4 pt-4 pb-3">
        {EXPLORE_FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => handleChipClick(f.id)}
            className={`px-3 py-2 rounded-full text-[14px] font-medium whitespace-nowrap shrink-0 ${
              activeFilter === f.id
                ? 'bg-surface-overlay text-content-inverse'
                : 'bg-surface-sunken text-content-primary'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Scrollable content below chips */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden px-4 pb-32 space-y-3">

      {/* Top equities */}
      <div ref={sectionRefs.equities} />
      <SectionHeader title="Top equities" />
      <div className="bg-surface-raised rounded-3xl overflow-hidden">
        {/* TCB */}
        <div className="flex gap-4 items-center p-4">
          <div className="size-12 rounded-full bg-surface-sunken overflow-hidden shrink-0 relative">
            <Image src="/tcb-logo.png" alt="TCB" fill className="object-cover" />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex items-center justify-between text-md font-medium text-content-primary leading-6">
              <span>TCB</span><span className="tabular-nums font-mono">34.30</span>
            </div>
            <div className="flex items-center justify-between text-[14px] leading-5">
              <span className="text-content-primary truncate pr-2">Vietnam Technological And Commercial Joint Stock Bank</span>
              <span className="text-success shrink-0">+1.29%</span>
            </div>
          </div>
        </div>
        <AssetDivider />
        {/* VIC */}
        <div className="flex gap-4 items-center p-4">
          <div className="size-12 rounded-full bg-surface-sunken overflow-hidden shrink-0 relative">
            <Image src="/vic-logo.png" alt="VIC" fill className="object-cover" />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex items-center justify-between text-md font-medium text-content-primary leading-6">
              <span>VIC</span><span className="tabular-nums font-mono">217.10</span>
            </div>
            <div className="flex items-center justify-between text-[14px] leading-5">
              <span className="text-content-primary truncate pr-2">VinGroup Joint Stock Company</span>
              <span className="text-success shrink-0">+0.98%</span>
            </div>
          </div>
        </div>
        <AssetDivider />
        {/* MSN */}
        <div className="flex gap-4 items-center p-4">
          <div className="size-12 rounded-full bg-surface-overlay overflow-hidden shrink-0 relative">
            <Image src="/msn-logo.png" alt="MSN" fill className="object-cover" />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex items-center justify-between text-md font-medium text-content-primary leading-6">
              <span>MSN</span><span className="tabular-nums font-mono">72.80</span>
            </div>
            <div className="flex items-center justify-between text-[14px] leading-5">
              <span className="text-content-primary truncate pr-2">Masan Group Corporation</span>
              <span className="text-success shrink-0">+0.41%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top bonds */}
      <div ref={sectionRefs.bonds} />
      <SectionHeader title="Top bonds" />
      <div className="bg-surface-raised rounded-3xl overflow-hidden">
        {[
          { ticker: 'VHM12605', name: 'VINHOMES (Công ty Cổ Phần Vinhomes)', yield: '11.18%' },
          { ticker: 'VHM12502', name: 'VINHOMES (Công ty Cổ Phần Vinhomes)', yield: '10.69%' },
          { ticker: 'TRM12503', name: 'CT ĐT & PT BĐS TRƯỜNG MINH',          yield: '10.49%' },
        ].map((bond, i, arr) => (
          <div key={bond.ticker}>
            <div className="flex gap-4 items-center p-4">
              <div className="size-12 rounded-full bg-surface-sunken flex items-center justify-center shrink-0">
                <Icon name="analytics" size={24} className="text-content-secondary" />
              </div>
              <div className="flex items-center flex-1 min-w-0 gap-1">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <p className="text-md font-medium text-content-primary leading-6 truncate">{bond.ticker}</p>
                  <p className="text-[14px] text-content-primary leading-5 truncate">{bond.name}</p>
                </div>
                <YieldBadge value={bond.yield} up={true} />
              </div>
            </div>
            {i < arr.length - 1 && <AssetDivider />}
          </div>
        ))}
      </div>

      {/* Top fund */}
      <div ref={sectionRefs.fund} />
      <SectionHeader title="Top fund" />
      <div className="bg-surface-raised rounded-3xl overflow-hidden">
        {[
          { ticker: 'TCEF',  name: 'Techcom Equity Fund',               logo: '/tcb-logo.png', yield: '11.18%' },
          { ticker: 'TCRES', name: 'Techcom Real Estate Equity Fund',    logo: '/tcb-logo.png', yield: '10.49%' },
          { ticker: 'DCDS',  name: 'DC Dynamic Securities',              logo: '/dcds-logo.png', yield: '11.18%' },
        ].map((fund, i, arr) => (
          <div key={fund.ticker}>
            <div className="flex gap-4 items-center p-4">
              <div className="size-12 rounded-full bg-surface-sunken overflow-hidden shrink-0 relative">
                <Image src={fund.logo} alt={fund.ticker} fill className="object-cover" />
              </div>
              <div className="flex items-center flex-1 min-w-0 gap-1">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <p className="text-md font-medium text-content-primary leading-6">{fund.ticker}</p>
                  <p className="text-[14px] text-content-primary leading-5 truncate">{fund.name}</p>
                </div>
                <YieldBadge value={fund.yield} up={true} />
              </div>
            </div>
            {i < arr.length - 1 && <AssetDivider />}
          </div>
        ))}
      </div>

      {/* Vietnam stock indices */}
      <div ref={sectionRefs.vietnam} />
      <SectionHeader title="Vietnam stock indices" />
      <div className="bg-surface-raised rounded-3xl p-4 flex gap-3">
        {VIETNAM_INDICES.map(idx => <IndexCard key={idx.name} {...idx} />)}
      </div>

      {/* Commodities */}
      <div ref={sectionRefs.commodities} />
      <SectionHeader title="Commodities" />
      <div className="bg-surface-raised rounded-3xl p-4 flex gap-3">
        {COMMODITY_INDICES.map(idx => <IndexCard key={idx.name} {...idx} />)}
      </div>

      {/* Global stock indices */}
      <div ref={sectionRefs.global} />
      <SectionHeader title="Global stock indices" />
      <div className="bg-surface-raised rounded-3xl p-4 flex gap-3">
        {GLOBAL_INDICES.map(idx => <IndexCard key={idx.name} {...idx} />)}
      </div>
      </div>
    </div>
  )
}

function BottomNav({ onNavigate }) {
  const [active, setActive] = useState('investment')

  const tabs = [
    { id: 'home',       label: 'Home'      },
    { id: 'cards',      label: 'Cards'     },
    { id: 'rewards',    label: 'Rewards'   },
    { id: 'investment', label: 'My wealth' },
  ]

  const handleTabChange = (tabId) => {
    setActive(tabId)
    if (tabId !== 'investment') onNavigate?.(tabId)
  }

  const icons = {
    home:       <Image src="/logo.svg"  alt="" width={24} height={24} />,
    cards:      <Icon name="credit_card" size={24} className={active === 'cards' ? 'text-content-inverse' : 'text-content-secondary'} />,
    rewards:    <Icon name="redeem"      size={24} className={active === 'rewards' ? 'text-content-inverse' : 'text-content-secondary'} />,
    investment: <Icon name="money_bag"   size={24} className="text-content-inverse" />,
  }

  const navBarRef = useRef(null)
  const tabRefs   = useRef({})
  const [pill, setPill] = useState(null)

  useLayoutEffect(() => {
    const el  = tabRefs.current[active]
    const bar = navBarRef.current
    if (!el || !bar) return
    setPill({ left: el.offsetLeft, width: el.offsetWidth })
  }, [active])

  return (
    <div
      className="px-4 py-2 pb-8 shrink-0"
      style={{ background: 'linear-gradient(to bottom, rgba(249,250,251,0), #f9fafb)' }}
    >
      <div className="flex items-center gap-2">
        <div ref={navBarRef} className="relative flex-1 flex items-center gap-1 p-1 bg-surface-raised border border-border-default rounded-full shadow-xl">
          {pill && (
            <div
              className="absolute top-1 bottom-1 bg-surface-overlay rounded-full"
              style={{
                left: pill.left,
                width: pill.width,
                transition: 'left 0.28s cubic-bezier(0.34,1.56,0.64,1), width 0.28s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            />
          )}
          {tabs.map(tab => {
            const isActive = active === tab.id
            return (
              <button
                key={tab.id}
                ref={el => { tabRefs.current[tab.id] = el }}
                onClick={() => handleTabChange(tab.id)}
                className={`relative flex items-center justify-center gap-1 px-4 py-3 rounded-full ${isActive ? 'flex-1' : ''}`}
              >
                <span className="relative z-10 flex items-center gap-1 overflow-hidden">
                  <span className="shrink-0">{icons[tab.id]}</span>
                  <span
                    className="t-label text-content-inverse whitespace-nowrap"
                    style={{ opacity: isActive ? 1 : 0, maxWidth: isActive ? '999px' : 0, overflow: 'hidden', transition: 'opacity 0.15s' }}
                  >
                    {tab.label}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
        <button className="size-14 rounded-full bg-surface-raised border border-border-strong flex items-center justify-center shrink-0 shadow-xl">
          <Image src="/tri.png" alt="TRÍ" width={24} height={24} />
        </button>
      </div>
    </div>
  )
}

/* ─── Page ──────────────────────────────────────────────────────────── */

function AnalyzeOverlay({ onClose, showCard = true }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 flex flex-col justify-end px-4 pb-10 pt-4"
      style={{
        backdropFilter: 'blur(2px)',
        backgroundColor: 'rgba(0,0,0,0.6)',
        pointerEvents: showCard ? 'auto' : 'none',
        zIndex: showCard ? 60 : 55,
      }}
      onClick={showCard ? onClose : undefined}
    >
      {showCard && (
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        className="bg-surface rounded-4xl p-4 flex flex-col gap-4 w-full"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <p className="text-[24px] font-semibold text-content-primary leading-8">Analyze</p>
          <button
            onClick={onClose}
            className="bg-surface-sunken size-12 rounded-full flex items-center justify-center shrink-0"
          >
            <Icon name="close" size={24} className="text-content-primary" />
          </button>
        </div>

        {/* Health score */}
        <div className="bg-[#f0fdf4] rounded-3xl p-4 flex flex-col gap-1">
          <p className="text-[16px] font-medium text-content-primary leading-6">Health score</p>
          <p className="text-[32px] font-bold text-success leading-10">32/100</p>
          <p className="text-[14px] text-content-secondary leading-5">Your 4.8% closer to your goal of buying a home. Keep going.</p>
        </div>

        {/* Trading analytics */}
        <div className="bg-surface-raised rounded-3xl overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <p className="text-[14px] font-medium text-content-primary leading-5">Trading analytics</p>
          </div>
          {/* TCB */}
          <div className="flex gap-4 items-start p-4">
            <div className="size-12 rounded-full bg-surface-sunken overflow-hidden shrink-0 relative">
              <Image src="/tcb-logo.png" alt="TCB" fill className="object-cover" />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <p className="text-[16px] font-medium text-content-primary leading-6">
                <span className="text-success">+8,000,000đ</span>{' in realized PnL'}
              </p>
              <p className="text-[14px] text-content-muted leading-5">You started buying on 12 Apr 2024, Average buy price is 28,250đ. You bought 5 times, sold 2 times in total</p>
            </div>
          </div>
          <AssetDivider />
          {/* VIC */}
          <div className="flex gap-4 items-start p-4">
            <div className="size-12 rounded-full bg-surface-sunken overflow-hidden shrink-0 relative">
              <Image src="/vic-logo.png" alt="VIC" fill className="object-cover" />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <p className="text-[16px] font-medium text-content-primary leading-6">
                <span className="text-danger">-2,000,000đ</span>{' in realized PnL'}
              </p>
              <p className="text-[14px] text-content-muted leading-5">You started buying on 12 Apr 2024, Average buy price is 220,000đ. You bought 4 times, sold 1 times in total</p>
            </div>
          </div>
        </div>

        {/* People like you often buy */}
        <div className="bg-surface-raised border border-border-strong rounded-3xl overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <p className="text-[14px] font-medium text-content-primary leading-5">People like you often buy</p>
          </div>
          <div className="flex gap-4 items-center p-4">
            <div className="size-12 rounded-full bg-surface-overlay overflow-hidden shrink-0 relative">
              <Image src="/msn-logo.png" alt="MSN" fill className="object-cover" />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <div className="flex items-center justify-between text-[16px] font-medium text-content-primary leading-6">
                <span>MSN</span><span className="tabular-nums font-mono">72.80</span>
              </div>
              <div className="flex items-center justify-between text-[14px] leading-5">
                <span className="text-content-primary truncate pr-2">Masan Group Corporation</span>
                <span className="text-success shrink-0">+0.41%</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col gap-2 shrink-0">
          <button className="w-full bg-surface-raised border border-[#1e2939] rounded-full px-4 py-3">
            <span className="text-[14px] font-medium text-content-primary">Create a new plan</span>
          </button>
          <button className="w-full bg-surface-overlay rounded-full px-4 py-3 flex items-center justify-center gap-1">
            <div className="size-5 relative overflow-hidden shrink-0">
              <Image src="/tri.png" alt="" fill className="object-contain" />
            </div>
            <span className="text-[14px] font-medium text-content-inverse">Ask TRÍ</span>
          </button>
        </div>
      </motion.div>
      )}
    </motion.div>
  )
}

const WEALTH_TABS = [{ id: 'wealth', label: 'My wealth' }, { id: 'explore', label: 'Explore' }]

const FAB_ACTIONS = [
  { label: 'Equities', icon: 'candlestick_chart' },
  { label: 'Bonds',    icon: 'analytics' },
  { label: 'Fund',     icon: 'credit_card' },
  { label: 'Top up',   icon: 'add_box' },
]

export default function WealthScreen({ onNavigate, embedded = false, onOpenSearch, defaultTab = 'wealth', portfolioHovered = false, advisorHovered = false, analyzeOpen = false, onAnalyzeClose, onAnalyzeOpen } = {}) {
  const [hidden, setHidden] = useState(false)
  const [navTab, setNavTab] = useState(defaultTab) // 'wealth' | 'explore'
  const [showAnalyze, setShowAnalyze] = useState(false)
  const [assetFilter, setAssetFilter] = useState('all') // 'all' | 'accounts' | 'watchlist'
  const [fabOpen, setFabOpen] = useState(false)

  const tabsRowRef  = useRef(null)
  const tabBtnRefs  = useRef({})
  const [indicatorX, setIndicatorX] = useState(null)

  useLayoutEffect(() => {
    const el  = tabBtnRefs.current[navTab]
    const row = tabsRowRef.current
    if (!el || !row) return
    setIndicatorX(el.offsetLeft + (el.offsetWidth - 20) / 2)
  }, [navTab])

  return (
    <div className={`overflow-hidden relative flex flex-col ${
      embedded ? 'w-full h-full' : 'w-[440px] h-[956px] rounded-[56px]'
    }`}>

      {/* Background: surface-raised base + animated image sequence (top-right) + pattern overlay */}
      <div className="absolute inset-0 bg-surface-raised">
        <div className="absolute top-[24px] right-[-124px] w-[310px] h-[175px]">
          <ImageSequencePlayer />
        </div>
        <img src="/pattern.png" alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      </div>

      {/* Status bar — standalone only */}
      {embedded ? (
        <div className="relative z-20 h-9.5 shrink-0" />
      ) : (
        <div className="relative z-20 shrink-0">
          <StatusBar />
        </div>
      )}

      {/* ── Shared nav header — always mounted so indicator never jumps ── */}
      <div className="relative z-10 shrink-0 flex items-center justify-between px-4 pt-4 pb-2">
        <div ref={tabsRowRef} className="relative flex items-center gap-4">
          {WEALTH_TABS.map(tab => (
            <button
              key={tab.id}
              ref={el => { tabBtnRefs.current[tab.id] = el }}
              onClick={() => setNavTab(tab.id)}
              className="flex flex-col gap-1 items-center pb-1"
            >
              <span className={`text-[24px] font-semibold leading-8 ${navTab === tab.id ? 'text-content-primary' : 'text-content-muted'}`}>
                {tab.label}
              </span>
            </button>
          ))}
          {/* Single sliding indicator — offsetLeft is unaffected by ancestor scale */}
          {indicatorX !== null && (
            <motion.div
              className="absolute bottom-0 h-1 w-5 rounded-full bg-content-primary"
              initial={false}
              animate={{ x: indicatorX }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-surface-sunken size-12 rounded-full flex items-center justify-center shrink-0" onClick={() => onOpenSearch?.()}><Icon name="search" size={24} className="text-content-primary" /></button>
        </div>
      </div>

      {/* ── My wealth tab: content scrolls ── */}
      {navTab === 'wealth' && (
        <div
          className="relative flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden"
          style={{
            zIndex: (portfolioHovered || advisorHovered || analyzeOpen) ? 'auto' : 10,
            backdropFilter: (portfolioHovered || advisorHovered || analyzeOpen) ? 'none' : 'blur(6px)',
            background: 'linear-gradient(to bottom, rgba(249,250,251,0), rgba(249,250,251,0.5))',
          }}
        >
          {/* Balance Info card — elevated above backdrop when portfolio is hovered */}
          <div className="bg-surface border-l border-r border-t border-border-default rounded-tl-3xl rounded-tr-3xl pt-4 px-4 pb-0 flex flex-col gap-4 w-full shrink-0">
            {/* Balance row */}
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-medium text-content-muted">Total Investment</span>
                  <button onClick={() => setHidden(v => !v)} className="flex items-center">
                    <Icon name={hidden ? 'visibility_off' : 'visibility'} size={20} className="text-content-primary" />
                  </button>
                </div>
                <p className="text-[24px] font-semibold text-content-primary leading-8 tabular-nums font-mono">
                  {hidden ? '••••••••••' : '24,008,897đ'}
                </p>
                <div className="flex items-center gap-1 text-[14px] font-medium">
                  <span className="text-success tabular-nums font-mono">+2,993,009đ (9,78%)</span>
                  <span className="text-content-muted">Today</span>
                </div>
              </div>
              <Sparkline />
            </div>

            {/* Analyze my portfolio — AI prompt button */}
            <button
              className={`bg-surface-sunken border border-border-strong rounded-full px-3 py-2 flex gap-2 items-center shrink-0 self-start transition-all duration-200${portfolioHovered ? ' relative z-[70] bg-surface shadow-md scale-[1.03]' : ''}`}
              onClick={() => { setShowAnalyze(true); onAnalyzeOpen?.() }}
            >
              <div className="size-5 relative overflow-hidden shrink-0">
                <Image src="/tri.png" alt="" fill className="object-contain" />
              </div>
              <span className="text-[12px] text-content-primary leading-4 whitespace-nowrap">Analyze my portfolio</span>
              <Icon name="arrow_right_alt" size={20} className="text-content-primary shrink-0" />
            </button>

            {/* For You Container — pb-20 reserves space for fan cards to peek into */}
            <div className={`bg-black border-2 border-black rounded-3xl overflow-hidden pb-20 pt-4 px-4 relative flex flex-col gap-4${advisorHovered ? ' z-70' : ''}`}>
              <div className="flex flex-col gap-1 items-center w-full">
                <div className="size-6 relative overflow-hidden shrink-0">
                  <Image src="/tri.png" alt="" fill className="object-contain" />
                </div>
                <p className="text-[16px] font-medium text-content-inverse text-center leading-6 w-full">Picked for you today</p>
                <p className="text-[12px] text-content-muted text-center leading-4 w-full">Matched to your goal of buying a home 🏡</p>
              </div>
              {/* Fan card 1 — VCB, left, -14.41deg */}
              <div className="absolute flex items-center justify-center" style={{ bottom: -56.64, left: 37, width: 198, height: 119.637 }}>
                <div style={{ transform: 'rotate(-14.41deg)' }}>
                  <FanCard ticker="VCB" yieldStr="Est. Yield 9.8%" />
                </div>
              </div>
              {/* Fan card 2 — TCB, right-ish, -11.36deg */}
              <div className="absolute flex items-center justify-center" style={{ bottom: -53.96, left: 175, width: 196.347, height: 110.958 }}>
                <div style={{ transform: 'rotate(-11.36deg)' }}>
                  <FanCard ticker="TCB" yieldStr="Est. Yield 6.8%" />
                </div>
              </div>
              {/* Fan card 3 — TCB, center-right, +13.65deg */}
              <div className="absolute -translate-x-1/2 flex items-center justify-center" style={{ bottom: -48.56, left: 'calc(50% + 10.92px)', width: 197.711, height: 117.517 }}>
                <div style={{ transform: 'rotate(13.65deg)' }}>
                  <FanCard ticker="TCB" yieldStr="Est. Yield 9.8%" />
                </div>
              </div>
            </div>
          </div>

          {/* My Assets section — same bg-surface, flows directly from balance card */}
          <div className="flex flex-col gap-3 pt-4 pb-32 px-4 bg-surface" style={{ backdropFilter: 'blur(20px)' }}>
            {/* Filter chips */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setAssetFilter('all')}
                className={`flex items-center rounded-full pl-3 pr-1 py-1 gap-2 shrink-0 ${assetFilter === 'all' ? 'bg-surface-overlay' : 'bg-surface-sunken'}`}
              >
                <span className={`text-[14px] font-medium whitespace-nowrap ${assetFilter === 'all' ? 'text-content-inverse' : 'text-content-primary'}`}>My Assets</span>
                <div className={`flex items-center gap-1 border rounded-full pl-2.5 pr-1 py-1 ${assetFilter === 'all' ? 'border-[#4a5565]' : 'border-border-default'}`}>
                  <span className={`text-[14px] font-medium ${assetFilter === 'all' ? 'text-content-inverse' : 'text-content-primary'}`}>All</span>
                  <Icon name="arrow_drop_down" size={20} className={assetFilter === 'all' ? 'text-content-inverse' : 'text-content-primary'} />
                </div>
              </button>
              <button
                onClick={() => setAssetFilter('accounts')}
                className={`px-3 py-2 rounded-full shrink-0 ${assetFilter === 'accounts' ? 'bg-surface-overlay' : 'bg-surface-sunken'}`}
              >
                <span className={`text-[14px] font-medium whitespace-nowrap ${assetFilter === 'accounts' ? 'text-content-inverse' : 'text-content-primary'}`}>Accounts</span>
              </button>
              <button
                onClick={() => setAssetFilter('watchlist')}
                className={`px-3 py-2 rounded-full shrink-0 ${assetFilter === 'watchlist' ? 'bg-surface-overlay' : 'bg-surface-sunken'}`}
              >
                <span className={`text-[14px] font-medium whitespace-nowrap ${assetFilter === 'watchlist' ? 'text-content-inverse' : 'text-content-primary'}`}>Watch list</span>
              </button>
            </div>

            {/* All view — detailed holdings */}
            {assetFilter === 'all' && (
              <div className="bg-surface-raised rounded-3xl overflow-hidden">
                <div className="px-4 pt-4 pb-2">
                  <p className="text-[14px] font-medium text-content-muted">Equities</p>
                </div>
                <div className="flex gap-4 items-center p-4">
                  <div className="size-12 rounded-full bg-surface-sunken overflow-hidden shrink-0 relative">
                    <Image src="/tcb-logo.png" alt="TCB" fill className="object-cover" />
                  </div>
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between text-md font-medium text-content-primary leading-6">
                      <span>TCB</span><span className="tabular-nums font-mono">12,008,897đ</span>
                    </div>
                    <div className="flex items-center justify-between text-[14px] leading-5">
                      <span className="text-content-primary">Qty: 400</span>
                      <span className="text-success tabular-nums font-mono">+149,000đ (+1.29%)</span>
                    </div>
                  </div>
                </div>
                <AssetDivider />
                <div className="px-4 pt-4 pb-2">
                  <p className="text-[14px] font-medium text-content-muted">Bonds</p>
                </div>
                {BONDS.map((bond, i) => (
                  <div key={bond.id}>
                    <div className="flex gap-4 items-center p-4">
                      <div className="size-12 rounded-full bg-surface-sunken flex items-center justify-center shrink-0">
                        <Icon name="analytics" size={24} className="text-content-secondary" />
                      </div>
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <div className="flex items-center justify-between text-md font-medium text-content-primary leading-6">
                          <span>{bond.ticker}</span><span className="tabular-nums font-mono">{bond.amount}</span>
                        </div>
                        <div className="flex items-center justify-between text-[14px] leading-5">
                          <span className="text-content-primary">Maturity: {bond.maturity}</span>
                          <span className="text-success">{bond.yieldStr}</span>
                        </div>
                      </div>
                    </div>
                    {i < BONDS.length - 1 && <AssetDivider />}
                  </div>
                ))}
              </div>
            )}

            {/* Accounts view */}
            {assetFilter === 'accounts' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="bg-surface-raised rounded-3xl overflow-hidden"
              >
                {[
                  { label: 'Equities',  sub: 'Holding 1', amount: '12,008,897đ', icon: 'candlestick_chart', iconBg: 'bg-orange-200' },
                  { label: 'Bonds',     sub: 'Holding 2', amount: '12,000,000đ', icon: 'analytics',         iconBg: 'bg-green-200'  },
                  { label: 'Fund',      sub: 'Holding 0', amount: '0đ',           icon: 'credit_card',       iconBg: 'bg-cyan-200'   },
                ].map((item, i, arr) => (
                  <div key={item.label}>
                    <div className="flex gap-4 items-center p-4">
                      <div className={`size-12 rounded-full flex items-center justify-center shrink-0 ${item.iconBg}`}>
                        <Icon name={item.icon} size={24} className="text-content-primary" />
                      </div>
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <div className="flex items-center justify-between text-md font-medium text-content-primary leading-6">
                          <span>{item.label}</span>
                          <span className="tabular-nums font-mono">{item.amount}</span>
                        </div>
                        <span className="text-[14px] text-content-primary">{item.sub}</span>
                      </div>
                    </div>
                    {i < arr.length - 1 && <AssetDivider />}
                  </div>
                ))}
              </motion.div>
            )}

            {/* Watch list — empty state */}
            {assetFilter === 'watchlist' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="bg-surface-raised rounded-3xl p-8 flex flex-col items-center gap-3"
              >
                <Icon name="bookmark" size={32} className="text-content-muted" />
                <p className="text-[14px] text-content-muted text-center">Your watch list is empty</p>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* ── Explore tab: white card scrolls inside ── */}
      {navTab === 'explore' && (
        <div className="relative z-10 flex-1 overflow-hidden flex flex-col">
          <ExploreContent />
        </div>
      )}

      {/* Bottom nav — standalone only */}
      {!embedded && (
        <div className="relative z-20 shrink-0 bg-surface">
          <BottomNav onNavigate={onNavigate} />
        </div>
      )}

      {/* FAB — always visible, rotates add → close */}
      {!embedded && (
        <button
          onClick={() => setFabOpen(v => !v)}
          className="absolute bg-surface-overlay flex items-center justify-center p-4 rounded-full shadow-2xl"
          style={{ right: 20, bottom: 100, zIndex: 50 }}
        >
          <motion.span
            animate={{ rotate: fabOpen ? 45 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="material-symbols-outlined leading-none select-none text-content-inverse"
            style={{ fontSize: 28, display: 'block' }}
          >
            add
          </motion.span>
        </button>
      )}

      {/* Analyze overlay — backdrop on hover, full sheet on click */}
      <AnimatePresence>
        {(portfolioHovered || advisorHovered || showAnalyze || analyzeOpen) && (
          <AnalyzeOverlay
            showCard={showAnalyze || analyzeOpen}
            onClose={() => { setShowAnalyze(false); onAnalyzeClose?.() }}
          />
        )}
      </AnimatePresence>

      {/* FAB overlay — backdrop + action list */}
      <AnimatePresence>
        {fabOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 rounded-[56px] overflow-hidden"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)', zIndex: 45 }}
          >
            {/* Action buttons — positioned above FAB, spring up from it */}
            <div
              className="absolute flex flex-col gap-3 items-end"
              style={{ right: 20, bottom: 168 }}
            >
              {FAB_ACTIONS.map((action, i) => {
                const reverseI = FAB_ACTIONS.length - 1 - i
                const startY = (reverseI + 1) * 68
                return (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, y: startY }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: startY }}
                    transition={{ type: 'spring', stiffness: 340, damping: 28, delay: reverseI * 0.04 }}
                    className="flex gap-4 items-center justify-end"
                  >
                    <span className="text-md font-medium text-content-inverse whitespace-nowrap">{action.label}</span>
                    <button className="bg-surface-sunken p-4 rounded-full shadow-xl shrink-0 flex items-center justify-center">
                      <Icon name={action.icon} size={24} className="text-content-primary" />
                    </button>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
