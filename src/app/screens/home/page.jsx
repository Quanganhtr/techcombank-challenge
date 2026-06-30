'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

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

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-14 pt-3.5 pb-1 shrink-0">
      <span className="text-[15px] font-semibold text-content-inverse">9:41</span>
      <div className="flex items-center gap-1">
        <Image src="/cellular.svg" alt="" width={16} height={16} />
        <Image src="/wifi.svg"     alt="" width={16} height={16} />
        <Image src="/battery.svg"  alt="" width={16} height={16} />
      </div>
    </div>
  )
}

function TopNav() {
  return (
    <div className="flex items-center justify-between px-4 py-2 shrink-0">
      {/* Avatar */}
      <div className="size-12 rounded-full bg-surface-overlay flex items-center justify-center shrink-0">
        <span className="text-[14px] font-medium text-content-inverse">QA</span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button className="size-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
          <Icon name="notifications" size={24} className="text-content-inverse" />
        </button>
        <button className="size-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
          <Icon name="search" size={24} className="text-content-inverse" />
        </button>
      </div>
    </div>
  )
}

function BalanceSection({ onOpenOverlay, overlayOpen, onCloseOverlay }) {
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
          <button onClick={() => setHidden(v => !v)}>
            <Icon
              name={hidden ? 'visibility_off' : 'visibility'}
              size={20}
              className="text-content-inverse"
            />
          </button>
        </div>
        <button
          onClick={onOpenOverlay}
          className="text-[32px] font-bold leading-10 text-content-inverse font-sans tabular-nums text-left"
        >
          {hidden ? '••••••••••' : '90,008,897đ'}
        </button>
      </div>

      {/* Spending pill — stays below overlay backdrop */}
      <button
        className="flex items-center gap-2 bg-white/30 backdrop-blur-sm rounded-full px-3 py-2 self-start mt-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Image src="/tri.png" alt="" width={20} height={20} className="shrink-0" />
        <span className="text-[12px] text-content-inverse whitespace-nowrap">
          8.7 months of your normal spending
        </span>
        <Icon name="arrow_right_alt" size={20} className="text-content-inverse" />
      </button>
    </div>
  )
}

