import { Hero } from '@/components/screens/Hero'
import { ContextAndGoals } from '@/components/screens/ContextAndGoals'
import { UserSegments } from '@/components/screens/UserSegments'
import { IntroduceTri } from '@/components/screens/IntroduceTri'
import { HomeSection } from '@/components/screens/HomeSection'
import { DynamicCreativeSection } from '@/components/screens/DynamicCreativeSection'
import { SearchSection } from '@/components/screens/SearchSection'
import { WealthSection } from '@/components/screens/WealthSection'
import { MeasuringSuccess } from '@/components/screens/MeasuringSuccess'
import { ScreensMarquee } from '@/components/screens/ScreensMarquee'

export default function Home() {
  return (
    <main className="bg-surface-raised">
      <Hero />
      <ContextAndGoals />
      <UserSegments />
      <IntroduceTri />
      <HomeSection />
      <DynamicCreativeSection />
      <SearchSection />
      <WealthSection />
      <MeasuringSuccess />
      <ScreensMarquee />
    </main>
  )
}
