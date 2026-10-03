// app/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function Home() {
  const heroImages = [
    { src: '/animals/cow.jpg', alt: 'Cattle' },
    { src: '/animals/goat.jpg', alt: 'Goats' },
    { src: '/animals/horse.jpg', alt: 'Horses' },
    { src: '/animals/sheep.jpg', alt: 'Sheep' },
  ]

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b sticky top-0 bg-white z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight text-kren">
            Kren
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="#packs">Packs</Link>
            <Link href="#how">How it works</Link>
            <Link href="#features">Features</Link>
            <Link href="#contact">Contact</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-kren hover:bg-kren-dark text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
              Leaders in livestock tracking and monitoring.
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Their well-being is important, and so is yours. Know where your
              herd is, always.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-kren hover:bg-kren-dark text-white">
                  Get Started
                </Button>
              </Link>
              <Link href="#how">
                <Button size="lg" variant="outline">See How It Works</Button>
              </Link>
            </div>
          </div>

          {/* Hero image slideshow */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
            {heroImages.map((img, idx) => (
              <img
                key={img.src}
                src={img.src}
                alt={img.alt}
                className="absolute inset-0 w-full h-full object-cover animate-[fadeIn_16s_infinite]"
                style={{
                  animationDelay: `${idx * 4}s`,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Packs */}
      <section id="packs" className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Discover our packs</h2>
            <p className="text-gray-600 mt-2">Let's select your preferred pack</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { animals: 1, label: 'Starter pack', price: 45, save: null },
              { animals: 2, label: '2 GPS package', price: 80, save: 10 },
              { animals: 3, label: '3 GPS package', price: 115, save: 20 },
              { animals: 5, label: '5 GPS package', price: 180, save: 45 },
              { animals: 7, label: '7 GPS package', price: 245, save: 70 },
              { animals: 10, label: '10 GPS package', price: 340, save: 110 },
            ].map((pack) => (
              <Card key={pack.animals} className="relative">
                <CardContent className="p-6">
                  <p className="text-xs font-semibold text-kren uppercase tracking-wide">
                    GPS Collar for Livestock
                  </p>
                  <h3 className="text-lg font-semibold mt-2">{pack.label}</h3>
                  {pack.save && (
                    <span className="absolute top-4 right-4 bg-kren text-white text-xs font-bold px-2 py-1 rounded">
                      Save ${pack.save}
                    </span>
                  )}
                  <div className="mt-4">
                    <span className="text-2xl font-bold">${pack.price}</span>
                    <span className="text-gray-500 text-sm ml-2">/ pack</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {pack.animals} {pack.animals === 1 ? 'animal' : 'animals'}
                  </p>
                  <Link href="/signup">
                    <Button className="w-full mt-6 bg-kren hover:bg-kren-dark text-white">
                      Add to basket
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-8">
            Prices in USD. Monthly subscription from $8 per animal.
          </p>
        </div>
      </section>

      {/* Why it works */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">
            The most used and powerful GPS for livestock.
          </h2>
          <p className="text-center text-gray-600 mb-16">Locate your livestock</p>
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-lg font-semibold mb-4">Locate your livestock</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Recent position</li>
                <li>✓ Position history</li>
                <li>✓ Maps of use</li>
                <li>✓ Animal management</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Their well-being matters</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ No more lost animals</li>
                <li>✓ 30% reduction in operating costs</li>
                <li>✓ Improvement of reproductive indicators</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Built for farmers</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Customer service</li>
                <li>✓ Support there if needed</li>
                <li>✓ Start with just 1 animal, no commitment</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">
            How to get started with Kren
          </h2>
          <p className="text-center text-gray-600 mb-16">
            Find out with these simple steps
          </p>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { n: '01', title: 'Choose your pack', desc: 'Select the number of collars you need.' },
              { n: '02', title: 'Install the collars', desc: 'Attach them to your animals and switch them on.' },
              { n: '03', title: 'Start tracking', desc: 'Log in to your dashboard and see them on the map.' },
              { n: '04', title: 'Support', desc: 'Call or WhatsApp us any time. We are local.' },
            ].map((step) => (
              <div key={step.n}>
                <span className="text-4xl font-bold text-kren">{step.n}</span>
                <h3 className="text-lg font-semibold mt-3">{step.title}</h3>
                <p className="text-gray-600 mt-2 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Powerful and easy-to-use app.
          </h2>
          <p className="text-gray-600 mb-8">
            Locate your livestock from the palm of your hand. Total peace of mind.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline">Web version</Button>
            <Button variant="outline">iOS coming soon</Button>
            <Button variant="outline">Android coming soon</Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-kren py-16">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to protect your herd?
          </h2>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="mt-4">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t py-12">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-sm">
          <div>
            <h4 className="font-semibold mb-3">Kren</h4>
            <p className="text-gray-600">
              Livestock tracking and monitoring for farmers.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <ul className="space-y-1 text-gray-600">
              <li>WhatsApp: +263 XX XXX XXXX</li>
              <li>Email: info@kren.com</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Links</h4>
            <ul className="space-y-1 text-gray-600">
              <li><Link href="/login">Log In</Link></li>
              <li><Link href="/signup">Sign Up</Link></li>
              <li><Link href="#how">How it works</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-8 pt-8 border-t text-center text-gray-500 text-xs">
          © {new Date().getFullYear()} Kren.
        </div>
      </footer>
    </main>
  )
}