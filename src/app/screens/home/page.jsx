'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, LayoutGroup, animate } from 'framer-motion'
import dynamic from 'next/dynamic'

const WealthScreen = dynamic(() => import('@/app/screens/wealth/page'), { ssr: false })

/* ─── Data ─────────────────────────────────────────────────────────── */

const TRANSACTIONS = [
  { id: 1, name: 'Shopee Pay',   type: 'Card Payment', time: '07:45', amount: '-50,000đ',     dir: 'out' },
  { id: 2, name: 'Hoang Thu Ha', type: 'Income',       time: '07:00', amount: '+20,000,000đ', dir: 'in'  },
  { id: 3, name: 'HKD Mai Khoi', type: 'Transfer',     time: '09:00', amount: '-50,000đ',     dir: 'out' },
  { id: 4, name: 'Starbucks',    type: 'Card Payment', time: '08:30', amount: '-50,000đ',     dir: 'out' },
]

/* ─── Micro-components ─────────────────────────────────────────────── */

function BlinkingCursor() {
  const [on, setOn] = useState(true)
  useEffect(() => {
    const id = setInterval(() => setOn(v => !v), 530)
    return () => clearInterval(id)
  }, [])
  return <div className="w-1 h-5 bg-info rounded-full shrink-0" style={{ opacity: on ? 1 : 0 }} />
}

function Icon({ name, size = 24, className = '' }) {
  return (
    <span
      className={`material-symbols-outlined leading-none select-none ${className}`}
      style={{ fontSize: size }}
    >
      {name}
    </span>
  )
}

/* Inline TCB logo — uses currentColor so it can recolor with text classes (unlike /logo.svg's baked-in fill) */
function TcbLogoIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M15.2008 5.40002L12.0023 8.59617V8.60542L15.2008 11.8016L12.0023 14.9977V15.0046L15.2008 18.2008L21.6 11.8016L15.2008 5.40002Z" fill="currentColor" />
      <path d="M8.80156 5.40002L11.9954 8.59617V8.60542L8.80156 11.8016L11.9954 14.9977V15.0046L8.80156 18.2008L2.40002 11.8016L8.80156 5.40002Z" fill="currentColor" />
    </svg>
  )
}

function StatusBar({ dark = false }) {
  const imgStyle = dark ? { filter: 'invert(1)' } : {}
  return (
    <div className="flex items-center justify-between px-14 pt-6 pb-1 shrink-0">
      <span className={`text-[15px] font-semibold ${dark ? 'text-content-primary' : 'text-white'}`}>9:41</span>
      <div className="flex items-center gap-1">
        <Image src="/cellular.svg" alt="" width={16} height={16} style={imgStyle} />
        <Image src="/wifi.svg"     alt="" width={16} height={16} style={imgStyle} />
        <Image src="/battery.svg"  alt="" width={16} height={16} style={imgStyle} />
      </div>
    </div>
  )
}

/* ─── Home sub-components ───────────────────────────────────────────── */

function TopNav({ onOpenSearch, light = false }) {
  const btnCls = light
    ? 'bg-white border border-[#e5e5e5] rounded-full px-6 py-3 flex items-center justify-center'
    : 'bg-[#0a0a0a] border border-[#262626] rounded-full px-6 py-3 flex items-center justify-center'
  const iconCls = light ? 'text-[#0a0a0a]' : 'text-[#d4d4d4]'
  return (
    <div className="flex items-center justify-between pl-6 pr-3 pb-3 pt-16 shrink-0">
      <div className="h-8 relative shrink-0" style={{ width: 48 }}>
        <Image src={light ? '/logo.svg' : '/logo-new.svg'} alt="TCB" fill className="object-contain object-left" />
      </div>
      <div className="flex items-center gap-1">
        <button className={btnCls}>
          <Icon name="notifications" size={24} className={iconCls} />
        </button>
        <button onClick={onOpenSearch} className={btnCls}>
          <Icon name="search" size={24} className={iconCls} />
        </button>
      </div>
    </div>
  )
}

function BalanceSection({ onOpenOverlay, light = false }) {
  const [hidden, setHidden] = useState(false)

  return (
    <div className="flex flex-col gap-2 px-6 py-3 shrink-0">
      <div className="flex items-center gap-2">
        <span className="t-body-md text-[#737373]">Current Balance</span>
        <button onClick={() => setHidden(v => !v)} className="flex items-center">
          <Icon name={hidden ? 'visibility_off' : 'visibility'} size={20} className="text-[#737373]" />
        </button>
      </div>
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-baseline gap-1">
          <span className={`t-h1 tabular-nums ${light ? 'text-[#0a0a0a]' : 'text-white'}`}>
            {hidden ? '••••••••' : '90,008,897'}
          </span>
          <span className="t-h3 text-[#737373]">đ</span>
        </div>
        <button
          onClick={onOpenOverlay}
          className="relative bg-cinnabar-500 rounded-full px-4 py-2 flex items-center gap-2 overflow-hidden shrink-0"
        >
          <img src="/insight-decor.svg" alt="" className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: 107, height: 41 }} />
          <span className="relative t-body-md text-white whitespace-nowrap">Insight</span>
        </button>
      </div>
    </div>
  )
}

const HOME_ACTIONS = [
  { icon: '/icons-home/pay-bills.svg',       lightIcon: '/icons-home/pay-bills-light.svg',   label: 'Pay bills', variant: 'dark'   },
  { icon: '/icons-home/savings.svg',         lightIcon: '/icons-home/savings-light.svg',     label: 'Savings',   variant: 'dark'   },
  { icon: '/icons-home/swap-horiz.svg',      lightIcon: '/icons-home/swap-horiz-light.svg',  label: 'Transfer',  variant: 'dark'   },
  { icon: '/icons-home/qr-scanner.svg',      lightIcon: '/icons-home/qr-scanner-light.svg',  label: 'Scan QR',   variant: 'light'  },
  { icon: '/icons-home/arrow-right-red.svg', lightIcon: '/icons-home/arrow-right-black.svg', label: 'More',      variant: 'dashed' },
]

