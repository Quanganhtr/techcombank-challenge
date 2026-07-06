import Image from 'next/image'
import HomeScreen from '@/app/screens/home/page'

const PHONE_W = 440
const PHONE_H = 956

export default function Home() {
  return (
    <main className="bg-black h-dvh w-full flex items-center justify-center overflow-hidden">
      <div className="relative shrink-0" style={{ width: PHONE_W, height: PHONE_H }}>
        {/* Phone frame — overflows 16px beyond the screen on each side */}
        <Image
          src="/mockup.png"
          alt=""
          width={PHONE_W + 32}
          height={PHONE_H + 32}
          className="absolute pointer-events-none z-10 max-w-none"
          style={{ top: -16, left: -16 }}
          priority
        />
        <div className="overflow-hidden rounded-[64px] relative z-0">
          <HomeScreen />
        </div>
      </div>
    </main>
  )
}
