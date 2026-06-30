import { Hero } from '@/components/screens/Hero'
import { ContextAndGoals } from '@/components/screens/ContextAndGoals'
import { UserSegments } from '@/components/screens/UserSegments'
import { IntroduceTri } from '@/components/screens/IntroduceTri'
import { HomeSection } from '@/components/screens/HomeSection'

export default function Home() {
  return (
    <main className="bg-surface-raised">
      <Hero />
      <ContextAndGoals />
      <UserSegments />
      <IntroduceTri />
      <HomeSection />
    </main>
  )
}