function BalanceOverlay({ onClose }) {
  return (
    <>
      {/* Backdrop — fades in at z-30, sits under balance text (z-40) and nav (z-40) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45 }}
        className="absolute inset-0 z-50"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-[56px]" />
      </motion.div>

      {/* Card — 16px below balance amount, slides up from off-screen */}
      <motion.div
        initial={{ y: 800 }}
        animate={{ y: 0 }}
        exit={{ y: 800 }}
        transition={{ type: 'spring', stiffness: 140, damping: 18 }}
        className="absolute inset-x-4 top-55 bottom-4 z-50"
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
              <Icon name="auto_awesome" size={20} className="text-warning" />
              <span className="text-[14px] font-medium text-content-primary">Create an investment plan</span>
            </button>
            <button
              onClick={onClose}
              className="w-full bg-surface-overlay px-4 py-3 rounded-full"
            >
              <span className="text-[14px] font-medium text-content-inverse">Ask a follow-up</span>
            </button>
          </div>
        </div>
      </motion.div>
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
        {/* Decorative bars */}
<div className="relative z-10">
          <p className="text-[14px] font-medium text-amber-950">Ride deals</p>
          <p className="text-md font-medium text-amber-950 leading-6">
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
        <div className="absolute right-[-8px] top-14 size-[85px] opacity-80">
          <Image src="/gold.png" alt="" fill className="object-cover object-bottom" />
        </div>
        <div className="absolute right-2 top-8 size-[37px] -rotate-[34deg] opacity-70">
          <Image src="/gold.png" alt="" fill className="object-cover object-bottom" />
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

function TransactionOverlay({ onClose }) {
  const suggestions = [
    'Why is it higher this month?',
    'How much did I spend at Shopee this year?',
    'Set a monthly budget',
  ]

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45 }}
        className="absolute inset-0 z-50"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-[56px]" />
      </motion.div>

      {/* Card — slides up from bottom */}
      <motion.div
        initial={{ y: 800 }}
        animate={{ y: 0 }}
        exit={{ y: 800 }}
        transition={{ type: 'spring', stiffness: 140, damping: 18 }}
        className="absolute inset-x-4 bottom-12 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-surface rounded-4xl flex flex-col gap-4 p-4">

          {/* Category insight row */}
          <div className="bg-amber-500/8 rounded-3xl p-4 flex flex-col gap-1">
            <div className="self-start bg-amber-300 px-4 py-2 rounded-full mb-1">
              <span className="text-md font-medium text-indigo-950">Online Shopping</span>
            </div>
            <p className="text-[14px] text-content-secondary leading-5">
              Your online shopping spending has increased 18% this month, mainly after payday.
            </p>
          </div>

          {/* Stats */}
          <div className="bg-surface-raised rounded-3xl p-4 flex flex-col gap-1">
            {[
              { label: 'Total Order purchase this month', value: '12th' },
              { label: 'in total spent on Online Shopping', value: '2,100,000đ' },
              { label: 'higher than your monthly average', value: '18%' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-[14px] text-content-muted leading-5">{label}</span>
                <span className="text-[14px] font-medium text-info leading-5 shrink-0 ml-2">{value}</span>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col gap-2">
            {suggestions.map(text => (
              <button key={text} className="w-full flex items-center justify-center gap-1.5 border border-surface-overlay bg-surface-raised px-4 py-3 rounded-full">
                <Icon name="auto_awesome" size={20} className="text-warning" />
                <span className="text-[14px] font-medium text-content-primary">{text}</span>
              </button>
            ))}
            <button onClick={onClose} className="w-full bg-surface-overlay px-4 py-3 rounded-full">
              <span className="text-[14px] font-medium text-content-inverse">Ask a follow-up</span>
            </button>
          </div>

        </div>
      </motion.div>
    </>
  )
}

function TransactionSection({ activeFilter, setActiveFilter, onOpenInsights }) {
  return (
    <div className="flex flex-col gap-3 px-4 py-2 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-md font-semibold text-content-primary">Transaction History</p>
        <button
          onClick={onOpenInsights}
          className="flex items-center gap-2 border border-border-default bg-surface-sunken px-3 py-2 rounded-full"
        >
          <Image src="/tri.png" alt="" width={20} height={20} />
          <span className="text-[14px] font-medium text-content-primary">AI insights</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className="relative flex-none px-3 py-2 rounded-full whitespace-nowrap"
          >
            {activeFilter === f && (
              <motion.div
                layoutId="filter-bg"
                className="absolute inset-0 bg-surface-raised border-2 border-surface-overlay rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
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

function BottomNav({ onOpenTri }) {
  const [active, setActive] = useState('home')

  const tabs = [
    { id: 'home',       icon: null,                     label: 'Home'       },
    { id: 'cards',      icon: 'credit_card',             label: 'Cards'      },
    { id: 'rewards',    icon: 'redeem',                  label: 'Rewards'    },
    { id: 'investment', icon: 'finance',                 label: 'Investment' },
  ]

  return (
    <div className="flex items-center gap-2 px-4 py-2 pb-8 backdrop-blur-[2px] shrink-0" style={{ background: 'linear-gradient(to bottom, rgba(249,250,251,0), #f9fafb)' }}>
      {/* Main nav pill */}
      <div className="flex-1 flex items-center gap-1 p-1 bg-surface-raised border border-border-default rounded-full shadow-xl">
        {tabs.map(tab => {
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`relative flex items-center justify-center gap-1 px-4 py-3 rounded-full ${
                isActive ? 'flex-1' : ''
              }`}
            >
              {/* Sliding background */}
              {isActive && (
                <motion.div
                  layoutId="nav-bg"
                  className="absolute inset-0 bg-surface-overlay rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}

              {/* Content */}
              <span className="relative z-10 flex items-center gap-1">
                {tab.id === 'home'
                  ? <Image src="/logo.svg" alt="" width={24} height={24} />
                  : <Icon name={tab.icon} size={24} className={isActive ? 'text-content-inverse' : 'text-content-secondary'} />
                }
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="t-label text-content-inverse whitespace-nowrap overflow-hidden"
                    >
                      {tab.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </button>
          )
        })}
      </div>

      {/* AI button */}
      <button
        onClick={onOpenTri}
        className="size-14 rounded-full bg-surface-raised border border-border-strong shadow-xl flex items-center justify-center shrink-0"
      >
        <div className="size-10 rounded-full bg-surface-raised flex items-center justify-center">
          <Image src="/tri.png" alt="AI" width={24} height={24} />
        </div>
      </button>
    </div>
  )
}

/* ─── TRÍ Screen ────────────────────────────────────────────────────── */

// Clip-path origin matches the AI button center in the phone frame:
//   X: 440 - 16(padding) - 28(half button) = 396px
//   Y: 956 - 32(pb-8) - 28(half button) = 896px

function TriScreen({ onClose }) {
  const suggestions = [
    'Make a plan to build house',
    'Summarize my total spending in Bangkok Trip',
    'Freeze my credit card',
  ]

  return (
    <motion.div
      initial={{ clipPath: 'circle(28px at 396px 896px)' }}
      animate={{ clipPath: 'circle(1100px at 396px 896px)' }}
      exit={{ clipPath: 'circle(28px at 396px 896px)' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 z-20 bg-surface flex flex-col overflow-hidden"
    >
      {/* Status bar — dark on white */}
      <div className="flex items-center justify-between px-14 pt-3.5 pb-1 shrink-0">
        <span className="text-[15px] font-semibold text-content-primary">9:41</span>
        <div className="flex items-center gap-1">
          <Icon name="signal_cellular_alt" size={16} className="text-content-primary" />
          <Icon name="wifi" size={16} className="text-content-primary" />
          <Icon name="battery_full" size={16} className="text-content-primary" />
        </div>
      </div>

      {/* Top nav */}
      <div className="flex items-center px-4 py-2 shrink-0">
        <button
          onClick={onClose}
          className="size-12 rounded-full bg-surface-overlay flex items-center justify-center"
        >
          <span className="text-[14px] font-medium text-content-inverse">QA</span>
        </button>
      </div>

      {/* Middle — grows to fill space */}
      <div className="flex-1" />

      {/* Suggestions + gradient container */}
      <div
        className="px-4 pb-4 flex flex-col gap-2 backdrop-blur-md"
        style={{ background: 'linear-gradient(to bottom, rgba(249,250,251,0), rgba(249,250,251,0.5))' }}
      >
        {suggestions.map(s => (
          <motion.button
            key={s}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="self-start bg-surface-sunken px-4 py-3 rounded-full"
          >
            <span className="text-[14px] font-medium text-content-primary">{s}</span>
          </motion.button>
        ))}
      </div>

      {/* Input bar */}
      <div
        className="flex items-center gap-2 px-4 pb-8 pt-2 shrink-0 backdrop-blur-[2px]"
        style={{ background: 'linear-gradient(to bottom, rgba(249,250,251,0), #f9fafb)' }}
      >
        {/* Logo pill — tap to go back */}
        <button onClick={onClose} className="bg-surface-raised border border-border-default rounded-full p-1 shadow-xl shrink-0 drop-shadow-[0px_20px_12.5px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-center p-3">
            <Image src="/logo.svg" alt="" width={24} height={24} />
          </div>
        </button>

        {/* Input field */}
        <div className="flex-1 flex items-center gap-2.5 bg-surface-raised border border-border-strong rounded-full pl-4 pr-2 py-2 shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_10px_10px_-5px_rgba(0,0,0,0.04)]">
          <span className="flex-1 text-[16px] text-content-muted leading-6">Ask TRÍ everything ...</span>
          <button className="p-2 rounded-full bg-surface-overlay flex items-center justify-center shrink-0">
            <Image src="/tri.png" alt="" width={24} height={24} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function HomeScreen({
  overlayOpen: extOverlay,
  onOverlayClose: extClose,
  transactionOpen: extTransaction,
  onTransactionClose: extTransactionClose,
  triOpen: extTri,
  onTriClose: extTriClose,
} = {}) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [internalOverlay, setInternalOverlay] = useState(false)
  const [internalTransaction, setInternalTransaction] = useState(false)
  const [internalTri, setInternalTri] = useState(false)
  const [navHidden, setNavHidden] = useState(false)

  const showOverlay     = extOverlay     !== undefined ? extOverlay     : internalOverlay
  const showTransaction = extTransaction !== undefined ? extTransaction : internalTransaction
  const showTriScreen   = extTri         !== undefined ? extTri         : internalTri

  const openOverlay      = () => { if (extOverlay === undefined) setInternalOverlay(true) }
  const closeOverlay     = () => { extClose            ? extClose()            : setInternalOverlay(false) }
  const closeTransaction = () => { extTransactionClose ? extTransactionClose() : setInternalTransaction(false) }

  function openTri() {
    setInternalTri(true)
    setTimeout(() => setNavHidden(true), 750)
  }
  function closeTri() {
    setNavHidden(false)
    extTriClose ? extTriClose() : setInternalTri(false)
  }

  // When triOpen is externally controlled, sync navHidden to it
  const prevExtTri = useRef(extTri)
  useEffect(() => {
    if (extTri !== undefined && extTri !== prevExtTri.current) {
      setNavHidden(!!extTri)
      prevExtTri.current = extTri
    }
  }, [extTri])

  return (
    <div className="w-[440px] h-[956px] overflow-hidden relative bg-surface-overlay rounded-[56px]">

      {/* Layer 1 — background image only, stays fixed */}
      <div className="absolute inset-0">
        <Image src="/background.png" alt="" fill sizes="440px" priority className="object-cover" />
      </div>

      {/* Layer 2 — everything scrolls together (no z-index so BalanceSection z-60 escapes to root) */}
      <div className="absolute inset-0 overflow-y-auto overscroll-contain scrollbar-none [&::-webkit-scrollbar]:hidden">
        {/* Push content below the fixed status bar */}
        <div className="h-9.5 shrink-0" />
        <TopNav />
        <BalanceSection
          onOpenOverlay={openOverlay}
          overlayOpen={showOverlay}
          onCloseOverlay={closeOverlay}
        />

        {/* White card — slides up over the balance section as you scroll */}
        <motion.div
          initial={{ y: 8, opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-3 bg-surface backdrop-blur-2xl rounded-t-4xl border-t border-l border-r border-border-default px-4 pt-4 pb-2"
        >
          <QuickActions />
          <p className="text-md font-semibold text-content-primary mt-1">Just for you</p>
          <PromoCards />
        </motion.div>

        <div className="bg-surface pb-32">
          <TransactionSection
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            onOpenInsights={() => setInternalTransaction(true)}
          />
        </div>
      </div>

      {/* Layer 3 — status bar (cellular/wifi/battery), transparent, always on top */}
      <div className="absolute top-0 left-0 right-0 z-70">
        <StatusBar />
      </div>

      {/* Bottom nav — z-30, fades out after TRÍ screen finishes expanding */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-30"
        animate={{ opacity: navHidden ? 0 : 1, pointerEvents: navHidden ? 'none' : 'auto' }}
        transition={{ duration: 0.2 }}
      >
        <BottomNav onOpenTri={openTri} />
      </motion.div>

      {/* Balance AI insights overlay */}
      <AnimatePresence>
        {showOverlay && <BalanceOverlay onClose={closeOverlay} />}
      </AnimatePresence>

      {/* Transaction AI insights overlay */}
      <AnimatePresence>
        {showTransaction && <TransactionOverlay onClose={closeTransaction} />}
      </AnimatePresence>

      {/* TRÍ screen */}
      <AnimatePresence>
        {showTriScreen && <TriScreen onClose={closeTri} />}
      </AnimatePresence>
    </div>
  )
}
