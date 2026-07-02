'use client'

import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'

const WealthScreen = dynamic(() => import('@/app/screens/wealth/page'), { ssr: false })

/* ─── Data ─────────────────────────────────────────────────────────── */

const FILTERS = ['All', 'Income', 'Transfer', 'Card Payment', 'Withdrawal']

const TRANSACTIONS = [
  {
    date: 'Friday, 26 Jun 2026',
    items: [
      { id: 1, name: 'Shopee Pay',    type: 'Card Payment', time: '07:45', amount: '-50,000đ',     dir: 'out' },
      { id: 2, name: 'Hoang Thu Ha',  type: 'Income',       time: '07:00', amount: '+20,000,000đ', dir: 'in'  },
    ],
  },
  {
    date: 'Thursday, 25 Jun 2026',
    items: [
      { id: 3, name: 'HKD Mai Khoi', type: 'Transfer',     time: '07:00', amount: '-50,000đ', dir: 'out' },
      { id: 4, name: 'Starbucks',    type: 'Card Payment', time: '07:00', amount: '-50,000đ', dir: 'out' },
      { id: 5, name: 'Shopee Pay',   type: 'Card Payment', time: '07:00', amount: '-50,000đ', dir: 'out' },
      { id: 6, name: 'Sarah Davies', type: 'Transfer',     time: '07:00', amount: '-50,000đ', dir: 'out' },
    ],
  },
]

/* ─── Micro-components ──────────────────────────────────────────────── */

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

function StatusBar({ dark = false }) {
  const imgStyle = dark ? { filter: 'invert(1)' } : {}
  return (
    <div className="flex items-center justify-between px-14 pt-3.5 pb-1 shrink-0">
      <span className={`text-[15px] font-semibold ${dark ? 'text-content-primary' : 'text-content-inverse'}`}>9:41</span>
      <div className="flex items-center gap-1">
        <Image src="/cellular.svg" alt="" width={16} height={16} style={imgStyle} />
        <Image src="/wifi.svg"     alt="" width={16} height={16} style={imgStyle} />
        <Image src="/battery.svg"  alt="" width={16} height={16} style={imgStyle} />
      </div>
    </div>
  )
}

function TopNav({ onOpenSearch }) {
  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
      {/* Avatar */}
      <div className="size-12 rounded-full overflow-hidden shrink-0 relative">
        <Image src="/avatar.png" alt="QA" fill className="object-cover" />
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button className="size-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
          <Icon name="notifications" size={24} className="text-content-inverse" />
        </button>
        <button
          onClick={onOpenSearch}
          className="size-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
        >
          <Icon name="search" size={24} className="text-content-inverse" />
        </button>
      </div>
    </div>
  )
}

