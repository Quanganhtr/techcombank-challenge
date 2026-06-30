'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import HomeScreen from '@/app/screens/home/page'

const TITLE_TOP = 128
const TEXT_GAP  = 64
const PHONE_H   = 956
const PHONE_W   = 440

// Scroll phase checkpoints (fractions of total scroll 0→1, section is 700vh)
const ANIM_END   = 0.35  // phone fully settled at final scale

const BAL_IN     = 0.42  // balance overlay + left panel entering
const BAL_FULL   = 0.47  // balance fully visible
const BAL_OUT    = 0.52  // balance starts exiting
const BAL_GONE   = 0.56  // balance fully gone

const TXN_IN     = 0.62  // transaction + right panel entering
const TXN_FULL   = 0.67  // transaction fully visible
const TXN_OUT    = 0.72  // transaction starts exiting
const TXN_GONE   = 0.76  // transaction fully gone

const TRI_IN     = 0.82  // TRÍ screen + left panel entering
const TRI_FULL   = 0.87  // TRÍ fully visible

export function HomeSection() {
  const pinRef  = useRef(null)
  const textRef = useRef(null)
  const [viewport,   setViewport]   = useState({ width: 1920, height: 1080 })
  const [textHeight, setTextHeight] = useState(250)
  const [activeOverlay, setActiveOverlay] = useState(null)
  // null | 'balance' | 'transaction' | 'tri'

  useLayoutEffect(() => {
    const measure = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight })
      if (textRef.current) setTextHeight(textRef.current.getBoundingClientRect().height)
    }
    measure()
    window.addEventListener('resize', measure)
    document.fonts?.ready?.then(measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ['start start', 'end end'],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 300, damping: 40, mass: 0.5 })

  /* ── Intro text: blur + fade out ───────────────────────────────── */
  const textFilter  = useTransform(progress, [0, 0.15], ['blur(0px)', 'blur(16px)'])
  const textOpacity = useTransform(progress, [0, 0.15], [1, 0])

  /* ── Phone: rise then scale down, settled by ANIM_END ──────────── */
  const initialPhoneTop = TITLE_TOP + textHeight + TEXT_GAP
  const finalScale      = (viewport.height - TITLE_TOP * 2) / PHONE_H
  const finalCssTop     = (viewport.height - PHONE_H) / 2

  const rawStop = Math.max(0.01, Math.min(0.99,
    (initialPhoneTop - TITLE_TOP) / Math.max(initialPhoneTop - finalCssTop, 1)
  ))
  const risingEnd  = rawStop * ANIM_END
  const scalingEnd = ANIM_END

  const phoneTop   = useTransform(progress,
    [0, risingEnd, scalingEnd, 1],
    [initialPhoneTop, TITLE_TOP, finalCssTop, finalCssTop]
  )
  const phoneScale = useTransform(progress,
    [0, risingEnd, scalingEnd, 1],
    [1, 1, finalScale, finalScale]
  )

  /* ── Left panel (Balance): in → hold → out ──────────────────────── */
  const leftBalOpacity = useTransform(progress,
    [BAL_IN, BAL_FULL, BAL_OUT, BAL_GONE],
    [0,      1,        1,       0]
  )
  const leftBalX = useTransform(progress,
    [BAL_IN, BAL_FULL, BAL_OUT, BAL_GONE],
    [-32,    0,        0,       -32]
  )

  /* ── Right panel (Transaction): in → hold → out ─────────────────── */
  const rightTxnOpacity = useTransform(progress,
    [TXN_IN, TXN_FULL, TXN_OUT, TXN_GONE],
    [0,      1,        1,       0]
  )
  const rightTxnX = useTransform(progress,
    [TXN_IN, TXN_FULL, TXN_OUT, TXN_GONE],
    [32,     0,        0,       32]
  )

  /* ── Left panel (TRÍ): in → hold ────────────────────────────────── */
  const leftTriOpacity = useTransform(progress, [TRI_IN, TRI_FULL], [0, 1])
  const leftTriX       = useTransform(progress, [TRI_IN, TRI_FULL], [-32, 0])

  /* ── Active overlay state (drives HomeScreen) ───────────────────── */
  useEffect(() => {
    return scrollYProgress.on('change', v => {
      if (v >= TRI_IN)                             setActiveOverlay('tri')
      else if (v >= TXN_IN && v < TXN_GONE)        setActiveOverlay('transaction')
      else if (v >= BAL_IN && v < BAL_GONE)         setActiveOverlay('balance')
      else                                          setActiveOverlay(null)
    })
  }, [scrollYProgress])

  const panelStyle = `absolute top-1/2 -translate-y-1/2 z-10 flex items-center justify-center px-8`
  const panelWidth = `calc(50vw - ${PHONE_W / 2}px)`

  return (
    <section ref={pinRef} className="relative h-[700vh]">
      <div className="bg-black sticky top-0 h-screen w-full overflow-hidden">

        {/* Intro text */}
        <motion.div
          ref={textRef}
          style={{ filter: textFilter, opacity: textOpacity }}
          className="absolute inset-x-0 top-32 z-10 flex flex-col gap-4 items-center text-center px-8 md:px-32"
        >
          <h2 className="t-display text-content-inverse max-w-3xl w-full">
            What does TRÍ help in home?
          </h2>
          <p className="t-body-lg text-neutral-500 max-w-3xl">
            TRÍ đóng vai trò là một &apos;AI Layer&apos; ẩn sau mọi Data Component trên màn hình Home. Chỉ với một điểm chạm, người dùng ngay lập tức tiếp cận được các phân tích tài chính chuyên sâu, từ đó nhận các đề xuất cá nhân hóa giúp tối ưu chi tiêu và gia tăng tài sản hiệu quả.
          </p>
        </motion.div>

        {/* Left panel — Balance AI layer */}
        <motion.div
          style={{ opacity: leftBalOpacity, x: leftBalX, width: panelWidth }}
          className={`left-0 ${panelStyle}`}
        >
          <div className="w-full max-w-120 flex flex-col gap-3">
            <h1 className="t-h1 text-content-inverse">Balance AI layer</h1>
            <p className="t-body-lg text-neutral-500">
              Hệ thống có kiến trúc Generative UI Framework — một thư viện component chuẩn giúp AI hiển thị giao diện phân tích tài chính ngay trên màn hình Home chỉ với một điểm chạm.
            </p>
          </div>
        </motion.div>

        {/* Right panel — Transaction AI layer */}
        <motion.div
          style={{ opacity: rightTxnOpacity, x: rightTxnX, width: panelWidth }}
          className={`right-0 ${panelStyle}`}
        >
          <div className="w-full max-w-120 flex flex-col gap-3">
            <h1 className="t-h1 text-content-inverse">Transaction AI layer</h1>
            <p className="t-body-lg text-neutral-500">
              Hệ thống UI sinh tạo tự động nhóm và diễn giải các giao dịch theo ngữ cảnh — giúp người dùng hiểu ngay mình đang chi tiêu vào đâu mà không cần lọc thủ công.
            </p>
          </div>
        </motion.div>

        {/* Left panel — TRÍ screen */}
        <motion.div
          style={{ opacity: leftTriOpacity, x: leftTriX, width: panelWidth }}
          className={`left-0 ${panelStyle}`}
        >
          <div className="w-full max-w-120 flex flex-col gap-3">
            <h1 className="t-h1 text-content-inverse">TRÍ AI screen</h1>
            <p className="t-body-lg text-neutral-500">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </motion.div>

        {/* Phone mockup */}
        <motion.div
          style={{ top: phoneTop }}
          className="absolute left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div style={{ scale: phoneScale }} className="relative">
            <Image
              src="/mockup.png"
              alt=""
              width={PHONE_W + 32}
              height={PHONE_H + 32}
              className="absolute pointer-events-none z-10 max-w-none"
              style={{ top: -16, left: -16 }}
            />
            <div className="overflow-hidden rounded-[44px] relative z-0">
              <HomeScreen
                overlayOpen={activeOverlay === 'balance'}
                onOverlayClose={() => {}}
                transactionOpen={activeOverlay === 'transaction'}
                onTransactionClose={() => {}}
                triOpen={activeOverlay === 'tri'}
                onTriClose={() => {}}
              />
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}