function BannerAndActions({ light = false }) {
  const pillCls = (variant) => {
    if (light) {
      // Light theme inverts the pill roles: dark pills go light, the light pill goes black
      return variant === 'light'
        ? 'bg-[#0a0a0a]'
        : variant === 'dashed'
          ? 'border border-dashed border-[#d4d4d4]'
          : 'bg-[#f5f5f5]'
    }
    return variant === 'light'
      ? 'bg-[#fafafa]'
      : variant === 'dashed'
        ? 'border border-dashed border-[#262626]'
        : 'bg-[#0a0a0a] border border-[#262626]'
  }
  const labelCls = (variant) => {
    if (light) return variant === 'light' ? 'text-[#fafafa]' : 'text-[#0a0a0a]'
    return variant === 'light' ? 'text-[#0a0a0a]' : 'text-[#fafafa]'
  }

  return (
    <div className="flex items-center gap-3 p-3 shrink-0">
      {/* Action pill buttons — left column, label left / icon right */}
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        {HOME_ACTIONS.map(({ icon, lightIcon, label, variant }) => (
          <button
            key={label}
            className={`rounded-full px-6 py-4 flex items-center justify-between w-full ${pillCls(variant)}`}
          >
            <span className={`t-label whitespace-nowrap ${labelCls(variant)}`}>
              {label}
            </span>
            <img src={light ? lightIcon : icon} alt="" className="size-6" />
          </button>
        ))}
      </div>

      {/* Auto Earning banner — right */}
      <div
        className="relative rounded-[48px] overflow-hidden flex flex-col items-center justify-between p-6 shrink-0"
        style={{ width: 236, height: 296 }}
      >
        {/* Background */}
        <Image src="/banner-auto-earning-bg.png" alt="" fill className="object-cover rounded-[48px]" />

        {/* Copy + CTA */}
        <div className="relative flex flex-col items-center gap-4 w-full">
          <div className="flex flex-col gap-2 text-center text-black w-full">
            <p className="t-label-lg text-black">Auto Earning</p>
            <p className="t-body-md text-black">Double Points, Redeem vouchers for food and shopping</p>
          </div>
          <button className="bg-[#0a0a0a] border border-[#262626] rounded-full px-5 py-2">
            <span className="t-label text-[#fafafa] whitespace-nowrap">Explore now</span>
          </button>
        </div>

        {/* Pagination */}
        <div className="relative backdrop-blur-[6px] bg-black/60 rounded-full p-1 flex items-start gap-0.5">
          <div className="bg-[#fafafa] rounded-full" style={{ width: 16, height: 4 }} />
          {[0, 1, 2].map(i => (
            <div key={i} className="bg-white/50 rounded-full" style={{ width: 6, height: 4 }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function TransactionItem({ item, isLast, light = false }) {
  const isIncome = item.dir === 'in'
  return (
    <>
      <div className="flex items-start justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <div className={`rounded-full p-2.5 flex items-center justify-center shrink-0 ${light ? 'bg-[#f5f5f5]' : 'bg-[#171717]'}`}>
            <Icon
              name={isIncome ? 'arrow_downward' : 'arrow_upward'}
              size={24}
              className={light ? (isIncome ? 'text-success' : 'text-[#737373]') : 'text-[#d4d4d4]'}
            />
          </div>
          <div className="flex flex-col gap-0.5 pb-0.5">
            <p className={`t-label whitespace-nowrap ${light ? 'text-[#0a0a0a]' : 'text-[#d4d4d4]'}`}>{item.name}</p>
            <div className="flex items-center gap-1 t-caption text-[#737373]">
              <span>{item.type}</span>
              <span>·</span>
              <span>{item.time}</span>
            </div>
          </div>
        </div>
        <p className={`t-number whitespace-nowrap ${isIncome ? 'text-success' : light ? 'text-[#0a0a0a]' : 'text-[#d4d4d4]'}`}>
          {item.amount}
        </p>
      </div>
      {!isLast && (
        <div className="pl-[83px] pr-4">
          <div className="h-px bg-[#737373] opacity-10 rounded-full" />
        </div>
      )}
    </>
  )
}

const TX_FILTERS = ['All', 'Income', 'Transfer', 'Card Payment', 'Withdrawal']

function TransactionSection({ menuOpen = false, light = false }) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [scrolled, setScrolled] = useState(false)
  const cardBg = light ? '#ffffff' : '#0a0a0a'

  return (
    <div
      className="flex-1 pb-3 px-3 overflow-hidden min-h-0"
      style={{ minHeight: menuOpen ? 372 : 0 }}
    >
      <div className={`backdrop-blur-lg border rounded-[48px] h-full flex flex-col overflow-hidden relative ${
        light ? 'bg-white border-[#ececec]' : 'bg-[#0a0a0a] border-[#262626]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between pt-6 px-6 shrink-0">
          <p className={`t-label-lg whitespace-nowrap ${light ? 'text-[#0a0a0a]' : 'text-[#d4d4d4]'}`}>Transaction History</p>
        </div>

        {/* Filter chips */}
        <div className="relative flex gap-3 pt-4 shrink-0">
          <div className="flex-1 flex items-center gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden pl-6 pr-6">
            {TX_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`rounded-full h-9 px-4 flex items-center shrink-0 border-2 ${
                  light
                    ? `bg-[#f5f5f5] ${f === activeFilter ? 'border-[#0a0a0a] bg-white' : 'border-transparent'}`
                    : `bg-[#171717] ${f === activeFilter ? 'border-[#fafafa]' : 'border-transparent'}`
                }`}
              >
                <span className={`t-label whitespace-nowrap ${light ? 'text-[#0a0a0a]' : 'text-[#fafafa]'}`}>
                  {f}
                </span>
              </button>
            ))}
          </div>
          <div
            className="absolute bottom-0 right-0 h-9 pointer-events-none"
            style={{ width: 64, background: `linear-gradient(to left, ${cardBg}, ${light ? 'rgba(255,255,255,0)' : 'rgba(10,10,10,0)'})` }}
          />
          {scrolled && (
            <div
              className="absolute top-full inset-x-0 h-14 pointer-events-none z-10"
              style={{ background: `linear-gradient(to bottom, ${cardBg}, ${light ? 'rgba(255,255,255,0)' : 'rgba(10,10,10,0)'})` }}
            />
          )}
        </div>

        {/* Transaction list */}
        <div
          onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 0)}
          className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden pt-3"
        >
          {TRANSACTIONS.map((item, i) => (
            <TransactionItem key={item.id} item={item} isLast={i === TRANSACTIONS.length - 1} light={light} />
          ))}
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 inset-x-0 h-14 pointer-events-none"
          style={{ background: `linear-gradient(to top, ${cardBg}, ${light ? 'rgba(255,255,255,0)' : 'rgba(10,10,10,0)'})` }}
        />
      </div>
    </div>
  )
}

/* ─── Bottom bar ───────────────────────────────────────────────────── */

function MenuDots() {
  return (
    <div className="flex flex-wrap w-6">
      {[0, 1, 2, 3].map(i => (
        <div key={i} className="p-1 flex items-center">
          <div className="size-1 rounded-full bg-black" />
        </div>
      ))}
    </div>
  )
}

/* Static menu / close icon — no morph animation */
function MenuToggleIcon({ open, light = false }) {
  if (open) {
    return <Icon name="close" size={24} className={light ? 'text-white' : 'text-black'} />
  }
  return (
    <Image
      src="/menu.svg"
      alt=""
      width={24}
      height={24}
      style={light ? { filter: 'invert(1)' } : undefined}
    />
  )
}

function BottomBar({ onOpenTri, triMode, onCloseTri, triHovered, keyboardOpen, onOpenKeyboard, onCloseKeyboard, onSend, menuOpen, onOpenMenu, light = false }) {
  const fade = { duration: 0.18, ease: 'easeInOut' }

  return (
    <div className="relative shrink-0" style={{ height: 64 }}>

      {/* Normal mode */}
      <motion.div
        initial={false}
        animate={{ opacity: triMode ? 0 : 1, y: triMode ? 4 : 0, pointerEvents: triMode ? 'none' : 'auto' }}
        transition={fade}
        className="absolute inset-0 flex items-center px-3 gap-2"
      >
        {/* Menu pill — morphs into the menu sheet via layoutId */}
        {!menuOpen && (
          <motion.button
            layoutId="menu-surface"
            style={{ borderRadius: 36 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenMenu}
            className={`px-8 py-5 flex items-center justify-center shrink-0 ${light ? 'bg-black' : 'bg-white'}`}
          >
            {/* Dots rendered by the static overlay button — this preserves the pill's size */}
            <div className="size-6" />
          </motion.button>
        )}
        {/* Spacer holds the pill's slot while the sheet is open */}
        {menuOpen && <div className="shrink-0" style={{ width: 88, height: 64 }} />}

        {/* Ask TRÍ input — physically shoved off the right edge when menu opens */}
        <motion.button
          initial={false}
          animate={{
            x: menuOpen ? 380 : 0,
            rotate: menuOpen ? 4 : 0,
            opacity: menuOpen ? 0 : 1,
            pointerEvents: menuOpen ? 'none' : 'auto',
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          onClick={onOpenTri}
          className={`flex-1 flex items-center justify-between backdrop-blur-sm border rounded-[36px] pl-8 pr-5 py-5 transition-shadow duration-200 ${
            light ? 'bg-white border-[#e5e5e5]' : 'bg-[#0a0a0a] border-[#404040]'
          } ${triHovered ? 'shadow-[0_0_0_4px_rgba(237,28,36,0.25)]' : ''}`}
        >
          <span className={`t-caption whitespace-nowrap ${light ? 'text-[#0a0a0a]' : 'text-white'}`}>Ask anything...</span>
          <div className="size-6 flex items-center justify-center shrink-0">
            <Image src="/tri.png" alt="" width={24} height={24} />
          </div>
        </motion.button>
      </motion.div>

      {/* TRÍ base mode — input visible, not keyboard */}
      <motion.div
        initial={false}
        animate={{
          opacity: triMode && !keyboardOpen ? 1 : 0,
          y: triMode && !keyboardOpen ? 0 : 4,
          pointerEvents: triMode && !keyboardOpen ? 'auto' : 'none',
        }}
        transition={{ ...fade, delay: triMode && !keyboardOpen ? 0.08 : 0 }}
        className="absolute inset-0 flex items-center gap-2"
      >
        <button onClick={onCloseTri} className="bg-white rounded-[36px] px-8 py-5 flex items-center justify-center shrink-0">
          <MenuDots />
        </button>
        <button
          onClick={onOpenKeyboard}
          className="flex-1 flex items-center justify-between bg-[#0a0a0a] backdrop-blur-sm border border-[#fafafa] rounded-[36px] pl-8 pr-5 py-5"
        >
          <span className="t-caption text-white whitespace-nowrap">Ask TRÍ anything...</span>
          <div className="size-6 flex items-center justify-center shrink-0">
            <Image src="/tri.png" alt="" width={24} height={24} />
          </div>
        </button>
      </motion.div>

      {/* TRÍ keyboard mode — typing state */}
      <motion.div
        initial={false}
        animate={{
          opacity: triMode && keyboardOpen ? 1 : 0,
          y: triMode && keyboardOpen ? 0 : 4,
          pointerEvents: triMode && keyboardOpen ? 'auto' : 'none',
        }}
        transition={{ ...fade, delay: triMode && keyboardOpen ? 0.05 : 0 }}
        className="absolute inset-0 flex items-center gap-2"
      >
        <div className="flex-1 flex items-center justify-between bg-[#0a0a0a] backdrop-blur-sm border border-[#fafafa] rounded-[36px] pl-8 pr-5 py-5">
          <span className="t-caption text-white flex items-center gap-px">
            Freeze my card
            <BlinkingCursor />
          </span>
          <button onClick={onSend} className="size-6 flex items-center justify-center shrink-0">
            <Image src="/tri.png" alt="" width={24} height={24} />
          </button>
        </div>
        <button
          onClick={onCloseKeyboard}
          className="bg-[#0a0a0a] border border-[#262626] rounded-full p-3 flex items-center justify-center shrink-0"
        >
          <Icon name="close" size={24} className="text-white" />
        </button>
      </motion.div>
    </div>
  )
}

/* ─── Menu Sheet — blooms out of the bottom-left pill ──────────────── */

const MENU_ITEMS = [
  { label: 'Home',              icon: 'logo',            navKey: 'home'       },
  { label: 'Accounts & Cards',  icon: 'wallet'    },
  { label: 'Transfer & Pay',    icon: 'mobiledata_arrows' },
  { label: 'Techcombank OneU',  icon: 'money_bag' },
  { label: 'My Wealth',         icon: 'lightbulb',       navKey: 'investment' },
]

const MENU_QUICK_LINKS = [
  { label: 'Payment  Link', icon: 'link' },
  { label: 'Card offers',   icon: 'credit_card' },
  { label: `What's new`,    icon: 'bolt' },
  { label: 'Refer & Earn',  icon: 'group' },
]

function MenuSheet({ onClose, onNavigateWealth, onToggleTheme, light = false, activeNav = 'home' }) {
  // Same contrast rule as the other overlays: light app → dark sheet.
  const dark = light

  // Bottom-up stagger: content nearest the origin (the pill) lands first
  const rise = (order) => ({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { delay: 0.18 + order * 0.05, duration: 0.32, ease: [0.16, 1, 0.3, 1] } },
    exit:    { opacity: 0, transition: { duration: 0.1 } },
  })

  return (
    <motion.div
      layoutId="menu-surface"
      style={{ borderRadius: 60, top: 160 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`absolute left-1 right-1 bottom-2 z-50 flex flex-col overflow-hidden ${dark ? 'bg-[#0a0a0a]' : 'bg-white'}`}
    >
      <div className="flex-1 flex flex-col gap-2 p-3 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden">

        {/* Profile card — always the cinnabar gradient, only its content inverts */}
        <motion.div
          {...rise(4)}
          className="relative overflow-hidden rounded-[48px] p-6 flex items-center justify-between gap-4 shrink-0"
          style={{ backgroundImage: 'linear-gradient(106deg, #ff9da1 0%, #fe353d 100%)' }}
        >
          <div
            className="absolute flex items-center justify-center pointer-events-none"
            style={{ left: 192, top: '50%', width: 274, height: 214, transform: 'translateY(-50%)' }}
          >
            <div className="relative shrink-0 opacity-40 rotate-[15deg]" style={{ width: 241, height: 157 }}>
              <Image src="/menu-profile-pattern.png" alt="" fill className="object-cover" />
            </div>
          </div>
          <div className="relative flex items-center gap-3">
            <div className="size-14 rounded-full bg-[#e5e5e5] overflow-hidden relative shrink-0">
              <Image src="/avatar.png" alt="QA" fill className="object-cover" />
            </div>
            <div className="flex flex-col gap-2 items-start">
              <span className={`t-label-lg ${dark ? 'text-white' : 'text-black'}`}>Quang Anh</span>
              <div className={`rounded-full px-2 py-1 flex items-center gap-1 ${dark ? 'bg-white' : 'bg-black'}`}>
                <Image src="/logo.svg" alt="" width={16} height={16} />
                <span className={`text-[12px] font-medium leading-4 whitespace-nowrap ${dark ? 'text-black' : 'text-white'}`}>Inspire Max</span>
              </div>
            </div>
          </div>
          <div className="relative flex items-center gap-2 shrink-0">
            <span className={`text-[12px] whitespace-nowrap ${dark ? 'text-white' : 'text-black'}`}>Membership benefits</span>
            <button className={`rounded-full p-1 flex items-center justify-center ${dark ? 'bg-white' : 'bg-black'}`}>
              <Icon name="chevron_right" size={16} className={dark ? 'text-black' : 'text-white'} />
            </button>
          </div>
        </motion.div>

        {/* Main menu items */}
        <motion.div {...rise(3)} className={`rounded-[32px] flex flex-col shrink-0 ${dark ? 'bg-[#171717]' : 'bg-[#f5f5f5]'}`}>
          {MENU_ITEMS.map(({ label, icon, navKey }, i) => {
            const active = navKey === activeNav
            return (
              <button
                key={label}
                onClick={label === 'Home' ? onClose : label === 'My Wealth' ? onNavigateWealth : undefined}
                className={`flex items-center gap-6 px-6 w-full text-left ${
                  i === 0 ? 'pt-6 pb-4' : i === MENU_ITEMS.length - 1 ? 'pt-4 pb-6' : 'py-4'
                }`}
              >
                {icon === 'logo'
                  ? <TcbLogoIcon size={20} className="text-cinnabar-500" />
                  : <Icon name={icon} size={20} className={active ? 'text-cinnabar-500' : (dark ? 'text-[#fafafa]' : 'text-[#0a0a0a]')} />
                }
                <span className={`t-label ${active ? 'text-cinnabar-500' : (dark ? 'text-[#fafafa]' : 'text-[#0a0a0a]')}`}>{label}</span>
              </button>
            )
          })}
        </motion.div>

        {/* Quick links + branch/map card */}
        <motion.div {...rise(2)} className="flex items-stretch gap-2.5 shrink-0">
          <div className={`flex-1 min-w-0 rounded-[32px] flex flex-col ${dark ? 'bg-[#171717]' : 'bg-[#f5f5f5]'}`}>
            {MENU_QUICK_LINKS.map(({ label, icon }, i) => (
              <button
                key={label}
                className={`flex items-center gap-6 px-6 w-full text-left ${
                  i === 0 ? 'pt-6 pb-4' : i === MENU_QUICK_LINKS.length - 1 ? 'pt-4 pb-6' : 'py-4'
                }`}
              >
                <Icon name={icon} size={20} className={`shrink-0 ${dark ? 'text-[#fafafa]' : 'text-[#0a0a0a]'}`} />
                <span className={`t-label whitespace-nowrap ${dark ? 'text-[#fafafa]' : 'text-[#0a0a0a]'}`}>{label}</span>
              </button>
            ))}
          </div>

          <div className={`flex-1 min-w-0 border border-info rounded-[32px] overflow-hidden flex flex-col ${dark ? 'bg-[#171717]' : 'bg-[#f5f5f5]'}`}>
            <p className={`t-label px-6 pt-6 pb-3 ${dark ? 'text-[#fafafa]' : 'text-[#0a0a0a]'}`}>Find branches &amp; ATMs on map</p>
            <div className="px-6"><div className="h-px bg-[#737373] opacity-10 rounded-full w-full" /></div>
            <div className="flex flex-col gap-2 px-6 py-3">
              <p className={`t-label ${dark ? 'text-[#fafafa]' : 'text-[#0a0a0a]'}`}>Book an appointment</p>
              <p className="text-[12px] leading-4 text-[#737373]">For a smoother branch visit</p>
            </div>
            <div className="relative h-[79px] shrink-0">
              <Image src={light ? '/menu-map-dark.png' : '/menu-map.png'} alt="" fill className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-info rounded-full p-1 flex items-center justify-center shadow-lg">
                  <Icon name="location_on" size={20} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer — dots slot left (rendered by static overlay), language + theme + settings right */}
      <div className="flex items-center justify-between px-11 py-5 shrink-0">
        <div className="size-6" />
        <motion.div {...rise(0)} className="flex items-center gap-4">
          <span className={`t-label-lg ${dark ? 'text-white' : 'text-black'}`}>EN</span>
          <button onClick={onToggleTheme} className="flex items-center">
            <Icon name={light ? 'light_mode' : 'dark_mode'} size={24} className={dark ? 'text-white' : 'text-black'} />
          </button>
          <button className="flex items-center">
            <Icon name="settings" size={24} className={dark ? 'text-white' : 'text-black'} />
          </button>
        </motion.div>
      </div>

      {/* Bottom spacer */}
      <div className="h-7 shrink-0" />
    </motion.div>
  )
}

/* ─── Overlays (light-themed, pop above dark background) ───────────── */

/* Counts from 0 to `to` on mount — runs when the Insight panel opens */
function CountUp({ to, format = (v) => Math.round(v).toLocaleString('en-US'), duration = 1.2, delay = 0.25, className = '' }) {
  const [display, setDisplay] = useState(() => format(0))
  useEffect(() => {
    const controls = animate(0, to, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(format(v)),
    })
    return () => controls.stop()
  }, [to, duration, delay]) // eslint-disable-line react-hooks/exhaustive-deps
  return <span className={`tabular-nums ${className}`}>{display}</span>
}

function InsightStatCard({ icon, label, value, description, dark = false }) {
  return (
    <div className={`flex-1 border rounded-[48px] p-6 flex flex-col items-end justify-center gap-1 min-w-0 ${
      dark ? 'bg-[#171717] border-[#262626]' : 'bg-[#f5f5f5] border-[#e5e5e5]'
    }`}>
      <div className={`rounded-full size-12 flex items-center justify-center shrink-0 ${dark ? 'bg-[#262626]' : 'bg-[#e5e5e5]'}`}>
        <Icon name={icon} size={24} className={dark ? 'text-white' : 'text-content-primary'} />
      </div>
      <div className="w-full flex flex-col gap-1">
        <p className="text-[14px] font-medium leading-5 text-[#737373] tracking-[0.28px]">{label}</p>
        {value}
        <p className="text-[14px] font-medium leading-5 text-[#737373] tracking-[0.28px]">{description}</p>
      </div>
    </div>
  )
}

const GOAL_BARS = 25
const GOAL_ACTIVE_BAR = 12
const GOAL_PERCENT = 45
const GOAL_FILL_WIDTH = 201

const INSIGHT_STARS = [
  { src: '/icons-home/insight-star-1.svg', size: 16, left: 101, top: 3,  delay: 0    },
  { src: '/icons-home/insight-star-2.svg', size: 8,  left: 97,  top: 45, delay: 0.12 },
  { src: '/icons-home/insight-star-3.svg', size: 12, left: 145, top: 21, delay: 0.24 },
]

/* Sparkle burst — rises, rotates, then fades out. Plays once on mount. */
function InsightStarBurst() {
  return (
    <>
      {INSIGHT_STARS.map((s, i) => (
        <motion.img
          key={i}
          src={s.src}
          alt=""
          className="absolute pointer-events-none"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size }}
          initial={{ opacity: 0, y: 6, rotate: 0, scale: 0.8 }}
          animate={{ opacity: [0, 1, 1, 0], y: [6, -6, -14, -22], rotate: [0, 20, 35, 50], scale: [0.8, 1, 1, 0.9] }}
          transition={{ duration: 1.4, times: [0, 0.2, 0.7, 1], ease: 'easeOut', delay: s.delay }}
        />
      ))}
    </>
  )
}

function CoffeeInsightCard({ dark = false }) {
  return (
    <div className={`relative flex-1 border rounded-[48px] p-6 flex flex-col items-end justify-center gap-1 min-w-0 overflow-hidden ${
      dark ? 'bg-[#171717] border-[#262626]' : 'bg-[#f5f5f5] border-[#e5e5e5]'
    }`}>
      {/* Diagonal shine — sweeps from outside the top-left corner to outside the bottom-right, once, to draw the eye to the new card */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ left: 22, top: 14 }}
        initial={{ x: -160, y: -160, opacity: 0 }}
        animate={{ x: 160, y: 160, opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.1, ease: 'easeInOut', times: [0, 0.15, 0.85, 1] }}
      >
        <div className="rotate-45 blur-md bg-white/40" style={{ width: 46, height: 260 }} />
      </motion.div>
      <div className={`relative rounded-full size-12 flex items-center justify-center shrink-0 ${dark ? 'bg-[#262626]' : 'bg-[#e5e5e5]'}`}>
        <Icon name="coffee" size={24} className={dark ? 'text-white' : 'text-content-primary'} />
        <InsightStarBurst />
      </div>
      <div className="relative w-full flex flex-col gap-1">
        <p className="text-[14px] font-medium leading-5 text-[#737373] tracking-[0.28px]">You have spent</p>
        <p className={`text-[24px] font-bold leading-8 tracking-[0.48px] ${dark ? 'text-white' : 'text-black'}`}>1.4m</p>
        <p className="text-[14px] font-medium leading-5 text-[#737373] tracking-[0.28px]">on daily coffee this month</p>
      </div>
    </div>
  )
}

const SHAKE = {
  animate: { rotate: [-0.6, 0.6, -0.6, 0.6, -0.6, 0.6] },
  transition: { repeat: Infinity, duration: 0.9, ease: 'easeInOut' },
}

function RemoveBtn({ dark }) {
  return (
    <div className={`absolute -top-3 -left-3 z-10 rounded-full px-2 py-1 flex items-center justify-center border ${
      dark ? 'bg-[#fafafa] border-[#0a0a0a]' : 'bg-black border-white'
    }`}>
      <Icon name="check_indeterminate_small" size={20} className={dark ? 'text-[#0a0a0a]' : 'text-white'} />
    </div>
  )
}

function BalanceOverlay({ onClose, onAddInsight, showCard = true, light = false, insightAdded = false }) {
  // The overlay always contrasts against the app's own theme: dark app → light panel,
  // light app → dark panel.
  const dark = light
  const [isEditing, setIsEditing] = useState(false)

  // One shared progress value (0 → 45) drives the percent text, fill widths, and active tick
  const [goalProgress, setGoalProgress] = useState(0)
  useEffect(() => {
    if (!showCard) return
    const controls = animate(0, GOAL_PERCENT, {
      duration: 1.2,
      delay: 0.25,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: setGoalProgress,
    })
    return () => controls.stop()
  }, [showCard])

  const fillWidth = (goalProgress / GOAL_PERCENT) * GOAL_FILL_WIDTH
  const activeBar = Math.round((goalProgress / GOAL_PERCENT) * GOAL_ACTIVE_BAR)

  const panelBg = dark ? '#0a0a0a' : '#ffffff'
  const panelExitBg = dark ? '#fafafa' : '#0a0a0a'

  return (
    <>
      {/* Backdrop — stays fully dark through the panel's collapse, only fades at the very end */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3 } }}
        exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.3 } }}
        className="absolute inset-0 z-50"
        onClick={onClose}
      >
        <div className={`absolute inset-0 rounded-[64px] ${dark ? 'bg-black/60' : 'bg-black/60'}`} />
      </motion.div>

      {/* Insight panel — unfolds (height-only) from the seam between header and body */}
      {showCard && (
          <motion.div
            initial={{ width: 24, height: 24, y: 120, opacity: 1, backgroundColor: panelBg }}
            animate={{ width: 424, height: insightAdded ? 868 : 768, y: 0, opacity: 1, backgroundColor: panelBg }}
            exit={{
              width: 160, height: 160, y: 96, opacity: 0, backgroundColor: panelBg,
              transition: {
                type: 'spring', stiffness: 360, damping: 38,
                opacity: { duration: 0.12, ease: 'easeOut' },
              },
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="absolute left-2 top-2 z-50 overflow-hidden rounded-[60px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Content layer — fades out immediately so nothing lingers visible while the shell collapses */}
            <motion.div
              exit={{ opacity: 0, transition: { duration: 0.12, ease: 'easeIn' } }}
              className={`border-[0.75px] border-dashed rounded-[60px] flex flex-col overflow-hidden h-full ${dark ? 'border-[#262626]' : 'border-[#fafaf9]'}`}
              style={{ width: 424 }}
            >
              {/* Content */}
              <div className="flex-1 flex flex-col gap-2 px-3 pt-16 pb-3 w-full min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                {/* Stat cards row */}
                <div className="flex items-stretch gap-2 w-full">
                  <motion.div className="relative flex-1 min-w-0" animate={isEditing ? SHAKE.animate : { rotate: 0 }} transition={isEditing ? SHAKE.transition : {}}>
                    {isEditing && <RemoveBtn dark={dark} />}
                    <InsightStatCard
                      icon="attach_money"
                      label="You have"
                      dark={dark}
                      value={<CountUp to={53} format={(v) => `${Math.round(v)}m`} className={`block text-[24px] font-bold leading-8 tracking-[0.48px] ${dark ? 'text-white' : 'text-black'}`} />}
                      description="has remained unused for over 4 months"
                    />
                  </motion.div>
                  <motion.div className="relative flex-1 min-w-0" animate={isEditing ? { ...SHAKE.animate, rotate: SHAKE.animate.rotate.map(r => -r) } : { rotate: 0 }} transition={isEditing ? { ...SHAKE.transition, delay: 0.08 } : {}}>
                    {isEditing && <RemoveBtn dark={dark} />}
                    <InsightStatCard
                      icon="wallet"
                      label="You already spent"
                      dark={dark}
                      value={
                        <p className={`text-[24px] font-bold leading-8 tracking-[0.48px] tabular-nums ${dark ? 'text-white' : 'text-black'}`}>
                          <CountUp to={2.4} format={(v) => `${v.toFixed(1).replace('.', ',')}m`} duration={1.1} />
                          {' / 20m'}
                        </p>
                      }
                      description="of your monthly budget"
                    />
                  </motion.div>
                </div>

                {/* Buying House Goal card — the accent block, opposite tone of the panel */}
                <motion.div className="relative w-full" animate={isEditing ? SHAKE.animate : { rotate: 0 }} transition={isEditing ? { ...SHAKE.transition, delay: 0.04 } : {}}>
                  {isEditing && <RemoveBtn dark={dark} />}
                <div className={`rounded-[48px] overflow-hidden relative flex flex-col gap-4 w-full ${dark ? 'bg-[#fafafa]' : 'bg-[#0a0a0a]'}`}>
                  {/* Progress region backdrop — grows with the percentage */}
                  <div
                    className={`absolute left-0 bottom-0 ${dark ? 'bg-[#f5f5f5]' : 'bg-[#171717]'}`}
                    style={{ height: 220, width: fillWidth }}
                  />
                  <div className="relative flex flex-col gap-2 pt-6 px-6 w-full">
                    <div className="flex items-start justify-between w-full">
                      <div className="flex flex-col gap-1">
                        <p className={`text-[16px] font-semibold leading-6 tracking-[0.32px] ${dark ? 'text-[#0a0a0a]' : 'text-[#fafafa]'}`}>Buying House Goal</p>
                        <span className="text-[24px] font-bold leading-8 text-info tracking-[0.48px] tabular-nums">
                          {Math.round(goalProgress)}%
                        </span>
                      </div>
                      <div className={`rounded-full size-12 flex items-center justify-center shrink-0 ${dark ? 'bg-[#e5e5e5]' : 'bg-[#262626]'}`}>
                        <Icon name="add_home" size={24} className={dark ? 'text-[#0a0a0a]' : 'text-[#fafafa]'} />
                      </div>
                    </div>
                    <p className={`t-body-md w-full ${dark ? 'text-[#0a0a0a]' : 'text-[#fafafa]'}`}>
                      Almost halfway to your goal.
                    </p>
                  </div>
                  {/* Tick bars + progress */}
                  <div className="relative flex flex-col w-full">
                    <div className="flex items-center justify-between w-full">
                      {Array.from({ length: GOAL_BARS }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-12 w-0.5 rounded-full ${i === activeBar && goalProgress > 0.5 ? 'bg-info' : (dark ? 'bg-[#e5e5e5]' : 'bg-[#262626]')}`}
                        />
                      ))}
                    </div>
                    <div className="bg-info h-6" style={{ width: fillWidth }} />
                  </div>
                </div>
                </motion.div>

                {/* Add new insight */}
                {insightAdded ? (
                  <div className="flex items-stretch gap-2 w-full">
                    <motion.div className="relative w-1/2 min-w-0" animate={isEditing ? SHAKE.animate : { rotate: 0 }} transition={isEditing ? { ...SHAKE.transition, delay: 0.12 } : {}}>
                      {isEditing && <RemoveBtn dark={dark} />}
                      <CoffeeInsightCard dark={dark} />
                    </motion.div>
                    <button
                      onClick={onAddInsight}
                      className={`w-1/2 min-w-0 border border-dashed rounded-[48px] p-6 flex flex-col items-center justify-center gap-2 ${dark ? 'border-[#fafafa]' : 'border-[#0a0a0a]'}`}
                    >
                      <Image src="/tri.png" alt="" width={24} height={24} />
                      <span className={`text-[16px] font-semibold leading-6 tracking-[0.32px] text-center ${dark ? 'text-white' : 'text-content-primary'}`}>Add new insight</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={onAddInsight}
                    className={`border border-dashed rounded-[48px] p-6 flex items-center justify-center gap-2 w-full ${dark ? 'border-[#fafafa]' : 'border-[#0a0a0a]'}`}
                  >
                    <span className={`text-[16px] font-semibold leading-6 tracking-[0.32px] ${dark ? 'text-white' : 'text-content-primary'}`}>Add new insight</span>
                    <Image src="/tri.png" alt="" width={24} height={24} />
                  </button>
                )}
              </div>

              {/* Footer — Edit / Close */}
              <div className={`flex items-center justify-between px-6 pt-3 pb-0 shrink-0 w-full bg-gradient-to-b ${
                dark ? 'from-black/0 to-black' : 'from-white/0 to-white'
              }`}>
                <button onClick={() => setIsEditing(v => !v)} className="bg-black border border-white rounded-[60px] px-8 py-5 backdrop-blur-sm">
                  <span className="text-[14px] font-medium leading-5 text-white tracking-[0.28px]">{isEditing ? 'Done' : 'Edit'}</span>
                </button>
                <button onClick={onClose} className="bg-white border border-black rounded-[60px] px-8 py-5 backdrop-blur-sm">
                  <span className="text-[14px] font-medium leading-5 text-black tracking-[0.28px]">Close</span>
                </button>
              </div>
              <div className="h-6 shrink-0" />
            </motion.div>
          </motion.div>
      )}
    </>
  )
}

function TransactionOverlay({ onClose, showCard = true, light = false }) {
  // Same contrast rule as BalanceOverlay: light app → dark card.
  const dark = light

  const suggestions = [
    'Why is it higher this month?',
    'How much did I spend at Shopee this year?',
    'Set a monthly budget',
  ]
  const spendingRows = [
    { label: 'Total coffee spending',        amount: '3,200,000vnd' },
    { label: 'Total only shopping spending', amount: '1,200,000vnd' },
    { label: 'Total food spending',          amount: '1,200,000vnd' },
  ]

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 z-50"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-[64px]" />
      </motion.div>

      <AnimatePresence>
        {showCard && (
          <motion.div
            initial={{ y: 800 }} animate={{ y: 0 }} exit={{ y: 800 }}
            transition={{ type: 'spring', stiffness: 140, damping: 18 }}
            className="absolute inset-x-4 bottom-10 z-60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`rounded-4xl flex flex-col gap-4 p-4 ${dark ? 'bg-[#0a0a0a]' : 'bg-surface'}`}>
              <div className="flex items-center justify-between">
                <span className={`text-[24px] font-bold leading-8 ${dark ? 'text-white' : 'text-content-primary'}`}>Analyze</span>
                <button onClick={onClose} className={`size-10 rounded-full flex items-center justify-center shrink-0 ${dark ? 'bg-[#171717]' : 'bg-surface-sunken'}`}>
                  <Icon name="close" size={20} className={dark ? 'text-[#a1a1a1]' : 'text-content-secondary'} />
                </button>
              </div>

              <div className={`rounded-3xl p-4 flex flex-col gap-1 ${dark ? 'bg-[#171717]' : 'bg-amber-50'}`}>
                <p className={`text-[13px] font-medium leading-5 ${dark ? 'text-[#a1a1a1]' : 'text-content-secondary'}`}>You overspent</p>
                <p className="text-[28px] font-bold text-amber-500 leading-9">2Mvnđ on coffee</p>
                <p className={`text-[13px] leading-5 ${dark ? 'text-[#a1a1a1]' : 'text-content-secondary'}`}>
                  Your coffee spending has increased 18% this month, mainly after payday.
                </p>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center justify-between pb-3">
                  <span className={`text-[14px] font-semibold leading-5 ${dark ? 'text-white' : 'text-content-primary'}`}>Spending</span>
                  <span className="text-[14px] font-medium text-info leading-5">Define new one</span>
                </div>
                {spendingRows.map(({ label, amount }) => (
                  <div key={label}>
                    <div className={`h-px ${dark ? 'bg-[#262626]' : 'bg-border-default'}`} />
                    <div className="flex items-center justify-between py-3">
                      <span className={`text-[13px] leading-5 ${dark ? 'text-[#737373]' : 'text-content-muted'}`}>{label}</span>
                      <span className="text-[13px] font-medium text-danger leading-5 shrink-0 ml-2">{amount}</span>
                    </div>
                  </div>
                ))}
                <div className="bg-info-subtle rounded-2xl p-3 flex items-start gap-2 mt-1">
                  <Icon name="info" size={18} className="text-info shrink-0 mt-px" />
                  <p className="text-[12px] text-info leading-4">
                    The categories is being created by TRÍ. You can add TRÍ to add more or remove the wrong one.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {suggestions.map(text => (
                  <button key={text} className={`w-full flex items-center justify-center border px-4 py-3 rounded-full ${
                    dark ? 'border-[#262626] bg-[#171717]' : 'border-border-strong bg-surface-raised'
                  }`}>
                    <span className={`text-[14px] font-medium ${dark ? 'text-white' : 'text-content-primary'}`}>{text}</span>
                  </button>
                ))}
                <button onClick={onClose} className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full ${dark ? 'bg-white' : 'bg-surface-overlay'}`}>
                  <Image src="/tri.png" alt="AI" width={20} height={20} />
                  <span className={`text-[14px] font-medium ${dark ? 'text-[#0a0a0a]' : 'text-content-inverse'}`}>Ask a follow-up</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ─── TRÍ Screen ────────────────────────────────────────────────────── */

const TRI_ENTRY_SUGGESTIONS = [
  { id: 1, rotate: -8, icon: '/icons-home/tri-suggestion-house.svg', label: 'Make a plan to buy house',                    message: 'Make a plan to buy house' },
  { id: 2, rotate: 8,  icon: '/icons-home/tri-suggestion-plane.svg', label: 'Summarize my total spending on Bangkok Trip', message: 'Summarize my total spending on Bangkok Trip' },
  { id: 3, rotate: -8, icon: 'freeze',                               label: 'Freeze my Credit card',                       message: 'Freeze my card' },
]

function TriScreen({ onClose, onOpenSearch, onOpenChat, light = false }) {
  return (
    <motion.div
      initial={{ x: 448 }} animate={{ x: 0 }} exit={{ x: 448 }}
      transition={{ type: 'spring', stiffness: 300, damping: 32 }}
      className={`absolute inset-0 z-80 rounded-[64px] overflow-hidden flex flex-col ${light ? 'bg-white' : 'bg-black'}`}
    >
      {/* Dotted pattern background — dark theme only */}
      {!light && (
        <Image src="/background-dark.png" alt="" fill unoptimized className="object-cover rounded-[64px]" />
      )}

      {/* Status bar */}
      <div className="absolute top-0 left-0 right-0 z-70">
        <StatusBar dark={light} />
      </div>

      {/* Layout column */}
      <div className="absolute inset-0 flex flex-col gap-2 px-1 pt-1 pb-1">

        {/* Main content card */}
        <div className={`relative flex-1 backdrop-blur-lg border rounded-tl-[60px] rounded-tr-[60px] rounded-bl-[32px] rounded-br-[32px] overflow-hidden flex flex-col items-center min-h-0 ${
          light ? 'bg-white border-[#f0f0f0]' : 'bg-[#0a0a0a] border-[#171717]'
        }`}>

          {/* Header */}
          <div className="flex items-center justify-between pb-3 pl-4 pr-3 pt-16 shrink-0 w-full">
            <button className={`rounded-full px-6 py-3 flex items-center justify-center border ${
              light ? 'bg-white border-[#e5e5e5]' : 'bg-[#0a0a0a] border-[#262626]'
            }`}>
              <Icon name="history" size={24} className={light ? 'text-[#0a0a0a]' : 'text-[#d4d4d4]'} />
            </button>
            <div className="flex items-center gap-1">
              <button onClick={onOpenSearch} className={`rounded-full px-6 py-3 flex items-center justify-center border ${
                light ? 'bg-white border-[#e5e5e5]' : 'bg-[#0a0a0a] border-[#262626]'
              }`}>
                <Icon name="search" size={24} className={light ? 'text-[#0a0a0a]' : 'text-[#d4d4d4]'} />
              </button>
              <button onClick={onClose} className={`rounded-full px-6 py-3 flex items-center justify-center ${light ? 'bg-[#0a0a0a]' : 'bg-[#fafafa]'}`} style={{ width: 72 }}>
                <Icon name="close" size={24} className={light ? 'text-white' : 'text-black'} />
              </button>
            </div>
          </div>

          {/* Greeting + suggestion cards */}
          <div className="backdrop-blur-[6px] flex-1 w-full flex flex-col items-center justify-end overflow-hidden min-h-0">
            <div className="flex flex-col gap-2.5 p-4 shrink-0 w-full whitespace-nowrap">
              <p className={`t-h3 ${light ? 'text-[#0a0a0a]' : 'text-white'}`}>Hey Quang!</p>
              <p className="t-label text-[#737373]">What&apos;s been on your mind lately?</p>
            </div>

            <div className="flex items-center pb-4 pt-3 px-4 shrink-0 w-full">
              {TRI_ENTRY_SUGGESTIONS.map(({ id, rotate, icon, label, message }) => (
                <button
                  key={id}
                  onClick={() => onOpenChat?.(message)}
                  className="flex items-start justify-start shrink-0 text-left"
                  style={{ width: 135, height: 155, marginRight: -16 }}
                >
                  <div
                    className={`rounded-3xl flex flex-col gap-1 items-start px-4 py-4 shrink-0 border ${
                      light ? 'bg-[#f5f5f5] border-[#e5e5e5]' : 'bg-[#171717] border-[#262626]'
                    }`}
                    style={{ width: 117, height: 140, transform: `rotate(${rotate}deg)` }}
                  >
                    {icon === 'freeze' ? (
                      <div className="bg-cinnabar-400 rounded-lg size-6 flex items-center justify-center shrink-0">
                        <div className="bg-cinnabar-200 rounded-full size-4" />
                      </div>
                    ) : (
                      <img src={icon} alt="" className="size-6" />
                    )}
                    <p className={`t-label text-left w-full whitespace-normal ${light ? 'text-[#0a0a0a]' : 'text-[#d4d4d4]'}`}>{label}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ask anything input */}
        <button
          onClick={() => onOpenChat?.('Freeze my card')}
          className={`backdrop-blur-sm border flex items-center gap-2 pl-4 pr-2 py-2 rounded-[60px] shrink-0 mx-3 w-[calc(100%-24px)] ${
            light ? 'bg-white border-[#e5e5e5]' : 'bg-[#fafafa] border-[#fafafa]'
          }`}
        >
          <Icon name="add" size={24} className="text-black shrink-0" />
          <div className="flex-1 flex items-center gap-1 min-w-0">
            <div className="bg-info h-5 w-1 rounded-full shrink-0" />
            <span className="flex-1 t-body text-[#a1a1a1] text-left">Ask anything</span>
          </div>
          <div className="bg-info rounded-full p-2 flex items-center justify-center shrink-0">
            <Icon name="arrow_upward" size={24} className="text-white" />
          </div>
        </button>

        {/* Dark keyboard — in flow */}
        <DarkKeyboardMock />
      </div>
    </motion.div>
  )
}

/* ─── Insight Chat Screen — scripted "Add new insight" conversation ─── */

const INSIGHT_SCRIPT = {
  draft1: 'Add me a new financial insight to control my balance',
  reply1: {
    lines: ['What financial insight would you like to add?', 'You can ask things like:'],
    bullets: ['Spending by category', 'Subscription analysis', 'Salary & cash flow', 'Investment performance'],
  },
  draft2: 'Monthly coffee spending',
  reply2: { text: 'I’ve added a new Coffee Spending insight.', view: true },
}

function InsightChatScreen({ onClose, onOpenSearch, onViewInsight, light = false }) {
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState(INSIGHT_SCRIPT.draft1)
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking])

  const handleSend = () => {
    if (!inputText || thinking) return
    const isFirst = messages.length === 0
    const sent = inputText
    setMessages(prev => [...prev, { role: 'user', content: sent }])
    setInputText('')
    setThinking(true)
    setTimeout(() => {
      setThinking(false)
      setMessages(prev => [...prev, { role: 'ai', content: isFirst ? INSIGHT_SCRIPT.reply1 : INSIGHT_SCRIPT.reply2 }])
      if (isFirst) setTimeout(() => setInputText(INSIGHT_SCRIPT.draft2), 500)
    }, 1000)
  }

  const canSend = !!inputText && !thinking

  return (
    <motion.div
      initial={{ x: 448 }} animate={{ x: 0 }} exit={{ x: 448 }}
      transition={{ type: 'spring', stiffness: 300, damping: 32 }}
      className={`absolute inset-0 z-80 rounded-[64px] overflow-hidden flex flex-col ${light ? 'bg-white' : 'bg-black'}`}
    >
      {/* Dotted pattern background — dark theme only */}
      {!light && (
        <Image src="/background-dark.png" alt="" fill unoptimized className="object-cover rounded-[64px]" />
      )}

      {/* Status bar */}
      <div className="absolute top-0 left-0 right-0 z-70">
        <StatusBar dark={light} />
      </div>

      {/* Layout column */}
      <div className="absolute inset-0 flex flex-col gap-2 px-1 pt-1 pb-1">

        {/* Main content card */}
        <div className={`relative flex-1 backdrop-blur-lg border rounded-tl-[60px] rounded-tr-[60px] rounded-bl-[32px] rounded-br-[32px] overflow-hidden flex flex-col min-h-0 ${
          light ? 'bg-white border-[#f0f0f0]' : 'bg-[#0a0a0a] border-[#171717]'
        }`}>

          {/* Header */}
          <div className="flex items-center justify-between pb-3 pl-4 pr-3 pt-16 shrink-0 w-full">
            <button className={`rounded-full px-6 py-3 flex items-center justify-center border ${
              light ? 'bg-white border-[#e5e5e5]' : 'bg-[#0a0a0a] border-[#262626]'
            }`}>
              <Icon name="history" size={24} className={light ? 'text-[#0a0a0a]' : 'text-[#d4d4d4]'} />
            </button>
            <div className="flex items-center gap-1">
              <button onClick={onOpenSearch} className={`rounded-full px-6 py-3 flex items-center justify-center border ${
                light ? 'bg-white border-[#e5e5e5]' : 'bg-[#0a0a0a] border-[#262626]'
              }`}>
                <Icon name="search" size={24} className={light ? 'text-[#0a0a0a]' : 'text-[#d4d4d4]'} />
              </button>
              <button onClick={onClose} className={`rounded-full px-6 py-3 flex items-center justify-center ${light ? 'bg-[#0a0a0a]' : 'bg-[#fafafa]'}`} style={{ width: 72 }}>
                <Icon name="close" size={24} className={light ? 'text-white' : 'text-black'} />
              </button>
            </div>
          </div>

          {/* Message list */}
          <div className="relative flex-1 min-h-0">
          <div ref={scrollRef} className="flex-1 flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden min-h-0 h-full">
            <div className="flex flex-col py-4 w-full mt-auto">
              {messages.map((m, i) => (
                <div key={i} className={`flex w-full py-2 ${m.role === 'user' ? 'justify-end pl-24 pr-4' : 'justify-start pl-4 pr-24'}`}>
                  {m.role === 'user' ? (
                    <div className="bg-info rounded-3xl px-4 py-3 max-w-full">
                      <p className="text-[16px] leading-6 text-white">{m.content}</p>
                    </div>
                  ) : (
                    <div className={`rounded-3xl px-4 py-3 max-w-full flex items-center gap-2.5 ${light ? 'bg-[#f5f5f5]' : 'bg-[#262626]'}`}>
                      {m.content.bullets ? (
                        <div className={`text-[16px] leading-6 ${light ? 'text-[#0a0a0a]' : 'text-white'}`}>
                          {m.content.lines.map((line, li) => <p key={li}>{line}</p>)}
                          <ul className="list-disc pl-6">
                            {m.content.bullets.map((b, bi) => <li key={bi}>{b}</li>)}
                          </ul>
                        </div>
                      ) : (
                        <p className={`text-[16px] leading-6 ${light ? 'text-[#0a0a0a]' : 'text-white'}`}>{m.content.text}</p>
                      )}
                      {m.content?.view && (
                        <button
                          onClick={onViewInsight}
                          className={`border rounded-[60px] px-6 py-4 backdrop-blur-sm shrink-0 ${
                            light ? 'bg-[#0a0a0a] border-black text-white' : 'bg-white border-black text-black'
                          }`}
                        >
                          <span className="text-[14px] font-medium leading-5 tracking-[0.28px]">View</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Thinking indicator */}
              {thinking && (
                <div className="flex justify-start pl-4 pr-24 py-2 w-full">
                  <motion.div
                    animate={{ rotate: 360, scale: [1, 1.18, 1] }}
                    transition={{ rotate: { duration: 1.6, repeat: Infinity, ease: 'linear' }, scale: { duration: 0.9, repeat: Infinity, ease: 'easeInOut' } }}
                  >
                    <Image src="/tri.png" alt="" width={28} height={28} />
                  </motion.div>
                </div>
              )}
            </div>
          </div>

          {/* Top fade — sits over the message list, not part of the scroll content */}
          <div className={`absolute top-0 inset-x-0 h-14 pointer-events-none z-10 ${
            light ? 'bg-linear-to-b from-white to-transparent' : 'bg-linear-to-b from-[#0a0a0a] to-transparent'
          }`} />
          </div>
        </div>

        {/* Footer + keyboard — slide up after screen lands */}
        <motion.div
          initial={{ y: 480 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 32, delay: 0.28 }}
          className="absolute left-0 right-0 bottom-0 z-20 flex flex-col gap-2"
        >
          {/* Ask anything input */}
          <div className={`backdrop-blur-sm border flex items-center gap-2 pl-4 pr-2 py-2 rounded-[60px] shrink-0 w-full ${
            light ? 'bg-white border-[#e5e5e5]' : 'bg-[#fafafa] border-[#fafafa]'
          }`}>
            <Icon name="add" size={24} className="text-black shrink-0" />
            <div className="flex-1 flex items-center gap-1 min-w-0">
              <div className="bg-info h-5 w-1 rounded-full shrink-0" />
              <span className="flex-1 t-body text-[#0a0a0a] text-left truncate">
                {inputText || <span className="text-[#a1a1a1]">Ask anything</span>}
              </span>
            </div>
            <button
              onClick={handleSend}
              disabled={!canSend}
              className="bg-info rounded-full p-2 flex items-center justify-center shrink-0 disabled:opacity-40"
            >
              <Icon name="arrow_upward" size={24} className="text-white" />
            </button>
          </div>

          {/* Dark keyboard — in flow */}
          <DarkKeyboardMock />
        </motion.div>
      </div>
    </motion.div>
  )
}

/* ─── iOS Keyboard Mock ─────────────────────────────────────────────── */

function KeyboardMock({ delay = 0, noAnim = false, zIndex = 25 }) {
  const rows = [
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l'],
    ['z','x','c','v','b','n','m'],
  ]

  const K = ({ label, className = '' }) => (
    <button className={`h-10.75 bg-white rounded-[10px] flex items-center justify-center text-[17px] text-content-primary shadow-[0_1px_0_rgba(0,0,0,0.3)] ${className}`}>
      {label}
    </button>
  )

  return (
    <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ zIndex }}>
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={noAnim ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 30, delay }}
        className="bg-[#E4E5EA] rounded-t-3xl"
      >
        <div className="flex items-center border-b border-[#C2C4CA] py-2">
          {['"The"', 'the', 'to'].map((s, i) => (
            <div key={s} className={`flex-1 flex items-center justify-center py-1 ${i < 2 ? 'border-r border-[#C2C4CA]' : ''}`}>
              <span className="text-[15px] text-content-primary">{s}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2.75 px-2 py-3">
          <div className="flex justify-center gap-1.5">
            {rows[0].map(k => <K key={k} label={k} className="w-9.25" />)}
          </div>
          <div className="flex justify-center gap-1.5">
            {rows[1].map(k => <K key={k} label={k} className="w-9.25" />)}
          </div>
          <div className="flex justify-center gap-1.5">
            <K label="⇧" className="w-11 bg-[#C9CCCE]!" />
            {rows[2].map(k => <K key={k} label={k} className="w-9.25" />)}
            <K label="⌫" className="w-11 bg-[#C9CCCE]!" />
          </div>
          <div className="flex gap-1.5">
            <K label="123" className="w-11 bg-[#C9CCCE]!" />
            <button className="flex-1 h-10.75 bg-white rounded-[10px] text-[17px] text-content-primary shadow-[0_1px_0_rgba(0,0,0,0.3)]">space</button>
            <button className="w-23 h-10.75 bg-[#007AFF] rounded-[10px] flex items-center justify-center shadow-[0_1px_0_rgba(0,0,0,0.3)]">
              <Icon name="keyboard_return" size={18} className="text-white" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between px-9 pt-2 pb-8">
          <Icon name="emoji_emotions" size={26} className="text-content-secondary" />
          <Icon name="mic" size={22} className="text-content-secondary" />
        </div>
      </motion.div>
    </div>
  )
}

/* ─── Search Screen ─────────────────────────────────────────────────── */

const RECENT_CARDS = [
  { id: 1, label: 'Shopee spending this month', icon: 'tri'     },
  { id: 2, label: 'Auto Savings',               icon: 'savings' },
  { id: 3, label: 'Can I afford an iPhone 17?', icon: 'tri'     },
]

const SUGGESTED_STOCKS = [
  { id: 1, icon: 'candlestick_chart', ticker: 'TCB',  subtitle: 'Equities',          price: '34.56', change: '+2.24%'  },
  { id: 2, icon: 'candlestick_chart', ticker: 'VIC',  subtitle: 'Equities',          price: '220',   change: '+2.24%'  },
  { id: 3, icon: 'bar_chart',         ticker: 'TCBF', subtitle: 'Techcom Bond Fund', price: null,    change: '+20.49%' },
]

const FEATURE_RESULTS = [
  { id: 1, icon: 'credit_card_off', label: 'Cardless withdrawal' },
  { id: 2, icon: 'credit_card',     label: 'Credit card application' },
]

const TRI_SUGGESTIONS = [
  { id: 1, label: 'Freeze my card ...',        message: 'Freeze my card' },
  { id: 2, label: 'Which card suits me best?', message: 'Which card suits me best?' },
  { id: 3, label: 'Estimate my credit limit',  message: 'Estimate my credit limit' },
]

function HighlightMatch({ text, query }) {
  if (!query) return <span>{text}</span>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <span>{text}</span>
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-info">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  )
}

function SearchResultDivider() {
  return (
    <div className="pl-[75px] pr-4 w-full">
      <div className="bg-[#737373] h-px opacity-10 rounded-full w-full" />
    </div>
  )
}

function DarkKeyboardMock() {
  const rows = [
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l'],
    ['z','x','c','v','b','n','m'],
  ]
  const DK = ({ label, className = '' }) => (
    <button className={`h-11 bg-[#3a3a3c] rounded-[10px] flex items-center justify-center text-[17px] text-white shadow-[0_1px_0_rgba(0,0,0,0.5)] ${className}`}>
      {label}
    </button>
  )
  return (
    <div className="w-full shrink-0">
      <div className="bg-[#1c1c1e] rounded-t-4xl rounded-b-[60px]">
        <div className="flex items-center border-b border-[#2c2c2e] py-2">
          {['"The"', 'the', 'to'].map((s, i) => (
            <div key={s} className={`flex-1 flex items-center justify-center py-1 ${i < 2 ? 'border-r border-[#2c2c2e]' : ''}`}>
              <span className="text-[15px] text-white">{s}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2.75 px-2 py-3">
          <div className="flex justify-center gap-1.5">
            {rows[0].map(k => <DK key={k} label={k} className="w-9.25" />)}
          </div>
          <div className="flex justify-center gap-1.5">
            {rows[1].map(k => <DK key={k} label={k} className="w-9.25" />)}
          </div>
          <div className="flex justify-center gap-1.5">
            <DK label="⇧" className="w-11 bg-[#636366]!" />
            {rows[2].map(k => <DK key={k} label={k} className="w-9.25" />)}
            <DK label="⌫" className="w-11 bg-[#636366]!" />
          </div>
          <div className="flex gap-1.5">
            <DK label="123" className="w-11 bg-[#636366]!" />
            <button className="flex-1 h-11 bg-[#3a3a3c] rounded-[10px] text-[17px] text-white shadow-[0_1px_0_rgba(0,0,0,0.5)]">space</button>
            <button className="w-23 h-11 bg-[#007AFF] rounded-[10px] flex items-center justify-center shadow-[0_1px_0_rgba(0,0,0,0.5)]">
              <Icon name="keyboard_return" size={18} className="text-white" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between px-9 pt-2 pb-8">
          <Icon name="emoji_emotions" size={26} className="text-[#636366]" />
          <Icon name="mic" size={22} className="text-[#636366]" />
        </div>
      </div>
    </div>
  )
}

export function SearchScreen({ onClose, onOpenChat, autoType = false, light = false }) {
  const SLIDE = { type: 'spring', stiffness: 300, damping: 32 }
  const TARGET = 'Card'
  const [typing, setTyping] = useState(false)
  const [typedText, setTypedText] = useState('')

  // Type "Card" letter by letter
  const startTyping = () => {
    if (typing) return
    setTyping(true)
    let i = 0
    const id = setInterval(() => {
      i++
      setTypedText(TARGET.slice(0, i))
      if (i >= TARGET.length) clearInterval(id)
    }, 120)
  }

  const clearTyping = () => { setTyping(false); setTypedText('') }

  useEffect(() => {
    if (!autoType) return
    const t = setTimeout(startTyping, 800)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoType])

  const iconPillBg = light ? 'bg-[#f5f5f5]' : 'bg-[#262626]'
  const iconPillFg = light ? 'text-[#0a0a0a]' : 'text-[#d4d4d4]'
  const primaryText = light ? 'text-[#0a0a0a]' : 'text-white'

  return (
    <motion.div
      initial={{ x: 448 }} animate={{ x: 0 }} exit={{ x: 448 }}
      transition={SLIDE}
      className={`absolute inset-0 z-80 rounded-[64px] overflow-hidden flex flex-col ${light ? 'bg-white' : 'bg-black'}`}
    >
      {/* Dotted pattern background — dark theme only */}
      {!light && (
        <Image src="/background-dark.png" alt="" fill unoptimized className="object-cover rounded-[64px]" />
      )}

      {/* Status bar */}
      <div className="absolute top-0 left-0 right-0 z-70">
        <StatusBar dark={light} />
      </div>

      {/* Layout column */}
      <div className="absolute inset-0 flex flex-col gap-2 px-1 pt-1 pb-1 pb-0">

        {/* Main content card */}
        <div className={`relative flex-1 backdrop-blur-lg border rounded-[60px] overflow-hidden flex flex-col min-h-0 ${
          light ? 'bg-white border-[#f0f0f0]' : 'bg-[#0a0a0a] border-[#171717]'
        }`}>

          {/* Header */}
          <div className="flex items-center px-4 pb-3 pt-16 shrink-0 w-full">
            <p className={`text-[24px] font-bold leading-8 tracking-[0.48px] ${primaryText}`}>
              {typing ? <>Result of &ldquo;{typedText}&rdquo;</> : 'Search'}
            </p>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {typing ? (
              /* ─── Results of "Card" ─── */
              <motion.div
                key="results"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex-1 flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden min-h-0"
              >
                {/* Features label */}
                <div className="flex items-center p-4 shrink-0 text-[14px] font-medium leading-5">
                  <span className="text-[#737373]">Features</span>
                </div>

                {/* Feature results */}
                {FEATURE_RESULTS.map((item) => (
                  <div key={item.id}>
                    <div className="flex gap-4 items-center px-4 py-3">
                      <div className={`p-2.5 rounded-full flex items-center justify-center shrink-0 ${iconPillBg}`}>
                        <Icon name={item.icon} size={24} className={iconPillFg} />
                      </div>
                      <p className={`flex-1 text-[14px] font-medium leading-5 min-w-0 ${primaryText}`}>
                        <HighlightMatch text={item.label} query={typedText} />
                      </p>
                      <Icon name="chevron_right" size={20} className="text-[#737373] shrink-0" />
                    </div>
                    <SearchResultDivider />
                  </div>
                ))}

                {/* Talk to Trí header */}
                <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0 text-[14px] font-medium leading-5">
                  <span className="text-[#737373]">Talk to Trí</span>
                  <span className={primaryText}>Open conversation</span>
                </div>

                {/* Trí suggestions */}
                {TRI_SUGGESTIONS.map((item, i) => (
                  <div key={item.id}>
                    <button
                      onClick={() => onOpenChat?.(item.message)}
                      className="flex gap-4 items-center px-4 py-3 w-full text-left"
                    >
                      <div className={`p-2.5 rounded-full flex items-center justify-center shrink-0 ${iconPillBg}`}>
                        <Image src="/tri.png" alt="" width={24} height={24} />
                      </div>
                      <span className={`flex-1 text-[14px] font-medium leading-5 ${primaryText}`}>{item.label}</span>
                      <Icon name="chevron_right" size={20} className="text-[#737373] shrink-0" />
                    </button>
                    {i < TRI_SUGGESTIONS.length - 1 && <SearchResultDivider />}
                  </div>
                ))}
              </motion.div>
            ) : (
              /* ─── Default: recent + suggestions ─── */
              <motion.div
                key="default"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex-1 flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden min-h-0"
              >
                {/* Recent header */}
                <div className="flex items-center justify-between p-4 shrink-0 text-[14px] font-medium leading-5">
                  <div className="flex items-center gap-2">
                    <span className="text-[#737373]">Recent</span>
                    <span className={primaryText}>Clear</span>
                  </div>
                  <span className="text-info">View All</span>
                </div>

                {/* Recent cards — horizontal row */}
                <div className="flex gap-2 items-stretch px-4 overflow-x-auto [&::-webkit-scrollbar]:hidden shrink-0">
                  {RECENT_CARDS.map(card => (
                    <div key={card.id} className={`shrink-0 w-[156px] rounded-[32px] px-4 py-4 flex flex-col gap-1 ${light ? 'bg-[#f5f5f5]' : 'bg-[#171717]'}`}>
                      <div className="flex items-start justify-between w-full">
                        <div className={`p-2.5 rounded-full flex items-center justify-center ${iconPillBg}`}>
                          {card.icon === 'tri'
                            ? <Image src="/tri.png" alt="" width={24} height={24} />
                            : <Icon name={card.icon} size={24} className={iconPillFg} />
                          }
                        </div>
                        <button className="mt-0.5">
                          <Icon name="close" size={20} className="text-[#737373]" />
                        </button>
                      </div>
                      <p className={`text-[14px] font-medium leading-5 mt-auto ${light ? 'text-[#0a0a0a]' : 'text-[#d4d4d4]'}`}>{card.label}</p>
                    </div>
                  ))}
                </div>

                {/* AI suggestion label */}
                <div className="flex items-center gap-1 px-4 pt-4 pb-2 shrink-0 text-[14px] font-medium leading-5 whitespace-nowrap">
                  <span className="text-[#737373]">Because you recently asked about</span>
                  <span className={primaryText}>&ldquo;Conservative&rdquo;</span>
                </div>

                {/* Stock list */}
                {SUGGESTED_STOCKS.map((stock, i) => (
                  <div key={stock.id}>
                    <div className="flex gap-4 items-center px-4 py-3">
                      <div className={`p-2.5 rounded-full flex items-center justify-center shrink-0 ${iconPillBg}`}>
                        <Icon name={stock.icon} size={24} className={iconPillFg} />
                      </div>
                      <div className="flex-1 flex flex-col gap-1 min-w-0">
                        <p className={`text-[14px] font-medium leading-5 ${primaryText}`}>{stock.ticker}</p>
                        <p className="text-[12px] font-medium text-[#737373] leading-4">{stock.subtitle}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0 whitespace-nowrap">
                        {stock.price
                          ? <>
                              <p className={`text-[14px] font-medium leading-5 tabular-nums ${primaryText}`}>{stock.price}</p>
                              <p className="text-[12px] font-medium text-success leading-4 tabular-nums">{stock.change}</p>
                            </>
                          : <p className="text-[14px] font-medium text-success leading-5 tabular-nums">{stock.change}</p>
                        }
                      </div>
                    </div>
                    {i < SUGGESTED_STOCKS.length - 1 && <SearchResultDivider />}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom fade */}
          <div className={`absolute bottom-0 left-0 right-0 h-14 pointer-events-none rounded-b-[60px] ${
            light ? 'bg-linear-to-t from-white to-transparent' : 'bg-linear-to-t from-[#0a0a0a] to-transparent'
          }`} />
        </div>

        {/* Footer + keyboard — slide up after screen lands */}
        <motion.div
          initial={{ y: 480 }} animate={{ y: 0 }}
          transition={{ ...SLIDE, delay: 0.28 }}
          className="flex flex-col gap-2 shrink-0"
        >
          {/* Search field + close */}
          <div className="flex gap-2 items-center px-3 w-full">
            <div
              role="button"
              onClick={startTyping}
              className={`flex-1 backdrop-blur-[4px] border rounded-[60px] pl-6 pr-4 py-4 flex items-center gap-4 min-w-0 cursor-text ${
                light ? 'bg-white border-[#e5e5e5]' : 'bg-[#fafafa] border-[#fafafa]'
              }`}
            >
              <div className="flex-1 flex items-center gap-1 min-w-0">
                {typing ? (
                  <>
                    <span className="text-[16px] leading-6 whitespace-nowrap text-[#0a0a0a]">{typedText}</span>
                    <BlinkingCursor />
                  </>
                ) : (
                  <>
                    <BlinkingCursor />
                    <span className="flex-1 text-[16px] text-[#a1a1a1] leading-6">Search</span>
                  </>
                )}
              </div>
              <AnimatePresence>
                {typing && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.15 }}
                    onClick={e => { e.stopPropagation(); clearTyping() }}
                    className={`p-1 rounded-full flex items-center justify-center shrink-0 ${light ? 'bg-[#404040]' : 'bg-[#d4d4d4]'}`}
                  >
                    <Icon name="close" size={16} className={light ? 'text-white' : 'text-[#0a0a0a]'} />
                  </motion.button>
                )}
              </AnimatePresence>
              <Icon name="search" size={24} className="text-[#0a0a0a] shrink-0" />
            </div>
            <button
              onClick={onClose}
              className={`rounded-[60px] px-6 py-4 flex items-center justify-center shrink-0 ${light ? 'bg-[#0a0a0a]' : 'bg-[#fafafa]'}`}
            >
              <Icon name="close" size={24} className={light ? 'text-white' : 'text-black'} />
            </button>
          </div>

          {/* Dark keyboard — in flow */}
          <DarkKeyboardMock />
        </motion.div>
      </div>
    </motion.div>
  )
}

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function HomeScreen({
  overlayOpen: extOverlay,
  onOverlayClose: extClose,
  balanceHovered = false,
  transactionHovered = false,
  triOpen: extTri,
  onTriClose: extTriClose,
  triHovered = false,
  defaultTab = 'home',
  defaultTheme = 'dark',
} = {}) {
  const [theme,               setTheme]               = useState(defaultTheme)
  const [internalOverlay,     setInternalOverlay]     = useState(false)
  const [showTriScreen,       setShowTriScreen]       = useState(false)
  const [keyboardOpen,        setKeyboardOpen]        = useState(false)
  const [showSearch,          setShowSearch]          = useState(false)
  const [navActive,           setNavActive]           = useState(defaultTab)
  const [wealthAnalyzeOpen,   setWealthAnalyzeOpen]   = useState(false)
  const [wealthInvestOpen,    setWealthInvestOpen]    = useState(false)
  const [menuOpen,            setMenuOpen]            = useState(false)
  const [showInsightChat,     setShowInsightChat]     = useState(false)
  const [insightAdded,        setInsightAdded]        = useState(false)

  // Suggestion taps / Ask TRÍ send used to open a scripted demo chat (TriChatScreen);
  // that screen has been removed, so these now just close back to the current screen.
  const closeTriFlow = () => {
    setShowSearch(false)
    setShowTriScreen(false)
    setKeyboardOpen(false)
  }

  const showOverlay     = extOverlay     !== undefined ? extOverlay     : internalOverlay
  const showTri         = extTri         !== undefined ? extTri         : showTriScreen
  const light           = theme === 'light'

  const openOverlay      = () => { if (extOverlay === undefined) setInternalOverlay(true) }
  const closeOverlay     = () => { extClose            ? extClose()            : setInternalOverlay(false) }

  return (
    <div className={`w-[440px] h-[956px] overflow-hidden relative rounded-[64px] ${light ? 'bg-white' : 'bg-black'}`}>

      {/* Dotted pattern background — dark theme only */}
      {!light && (
        <Image src="/background-dark.png" alt="" fill priority unoptimized className="object-cover rounded-[64px]" />
      )}

      {/* Slideable home content — exits left when search opens */}
      <motion.div
        className="absolute inset-0"
        animate={{ x: showSearch || showTri || showInsightChat ? -448 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
      >

      {/* Absolute status bar — always on top */}
      <div className="absolute top-0 left-0 right-0 z-70">
        <StatusBar dark={light || showTri || showOverlay} />
      </div>

      {/* Main layout column */}
      <LayoutGroup id="home-menu">
      <div className="absolute inset-0 flex flex-col overflow-hidden">

        {/* Outer padding container */}
        <div className="flex-1 flex flex-col gap-2 px-1 pt-1 pb-8 min-h-0">

          {/* Inner dark card — split into header + rest so the Insight overlay can
              separate them: header exits up, rest sinks to the bottom (172px visible) */}
          <motion.div
            initial={false}
            animate={{
              y: showOverlay ? -160 : menuOpen ? -140 : 0,
              opacity: menuOpen ? 0.5 : 1,
              borderBottomLeftRadius: showOverlay ? 60 : 0,
              borderBottomRightRadius: showOverlay ? 60 : 0,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className={`backdrop-blur-lg border border-b-0 rounded-t-[60px] shrink-0 ${
              light ? 'bg-white border-[#f0f0f0]' : 'bg-[#0a0a0a] border-[#171717]'
            }`}
          >
            <TopNav onOpenSearch={() => setShowSearch(true)} light={light} />
          </motion.div>
          <motion.div
            initial={false}
            animate={{
              y: showOverlay ? 649 : menuOpen ? -140 : 0,
              opacity: menuOpen ? 0.5 : 1,
              paddingTop: showOverlay ? 24 : 0,
              borderTopLeftRadius: showOverlay ? 60 : 0,
              borderTopRightRadius: showOverlay ? 60 : 0,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            style={{ zIndex: showOverlay ? 20 : 'auto' }}
            className={`flex-1 -mt-2 backdrop-blur-lg border border-t-0 rounded-b-[60px] flex flex-col justify-end overflow-hidden min-h-0 ${
              light ? 'bg-white border-[#f0f0f0]' : 'bg-[#0a0a0a] border-[#171717]'
            }`}
          >
            <BalanceSection onOpenOverlay={openOverlay} light={light} />
            <BannerAndActions light={light} />
            <TransactionSection
              menuOpen={menuOpen}
              light={light}
            />
          </motion.div>

          {/* Push spacer — compresses the card; the whole page (header + card)
              also translates up 140px, so the spacer covers the remainder */}
          <motion.div
            initial={false}
            animate={{ height: menuOpen ? 560 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30, delay: menuOpen ? 0.05 : 0 }}
            className="shrink-0 -mt-2"
          />

          {/* Bottom bar */}
          <BottomBar
            triMode={showTri}
            onOpenTri={() => setShowTriScreen(true)}
            onCloseTri={() => { setShowTriScreen(false); setKeyboardOpen(false) }}
            keyboardOpen={keyboardOpen}
            onOpenKeyboard={() => setKeyboardOpen(true)}
            onCloseKeyboard={() => setKeyboardOpen(false)}
            triHovered={triHovered}
            onSend={closeTriFlow}
            menuOpen={menuOpen}
            onOpenMenu={() => setMenuOpen(true)}
            light={light}
          />
        </div>

        <motion.div
          initial={false}
          animate={{ opacity: menuOpen ? 1 : 0 }}
          transition={{ duration: 0.18 }}
          className="absolute inset-0 bg-black/60 rounded-[64px] pointer-events-none z-30"
        />
      </div>

      {/* Menu tap-to-close area — sits on the compressed card */}
      {menuOpen && (
        <div
          className="absolute inset-x-1 top-1 z-40"
          style={{ height: 148 }}
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Menu sheet — the pill morphs into this */}
      <AnimatePresence>
        {menuOpen && (
          <MenuSheet
            onClose={() => { setMenuOpen(false); setNavActive('home') }}
            onNavigateWealth={() => { setMenuOpen(false); setNavActive('investment') }}
            onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            light={light}
            activeNav={navActive}
          />
        )}
      </AnimatePresence>

      {/* Menu dots — single element that tracks the pill icon slot when closed
          (pill at x16 + px-8 pad = 48) and the sheet footer slot when open
          (sheet at x4 + px-8 pad = 36) */}
      {!showTri && !showSearch && !showOverlay && !showInsightChat && !wealthInvestOpen && (
        <motion.button
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen(v => !v)}
          className="absolute z-60"
          initial={false}
          animate={{ left: menuOpen ? 36 : 48 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ bottom: 52 }}
        >
          <MenuToggleIcon open={menuOpen} light={light} />
        </motion.button>
      )}
      </LayoutGroup>

      {/* Keyboard — TRÍ mode before chat opens */}
      <AnimatePresence>
        {showTri && keyboardOpen && (
          <KeyboardMock key="keyboard" zIndex={25} />
        )}
      </AnimatePresence>

      {/* Balance AI overlay */}
      <AnimatePresence>
        {(showOverlay || balanceHovered) && (
          <BalanceOverlay
            onClose={closeOverlay}
            onAddInsight={() => { closeOverlay(); setShowInsightChat(true) }}
            showCard={showOverlay}
            light={light}
            insightAdded={insightAdded}
          />
        )}
      </AnimatePresence>

      {/* Wealth screen */}
      <AnimatePresence>
        {navActive === 'investment' && (
          <div className="absolute inset-0 overflow-hidden" style={{ zIndex: (wealthAnalyzeOpen || wealthInvestOpen) ? 40 : 20 }}>
            <WealthScreen
              onNavigate={(tab) => setNavActive(tab)}
              embedded={true}
              onOpenSearch={() => setShowSearch(true)}
              onAnalyzeOpen={() => setWealthAnalyzeOpen(true)}
              onAnalyzeClose={() => setWealthAnalyzeOpen(false)}
              onInvestOpen={() => setWealthInvestOpen(true)}
              onInvestClose={() => setWealthInvestOpen(false)}
              menuOpen={menuOpen}
              onOpenMenu={() => setMenuOpen(true)}
              light={light}
            />
          </div>
        )}
      </AnimatePresence>

      </motion.div>{/* end slideable home content */}

      {/* TRÍ screen — slides in from the right, same as Search */}
      <AnimatePresence>
        {showTri && (
          <TriScreen
            onClose={() => { setShowTriScreen(false); extTriClose?.() }}
            onOpenSearch={() => setShowSearch(true)}
            onOpenChat={closeTriFlow}
            light={light}
          />
        )}
      </AnimatePresence>

      {/* Search screen */}
      <AnimatePresence>
        {showSearch && <SearchScreen onClose={() => setShowSearch(false)} onOpenChat={closeTriFlow} light={light} />}
      </AnimatePresence>

      {/* Insight chat screen — "Add new insight" scripted conversation */}
      <AnimatePresence>
        {showInsightChat && (
          <InsightChatScreen
            onClose={() => setShowInsightChat(false)}
            onOpenSearch={() => setShowSearch(true)}
            onViewInsight={() => { setInsightAdded(true); setShowInsightChat(false); openOverlay() }}
            light={light}
          />
        )}
      </AnimatePresence>


      {/* Backdrop for TRÍ hover preview */}
      <AnimatePresence>
        {triHovered && !showTri && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-20 pointer-events-none"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-[64px]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