function BalanceSection({ onOpenOverlay, overlayOpen, onCloseOverlay, cardOpen }) {
  const [hidden, setHidden] = useState(false)

  return (
    <div className="px-4 pt-8 pb-24 flex flex-col gap-1">
      {/* Label + amount — elevated above overlay when open */}
      <div
        className={`flex flex-col gap-1 ${overlayOpen ? 'relative z-60' : ''}`}
        onClick={overlayOpen ? onCloseOverlay : undefined}
      >
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-medium text-content-inverse">Current Balance</span>
          <button onClick={() => setHidden(v => !v)} className="flex items-center">
            <Icon
              name={hidden ? 'visibility_off' : 'visibility'}
              size={20}
              className="text-content-inverse"
            />
          </button>
        </div>
        <p className="text-[32px] font-bold leading-10 text-content-inverse font-sans tabular-nums">
          {hidden ? '••••••••••' : '90,008,897đ'}
        </p>
      </div>

      <button
        className={`flex items-center gap-2 bg-white/30 backdrop-blur-sm rounded-full px-3 py-2 self-start ${overlayOpen ? 'relative z-60' : ''}`}
        onClick={(e) => { e.stopPropagation(); onOpenOverlay() }}
      >
        <Image src="/tri.png" alt="" width={20} height={20} className="shrink-0" />
        <span className="text-[12px] text-content-inverse whitespace-nowrap">
          8.7 months of your normal spending
        </span>
        <motion.span
          animate={{ rotate: cardOpen ? 90 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="material-symbols-outlined leading-none select-none text-content-inverse"
          style={{ fontSize: 20 }}
        >
          arrow_right_alt
        </motion.span>
      </button>
    </div>
  )
}

function BalanceOverlay({ onClose, showCard = true }) {
  return (
    <>
      {/* Backdrop — always shown when overlay is mounted */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 z-50"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-[56px]" />
      </motion.div>

      {/* Card — only slides up on click (showCard = true) */}
      <AnimatePresence>
        {showCard && (
          <motion.div
            initial={{ y: 800 }}
            animate={{ y: 0 }}
            exit={{ y: 800 }}
            transition={{ type: 'spring', stiffness: 140, damping: 18 }}
            className="absolute inset-x-4 bottom-4 z-50"
            style={{ top: 271 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* AI insight card */}
            <div className="bg-surface rounded-4xl flex flex-col gap-4 p-4">

              {/* Insight rows */}
              <div className="bg-surface-raised rounded-3xl overflow-hidden">
                {/* Row 1 */}
                <div className="flex gap-4 items-start p-4">
                  <div className="size-12 rounded-full bg-surface-sunken flex items-center justify-center shrink-0">
                    <Icon name="attach_money" size={24} className="text-content-secondary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-md font-medium text-content-primary leading-6">83,000,000đ has remained</p>
                    <p className="text-[14px] text-content-muted leading-5">unused for over 4 months</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="pl-20 pr-4">
                  <div className="h-px bg-surface-overlay opacity-10 rounded-full" />
                </div>

                {/* Row 2 */}
                <div className="flex gap-4 items-start p-4">
                  <div className="size-12 rounded-full bg-surface-sunken flex items-center justify-center shrink-0">
                    <Icon name="payments" size={24} className="text-content-secondary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-md font-medium text-content-primary leading-6 whitespace-nowrap">20,000,000đ month salary</p>
                    <p className="text-[14px] text-content-muted leading-5">
                      consistently covers your regular spending and remaining instalments
                    </p>
                  </div>
                </div>
              </div>

              {/* Investable cash card */}
              <div className="bg-blue-500/8 rounded-3xl p-4 flex flex-col gap-1">
                <p className="text-md font-medium text-content-primary leading-6">Est. investable cash</p>
                <p className="text-[32px] font-bold leading-10 text-info font-sans tabular-nums">55 - 65Mđ</p>
                <p className="text-[14px] text-content-secondary leading-5">
                  Based on 12 months of cash flow, recurring income and remaining instalments.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-2">
                <button className="w-full flex items-center justify-center gap-1.5 border border-surface-overlay bg-surface-raised px-4 py-3 rounded-full">
                  <span className="text-[14px] font-medium text-content-primary">Create an investment plan</span>
                </button>
                <button onClick={onClose} className="w-full flex items-center justify-center gap-1.5 bg-surface-overlay px-4 py-3 rounded-full">
                  <Image src="/tri.png" alt="AI" width={20} height={20} />
                  <span className="text-[14px] font-medium text-content-inverse">Ask a follow-up</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function QuickActions() {
  const actions = [
    { icon: 'qr_code_scanner', label: 'Scan QR',  dark: true  },
    { icon: 'swap_horiz',      label: 'Transfer', dark: false },
    { icon: 'receipt_long',    label: 'Pay bills',dark: false },
    { icon: 'savings',         label: 'Savings',  dark: false },
  ]

  return (
    <div className="flex gap-1">
      {actions.map(({ icon, label, dark }) => (
        <button
          key={label}
          className={`flex-1 flex flex-col gap-2 px-4 py-3 rounded-3xl shadow-xs ${
            dark
              ? 'bg-surface-overlay'
              : 'bg-surface-raised'
          }`}
        >
          <Icon
            name={icon}
            size={24}
            className={dark ? 'text-content-inverse' : 'text-content-primary'}
          />
          <span
            className={`text-[12px] leading-4 font-sans whitespace-nowrap ${
              dark ? 'text-content-inverse' : 'text-content-primary'
            }`}
          >
            {label}
          </span>
        </button>
      ))}

      {/* More button */}
      <button className="flex flex-col gap-2 items-center justify-center p-3 rounded-3xl shadow-xs bg-surface-raised self-stretch">
        <Icon name="arrow_right_alt" size={24} className="text-content-primary" />
      </button>
    </div>
  )
}

function PromoCards() {
  return (
    <div className="flex gap-2.5 h-40">
      {/* Ride deals card */}
      <div className="flex-1 rounded-3xl bg-blue-200 p-4 flex flex-col justify-between overflow-hidden relative">
        <img src="/car.png" alt="" className="absolute pointer-events-none" style={{ left: 118, top: 20, width: 231, height: 231 }} />
        <div className="relative z-10">
          <p className="text-[14px] font-medium text-blue-950">Ride deals</p>
          <p className="text-md font-medium text-blue-950 leading-6">
            Up to 30K off your rides! (Grab, Be...)
          </p>
        </div>
        <button className="relative z-10 self-start bg-blue-950 text-content-inverse text-[12px] px-3 py-2 rounded-full">
          Receive now
        </button>
      </div>

      {/* Gold card */}
      <div className="w-[120px] rounded-3xl bg-amber-100 p-4 flex flex-col justify-between overflow-hidden relative shrink-0">
        {/* Gold coins */}
        <div className="absolute left-[55px] top-[93px] size-[85px]">
          <Image src="/gold.png" alt="" fill className="object-cover object-bottom" />
        </div>
        <div className="absolute left-[66px] top-[59px] size-[51px] flex items-center justify-center">
          <div className="-rotate-[34deg] size-[37px] relative">
            <Image src="/gold.png" alt="" fill className="object-cover object-bottom" />
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-[14px] font-medium text-content-primary">Gold price increased</p>
          <p className="text-[20px] font-normal leading-7 text-content-primary">4%</p>
        </div>
        <button className="relative z-10 w-full bg-amber-950 text-content-inverse text-[12px] px-3 py-2 rounded-full text-center">
          Take a look
        </button>
      </div>
    </div>
  )
}

function TransactionItem({ item, isLast }) {
  const isIncome = item.dir === 'in'

  return (
    <>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="size-12 rounded-full bg-surface-sunken flex items-center justify-center shrink-0">
            <Icon
              name={isIncome ? 'arrow_downward' : 'arrow_upward'}
              size={24}
              className="text-content-secondary"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-1">
            <p className="text-md font-medium text-content-primary whitespace-nowrap">{item.name}</p>
            <div className="flex items-center gap-1 text-[14px] text-content-secondary">
              <span>{item.type}</span>
              <span>·</span>
              <span>{item.time}</span>
            </div>
          </div>
        </div>

        {/* Amount */}
        <p className={`text-md font-medium whitespace-nowrap font-sans tabular-nums ${
          isIncome ? 'text-success' : 'text-content-primary'
        }`}>
          {item.amount}
        </p>
      </div>

      {/* Divider */}
      {!isLast && (
        <div className="pl-20 pr-4">
          <div className="h-px bg-surface-overlay opacity-10 rounded-full" />
        </div>
      )}
    </>
  )
}

function TransactionOverlay({ onClose, showCard = true }) {
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
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 z-50"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-[56px]" />
      </motion.div>

      {/* Card — only slides up on click */}
      <AnimatePresence>
        {showCard && (
          <motion.div
            initial={{ y: 800 }}
            animate={{ y: 0 }}
            exit={{ y: 800 }}
            transition={{ type: 'spring', stiffness: 140, damping: 18 }}
            className="absolute inset-x-4 bottom-10 z-60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-surface rounded-4xl flex flex-col gap-4 p-4">

              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="text-[24px] font-bold text-content-primary leading-8">Analyze</span>
                <button
                  onClick={onClose}
                  className="size-10 bg-surface-sunken rounded-full flex items-center justify-center shrink-0"
                >
                  <Icon name="close" size={20} className="text-content-secondary" />
                </button>
              </div>

              {/* AI insight */}
              <div className="bg-amber-50 rounded-3xl p-4 flex flex-col gap-1">
                <p className="text-[13px] font-medium text-content-secondary leading-5">You overspent</p>
                <p className="text-[28px] font-bold text-amber-500 leading-9">2Md on coffee</p>
                <p className="text-[13px] text-content-secondary leading-5">
                  Your coffee spending has increased 18% this month, mainly after payday.
                </p>
              </div>

              {/* Spending breakdown */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between pb-3">
                  <span className="text-[14px] font-semibold text-content-primary leading-5">Spending</span>
                  <span className="text-[14px] font-medium text-info leading-5">Define new one</span>
                </div>
                {spendingRows.map(({ label, amount }) => (
                  <div key={label}>
                    <div className="h-px bg-border-default" />
                    <div className="flex items-center justify-between py-3">
                      <span className="text-[13px] text-content-muted leading-5">{label}</span>
                      <span className="text-[13px] font-medium text-danger leading-5 shrink-0 ml-2">{amount}</span>
                    </div>
                  </div>
                ))}
                {/* Info note */}
                <div className="bg-info-subtle rounded-2xl p-3 flex items-start gap-2 mt-1">
                  <Icon name="info" size={18} className="text-info shrink-0 mt-px" />
                  <p className="text-[12px] text-info leading-4">
                    The categories is being created by TRÍ. You can add TRÍ to add more or remove the wrong one.
                  </p>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col gap-2">
                {suggestions.map(text => (
                  <button key={text} className="w-full flex items-center justify-center border border-border-strong bg-surface-raised px-4 py-3 rounded-full">
                    <span className="text-[14px] font-medium text-content-primary">{text}</span>
                  </button>
                ))}
                <button onClick={onClose} className="w-full flex items-center justify-center gap-2 bg-surface-overlay px-4 py-3 rounded-full">
                  <Image src="/tri.png" alt="AI" width={20} height={20} />
                  <span className="text-[14px] font-medium text-content-inverse">Ask a follow-up</span>
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function TransactionSection({ activeFilter, setActiveFilter, onOpenInsights, transactionHovered }) {
  const filterRowRef = useRef(null)
  const filterRefs   = useRef({})
  const [filterPill, setFilterPill] = useState(null)

  useLayoutEffect(() => {
    const el  = filterRefs.current[activeFilter]
    const row = filterRowRef.current
    if (!el || !row) return
    setFilterPill({ left: el.offsetLeft, width: el.offsetWidth })
  }, [activeFilter])

  return (
    <div className="flex flex-col gap-3 px-4 py-2 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-md font-semibold text-content-primary">Transaction History</p>
        <button
          onClick={onOpenInsights}
          className={`flex items-center gap-2 border border-border-default bg-surface-sunken px-3 py-2 rounded-full ${transactionHovered ? 'relative z-55' : ''}`}
        >
          <Image src="/tri.png" alt="" width={20} height={20} />
          <span className="text-[14px] font-medium text-content-primary">AI insights</span>
        </button>
      </div>

      {/* Filters */}
      <div ref={filterRowRef} className="relative flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filterPill && (
          <motion.div
            className="absolute top-0 bottom-0 bg-surface-raised border-2 border-surface-overlay rounded-full"
            initial={false}
            animate={{ left: filterPill.left, width: filterPill.width }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          />
        )}
        {FILTERS.map(f => (
          <button
            key={f}
            ref={el => { filterRefs.current[f] = el }}
            onClick={() => setActiveFilter(f)}
            className="relative flex-none px-3 py-2 rounded-full whitespace-nowrap"
          >
            <span className="relative z-10 t-label text-content-primary">{f}</span>
          </button>
        ))}
      </div>

      {/* Transaction list */}
      <div className="bg-surface-raised rounded-3xl overflow-hidden">
        {TRANSACTIONS.map(group => (
          <div key={group.date}>
            <div className="px-4 pt-4 pb-2">
              <p className="text-[14px] font-medium text-content-muted">{group.date}</p>
            </div>
            {group.items.map((item, i) => (
              <TransactionItem
                key={item.id}
                item={item}
                isLast={i === group.items.length - 1}
              />
            ))}
          </div>
        ))}
      </div>

      {/* See more */}
      <button className="w-full border border-surface-overlay text-[14px] font-medium text-content-primary py-3 rounded-full bg-surface-raised">
        See more
      </button>
    </div>
  )
}

function BottomNav({ onOpenTri, triMode, onCloseTri, keyboardOpen, onOpenKeyboard, onCloseKeyboard, triHovered, onSend, navActive = 'home', onNavChange }) {
  const tabs = [
    { id: 'home',       icon: null,          label: 'Home'       },
    { id: 'cards',      icon: 'credit_card', label: 'Cards'      },
    { id: 'rewards',    icon: 'redeem',      label: 'Rewards'    },
    { id: 'investment', icon: 'money_bag',   label: 'My wealth'  },
  ]
  const active    = navActive
  const setActive = onNavChange ?? (() => {})

  const navBarRef = useRef(null)
  const tabRefs   = useRef({})
  const [pill, setPill] = useState(null)

  useLayoutEffect(() => {
    const el = tabRefs.current[active]
    const bar = navBarRef.current
    if (!el || !bar) return
    setPill({ left: el.offsetLeft, width: el.offsetWidth })
  }, [active])

  const fade = { duration: 0.18, ease: 'easeInOut' }

  return (
    <div
      className="relative px-4 py-2 pb-8 backdrop-blur-[2px] shrink-0"
      style={{ background: 'linear-gradient(to bottom, rgba(249,250,251,0), #f9fafb)' }}
    >
      {/* Normal mode — full tab bar + AI circle */}
      <motion.div
        initial={false}
        animate={{ opacity: triMode ? 0 : 1, y: triMode ? 4 : 0, pointerEvents: triMode ? 'none' : 'auto' }}
        transition={fade}
        className="flex items-center gap-2"
      >
        <div ref={navBarRef} className="relative flex-1 flex items-center gap-1 p-1 bg-surface-raised border border-border-default rounded-full shadow-xl">
          {/* Sliding pill — plain div + CSS transition; no Framer Motion to avoid transform conflicts */}
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
                onClick={() => setActive(tab.id)}
                className={`relative flex items-center justify-center gap-1 px-4 py-3 rounded-full ${isActive ? 'flex-1' : ''}`}
              >
                <span className="relative z-10 flex items-center gap-1 overflow-hidden">
                  {tab.id === 'home'
                    ? <Image src="/logo.svg" alt="" width={24} height={24} className="shrink-0" />
                    : <Icon name={tab.icon} size={24} className={`shrink-0 ${isActive ? 'text-content-inverse' : 'text-content-secondary'}`} />
                  }
                  {/* label always collapses/expands instantly — no CSS width transition, so offsetWidth is always the settled value */}
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
        <button
          onClick={onOpenTri}
          className={`size-14 rounded-full bg-surface-raised border border-border-strong flex items-center justify-center shrink-0 transition-all duration-200 ${triHovered ? 'shadow-[0_0_0_4px_rgba(237,28,36,0.25),0_4px_24px_rgba(0,0,0,0.18)] scale-110' : 'shadow-xl'}`}
        >
          <div className="size-10 rounded-full flex items-center justify-center">
            <Image src="/tri.png" alt="AI" width={24} height={24} />
          </div>
        </button>
      </motion.div>

      {/* TRÍ base mode — logo pill + input bar */}
      <motion.div
        initial={false}
        animate={{
          opacity: triMode && !keyboardOpen ? 1 : 0,
          y: triMode && !keyboardOpen ? 0 : 4,
          pointerEvents: triMode && !keyboardOpen ? 'auto' : 'none',
        }}
        transition={{ ...fade, delay: triMode && !keyboardOpen ? 0.08 : 0 }}
        className="absolute inset-x-4 top-2 flex items-center gap-2"
      >
        <button
          onClick={onCloseTri}
          className="size-14 flex items-center justify-center bg-surface-raised border border-border-default rounded-full shadow-xl shrink-0"
        >
          {active === 'home'
            ? <Image src="/logo.svg" alt="" width={24} height={24} />
            : <Icon name={tabs.find(t => t.id === active)?.icon} size={24} className="text-content-secondary" />
          }
        </button>
        <button
          onClick={onOpenKeyboard}
          className="flex-1 flex items-center gap-2.5 bg-surface-raised border border-border-strong rounded-full pl-4 pr-2 py-2 shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_10px_10px_-5px_rgba(0,0,0,0.04)]"
        >
          <span className="flex-1 text-md text-content-muted leading-6 overflow-hidden whitespace-nowrap text-left">Ask TRÍ everything ...</span>
          <div className="p-2 rounded-full bg-surface-overlay flex items-center justify-center shrink-0">
            <Image src="/tri.png" alt="" width={24} height={24} />
          </div>
        </button>
      </motion.div>

      {/* TRÍ keyboard mode — full-width input + X close button */}
      <motion.div
        initial={false}
        animate={{
          opacity: triMode && keyboardOpen ? 1 : 0,
          y: triMode && keyboardOpen ? 0 : 4,
          pointerEvents: triMode && keyboardOpen ? 'auto' : 'none',
        }}
        transition={{ ...fade, delay: triMode && keyboardOpen ? 0.05 : 0 }}
        className="absolute inset-x-4 top-2 flex items-center gap-2"
      >
        <div className="flex-1 flex items-center gap-2.5 bg-surface-raised border border-border-strong rounded-full pl-4 pr-2 py-2 shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_10px_10px_-5px_rgba(0,0,0,0.04)]">
          <span className="flex-1 text-md text-content-primary leading-6 overflow-hidden whitespace-nowrap flex items-center gap-px">
            Freeze my card
            <BlinkingCursor />
          </span>
          <button onClick={onSend} className="p-2 rounded-full bg-surface-overlay flex items-center justify-center shrink-0">
            <Image src="/tri.png" alt="" width={24} height={24} />
          </button>
        </div>
        <button
          onClick={onCloseKeyboard}
          className="shrink-0 p-1 rounded-full bg-surface-raised border border-border-default shadow-xl"
        >
          <div className="p-3 rounded-full flex items-center justify-center">
            <Icon name="close" size={24} className="text-content-primary" />
          </div>
        </button>
      </motion.div>
    </div>
  )
}

/* ─── TRÍ Screen ────────────────────────────────────────────────────── */

// Clip-path origin matches the AI button center in the phone frame:
//   X: 440 - 16(padding) - 28(half button) = 396px
//   Y: 956 - 32(pb-8) - 28(half button) = 896px

function TriScreen({ onClose, keyboardOpen = false, onOpenSearch }) {
  const suggestions = [
    'Make a plan to build house',
    'Summarize my total spending in Bangkok Trip',
    'Freeze my credit card',
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="absolute inset-0 z-20 bg-surface flex flex-col overflow-hidden"
    >
      {/* Status bar spacer (actual bar is z-70 in parent, switches to dark mode) */}
      <div className="h-9.5 shrink-0" />

      {/* Top nav */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
        <button onClick={onClose} className="size-12 rounded-full overflow-hidden relative shrink-0">
          <Image src="/avatar.png" alt="QA" fill className="object-cover" />
        </button>
        <div className="flex items-center gap-2">
          <button className="size-12 shrink-0 bg-surface-sunken rounded-full flex items-center justify-center">
            <Icon name="history" size={24} className="text-content-secondary" />
          </button>
          <button onClick={onOpenSearch} className="size-12 shrink-0 bg-surface-sunken rounded-full flex items-center justify-center">
            <Icon name="search" size={24} className="text-content-secondary" />
          </button>
        </div>
      </div>

      {/* Middle — TRÍ logo + label centered */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 pt-10">
        <div className="size-24 relative shrink-0">
          <Image src="/tri.png" alt="" fill className="object-contain" />
        </div>
        <p className="text-[16px] font-medium text-content-primary text-center">Trí is here, Ask Trí anything...</p>
      </div>

      {/* Suggestions */}
      <div
        className="px-4 pb-4 flex flex-col gap-2"
        style={{ background: 'linear-gradient(to bottom, rgba(249,250,251,0), rgba(249,250,251,0.6))' }}
      >
        {suggestions.map((s, i) => (
          <motion.button
            key={s}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.06 }}
            className="self-start bg-surface-sunken px-4 py-3 rounded-full"
          >
            <span className="text-[14px] font-medium text-content-primary">{s}</span>
          </motion.button>
        ))}
      </div>

      {/* Space reserved for bottom nav — grows when keyboard is open */}
      <motion.div
        className="shrink-0"
        initial={false}
        animate={{ height: keyboardOpen ? 96 + 342 : 96 }}
        transition={{ type: 'spring', stiffness: 380, damping: 38 }}
      />
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
    <button
      className={`h-10.75 bg-white rounded-[10px] flex items-center justify-center text-[17px] text-content-primary shadow-[0_1px_0_rgba(0,0,0,0.3)] ${className}`}
    >
      {label}
    </button>
  )

  return (
    /* Clipping wrapper — positioned at bottom, clips the slide-up animation so it looks
       like the keyboard rises from below the screen edge even inside overflow-hidden parents */
    <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ zIndex }}>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={noAnim ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 30, delay }}
        className="bg-[#E4E5EA] rounded-t-3xl"
      >
        {/* Autocorrect bar */}
        <div className="flex items-center border-b border-[#C2C4CA] py-2">
          {['"The"', 'the', 'to'].map((s, i) => (
            <div key={s} className={`flex-1 flex items-center justify-center py-1 ${i < 2 ? 'border-r border-[#C2C4CA]' : ''}`}>
              <span className="text-[15px] text-content-primary">{s}</span>
            </div>
          ))}
        </div>

        {/* Key rows */}
        <div className="flex flex-col gap-2.75 px-2 py-3">
          {/* Row 1 */}
          <div className="flex justify-center gap-1.5">
            {rows[0].map(k => <K key={k} label={k} className="w-9.25" />)}
          </div>
          {/* Row 2 */}
          <div className="flex justify-center gap-1.5">
            {rows[1].map(k => <K key={k} label={k} className="w-9.25" />)}
          </div>
          {/* Row 3 — shift + letters + delete */}
          <div className="flex justify-center gap-1.5">
            <K label="⇧" className="w-11 bg-[#C9CCCE]!" />
            {rows[2].map(k => <K key={k} label={k} className="w-9.25" />)}
            <K label="⌫" className="w-11 bg-[#C9CCCE]!" />
          </div>
          {/* Row 4 — 123, space, return */}
          <div className="flex gap-1.5">
            <K label="123" className="w-11 bg-[#C9CCCE]!" />
            <button className="flex-1 h-10.75 bg-white rounded-[10px] text-[17px] text-content-primary shadow-[0_1px_0_rgba(0,0,0,0.3)]">
              space
            </button>
            <button className="w-23 h-10.75 bg-[#007AFF] rounded-[10px] flex items-center justify-center shadow-[0_1px_0_rgba(0,0,0,0.3)]">
              <Icon name="keyboard_return" size={18} className="text-white" />
            </button>
          </div>
        </div>

        {/* Emoji / mic bar */}
        <div className="flex items-center justify-between px-9 pt-2 pb-8">
          <Icon name="emoji_emotions" size={26} className="text-content-secondary" />
          <Icon name="mic" size={22} className="text-content-secondary" />
        </div>
      </motion.div>
    </div>
  )
}

/* ─── Search Screen ─────────────────────────────────────────────────── */

const RECENT_SEARCHES = [
  { id: 1, icon: 'tri',    label: 'Shopee spending this month' },
  { id: 2, icon: 'tri',    label: 'Can I afford an iPhone 17?' },
  { id: 3, icon: 'savings', label: 'Auto Savings' },
]

const SUGGESTED_STOCKS = [
  { id: 1, icon: 'candlestick_chart', ticker: 'TCB',  subtitle: 'Equities',          price: '34.56', change: '+2.24%' },
  { id: 2, icon: 'candlestick_chart', ticker: 'VIC',  subtitle: 'Equities',          price: '220',   change: '+1.29%' },
  { id: 3, icon: 'bar_chart',         ticker: 'TCBF', subtitle: 'Techcom Bond Fund', price: null,    change: '+20.49%' },
]

const FEATURE_RESULTS = [
  { id: 1, icon: 'credit_card_off', label: 'Cardless withdrawal' },
  { id: 2, icon: 'credit_card',     label: 'Credit card application' },
]

const TRI_SUGGESTIONS = [
  { id: 1, label: 'Freeze my card...', message: 'Freeze my card' },
  { id: 2, label: 'Which card suits me best?', message: 'Which card suits me best?' },
  { id: 3, label: 'Estimate my credit limit', message: 'Estimate my credit limit' },
]

/* Highlights the first occurrence of `query` in `text` with info (blue) color */
function HighlightMatch({ text, query }) {
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

const CONTENT_CLASSES = 'flex-1 flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden backdrop-blur-[6px] bg-linear-to-b from-[rgba(249,250,251,0)] to-[rgba(249,250,251,0.5)]'

function SearchDivider() {
  return (
    <div className="bg-white pl-14 pr-4 shrink-0 w-full">
      <div className="bg-surface-overlay h-px opacity-10 rounded-full w-full" />
    </div>
  )
}

export function SearchScreen({ onClose, onOpenChat, autoType = false }) {
  const [typing, setTyping] = useState(false)
  const [typedText, setTypedText] = useState('')
  const TARGET = 'Card'

  useEffect(() => {
    if (!autoType) {
      setTyping(false)
      setTypedText('')
      return
    }
    setTypedText('')
    let i = 0
    const start = setTimeout(() => {
      setTyping(true)
      const id = setInterval(() => {
        i++
        setTypedText(TARGET.slice(0, i))
        if (i >= TARGET.length) clearInterval(id)
      }, 120)
      return () => clearInterval(id)
    }, 200)
    return () => clearTimeout(start)
  }, [autoType])

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 z-80 bg-surface rounded-[56px] overflow-hidden flex flex-col"
    >
      <StatusBar dark={true} />

      {/* Nav */}
      <div className="flex gap-2 items-center px-4 pt-4 pb-2 shrink-0">
        {/* Search pill */}
        <div
          role="button"
          onClick={() => setTyping(true)}
          className="flex-1 flex items-center gap-2.5 bg-surface-raised border border-border-strong rounded-full pl-2 pr-4 py-2 shadow-xl overflow-hidden min-w-0 cursor-text"
        >
          <div className="bg-surface p-2 rounded-full flex items-center justify-center shrink-0">
            <Icon name="search" size={24} className="text-content-primary" />
          </div>

          {/* Cursor + text — cursor leads in empty state, trails in typing state */}
          <div className="flex-1 flex items-center gap-1 min-w-0">
            <AnimatePresence mode="wait" initial={false}>
              {typing ? (
                <motion.div
                  key="typing"
                  className="flex items-center gap-1"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                >
                  <span className="text-md text-content-primary leading-6">{typedText}</span>
                  <BlinkingCursor />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  className="flex items-center gap-1"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                >
                  <BlinkingCursor />
                  <span className="text-md text-content-muted leading-6">Search</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dark inline clear button — only in typing state */}
          <AnimatePresence>
            {typing && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.15 }}
                onClick={e => { e.stopPropagation(); setTyping(false) }}
                className="bg-surface-overlay p-0.5 rounded-full flex items-center justify-center shrink-0"
              >
                <Icon name="close" size={16} className="text-content-inverse" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Outer close */}
        <button
          onClick={onClose}
          className="bg-surface-raised border border-border-default rounded-full p-1 shadow-xl shrink-0"
        >
          <div className="p-3 rounded-full flex items-center justify-center">
            <Icon name="close" size={24} className="text-content-primary" />
          </div>
        </button>
      </div>

      {/* Content — fades between recent ↔ typing results */}
      <AnimatePresence mode="wait" initial={false}>
        {typing ? (
          <motion.div
            key="results"
            className={CONTENT_CLASSES}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {/* Features */}
            <div className="flex items-center px-4 pb-2 pt-4 shrink-0">
              <span className="text-[14px] font-medium text-content-muted">Features</span>
            </div>
            {FEATURE_RESULTS.map((item, i) => (
              <>
                <div key={item.id} className="flex gap-4 items-center px-4 py-3">
                  <Icon name={item.icon} size={24} className="text-content-secondary shrink-0" />
                  <p className="flex-1 text-[14px] font-medium text-content-primary min-w-0">
                    <HighlightMatch text={item.label} query="Card" />
                  </p>
                  <Icon name="chevron_right" size={20} className="text-content-muted shrink-0" />
                </div>
                <SearchDivider />
              </>
            ))}

            {/* Talk to Trí */}
            <div className="flex items-center justify-between px-4 pb-2 pt-4 shrink-0">
              <span className="text-[14px] font-medium text-content-muted">Talk to Trí</span>
              <span className="text-[14px] font-medium text-info">Open conversation</span>
            </div>
            {TRI_SUGGESTIONS.map((item, i) => (
              <>
                <button key={item.id} onClick={() => onOpenChat(item.message)} className="flex gap-4 items-center px-4 py-3 w-full text-left">
                  <Image src="/tri.png" alt="" width={24} height={24} className="shrink-0" />
                  <span className="flex-1 text-[14px] font-medium text-content-primary">{item.label}</span>
                  <Icon name="chevron_right" size={20} className="text-content-muted shrink-0" />
                </button>
                {i < TRI_SUGGESTIONS.length - 1 && <SearchDivider />}
              </>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="recent"
            className={CONTENT_CLASSES}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {/* Recent */}
            <div className="flex items-center justify-between px-4 pb-2 pt-4 shrink-0">
              <span className="text-[14px] font-medium text-content-muted">Recent</span>
              <span className="text-[14px] font-medium text-content-primary">Clear</span>
            </div>
            {RECENT_SEARCHES.map((item, i) => (
              <>
                <div key={item.id} className="flex gap-4 items-center px-4 py-3">
                  {item.icon === 'tri'
                    ? <Image src="/tri.png" alt="" width={24} height={24} className="shrink-0" />
                    : <Icon name={item.icon} size={24} className="text-content-secondary shrink-0" />
                  }
                  <span className="flex-1 text-[14px] font-medium text-content-primary">{item.label}</span>
                  <button className="shrink-0">
                    <Icon name="close" size={20} className="text-content-muted" />
                  </button>
                </div>
                {i < RECENT_SEARCHES.length - 1 && <SearchDivider />}
              </>
            ))}

            {/* View more */}
            <div className="flex items-center justify-center px-4 py-2">
              <button className="bg-surface-raised border border-[#1e2939] rounded-full px-4 py-2 h-8 flex items-center justify-center w-full">
                <span className="text-[11px] text-content-primary">View more</span>
              </button>
            </div>

            {/* Contextual header */}
            <div className="flex items-center gap-1 px-4 pb-2 pt-4 shrink-0">
              <span className="text-[14px] font-medium text-content-muted whitespace-nowrap">Because you recently asked about</span>
              <span className="text-[14px] font-medium text-content-primary whitespace-nowrap">&ldquo;Conservative&rdquo;</span>
            </div>

            {/* Suggested stocks */}
            {SUGGESTED_STOCKS.map((stock, i) => (
              <>
              <div key={stock.id} className="flex gap-4 items-center px-4 py-3">
                <Icon name={stock.icon} size={24} className="text-content-secondary shrink-0" />
                <div className="flex-1 flex flex-col gap-1 min-w-0">
                  <span className="text-[14px] font-medium text-content-primary">{stock.ticker}</span>
                  <span className="text-[12px] text-content-muted">{stock.subtitle}</span>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0 whitespace-nowrap">
                  {stock.price && <span className="text-[14px] font-medium text-content-primary">{stock.price}</span>}
                  <span className="text-[12px] text-success">{stock.change}</span>
                </div>
              </div>
              {i < SUGGESTED_STOCKS.length - 1 && <SearchDivider />}
              </>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button — 16px above keyboard top, pinned to right, always visible */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28, delay: 0.25 }}
        className="absolute right-4 bg-surface-overlay rounded-full pl-3 pr-4 py-3 shadow-xl flex items-center gap-2"
        style={{ bottom: 342 + 16 }}
      >
        <Image src="/tri.png" alt="" width={24} height={24} />
        <span className="text-[14px] font-medium text-content-inverse">Ask Trí</span>
      </motion.button>

      {/* Keyboard slides up after screen fades in */}
      <KeyboardMock delay={0.2} />
    </motion.div>
  )
}

/* ─── TRÍ Chat Screen ───────────────────────────────────────────────── */

function CardThumbnail({ variant = 'gold' }) {
  return (
    <div className={`w-16 h-10 rounded-sm shrink-0 overflow-hidden flex flex-col justify-between p-1.5 ${
      variant === 'gold'
        ? 'bg-linear-to-br from-amber-300 to-orange-500'
        : 'bg-linear-to-br from-gray-700 to-gray-900'
    }`}>
      <span className={`text-[6px] font-bold ${variant === 'gold' ? 'text-amber-900' : 'text-white'} opacity-70`}>TCB</span>
      <span className={`text-[7px] font-bold italic self-end ${variant === 'gold' ? 'text-amber-900' : 'text-white'}`}>VISA</span>
    </div>
  )
}

export function TriChatScreen({ onClose, userMessage = 'Freeze my card' }) {
  const [phase, setPhase] = useState('user') // 'user' | 'thinking' | 'answer'

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('thinking'), 600)
    const t2 = setTimeout(() => setPhase('answer'), 2600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="absolute inset-0 z-90 bg-surface rounded-[56px] overflow-hidden flex flex-col"
    >
      <StatusBar dark={false} />

      {/* Top nav */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
        <div className="size-12 rounded-full overflow-hidden shrink-0 relative">
          <Image src="/avatar.png" alt="QA" fill className="object-cover" />
        </div>
        <div className="flex items-center gap-2">
          <button className="size-12 shrink-0 bg-surface-sunken rounded-full flex items-center justify-center">
            <Icon name="history" size={24} className="text-content-secondary" />
          </button>
          <button className="size-12 shrink-0 bg-surface-sunken rounded-full flex items-center justify-center">
            <Icon name="search" size={24} className="text-content-secondary" />
          </button>
        </div>
      </div>

      {/* Chat content */}
      <div className="flex-1 flex flex-col gap-2 px-4 pt-4 pb-4 overflow-y-auto [&::-webkit-scrollbar]:hidden backdrop-blur-[6px] bg-linear-to-b from-[rgba(249,250,251,0)] to-[rgba(249,250,251,0.5)]">

        {/* Spacer pushes messages to the bottom by default */}
        <div className="flex-1" />

        {/* User message */}
        <motion.div
          className="flex justify-end"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28, delay: 0.1 }}
        >
          <div className="bg-surface-overlay px-4 py-3 rounded-full">
            <span className="text-[14px] font-medium text-content-inverse">{userMessage}</span>
          </div>
        </motion.div>

        {/* AI section — single AnimatePresence so popLayout takes exiting element out of flow
            immediately, preventing the double layout-shift that caused the message to drop */}
        <AnimatePresence mode="popLayout">
          {phase === 'thinking' && (
            <motion.div
              key="thinking"
              className="flex items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.22 }}
            >
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.18, 1] }}
                transition={{
                  rotate: { duration: 1.6, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 0.9, repeat: Infinity, ease: 'easeInOut' },
                }}
              >
                <Image src="/tri.png" alt="" width={28} height={28} />
              </motion.div>
            </motion.div>
          )}
          {phase === 'answer' && (
            <motion.div
              key="answer"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="bg-surface-sunken p-4 rounded-3xl flex flex-col gap-3 w-full"
            >
              <p className="text-[14px] font-medium text-content-primary">Which card do you want me to freeze?</p>

              {/* Card list */}
              <div className="bg-surface-raised rounded-2xl overflow-hidden">
                {/* Card 1 — unselected */}
                <div className="flex gap-4 items-center px-4 py-3">
                  <CardThumbnail variant="gold" />
                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <span className="text-[14px] font-medium text-content-primary">Techcombank Visa Everyday</span>
                    <span className="text-[12px] text-content-muted">**** 8978</span>
                  </div>
                  <Icon name="radio_button_unchecked" size={24} className="text-content-muted shrink-0" />
                </div>
                {/* Divider */}
                <div className="pl-24 pr-4">
                  <div className="h-px bg-surface-overlay opacity-10" />
                </div>
                {/* Card 2 — selected */}
                <div className="flex gap-4 items-center px-4 py-3">
                  <CardThumbnail variant="dark" />
                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <span className="text-[14px] font-medium text-content-primary">Techcombank Visa Everyday</span>
                    <span className="text-[12px] text-content-muted">**** 8978</span>
                  </div>
                  <Icon name="radio_button_checked" size={24} className="text-info shrink-0" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom input bar */}
      <div className="flex gap-2 items-center pb-4 pt-2 px-4 shrink-0 bg-linear-to-b from-[rgba(249,250,251,0)] to-surface backdrop-blur-sm">
        <div className="flex-1 flex items-center gap-2.5 bg-surface-raised border border-border-strong rounded-full pl-4 pr-2 py-2 shadow-xl min-w-0 overflow-hidden">
          <span className="flex-1 text-md text-content-muted leading-6 whitespace-nowrap overflow-hidden">Ask TRÍ everything ...</span>
          <div className="bg-surface-overlay p-2 rounded-full flex items-center justify-center shrink-0">
            <Image src="/tri.png" alt="" width={24} height={24} />
          </div>
        </div>
        <button
          onClick={onClose}
          className="bg-surface-raised border border-border-default rounded-full p-1 shadow-xl shrink-0"
        >
          <div className="p-3 rounded-full flex items-center justify-center">
            <Icon name="close" size={24} className="text-content-primary" />
          </div>
        </button>
      </div>

      {/* Spacer reserves room for the keyboard */}
      <div className="shrink-0 h-85.5" />

      {/* Keyboard */}
      <KeyboardMock noAnim />
    </motion.div>
  )
}

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function HomeScreen({
  overlayOpen: extOverlay,
  onOverlayClose: extClose,
  balanceHovered = false,
  transactionOpen: extTransaction,
  onTransactionClose: extTransactionClose,
  transactionHovered = false,
  triOpen: extTri,
  onTriClose: extTriClose,
  triHovered = false,
  defaultTab = 'home',
  defaultTriChatOpen = false,
} = {}) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [internalOverlay, setInternalOverlay] = useState(false)
  const [internalTransaction, setInternalTransaction] = useState(false)
  const [showTriScreen, setShowTriScreen] = useState(false)
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [triChatOpen, setTriChatOpen] = useState(defaultTriChatOpen)
  const [triChatMsg, setTriChatMsg] = useState('')
  const [navActive, setNavActive] = useState(defaultTab)
  const [wealthFabOpen, setWealthFabOpen] = useState(false)
  const [wealthAnalyzeOpen, setWealthAnalyzeOpen] = useState(false)

  const openTriChat = (message) => {
    setTriChatMsg(message)
    setTriChatOpen(true)
    setShowSearch(false)
    // TriScreen stays mounted — TriChatScreen (z-90) covers it so there's no flash of home
  }

  const showOverlay     = extOverlay     !== undefined ? extOverlay     : internalOverlay
  const showTransaction = extTransaction !== undefined ? extTransaction : internalTransaction
  const showTri         = extTri         !== undefined ? extTri         : showTriScreen

  const openOverlay      = () => { if (extOverlay === undefined) setInternalOverlay(true) }
  const closeOverlay     = () => { extClose            ? extClose()            : setInternalOverlay(false) }
  const closeTransaction = () => { extTransactionClose ? extTransactionClose() : setInternalTransaction(false) }

  return (
    <div className="w-[440px] h-[956px] overflow-hidden relative bg-surface-overlay rounded-[56px]">

      {/* Layer 1 — background image only, stays fixed */}
      <div className="absolute inset-0">
        <Image src="/background.png" alt="" fill sizes="440px" priority className="object-cover" />
      </div>

      {/* Layer 2 — everything scrolls together (no z-index so BalanceSection z-60 escapes to root) */}
      <div className="absolute inset-0 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
        {/* Push content below the fixed status bar */}
        <div className="h-9.5 shrink-0" />
        <TopNav onOpenSearch={() => setShowSearch(true)} />
        <BalanceSection
          onOpenOverlay={openOverlay}
          overlayOpen={showOverlay || balanceHovered}
          onCloseOverlay={closeOverlay}
          cardOpen={showOverlay}
        />

        {/* White card — slides up over the balance section as you scroll */}
        {/* Single bg-surface wrapper prevents subpixel gap between sections at scaled transforms */}
        <div className="bg-surface rounded-t-4xl pb-32">
          <motion.div
            initial={{ y: 8, opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-col gap-3 px-4 pt-4 pb-2">
              <QuickActions />
              <p className="text-md font-semibold text-content-primary mt-1">Just for you</p>
              <PromoCards />
            </div>
          </motion.div>

          {/* TransactionSection z-index still escapes — stacking context is now on the outer div, not motion.div */}
          <TransactionSection
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            onOpenInsights={() => setInternalTransaction(true)}
            transactionHovered={transactionHovered || showTransaction}
          />
        </div>
      </div>

      {/* Layer 3 — status bar; dark text when TRÍ or wealth screen (both have light backgrounds) */}
      <div className="absolute top-0 left-0 right-0 z-70">
        <StatusBar dark={showTri || navActive === 'investment'} />
      </div>

      {/* Bottom nav — pushed up when iOS keyboard is open */}
      <motion.div
        className="absolute left-0 right-0 z-30"
        initial={false}
        animate={{ bottom: showTri && keyboardOpen ? 342 : 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 38 }}
      >
        <BottomNav
          triMode={showTri}
          onOpenTri={() => setShowTriScreen(true)}
          onCloseTri={() => { setShowTriScreen(false); setKeyboardOpen(false) }}
          keyboardOpen={keyboardOpen}
          onOpenKeyboard={() => setKeyboardOpen(true)}
          onCloseKeyboard={() => setKeyboardOpen(false)}
          triHovered={triHovered}
          onSend={() => openTriChat('Freeze my card')}
          navActive={navActive}
          onNavChange={setNavActive}
        />
      </motion.div>

      {/* Keyboard — only in TRÍ mode before chat opens; TriChatScreen has its own internal keyboard */}
      <AnimatePresence>
        {showTri && keyboardOpen && !triChatOpen && (
          <KeyboardMock key="keyboard" zIndex={25} />
        )}
      </AnimatePresence>

      {/* Balance AI insights overlay — backdrop on hover, card on click */}
      <AnimatePresence>
        {(showOverlay || balanceHovered) && (
          <BalanceOverlay onClose={closeOverlay} showCard={showOverlay} />
        )}
      </AnimatePresence>

      {/* Transaction AI insights overlay — backdrop on hover, card on click */}
      <AnimatePresence>
        {(showTransaction || transactionHovered) && (
          <TransactionOverlay onClose={closeTransaction} showCard={showTransaction} />
        )}
      </AnimatePresence>

      {/* Wealth screen — z-20 keeps it below nav (z-30) and status bar (z-70) */}
      <AnimatePresence>
        {navActive === 'investment' && (
          <div className="absolute inset-0 overflow-hidden" style={{ zIndex: wealthAnalyzeOpen ? 40 : 20 }}>
            <WealthScreen onNavigate={(tab) => setNavActive(tab)} embedded={true} onOpenSearch={() => setShowSearch(true)} onAnalyzeOpen={() => setWealthAnalyzeOpen(true)} onAnalyzeClose={() => setWealthAnalyzeOpen(false)} />
          </div>
        )}
      </AnimatePresence>

      {/* Wealth screen FAB — hidden when TRÍ/Search/Chat overlays are open */}
      <AnimatePresence>
        {navActive === 'investment' && !showTri && !showSearch && !triChatOpen && !wealthAnalyzeOpen && (
          <button
            onClick={() => setWealthFabOpen(v => !v)}
            className="absolute right-5 size-14 rounded-full bg-surface-overlay flex items-center justify-center shadow-2xl"
            style={{ bottom: 100, zIndex: 35 }}
          >
            <motion.span
              animate={{ rotate: wealthFabOpen ? 45 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="material-symbols-outlined leading-none select-none text-content-inverse"
              style={{ fontSize: 28, display: 'block' }}
            >
              add
            </motion.span>
          </button>
        )}
      </AnimatePresence>

      {/* Wealth FAB overlay */}
      <AnimatePresence>
        {navActive === 'investment' && wealthFabOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 overflow-hidden"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)', zIndex: 34, borderRadius: 56 }}
          >
            <div className="absolute flex flex-col gap-3 items-end" style={{ right: 20, bottom: 168 }}>
              {[
                { label: 'Equities', icon: 'candlestick_chart' },
                { label: 'Bonds',    icon: 'analytics' },
                { label: 'Fund',     icon: 'credit_card' },
                { label: 'Top up',   icon: 'add_box' },
              ].map((action, i, arr) => {
                const reverseI = arr.length - 1 - i
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
                    <span className="text-[16px] font-medium text-content-inverse whitespace-nowrap">{action.label}</span>
                    <button className="bg-surface-sunken p-4 rounded-full shadow-xl shrink-0 flex items-center justify-center">
                      <span className="material-symbols-outlined leading-none select-none text-content-primary" style={{ fontSize: 24 }}>{action.icon}</span>
                    </button>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TRÍ screen — after WealthScreen in DOM so z-20 wins by order */}
      <AnimatePresence>
        {showTri && <TriScreen onClose={() => { setShowTriScreen(false); extTriClose?.() }} keyboardOpen={keyboardOpen} onOpenSearch={() => setShowSearch(true)} />}
      </AnimatePresence>

      {/* Search screen — covers everything */}
      <AnimatePresence>
        {showSearch && <SearchScreen onClose={() => setShowSearch(false)} onOpenChat={openTriChat} />}
      </AnimatePresence>

      {/* TRÍ chat screen — top of the stack */}
      <AnimatePresence>
        {triChatOpen && (
          <TriChatScreen
            userMessage={triChatMsg}
            onClose={() => {
              setTriChatOpen(false)
              setShowTriScreen(false)
              setKeyboardOpen(false)
            }}
          />
        )}
      </AnimatePresence>

      {/* Backdrop for TRÍ hover preview */}
      <AnimatePresence>
        {triHovered && !showTri && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-20 pointer-events-none"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-[56px]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
