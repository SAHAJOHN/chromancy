import Nav from './components/Nav'
import Footer from './components/Footer'
import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import QuickStartSection from './components/QuickStartSection'
import CTASection from './components/CTASection'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <HeroSection />
        <FeaturesSection />
        <QuickStartSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
